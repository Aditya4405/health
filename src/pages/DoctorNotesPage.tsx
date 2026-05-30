import { useState, useMemo } from 'react';
import { 
  ClipboardPen, 
  ClipboardCheck, 
  Search, 
  Trash2, 
  Plus, 
  PlusCircle, 
  AlertCircle, 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  List, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic,
  FileText,
  Clock,
  ArrowRight,
  Database
} from 'lucide-react';
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
  title: string;
  date: string;
  summary: string;
  prescriptions: Prescription[];
  tags: string[];
}

const initialNotes: NoteRecord[] = [
  {
    id: 'n-1',
    patientName: 'Aarav Kapoor',
    title: 'Anemia & Cardiovascular Follow-up',
    date: 'Today, 11:45 AM',
    summary: 'Patient presented with LDL levels of 182 mg/dL. Microcytic anemia patterns are present (hemoglobin 11.2 g/dL). Checked patient dietary logs. Prescribed low-dose statins (Atorvastatin 10mg) and elemental iron guidelines (Carbonyl Iron 45mg). Recommended follow-up CBC in 4 weeks.',
    prescriptions: [
      { medication: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '30 days' },
      { medication: 'Carbonyl Iron', dosage: '45mg element', frequency: 'Once daily with Vitamin C', duration: '60 days' }
    ],
    tags: ['Anemia', 'Cardio Watch']
  },
  {
    id: 'n-2',
    patientName: 'Isha Verma',
    title: 'Metabolic baseline review',
    date: 'Yesterday, 04:30 PM',
    summary: 'Metabolic review. Hemoglobin is stable but low at 10.5 g/dL. Glucose parameters elevated at 105 mg/dL. Fatigue persists. Instructed patient to focus on dietary iron intake and schedule a secondary glucose and lipid panel in 4 weeks.',
    prescriptions: [
      { medication: 'Ferrous Gluconate', dosage: '324mg', frequency: 'Once daily', duration: '30 days' }
    ],
    tags: ['Glucose Check', 'Fatigue']
  }
];

const templates = [
  { name: 'Intake: Anemia check', title: 'Anemia Screening & Vitals check', text: 'Patient presented with chronic fatigue. Lab values check shows low hemoglobin count. Check ferritin serum parameters and draft dietary iron checklist.' },
  { name: 'Lipid Therapy follow-up', title: 'Cardiovascular Lipid Review', text: 'Reviewing response to low-dose statin parameters. LDL remains elevated. Suggesting dietary modifications and ordering follow-up lipid panels.' },
  { name: 'Routine Health baseline', title: 'Routine Clinical Checkup', text: 'Annual metabolic check. Vital parameters are stable. Biomarkers achievement normal. Next routine EHR check scheduled in 12 months.' }
];

export const DoctorNotesPage = () => {
  const [notes, setNotes] = useState<NoteRecord[]>(initialNotes);
  const [activeNote, setActiveNote] = useState<NoteRecord>(initialNotes[0]);
  const [search, setSearch] = useState('');
  
  // Notion-style editor states
  const [editorTitle, setEditorTitle] = useState(initialNotes[0].title);
  const [editorPatient, setEditorPatient] = useState(initialNotes[0].patientName);
  const [editorBody, setEditorBody] = useState(initialNotes[0].summary);
  const [editorRx, setEditorRx] = useState<Prescription[]>(initialNotes[0].prescriptions);
  const [editorTags, setEditorTags] = useState<string[]>(initialNotes[0].tags);

  // Dictation mock
  const [voiceActive, setVoiceActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelectNote = (note: NoteRecord) => {
    setActiveNote(note);
    setEditorTitle(note.title);
    setEditorPatient(note.patientName);
    setEditorBody(note.summary);
    setEditorRx(note.prescriptions);
    setEditorTags(note.tags);
  };

  const handleAddMedicationRow = () => {
    setEditorRx(prev => [...prev, { medication: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleMedChange = (index: number, field: keyof Prescription, val: string) => {
    setEditorRx(prev => prev.map((row, idx) => idx === index ? { ...row, [field]: val } : row));
  };

  const handleDeleteMedRow = (index: number) => {
    setEditorRx(prev => prev.filter((_, idx) => idx !== index));
  };

  // Preset Template injection
  const injectTemplate = (tpl: typeof templates[0]) => {
    setEditorTitle(tpl.title);
    setEditorBody(tpl.text);
    setEditorRx([]);
    setEditorTags(['Template Synced']);
    toast.info(`Injected: ${tpl.name}`);
  };

  const handleCreateNewNote = () => {
    const fresh: NoteRecord = {
      id: `n-${Date.now()}`,
      patientName: 'Aarav Kapoor',
      title: 'Untitled Note Document',
      date: 'Just now',
      summary: '',
      prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }],
      tags: ['Clinical Draft']
    };
    setNotes(prev => [fresh, ...prev]);
    handleSelectNote(fresh);
    toast.success('New clinical note draft created.');
  };

  const handleSaveActiveNote = () => {
    if (!editorPatient.trim()) {
      toast.warning('Patient context name is required.');
      return;
    }
    setSaving(true);
    
    setTimeout(() => {
      const cleanRx = editorRx.filter(r => r.medication.trim() !== '');
      const updated: NoteRecord = {
        ...activeNote,
        patientName: editorPatient,
        title: editorTitle,
        summary: editorBody,
        prescriptions: cleanRx,
        tags: editorTags.includes('Clinical Draft') ? ['Clinical Logs'] : editorTags
      };

      setNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n));
      setActiveNote(updated);
      setSaving(false);
      toast.success(`EHR notes saved and synced for ${editorPatient}`);
    }, 1000);
  };

  const handleDeleteNote = (id: string, name: string) => {
    const list = notes.filter(n => n.id !== id);
    setNotes(list);
    toast.error(`Deleted clinical log for ${name}`);
    if (list.length > 0) {
      handleSelectNote(list[0]);
    }
  };

  // Mock voice note recorder dictation trigger
  const handleToggleVoiceDictation = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      toast.info('Voice dictation active. Speak clinical symptoms now...');
      
      // Simulate speech-to-text input after 3 seconds
      setTimeout(() => {
        setEditorBody(prev => prev + '\n\n[Voice Sync]: Patient claims mild insomnia side-effects after dinner. Normal vitals validated.');
        setVoiceActive(false);
        toast.success('Speech-to-Text translation packet synced.');
      }, 4000);
    } else {
      setVoiceActive(false);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.patientName.toLowerCase().includes(search.toLowerCase()) ||
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Clinical Notes">
      <PageTransition>
        <div className="grid gap-5 lg:grid-cols-[300px_1fr_320px] text-[var(--portal-text)] h-[calc(100vh-140px)] min-h-[580px]">
          
          {/* LEFT PANEL: Drafts list & Templates */}
          <aside className="app-card p-4 flex flex-col justify-between h-full overflow-hidden select-none">
            <div className="flex flex-col h-full overflow-hidden space-y-4">
              
              <div className="flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Clinical Records</p>
                <button 
                  onClick={handleCreateNewNote}
                  className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Write Note
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full shrink-0">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--portal-muted)]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clinical notes..."
                  className="input-premium h-8.5 w-full pl-9 text-xs"
                />
              </div>

              {/* Drafts scrollable list */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {filteredNotes.map((note) => {
                  const isActive = note.id === activeNote.id;
                  return (
                    <div 
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all",
                        isActive 
                          ? "border-[#0ea5e9]/40 bg-[#0ea5e9]/5" 
                          : "border-[var(--portal-border)] bg-[var(--portal-elevated)]/20 hover:bg-[var(--portal-elevated)]/50"
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-xs truncate text-[var(--portal-text)] max-w-[190px]">{note.title || 'Untitled Note'}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id, note.patientName);
                          }}
                          className="text-[var(--portal-muted)] hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--portal-muted)] font-semibold mt-1 uppercase tracking-wider">{note.patientName}</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-1.5 font-mono truncate">{note.date}</p>
                    </div>
                  );
                })}
              </div>

              {/* Templates menu block */}
              <div className="border-t border-[var(--portal-border)] pt-3 shrink-0 space-y-2">
                <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Clinical Presets</p>
                <div className="grid gap-1.5">
                  {templates.map((tpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => injectTemplate(tpl)}
                      className="w-full text-left p-2 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] text-[10px] font-semibold text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] transition-colors truncate"
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* CENTER PANEL: Notion-style Editor */}
          <section className="app-card p-5 h-full overflow-y-auto flex flex-col justify-between space-y-4">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              
              {/* Rich text helpers toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)] shrink-0 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-[var(--portal-muted)]">
                  <button className="p-1.5 rounded hover:bg-[var(--portal-elevated)] hover:text-[var(--portal-text)]" title="H1 Heading"><Heading1 className="h-4 w-4" /></button>
                  <button className="p-1.5 rounded hover:bg-[var(--portal-elevated)] hover:text-[var(--portal-text)]" title="H2 Heading"><Heading2 className="h-4 w-4" /></button>
                  <span className="h-4 w-px bg-[var(--portal-border)]" />
                  <button className="p-1.5 rounded hover:bg-[var(--portal-elevated)] hover:text-[var(--portal-text)]" title="Bold Text"><Bold className="h-4 w-4 font-bold" /></button>
                  <button className="p-1.5 rounded hover:bg-[var(--portal-elevated)] hover:text-[var(--portal-text)]" title="Italic Text"><Italic className="h-4 w-4 italic" /></button>
                  <button className="p-1.5 rounded hover:bg-[var(--portal-elevated)] hover:text-[var(--portal-text)]" title="Bullet Lists"><List className="h-4 w-4" /></button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Blinking dictation waves indicator */}
                  {voiceActive && (
                    <div className="flex gap-0.5 items-center px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                      <span className="h-1.5 w-1 bg-red-50 rounded" />
                      <span className="h-2.5 w-1 bg-red-50 rounded animate-bounce delay-75" />
                      <span className="h-1.5 w-1 bg-red-50 rounded animate-bounce delay-150" />
                      <span>Recording</span>
                    </div>
                  )}
                  <button 
                    onClick={handleToggleVoiceDictation}
                    className={cn(
                      "h-8 px-2.5 rounded-lg border flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                      voiceActive ? "bg-red-500/15 border-red-500/30 text-red-400" : "bg-[var(--portal-surface)] border-[var(--portal-border)] hover:bg-[var(--portal-elevated)] text-[var(--portal-muted)]"
                    )}
                    title="Dictate Clinical Note"
                  >
                    {voiceActive ? <MicOff className="h-3.5 w-3.5 animate-pulse" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>Dictation</span>
                  </button>
                </div>
              </div>

              {/* Title & Patient Context Inputs */}
              <div className="space-y-3 shrink-0">
                <input 
                  type="text" 
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="EHR Note Document Title..."
                  className="bg-transparent border-none outline-none text-page-title font-bold w-full text-[var(--portal-text)] placeholder-[var(--portal-muted)] px-1"
                />
                
                <div className="flex items-center gap-2 px-1 text-xs">
                  <span className="text-[var(--portal-muted)] font-semibold uppercase text-[9px] tracking-wider shrink-0">Patient Context:</span>
                  <input 
                    type="text" 
                    value={editorPatient}
                    onChange={(e) => setEditorPatient(e.target.value)}
                    placeholder="e.g. Aarav Kapoor"
                    className="bg-transparent border-none outline-none font-bold text-[#0ea5e9] w-48 placeholder-[var(--portal-muted)]"
                  />
                </div>
              </div>

              {/* Body editor */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <textarea 
                  value={editorBody}
                  onChange={(e) => setEditorBody(e.target.value)}
                  placeholder="Click here and start drafting patient assessment notes..."
                  className="bg-transparent border-none outline-none w-full h-full min-h-[150px] resize-none text-xs leading-relaxed text-[var(--portal-text)] placeholder-[var(--portal-muted)] px-1"
                />
              </div>

              {/* Linear-style Prescription Blocks editor */}
              <div className="border-t border-[var(--portal-border)]/50 pt-3 shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider ml-1">EHR Treatment Regimen</span>
                  <button 
                    type="button" 
                    onClick={handleAddMedicationRow}
                    className="text-[9px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center gap-0.5 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add Medication Block
                  </button>
                </div>

                <div className="grid gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {editorRx.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-[var(--portal-elevated)]/30 p-2 border border-[var(--portal-border)] rounded-xl relative">
                      <input 
                        type="text" 
                        placeholder="Drug name" 
                        value={med.medication}
                        onChange={(e) => handleMedChange(idx, 'medication', e.target.value)}
                        className="input-premium h-8 px-2 text-[10px] w-full"
                      />
                      <input 
                        type="text" 
                        placeholder="Dosage" 
                        value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="input-premium h-8 px-2 text-[10px] w-full"
                      />
                      <input 
                        type="text" 
                        placeholder="Frequency" 
                        value={med.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="input-premium h-8 px-2 text-[10px] w-full"
                      />
                      <div className="flex gap-1.5 w-full">
                        <input 
                          type="text" 
                          placeholder="Duration" 
                          value={med.duration}
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                          className="input-premium h-8 px-2 text-[10px] w-full"
                        />
                        <button 
                          type="button" 
                          onClick={() => handleDeleteMedRow(idx)}
                          className="text-[var(--portal-muted)] hover:text-red-400 px-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-[var(--portal-border)] flex gap-2 shrink-0">
              <button 
                onClick={handleSaveActiveNote}
                disabled={saving}
                className="btn-premium btn-premium-primary text-[10px] font-bold uppercase tracking-wider"
              >
                {saving ? 'Syncing...' : 'Save Notes & Sync EMR'}
              </button>
            </div>
          </section>

          {/* RIGHT PANEL: AI Summary & EMR packet */}
          <aside className="app-card p-4 flex flex-col justify-between h-full overflow-hidden select-none">
            <div className="flex flex-col h-full overflow-hidden space-y-4">
              
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)] shrink-0">
                <Sparkles className="h-4.5 w-4.5 text-[#7f77dd]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">AI Clinical Synthesis</h4>
              </div>

              {/* AI generated package */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="p-3 bg-[#7f77dd]/5 border border-[#7f77dd]/15 rounded-xl space-y-2 text-xs">
                  <p className="text-[9px] font-bold text-[#7f77dd] uppercase tracking-wider">EHR Synced Packet</p>
                  <p className="text-[11px] text-[var(--portal-text)] font-semibold leading-relaxed">
                    AI analysis logs are compiled automatically from the editor remarks.
                  </p>
                  <div className="border-t border-[#7f77dd]/15 pt-2.5 space-y-2 text-[10px]">
                    <div className="flex justify-between font-mono">
                      <span className="text-[var(--portal-muted)]">Code:</span>
                      <span className="font-semibold text-[var(--portal-text)]">ICD-10 D64.9</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-[var(--portal-muted)]">Triage Status:</span>
                      <span className="font-semibold text-emerald-500">Normal Sync</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/20 space-y-2 text-xs">
                  <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Active Biomarker Warnings</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[var(--portal-muted)]">Hemoglobin:</span>
                      <span className="font-semibold text-amber-500">11.2 (Low)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--portal-muted)]">LDL Cholesterol:</span>
                      <span className="font-semibold text-red-500">182 (Critical)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-dashed border-[var(--portal-border)] space-y-2 text-xs text-[var(--portal-muted)]">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                    <Database className="h-3.5 w-3.5" />
                    <span>EMR Sync Targets</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Clinical remarks and prescription regimens will sync directly with the central hospital repository.
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--portal-border)] pt-3 shrink-0">
                <button 
                  onClick={handleSaveActiveNote}
                  disabled={saving}
                  className="btn-premium btn-premium-secondary w-full gap-1.5 h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[var(--portal-muted)] border-[var(--portal-border)] bg-[var(--portal-surface)]"
                >
                  <Database className="h-3.5 w-3.5 text-[#0ea5e9]" /> Sync Patient Dossier
                </button>
              </div>

            </div>
          </aside>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
