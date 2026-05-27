import { useState } from 'react';
import { CalendarDays, Clock, Check, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface AvailabilityDay {
  dayName: string;
  active: boolean;
  slots: string[];
}

const initialSchedule: AvailabilityDay[] = [
  { dayName: 'Monday', active: true, slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
  { dayName: 'Tuesday', active: true, slots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM'] },
  { dayName: 'Wednesday', active: true, slots: ['09:00 AM - 12:00 PM'] },
  { dayName: 'Thursday', active: true, slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
  { dayName: 'Friday', active: true, slots: ['09:00 AM - 01:00 PM'] },
  { dayName: 'Saturday', active: false, slots: [] },
  { dayName: 'Sunday', active: false, slots: [] }
];

export const DoctorSchedulePage = () => {
  const [schedule, setSchedule] = useState<AvailabilityDay[]>(initialSchedule);
  const [addingSlotDay, setAddingSlotDay] = useState<string | null>(null);
  const [newSlotTime, setNewSlotTime] = useState('09:00 AM - 11:00 AM');

  const handleToggleDay = (dayName: string) => {
    setSchedule(prev => 
      prev.map(d => d.dayName === dayName ? { ...d, active: !d.active, slots: !d.active ? ['09:00 AM - 12:00 PM'] : [] } : d)
    );
    const day = schedule.find(d => d.dayName === dayName);
    toast.info(`${dayName} clinical availability ${!day?.active ? 'enabled' : 'disabled'}.`);
  };

  const handleDeleteSlot = (dayName: string, index: number) => {
    setSchedule(prev => 
      prev.map(d => d.dayName === dayName ? { ...d, slots: d.slots.filter((_, idx) => idx !== index) } : d)
    );
    toast.error(`Removed slot block on ${dayName}.`);
  };

  const handleAddSlot = (dayName: string) => {
    setSchedule(prev => 
      prev.map(d => d.dayName === dayName ? { ...d, slots: [...d.slots, newSlotTime] } : d)
    );
    toast.success(`Availability block added on ${dayName}.`);
    setAddingSlotDay(null);
  };

  const handleSaveAll = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Syncing schedule metrics to patient booking engines...',
        success: 'Clinical availability successfully updated globally!',
        error: 'Failed to sync schedule.',
      }
    );
  };

  return (
    <DashboardLayout title="Clinical Calendar">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Availability & Schedule Blocks</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Set weekly telehealth availability windows for synced patient booking routers
              </p>
            </div>
            <button 
              onClick={handleSaveAll}
              className="btn-premium btn-premium-primary h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
            >
              <ShieldCheck className="h-4.5 w-4.5" /> Save Calendar Config
            </button>
          </div>

          {/* Schedule list */}
          <section className="space-y-4">
            {schedule.map((day) => (
              <div 
                key={day.dayName}
                className={cn(
                  "app-card p-5 transition-all duration-200",
                  day.active ? "border-[var(--portal-border)] bg-[var(--portal-surface)]" : "border-[var(--portal-border)]/40 bg-[var(--portal-elevated)]/40 opacity-70"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Day Toggler */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day.dayName)}
                      className={cn(
                        "h-6 w-11 rounded-full p-0.5 transition-colors relative",
                        day.active ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                      )}
                    >
                      <span className={cn(
                        "block h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
                        day.active ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                    <div>
                      <h3 className="text-body-premium font-bold text-[var(--portal-text)]">{day.dayName}</h3>
                      <p className="text-[10px] text-[var(--portal-muted)] font-semibold mt-0.5 uppercase tracking-wide">
                        {day.active ? `${day.slots.length} Active Slots` : 'Clinically Offline'}
                      </p>
                    </div>
                  </div>

                  {/* Active Slots list */}
                  {day.active && (
                    <div className="flex flex-wrap gap-2 items-center flex-1 sm:justify-end">
                      {day.slots.map((slot, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-xs text-[var(--portal-muted)] font-medium group hover:border-red-500/20 hover:bg-red-500/5 transition-all"
                        >
                          <Clock className="h-3.5 w-3.5 text-[#0ea5e9]" />
                          <span>{slot}</span>
                          <button
                            onClick={() => handleDeleteSlot(day.dayName, sIdx)}
                            className="text-[var(--portal-muted)] group-hover:text-red-500 transition-colors ml-1"
                            title="Remove slot block"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {addingSlotDay === day.dayName ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-150">
                          <input
                            type="text"
                            value={newSlotTime}
                            onChange={(e) => setNewSlotTime(e.target.value)}
                            placeholder="e.g. 09:00 AM - 11:00 AM"
                            className="input-premium h-8 px-2 text-[10px] w-40"
                          />
                          <button
                            onClick={() => handleAddSlot(day.dayName)}
                            className="btn-premium btn-premium-primary h-8 px-3 rounded-lg text-[10px]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setAddingSlotDay(null)}
                            className="btn-premium btn-premium-secondary h-8 px-3 rounded-lg text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingSlotDay(day.dayName);
                            setNewSlotTime('09:00 AM - 11:00 AM');
                          }}
                          className="flex items-center justify-center h-8 px-3 rounded-lg border border-dashed border-[var(--portal-border)] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 text-[#0ea5e9] text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Block
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
