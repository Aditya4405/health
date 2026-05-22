import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Star, CalendarClock, Languages, BriefcaseMedical, X } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { doctorService, type Doctor } from '@/services/doctorService';
import { useDebounce } from '@/hooks/useDebounce';
import { usePageTitle } from '@/hooks/usePageTitle';

const specialties = ['All', 'Cardiologist', 'Hematologist', 'Endocrinologist', 'General Physician'];

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
    <DashboardLayout title="Doctor Finder">
      <PageTransition>
        <div className="space-y-5">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d8296]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, specialty, or condition..."
                  className="pl-9"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-5">
                <select
                  className="focus-ring h-11 rounded-sm border border-[#d7e4f0] bg-white px-3 text-sm"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                >
                  {specialties.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" />
                <select
                  className="focus-ring h-11 rounded-sm border border-[#d7e4f0] bg-white px-3 text-sm"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                >
                  <option>4.0+</option>
                  <option>4.5+</option>
                </select>
                <label className="flex h-11 items-center justify-between rounded-sm border border-[#d7e4f0] bg-white px-3 text-sm text-[#4d6780]">
                  Available Today
                  <Switch checked={availableToday} onCheckedChange={setAvailableToday} />
                </label>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#4d6980]">Showing {filteredDoctors.length} doctors in {location}</p>
            <div className="inline-flex items-center gap-2 text-sm">
              <span className="text-[#60758a]">Sort:</span>
              {(['Relevance', 'Rating', 'Distance', 'Availability'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSortBy(mode)}
                  className={`rounded-full px-3 py-1 ${sortBy === mode ? 'bg-[#dbeafb] text-primary' : 'bg-white text-[#60758a]'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dceafb] text-lg font-semibold text-primary">
                      {doctor.name
                        .split(' ')
                        .filter((_, index) => index !== 0)
                        .map((token) => token[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-lg font-semibold">{doctor.name}</h3>
                      <Badge variant="teal" className="mt-1">
                        {doctor.specialty}
                      </Badge>
                      <p className="mt-2 text-sm text-[#657c91]">{doctor.hospital}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[#4e6880]">
                    <p className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber" /> {doctor.rating} ({doctor.reviews} reviews)
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <BriefcaseMedical className="h-4 w-4 text-teal" /> {doctor.experience} years experience
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <CalendarClock className="h-4 w-4 text-[#639922]" /> {doctor.nextAvailable}
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" /> {doctor.location}
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <Languages className="h-4 w-4 text-purple" /> {doctor.languages.join(', ')}
                    </p>
                  </div>

                  <p className="mt-4 font-display text-xl font-semibold">?{doctor.fee}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setSelectedDoctor(doctor)}>
                      View Profile
                    </Button>
                    <Button variant="success" className="hover:bg-primary">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedDoctor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-[#031f3d]/45"
                onClick={() => setSelectedDoctor(null)}
              />
              <motion.aside
                initial={{ x: 420 }}
                animate={{ x: 0 }}
                exit={{ x: 420 }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-[#cfdeec] bg-white p-5 shadow-2xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Doctor Profile</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDoctor(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="rounded-md bg-[#f4f8fc] p-4">
                    <p className="font-display text-lg font-semibold">{selectedDoctor.name}</p>
                    <p className="text-sm text-[#60758a]">{selectedDoctor.specialty}</p>
                    <p className="mt-2 text-sm text-[#4f6982]">{selectedDoctor.about}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#4d6980]">Availability</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM'].map((slot) => (
                        <button key={slot} type="button" className="focus-ring rounded-md border border-[#d4e2ef] px-2 py-2 text-xs hover:bg-[#edf4fb]">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-[#dbe8f4] p-4">
                    <p className="text-sm font-semibold text-[#4f6882]">Reviews</p>
                    <p className="mt-2 text-sm text-[#60758a]">“Excellent clarity and compassionate consultation.”</p>
                    <p className="mt-2 text-sm text-[#60758a]">“Helped me understand lipid trends better.”</p>
                  </div>
                  <Button className="w-full" variant="success">
                    Book Consultation
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </PageTransition>
    </DashboardLayout>
  );
};

