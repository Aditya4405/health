import { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  GripVertical,
  Calendar as CalendarIcon 
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ScheduledAppointment {
  id: string;
  patientName: string;
  reason: string;
  day: string; // 'Monday', 'Tuesday', etc.
  time: string; // '09:00 AM', '10:30 AM', etc.
  type: 'Consultation' | 'Follow Up' | 'Emergency' | 'Blocked';
}

const initialAppointments: ScheduledAppointment[] = [
  { id: 'app-1', patientName: 'Aarav Kapoor', reason: 'LDL spike watch', day: 'Monday', time: '09:00 AM', type: 'Emergency' },
  { id: 'app-2', patientName: 'Isha Verma', reason: 'Fatigue screening', day: 'Monday', time: '10:30 AM', type: 'Consultation' },
  { id: 'app-3', patientName: 'Rohan Das', reason: 'Baseline review', day: 'Tuesday', time: '12:00 PM', type: 'Follow Up' },
  { id: 'app-4', patientName: 'Clinical Buffer', reason: 'EHR Sync Block', day: 'Wednesday', time: '03:00 PM', type: 'Blocked' },
  { id: 'app-5', patientName: 'Karan Malhotra', reason: 'Hypertension triage', day: 'Thursday', time: '09:00 AM', type: 'Emergency' }
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM'];

const colorMap = {
  Consultation: 'bg-sky-500/10 border-sky-500/20 text-[#0ea5e9]',
  'Follow Up': 'bg-purple-500/10 border-purple-500/20 text-[#7f77dd]',
  Emergency: 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse',
  Blocked: 'bg-zinc-500/10 border-zinc-500/20 text-[var(--portal-muted)]'
};

export const DoctorSchedulePage = () => {
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>(initialAppointments);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [activeMonth, setActiveMonth] = useState('May 2026');
  const [addingSlot, setAddingSlot] = useState(false);

  // New slot form states
  const [newPatient, setNewPatient] = useState('');
  const [newType, setNewType] = useState<ScheduledAppointment['type']>('Consultation');
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('09:00 AM');

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('appointmentId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: string, targetTime: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appointmentId');
    if (!id) return;
    
    // Check if slot is already occupied
    const isOccupied = appointments.some(app => app.day === targetDay && app.time === targetTime && app.id !== id);
    if (isOccupied) {
      toast.warning(`Reschedule failed: Slot on ${targetDay} at ${targetTime} is already occupied.`);
      return;
    }

    setAppointments(prev => prev.map(app => app.id === id ? { ...app, day: targetDay, time: targetTime } : app));
    const moved = appointments.find(app => app.id === id);
    toast.success(`Rescheduled: ${moved?.patientName} moved to ${targetDay} at ${targetTime}.`);
  };

  const handleQuickBook = (day: string, time: string) => {
    setNewDay(day);
    setNewTime(time);
    setNewPatient('');
    setNewType('Consultation');
    setAddingSlot(true);
    toast.info(`Quick booking initiated for ${day} at ${time}.`);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.trim()) {
      toast.warning('Patient Name or Buffer label is required.');
      return;
    }

    const isOccupied = appointments.some(app => app.day === newDay && app.time === newTime);
    if (isOccupied) {
      toast.warning(`Failed to add: Slot on ${newDay} at ${newTime} is occupied.`);
      return;
    }

    const fresh: ScheduledAppointment = {
      id: `app-${Date.now()}`,
      patientName: newPatient,
      reason: newType === 'Blocked' ? 'EHR Sync Block' : 'Clinical evaluation',
      day: newDay,
      time: newTime,
      type: newType
    };

    setAppointments(prev => [...prev, fresh]);
    toast.success(`Created slot on ${newDay} at ${newTime}.`);
    setNewPatient('');
    setAddingSlot(false);
  };

  const handleDeleteSlot = (id: string, name: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    toast.error(`Removed scheduled block for ${name}.`);
  };

  return (
    <DashboardLayout title="Clinical Scheduler">
      <PageTransition>
        <div className="space-y-5 text-[var(--portal-text)]">
          
          {/* Header Row */}
          <div className="pb-3 border-b border-[var(--portal-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Clinical Scheduler Console</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Set weekly telehealth consultation grids and clinical buffer blocks
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setAddingSlot(!addingSlot)}
                className="btn-premium btn-premium-primary h-9 px-4 gap-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider"
              >
                <Plus className="h-4 w-4" /> Add Slot Block
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <div className="app-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 border border-[var(--portal-border)] bg-[var(--portal-surface)] flex items-center justify-center rounded-xl text-[var(--portal-muted)]">
                <CalendarIcon className="h-4.5 w-4.5" />
              </span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 text-[var(--portal-muted)] hover:text-[var(--portal-text)]"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-xs font-bold uppercase tracking-wider">{activeMonth}</span>
                <button className="p-1 text-[var(--portal-muted)] hover:text-[var(--portal-text)]"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Drag & Drop Alert */}
            <div className="hidden lg:flex items-center gap-2 bg-[#0ea5e9]/5 border border-[#0ea5e9]/15 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-[#0ea5e9]">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Interactive Drag & Drop Scheduler Enabled. Drag tags to reschedule slots.</span>
            </div>

            {/* Layout switch */}
            <div className="flex bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] rounded-xl p-0.5 shrink-0">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                    viewMode === mode 
                      ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" 
                      : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {addingSlot && (
            /* Add Slot Form overlay */
            <form onSubmit={handleSaveSlot} className="app-card p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 max-w-xl mx-auto border-sky-500/20">
              <h3 className="text-card-title font-bold text-[var(--portal-text)]">Create Scheduled Appointment Block</h3>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Patient Name / Label</label>
                  <input 
                    type="text" 
                    value={newPatient} 
                    onChange={(e) => setNewPatient(e.target.value)} 
                    placeholder="e.g. Aarav Kapoor" 
                    className="input-premium w-full"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Appointment Type</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value as any)} 
                    className="input-premium w-full font-bold text-xs"
                  >
                    <option value="Consultation" className="bg-[#0B1020]">Consultation (Blue)</option>
                    <option value="Follow Up" className="bg-[#0B1020]">Follow Up (Purple)</option>
                    <option value="Emergency" className="bg-[#0B1020]">Emergency (Red)</option>
                    <option value="Blocked" className="bg-[#0B1020]">Blocked Buffer (Gray)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Weekday</label>
                  <select 
                    value={newDay} 
                    onChange={(e) => setNewDay(e.target.value)} 
                    className="input-premium w-full font-bold text-xs"
                  >
                    {weekdays.map(d => <option key={d} value={d} className="bg-[#0B1020]">{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Time Slot</label>
                  <select 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                    className="input-premium w-full font-bold text-xs"
                  >
                    {timeSlots.map(t => <option key={t} value={t} className="bg-[#0B1020]">{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-[var(--portal-border)]/50">
                <button type="submit" className="btn-premium btn-premium-primary text-[10px]">Add to Grid</button>
                <button type="button" onClick={() => setAddingSlot(false)} className="btn-premium btn-premium-secondary text-[10px]">Cancel</button>
              </div>
            </form>
          )}

          {/* WEEK VIEW (Flagship Layout) */}
          {viewMode === 'week' ? (
            <article className="app-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[850px] table-fixed">
                  <thead>
                    <tr className="border-b border-[var(--portal-border)] text-[var(--portal-muted)] font-semibold uppercase tracking-wider bg-[var(--portal-elevated)]/25">
                      <th className="py-3 px-4 w-[120px] text-center border-r border-[var(--portal-border)]/40">Hour Slot</th>
                      {weekdays.map((day) => (
                        <th key={day} className="py-3 px-4 text-center border-r border-[var(--portal-border)]/40 last:border-r-0">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--portal-border)]/40">
                    {timeSlots.map((slot) => (
                      <tr key={slot} className="hover:bg-[var(--portal-elevated)]/10">
                        {/* Time labels column */}
                        <td className="py-4 px-4 w-[120px] text-center font-mono font-bold text-[var(--portal-muted)] bg-[var(--portal-elevated)]/20 border-r border-[var(--portal-border)]/40">
                          {slot}
                        </td>
                        
                        {/* Days column blocks */}
                        {weekdays.map((day) => {
                          const appInSlot = appointments.find(app => app.day === day && app.time === slot);
                          return (
                            <td 
                              key={day} 
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, day, slot)}
                              className="py-2.5 px-2 text-center border-r border-[var(--portal-border)]/40 last:border-r-0 bg-[var(--portal-surface)]/20 relative min-h-[70px] transition-colors hover:bg-sky-500/[0.015]"
                            >
                              {appInSlot ? (
                                <div 
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, appInSlot.id)}
                                  className={cn(
                                    "p-2.5 rounded-xl border text-left space-y-1 relative shadow-sm cursor-grab active:cursor-grabbing transition-all select-none hover:shadow-md",
                                    colorMap[appInSlot.type]
                                  )}
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <GripVertical className="h-3 w-3 text-current/40 shrink-0 cursor-grab active:cursor-grabbing" />
                                      <span className="font-bold text-[11px] truncate block max-w-[90px]">{appInSlot.patientName}</span>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteSlot(appInSlot.id, appInSlot.patientName)}
                                      className="text-current/60 hover:text-red-500 transition-colors shrink-0"
                                      title="Cancel appointment"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <span className="text-[9px] font-semibold opacity-75 block leading-tight truncate">{appInSlot.reason}</span>
                                  <span className="text-[8px] font-bold uppercase tracking-wider inline-block bg-current/5 border border-current/10 px-1 rounded">{appInSlot.type}</span>
                                </div>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleQuickBook(day, slot)}
                                  className="h-full w-full min-h-[50px] flex items-center justify-center rounded-xl border border-dashed border-transparent hover:border-[var(--portal-border)] bg-transparent hover:bg-[var(--portal-elevated)]/25 group transition-all select-none cursor-pointer"
                                >
                                  <span className="text-[9px] text-transparent group-hover:text-[#0ea5e9] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                                    <Plus className="h-3 w-3" /> Book Slot
                                  </span>
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ) : (
            /* Day / Month fallback mock */
            <article className="app-card p-8 text-center py-20 border-dashed border-2">
              <CalendarDays className="h-10 w-10 text-[var(--portal-muted)] mx-auto mb-4 animate-bounce" />
              <h3 className="text-card-title font-bold text-[var(--portal-text)] uppercase tracking-wider">
                {viewMode === 'day' ? "Single Day Timeline Mode" : "Grid Month Calendar Mode"}
              </h3>
              <p className="text-xs text-[var(--portal-muted)] max-w-sm mx-auto leading-relaxed mt-2">
                This layout view is clinically synced. Week View is currently selected as the active operational dashboard interface for scheduling operations.
              </p>
              <button 
                onClick={() => setViewMode('week')}
                className="btn-premium btn-premium-primary text-[10px] uppercase font-bold tracking-wider mt-5"
              >
                Return to Week View Grid
              </button>
            </article>
          )}

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
