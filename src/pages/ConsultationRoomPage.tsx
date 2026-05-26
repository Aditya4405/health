import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  ClipboardList, 
  Clock, 
  CheckCircle,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface Dialogue {
  speaker: 'Doctor' | 'Patient' | 'AI Insight';
  text: string;
}

const mockDialogue: Dialogue[] = [
  { speaker: 'Doctor', text: 'Hello Aarav, I reviewed your latest blood panels. Let\'s look at your hemoglobin metrics.' },
  { speaker: 'Patient', text: 'Sure Dr. Rahul, I felt tired lately. Is my iron level low?' },
  { speaker: 'AI Insight', text: 'Patient\'s symptoms correlate with Hemoglobin: 11.2 g/dL and Ferritin: 18 ng/mL (Iron deficiency anemia pattern).' },
  { speaker: 'Doctor', text: 'Yes, your hemoglobin is 11.2, which is low. I am prescribing Carbonyl Iron daily. We also need to keep monitoring Atorvastatin response for LDL.' },
  { speaker: 'Patient', text: 'Got it, I will follow that diet checklist and take the tablets.' }
];

export const ConsultationRoomPage = () => {
  const navigate = useNavigate();
  const { consultationId = 'c1' } = useParams();

  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [transcripts, setTranscripts] = useState<Dialogue[]>(mockDialogue.slice(0, 3));
  const [sessionNotes, setSessionNotes] = useState('Patient confirms adherence to Atorvastatin. Initiated iron supplements.');
  const [endingCall, setEndingCall] = useState(false);

  // Simulate incoming transcription lines over time
  useEffect(() => {
    const t1 = setTimeout(() => {
      setTranscripts(prev => [...prev, mockDialogue[3]]);
    }, 4000);
    const t2 = setTimeout(() => {
      setTranscripts(prev => [...prev, mockDialogue[4]]);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEndCall = () => {
    setEndingCall(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Archiving consultation record & syncing prescriptions...',
        success: () => {
          setEndingCall(false);
          navigate('/app/doctor/consultations');
          return 'Consultation successfully completed! Session logs saved.';
        },
        error: 'Failed to close session.'
      }
    );
  };

  return (
    <DashboardLayout title="Consultation Room">
      <PageTransition>
        <div className="space-y-4 text-[var(--portal-text)] h-[calc(100vh-100px)] min-h-[550px] flex flex-col justify-between">
          
          {/* Top row */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)] shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--portal-text)]">Active Telehealth Session</h2>
            </div>
            <button 
              onClick={handleEndCall}
              disabled={endingCall}
              className="btn-premium btn-premium-danger h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
            >
              <PhoneOff className="h-4 w-4" /> End Consultation
            </button>
          </div>

          {/* Core Telehealth Grid */}
          <div className="flex-1 grid gap-4 lg:grid-cols-12 min-h-0 overflow-hidden py-1">
            
            {/* Left Column: Video Feed (7 columns) */}
            <article className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
              
              {/* Simulated patient video feed box */}
              <div className="flex-1 rounded-2xl border border-[var(--portal-border)] bg-[#0B1020] relative overflow-hidden flex items-center justify-center shadow-lg group">
                
                {/* Visual scanline overlays */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,32,0)_99%,rgba(14,165,233,0.1)_1%)] [background-size:100%_4px] pointer-events-none opacity-20" />
                
                {camActive ? (
                  <div className="text-center space-y-3 relative z-10 select-none">
                    {/* Diagnostic HUD mock overlays */}
                    <div className="absolute left-4 top-4 text-[9px] font-bold text-sky-400 bg-[#0B1020]/80 border border-sky-500/20 px-2.5 py-1 rounded-md">
                      FPS: 60 | LATENCY: 24ms | RESOLUTION: 1080P
                    </div>

                    <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9] flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
                      AK
                    </div>
                    <p className="text-xs font-bold text-slate-200">Aarav Kapoor (Patient)</p>
                    <p className="text-[10px] text-emerald-500 font-semibold flex items-center justify-center gap-1.5 leading-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-3 text-[var(--portal-muted)] select-none">
                    <VideoOff className="h-10 w-10 mx-auto" />
                    <p className="text-xs font-bold">Patient camera disabled</p>
                  </div>
                )}

                {/* Overlay Doctor Mini Camera feed (Bottom Right) */}
                <div className="absolute bottom-4 right-4 h-24 w-32 rounded-xl border border-sky-500/20 bg-[#111827] shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center select-none">
                    <span className="text-[9px] font-bold text-slate-400">Dr. Rahul Mehta</span>
                    <span className="block text-[8px] text-[var(--portal-muted)] mt-1 font-semibold uppercase tracking-wide">Doctor Feed</span>
                  </div>
                </div>

                {/* Overlay controls bar (bottom center) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0B1020]/90 border border-[var(--portal-border)] rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-md">
                  <button 
                    onClick={() => setMicActive(!micActive)}
                    className={cn(
                      "h-8.5 w-8.5 rounded-full flex items-center justify-center transition-colors border",
                      micActive ? "bg-[var(--portal-surface)] text-[var(--portal-text)] border-[var(--portal-border)]" : "bg-danger/20 text-danger border-danger/30"
                    )}
                    title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {micActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => setCamActive(!camActive)}
                    className={cn(
                      "h-8.5 w-8.5 rounded-full flex items-center justify-center transition-colors border",
                      camActive ? "bg-[var(--portal-surface)] text-[var(--portal-text)] border-[var(--portal-border)]" : "bg-danger/20 text-danger border-danger/30"
                    )}
                    title={camActive ? 'Disable Cam' : 'Enable Cam'}
                  >
                    {camActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => toast.success('Screen share request sent.')}
                    className="h-8.5 w-8.5 rounded-full bg-[var(--portal-surface)] text-[var(--portal-text)] border border-[var(--portal-border)] hover:bg-[var(--portal-elevated)] flex items-center justify-center transition-colors"
                    title="Share Screen"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            {/* Right Column: AI Transcripts, Notes (5 columns) */}
            <article className="lg:col-span-5 grid grid-rows-2 gap-4 h-full min-h-0">
              
              {/* Top half: AI voice transcription feed */}
              <div className="app-card p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)] shrink-0">
                  <BrainCircuit className="h-4 w-4 text-[#7f77dd]" />
                  <h3 className="text-xs font-bold text-[var(--portal-text)] uppercase tracking-wider">Real-Time Transcription</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3.5 pt-3 pr-1 text-[11px] leading-relaxed scroll-smooth">
                  {transcripts.map((t, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "space-y-1 p-2.5 rounded-xl border animate-in fade-in duration-200",
                        t.speaker === 'AI Insight' 
                          ? "bg-[#7f77dd]/5 border-[#7f77dd]/15 text-[#7f77dd] italic font-semibold" 
                          : t.speaker === 'Doctor'
                            ? "bg-[#0ea5e9]/5 border-[#0ea5e9]/15 text-[var(--portal-text)]"
                            : "bg-[var(--portal-elevated)] border-[var(--portal-border)] text-[var(--portal-text)]"
                      )}
                    >
                      <span className="font-bold uppercase tracking-wider text-[9px] block opacity-85">{t.speaker}</span>
                      <p>{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom half: EHR lookup notes & medication summary */}
              <div className="app-card p-4 flex flex-col justify-between overflow-hidden">
                <div className="space-y-3 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <ClipboardList className="h-4 w-4 text-[#0ea5e9]" />
                    <h3 className="text-xs font-bold text-[var(--portal-text)] uppercase tracking-wider">Session Remarks Sheet</h3>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wide ml-1">Live Notes</label>
                    <textarea 
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Write session remarks directly..."
                      className="input-premium w-full h-20 py-2 text-xs resize-none"
                    />
                  </div>

                  {/* EHR quick look card */}
                  <div className="bg-[var(--portal-elevated)]/60 border border-[var(--portal-border)] rounded-xl p-3 flex items-start gap-2.5 text-[10px]">
                    <Activity className="h-4 w-4 text-[#0ea5e9] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[var(--portal-text)]">Active Patient Vitals Reference</p>
                      <p className="text-[var(--portal-muted)] mt-1">LDL: 182 HIGH | Hemoglobin: 11.2 LOW | Ferritin: 18 LOW</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--portal-border)] shrink-0">
                  <button 
                    onClick={handleEndCall}
                    disabled={endingCall}
                    className="btn-premium btn-premium-primary w-full h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" /> Save & Close Consultation
                  </button>
                </div>
              </div>

            </article>

          </div>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
