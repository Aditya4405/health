import { useState } from 'react';
import { ClipboardPen, ClipboardCheck, Search, Trash2, RotateCcw, Plus, PlusCircle, AlertCircle, X } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface NoteRecord {
  id: string;
  patientName: string;
  date: string;
  summary: string;
  prescriptions: Prescription[];
}

const initialNotes: NoteRecord[] = [
  {
    id: 'n1',
    patientName: 'Aarav Kapoor',
    date: 'Today, 11:45 AM',
    summary: 'Patient presented with LDL levels of 182 mg/dL. Anemia patterns are present (hemoglobin 11.2 g/dL). Checked diet logs. Prescribed low-dose statins and iron guidelines.',
    prescriptions: [
      { medication: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '30 days' },
      { medication: 'Carbonyl Iron', dosage: '45mg element', frequency: 'Once daily with Vitamin C', duration: '60 days' }
    ]
  },
  {
    id: 'n2',
    patientName: 'Isha Verma',
    date: 'Yesterday, 04:30 PM',
    summary: 'Anemia follow-up. Hemoglobin is stable but low at 10.5 g/dL. Fatigue persists. Instructed patient to focus on dietary iron intake and schedule a CBC check in 4 weeks.',
    prescriptions: [
      { medication: 'Ferate (Ferrous Gluconate)', dosage: '324mg', frequency: 'Once daily', duration: '30 days' }
    ]
  }
];

export const DoctorNotesPage = () => {
  const [notes, setNotes] = useState<NoteRecord[]>(initialNotes);
  const [search, setSearch] = useState('');
  
  // New Note Form States
  const [patientName, setPatientName] = useState('');
  const [summary, setSummary] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medication: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [addingNew, setAddingNew] = useState(false);

  const handleAddPrescriptionRow = () => {
    setPrescriptions(prev => [...prev, { medication: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handlePrescriptionChange = (index: number, field: keyof Prescription, val: string) => {
    setPrescriptions(prev => 
      prev.map((row, idx) => idx === index ? { ...row, [field]: val } : row)
    );
  };

  const handleDeletePrescriptionRow = (index: number) => {
    setPrescriptions(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !summary.trim()) {
      toast.warning('Patient Name and Note Summary are required.');
      return;
    }

    const cleanPrescriptions = prescriptions.filter(p => p.medication.trim());

    const newNote: NoteRecord = {
      id: `note-${Date.now()}`,
      patientName,
      date: 'Just now',
      summary,
      prescriptions: cleanPrescriptions
    };

    setNotes(prev => [newNote, ...prev]);
    toast.success(`Clinical notes saved & synced for ${patientName}`);

    // Reset Form
    setPatientName('');
    setSummary('');
    setPrescriptions([{ medication: '', dosage: '', frequency: '', duration: '' }]);
    setAddingNew(false);
  };

  const handleDeleteNote = (id: string, name: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.error(`Deleted note record for ${name}`);
  };

  const filteredNotes = notes.filter(note => 
    note.patientName.toLowerCase().includes(search.toLowerCase()) ||
    note.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Clinical Logs">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Notes & Prescriptions Log</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Practice electronic health record logs and treatment summaries
              </p>
            </div>
            <button 
              onClick={() => setAddingNew(!addingNew)}
              className="btn-premium btn-premium-primary gap-1.5 h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider self-start md:self-auto"
            >
              <PlusCircle className="h-4.5 w-4.5" /> {addingNew ? 'View Logs' : 'Write Notes'}
            </button>
          </div>

          {addingNew ? (
            /* Write new clinical notes form */
            <form onSubmit={handleSaveNote} className="app-card p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-card-title text-[var(--portal-text)] font-bold">Write Clinical Note & Prescriptions</h3>
              
              <div className="space-y-1 max-w-md">
                <label className="text-label-premium text-[var(--portal-muted)] ml-1">Patient Name</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Aarav Kapoor" 
                  className="input-premium w-full"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-premium text-[var(--portal-muted)] ml-1">Note Summary / Recommendations</label>
                <textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize symptoms, biometrics warnings, and lifestyle instructions..." 
                  className="input-premium w-full h-24 py-2.5 resize-none"
                  required
                />
              </div>

              {/* Prescriptions array fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-label-premium text-[var(--portal-muted)] ml-1">Prescription Items (Optional)</label>
                  <button 
                    type="button" 
                    onClick={handleAddPrescriptionRow}
                    className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center gap-1 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add Medication
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((row, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-[var(--portal-elevated)]/50 p-2.5 rounded-xl border border-[var(--portal-border)]">
                      <input 
                        type="text" 
                        placeholder="Medication name" 
                        value={row.medication}
                        onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                        className="input-premium h-9 px-3 text-xs w-full"
                      />
                      <input 
                        type="text" 
                        placeholder="Dosage (e.g. 10mg)" 
                        value={row.dosage}
                        onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                        className="input-premium h-9 px-3 text-xs w-full"
                      />
                      <input 
                        type="text" 
                        placeholder="Frequency" 
                        value={row.frequency}
                        onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                        className="input-premium h-9 px-3 text-xs w-full"
                      />
                      <div className="flex gap-2 w-full">
                        <input 
                          type="text" 
                          placeholder="Duration" 
                          value={row.duration}
                          onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                          className="input-premium h-9 px-3 text-xs w-full"
                        />
                        {prescriptions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleDeletePrescriptionRow(index)}
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/5 h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-red-500/10 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3 border-t border-[var(--portal-border)]/50">
                <button type="submit" className="btn-premium btn-premium-primary">
                  Save Note & Sync
                </button>
                <button 
                  type="button" 
                  onClick={() => setAddingNew(false)}
                  className="btn-premium btn-premium-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Historical Logs List */
            <>
              <div className="app-card p-4 flex gap-4 items-center">
                <Search className="h-4 w-4 text-[var(--portal-muted)] shrink-0 ml-1" />
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Filter logs by patient or note details..." 
                  className="input-premium w-full sm:w-80"
                />
              </div>

              <section className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="app-card p-5 space-y-4 relative overflow-hidden transition-all duration-200">
                    <div className="flex justify-between items-center border-b border-[var(--portal-border)]/50 pb-3">
                      <div>
                        <h3 className="text-body-premium font-bold text-[var(--portal-text)]">{note.patientName}</h3>
                        <p className="text-[10px] text-[var(--portal-muted)] font-semibold mt-0.5 uppercase tracking-wide">{note.date}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id, note.patientName)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/5 h-8 w-8 flex items-center justify-center rounded-lg border border-red-500/10 transition-colors"
                        title="Delete note log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-xs text-[var(--portal-text)] leading-relaxed bg-[var(--portal-elevated)]/30 p-3 rounded-xl border border-[var(--portal-border)]">
                        <span className="font-bold text-[#0ea5e9]">Clinical Remarks: </span>
                        {note.summary}
                      </p>

                      {note.prescriptions.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[9px] font-bold text-[#7f77dd] uppercase tracking-wider ml-1">Treatment Regimen</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left min-w-[500px] border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--portal-border)] text-[var(--portal-muted)]">
                                  <th className="py-2 px-3 font-semibold uppercase tracking-wider">Medication</th>
                                  <th className="py-2 px-3 font-semibold uppercase tracking-wider">Dosage</th>
                                  <th className="py-2 px-3 font-semibold uppercase tracking-wider">Frequency</th>
                                  <th className="py-2 px-3 font-semibold uppercase tracking-wider">Duration</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--portal-border)]/40">
                                {note.prescriptions.map((pr, pIdx) => (
                                  <tr key={pIdx}>
                                    <td className="py-2.5 px-3 font-semibold text-[var(--portal-text)]">{pr.medication}</td>
                                    <td className="py-2.5 px-3 font-mono text-[var(--portal-muted)]">{pr.dosage}</td>
                                    <td className="py-2.5 px-3 text-[var(--portal-muted)]">{pr.frequency}</td>
                                    <td className="py-2.5 px-3 text-[var(--portal-muted)]">{pr.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredNotes.length === 0 && (
                  <div className="text-center py-16 app-card space-y-4 max-w-xl mx-auto border-dashed border-2">
                    <AlertCircle className="h-10 w-10 text-[var(--portal-muted)] mx-auto" />
                    <h3 className="text-card-title text-[var(--portal-text)] font-bold">No clinical logs found</h3>
                    <p className="text-secondary-premium text-[var(--portal-muted)]">Enter another filter text or write a fresh clinical notes document.</p>
                  </div>
                )}
              </section>
            </>
          )}

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
