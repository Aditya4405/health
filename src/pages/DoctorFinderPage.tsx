import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, CheckCircle2, Languages, MapPin, Search, Star, Stethoscope, X, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doctorService, type Doctor } from '@/services/doctorService';
import { useDebounce } from '@/hooks/useDebounce';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/utils/cn';

const specialties = ['All', 'Cardiologist', 'Hematologist', 'Endocrinologist', 'General Physician'];

const avatarGradients = [
  'from-[#38bdf8] to-[#4338ca]', // Cyan to Indigo
  'from-[#ec4899] to-[#8b5cf6]', // Pink to Purple
  'from-[#10b981] to-[#0369a1]', // Emerald to Blue
  'from-[#f59e0b] to-[#be123c]', // Amber to Rose
  'from-[#8b5cf6] to-[#d946ef]', // Violet to Fuchsia
];

export const DoctorFinderPage = () => {
  usePageTitle('Doctor Finder');

  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation] = useState('Lucknow');
  const [rating, setRating] = useState('4.0+');
  const [availableToday, setAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState<'Relevance' | 'Rating' | 'Distance' | 'Availability'>('Relevance');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchDoctors = async () => {
      const results = await doctorService.searchDoctors({
        q: debouncedQuery,
        specialty,
        location,
        rating,
        availableToday,
      });
      setDoctors(results);
    };
    void fetchDoctors();
  }, [availableToday, debouncedQuery, location, rating, specialty]);

  const filteredDoctors = useMemo(() => {
    const minRating = rating === '4.5+' ? 4.5 : 4;
    return doctors
      .filter((doctor) => (specialty === 'All' ? true : doctor.specialty === specialty))
      .filter((doctor) => doctor.rating >= minRating)
      .filter((doctor) => doctor.location.toLowerCase().includes(location.toLowerCase()))
      .filter((doctor) => (availableToday ? doctor.nextAvailable.toLowerCase().includes('today') : true));
  }, [availableToday, doctors, location, rating, specialty]);

  return (
    <DashboardLayout title="Doctors">
      <PageTransition>
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)]">
            <h2 className="text-section-title text-[var(--portal-text)]">Consult Specialists</h2>
            <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Schedule telehealth bookings synced with your clinical timeline profile</p>
          </div>

          {/* Search, Filter Tools */}
          <section className="grid gap-6 xl:grid-cols-[1fr_260px]">
            <article className="app-card p-5 md:p-6 shadow-sm space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--portal-muted)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search specialist name, clinical specialty, or condition..."
                  className="input-premium w-full pl-9 text-xs h-10"
                />
              </div>

              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                <select
                  className="focus-ring h-10 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-3 text-xs text-[var(--portal-text)] transition-all duration-200"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                >
                  {specialties.map((item) => (
                    <option key={item} className="bg-[var(--portal-surface)] text-[var(--portal-text)]">{item}</option>
                  ))}
                </select>

                <input 
                  value={location} 
                  onChange={(event) => setLocation(event.target.value)} 
                  placeholder="Location" 
                  className="input-premium w-full text-xs h-10 px-3" 
                />

                <select
                  className="focus-ring h-10 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-3 text-xs text-[var(--portal-text)] transition-all duration-200"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                >
                  <option className="bg-[var(--portal-surface)] text-[var(--portal-text)]">4.0+ Star Rating</option>
                  <option className="bg-[var(--portal-surface)] text-[var(--portal-text)]">4.5+ Star Rating</option>
                </select>

                <button
                  type="button"
                  onClick={() => setAvailableToday(prev => !prev)}
                  className={cn(
                    "flex h-10 items-center justify-between rounded-xl border px-3.5 text-xs font-semibold transition-all duration-200",
                    availableToday
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/30 text-[#0ea5e9]"
                      : "bg-[var(--portal-surface)] border-[var(--portal-border)] text-[var(--portal-muted)] hover:bg-[var(--portal-elevated)]"
                  )}
                >
                  Available Today
                  <span className={cn("h-1.5 w-1.5 rounded-full ml-2", availableToday ? "bg-[#0ea5e9]" : "bg-gray-400")} />
                </button>
              </div>
            </article>

            {/* Map Anchored Indicator */}
            <article className="app-card p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.04),transparent_45%),radial-gradient(circle_at_72%_58%,rgba(14,165,233,0.02),transparent_42%)] pointer-events-none" />
              <p className="text-label-premium text-[var(--portal-muted)]">Location Nodes</p>
              
              <div className="relative mt-2.5 h-[80px] overflow-hidden rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--portal-border) 1px, transparent 0)', backgroundSize: '10px 10px' }} />
                {['left-[28%] top-[38%]', 'left-[58%] top-[25%]', 'left-[44%] top-[60%]'].map((pin, i) => (
                  <span key={pin} className={`absolute ${pin} inline-flex h-3 w-3 rounded-full border border-white bg-gradient-to-tr from-[#0ea5e9] to-[#0284c7] shadow-md animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </article>
          </section>

          {/* Sorter */}
          <section className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-secondary-premium text-[var(--portal-muted)] font-medium">Found {filteredDoctors.length} doctors near your coordinates</p>
            <div className="inline-flex rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-1">
              {(['Relevance', 'Rating', 'Distance', 'Availability'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSortBy(mode)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border border-transparent",
                    sortBy === mode 
                      ? 'bg-[var(--portal-elevated)] text-[#0ea5e9] border-[var(--portal-border)]' 
                      : 'text-[var(--portal-muted)] hover:text-[var(--portal-text)]'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          {/* Telehealth grid */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor, index) => {
              const gradientClass = avatarGradients[index % avatarGradients.length];
              return (
                <article 
                  key={doctor.id} 
                  className="app-card app-card-hover p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                >
                  <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-gradient-to-br from-[#0ea5e9]/5 to-transparent blur-2xl pointer-events-none" />
                  
                  <div>
                    {/* Header profile block */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr text-white text-xs font-bold shadow-md", gradientClass)}>
                          {doctor.name
                            .split(' ')
                            .filter((_, idx) => idx !== 0)
                            .map((token) => token[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="text-body-premium text-[var(--portal-text)] font-semibold leading-tight">{doctor.name}</h3>
                          <p className="text-secondary-premium text-[var(--portal-muted)] mt-1">{doctor.hospital}</p>
                        </div>
                      </div>

                      {/* AI Match badge */}
                      <span className="inline-flex rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#0ea5e9] shadow-sm uppercase tracking-wider">
                        {Math.round(Math.min(99, doctor.rating * 20 + 8))}% Match
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className="inline-flex rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-text)]">
                        {doctor.specialty}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="mt-5 space-y-2 text-secondary-premium text-[var(--portal-muted)]">
                      <div className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                        <span className="text-[var(--portal-text)] font-bold">{doctor.rating}</span>
                        <span>({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-3.5 w-3.5 text-[#0ea5e9]" />
                        <span>Available: <span className="text-[#0ea5e9] font-bold">{doctor.nextAvailable}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[var(--portal-muted)]" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and booking */}
                  <div className="mt-6 pt-4 border-t border-[var(--portal-border)] space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-label-premium text-[var(--portal-muted)]">Consultation Fee</p>
                      <p className="text-card-title text-[var(--portal-text)] font-bold">₹{doctor.fee}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        className="btn-premium btn-premium-secondary h-9 text-xs rounded-xl" 
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        Profile
                      </button>
                      <button
                        className="btn-premium btn-premium-primary h-9 text-xs rounded-xl"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        {/* Doctor profile slide-in details drawer */}
        <AnimatePresence>
          {selectedDoctor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-[var(--portal-bg)]/60 backdrop-blur-sm"
                onClick={() => setSelectedDoctor(null)}
              />
              <motion.aside
                initial={{ x: 440 }}
                animate={{ x: 0 }}
                exit={{ x: 440 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 shadow-2xl space-y-6 text-[var(--portal-text)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--portal-border)] pb-4">
                  <h3 className="text-card-title font-bold tracking-tight">{selectedDoctor.name}</h3>
                  <button onClick={() => setSelectedDoctor(null)} className="h-8 w-8 flex items-center justify-center rounded-full text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 p-5 space-y-3">
                    <p className="text-label-premium text-[#0ea5e9]">{selectedDoctor.specialty}</p>
                    <p className="text-secondary-premium leading-relaxed text-[var(--portal-muted)]">{selectedDoctor.about}</p>
                    <div className="mt-3 flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-success">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Credentials Verified
                      </span>
                      <span className="inline-flex rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--portal-muted)]">
                        {selectedDoctor.experience} Yrs Experience
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 text-label-premium text-[var(--portal-muted)]">Select Appointment Slot</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM', '7:30 PM'].map((slot) => (
                        <button key={slot} type="button" className="focus-ring h-[38px] flex items-center justify-center rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:bg-[var(--portal-elevated)] px-2 text-xs font-semibold text-[var(--portal-text)] transition-all">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 p-5 text-secondary-premium text-[var(--portal-muted)] space-y-3">
                    <p className="font-bold text-[var(--portal-text)]">Patient feedback highlights</p>
                    <p className="italic">"Compassionate doctor who explains biological indicators in detail."</p>
                    <p className="italic">"Helped customize my lifestyle nutrition targets based on lab markers."</p>
                  </div>

                  <button
                    className="btn-premium btn-premium-primary w-full"
                  >
                    Confirm Appointment Bookings
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </PageTransition>
    </DashboardLayout>
  );
};
