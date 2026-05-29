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
  Activity,
  Disc,
  FileText,
  AlertCircle,
  ChevronRight,
  Plus
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
  { speaker: 'Doctor', text: "Hello Aarav, I reviewed your latest blood panels. Let's look at your hemoglobin metrics." },
  { speaker: 'Patient', text: 'Sure Dr. Rahul, I felt tired lately. Is my iron level low?' },
  { speaker: 'AI Insight', text: "Patient's symptoms correlate with Hemoglobin: 11.2 g/dL and Ferritin: 18 ng/mL (Iron deficiency anemia pattern)." },
  { speaker: 'Doctor', text: 'Yes, your hemoglobin is 11.2, which is low. I am prescribing Carbonyl Iron daily. We also need to keep monitoring Atorvastatin response for LDL.' },
  { speaker: 'Patient', text: 'Got it, I will follow that diet checklist and take the tablets.' }
];

export const ConsultationRoomPage = () => {
  const navigate = useNavigate();
  const { consultationId = 'c1' } = useParams();

  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [recording, setRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'copilot' | 'transcript' | 'biomarkers' | 'history'>('copilot');

  const [transcripts, setTranscripts] = useState<Dialogue[]>(mockDialogue.slice(0, 3));
  const [sessionNotes, setSessionNotes] = useState('Patient confirms compliance with lipid therapy. Fatigue symptoms match iron levels.');
  const [prescription, setPrescription] = useState<{ drug: string; dose: string }[]>([
    { drug: 'Atorvastatin', dose: '10mg once daily' }
  ]);
  
  const [endingCall, setEndingCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(254); // starts at 04:14
  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 's1', type: 'symptom', text: 'Add "Fatigue" to patient symptoms checklist', actionLabel: 'Quick Add', payload: 'Fatigue' },
    { id: 's2', type: 'prescription', text: 'Prescribe Carbonyl Iron 45mg once daily', actionLabel: 'Accept Rx', payload: { drug: 'Carbonyl Iron', dose: '45mg once daily' } },
    { id: 's3', type: 'test', text: 'Order "Total Iron Binding Capacity (TIBC) panel"', actionLabel: 'Order Test', payload: 'TIBC Panel' }
  ]);

  // Clock ticker for active duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const callDuration = formatDuration(callSeconds);

  // Simulate transcription updates
  useEffect(() => {
    const t1 = setTimeout(() => {
      setTranscripts(prev => [...prev, mockDialogue[3]]);
    }, 5000);
    const t2 = setTimeout(() => {
      setTranscripts(prev => [...prev, mockDialogue[4]]);
    }, 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEndCall = () => {
    setEndingCall(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
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

  const handleAcceptCoPilotRx = (drug: string, dose: string) => {
    if (prescription.some(p => p.drug === drug)) {
      toast.warning(`${drug} is already added to active prescriptions.`);
      return;
    }
    setPrescription(prev => [...prev, { drug, dose }]);
    toast.success(`AI Recommendation Accepted: Added ${drug} to active prescriptions.`);
  };

  const handleExecuteSuggestion = (id: string) => {
    const sug = aiSuggestions.find(s => s.id === id);
    if (!sug) return;
    
    if (sug.type === 'prescription') {
      const p = sug.payload as { drug: string; dose: string };
      handleAcceptCoPilotRx(p.drug, p.dose);
    } else if (sug.type === 'symptom') {
      setSessionNotes(prev => {
        const clean = prev.trim();
        return clean ? `${clean}\n- Patient symptom flagged: Fatigue` : '- Patient symptom flagged: Fatigue';
      });
      toast.success('Added Fatigue symptom to live clinical notes.');
    } else if (sug.type === 'test') {
      setSessionNotes(prev => {
        const clean = prev.trim();
        return clean ? `${clean}\n- Laboratory test ordered: TIBC Panel` : '- Laboratory test ordered: TIBC Panel';
      });
      toast.success('Ordered TIBC Panel for Aarav Kapoor.');
    }
    
    setAiSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout title="Telehealth Room">
      <PageTransition>
        <div className="space-y-4 text-[var(--portal-text)] h-[calc(100vh-130px)] min-h-[580px] flex flex-col justify-between">
          
          {/* Top row */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)] shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--portal-text)]">Active Telehealth Session</h2>
              <span className="text-[10px] text-[var(--portal-muted)] bg-[var(--portal-elevated)] border border-[var(--portal-border)] px-2 py-0.5 rounded font-mono">Patient: Aarav Kapoor</span>
            </div>
            
            <div className="flex items-center gap-2">
              {recording && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 uppercase bg-red-500/10 px-2 py-1 border border-red-500/20 rounded-full animate-pulse">
                  <Disc className="h-3 w-3 animate-spin" /> REC Active
                </span>
              )}
              <button 
                onClick={handleEndCall}
                disabled={endingCall}
                className="btn-premium btn-premium-danger h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
              >
                <PhoneOff className="h-4 w-4" /> End Consultation
              </button>
            </div>
          </div>

          {/* Core Telehealth Grid */}
          <div className="flex-1 grid gap-4 lg:grid-cols-12 min-h-0 overflow-hidden py-1">
            
            {/* Left Column: Patient Video Feed (8 columns) */}
            <article className="lg:col-span-8 flex flex-col justify-between h-full min-h-0 relative bg-[#090D1A] rounded-2xl border border-[var(--portal-border)] overflow-hidden shadow-lg select-none">
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,32,0)_99%,rgba(14,165,233,0.06)_1%)] [background-size:100%_4px] pointer-events-none opacity-20" />
              
              {/* Clinical HUD Overlay */}
              <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1020]/90 border border-sky-500/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>60 FPS</span>
                    <span className="text-[var(--portal-muted)]">|</span>
                    <span>18ms Latency</span>
                    <span className="text-[var(--portal-muted)]">|</span>
                    <span>1080P</span>
                  </div>
                  
                  {/* Call Duration Ticker */}
                  <div className="inline-flex items-center gap-1 rounded-lg bg-[#0B1020]/90 border border-[var(--portal-border)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--portal-text)] font-mono">
                    <Clock className="h-3 w-3 text-[#7f77dd]" />
                    <span>{callDuration}</span>
                  </div>

                  {/* Network Latency status bar (Excellent badge) */}
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1020]/90 border border-emerald-500/20 px-2 py-1 text-[9px] font-bold text-emerald-400 font-mono">
                    <span className="flex gap-0.5 items-end h-2 w-2.5">
                      <span className="h-1 w-0.5 bg-current rounded-full" />
                      <span className="h-1.5 w-0.5 bg-current rounded-full" />
                      <span className="h-2 w-0.5 bg-current rounded-full" />
                    </span>
                    <span>EXCELLENT</span>
                  </div>
                </div>

                {/* Patient Risk Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1020]/90 border border-red-500/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-500 pointer-events-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>CRITICAL RISK STATUS</span>
                </div>
              </div>

              {/* Video console */}
              <div className="flex-1 w-full flex items-center justify-center relative">
                {camActive ? (
                  <div className="text-center space-y-3 relative z-10">
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
                  <div className="text-center space-y-3 text-[var(--portal-muted)]">
                    <VideoOff className="h-10 w-10 mx-auto" />
                    <p className="text-xs font-bold">Patient camera disabled</p>
                  </div>
                )}

                {/* mini Doctor Camera feed (Bottom Right) */}
                <div className="absolute bottom-4 right-4 h-24 w-32 rounded-xl border border-sky-500/20 bg-[#111827] shadow-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-slate-400">Dr. Rahul Mehta</span>
                    <span className="block text-[8px] text-[var(--portal-muted)] mt-1 font-semibold uppercase tracking-wide">Doctor Feed</span>
                  </div>
                </div>
              </div>

              {/* Floating Bottom Dock controls */}
              <div className="h-16 border-t border-[var(--portal-border)] bg-[#0B1020]/90 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setMicActive(!micActive)}
                    className={cn(
                      "h-8.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border select-none cursor-pointer",
                      micActive ? "bg-[var(--portal-surface)] text-[var(--portal-text)] border-[var(--portal-border)]" : "bg-danger/20 text-danger border-danger/30"
                    )}
                  >
                    {micActive ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                    <span>{micActive ? 'Mute' : 'Unmute'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCamActive(!camActive)}
                    className={cn(
                      "h-8.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border select-none cursor-pointer",
                      camActive ? "bg-[var(--portal-surface)] text-[var(--portal-text)] border-[var(--portal-border)]" : "bg-danger/20 text-danger border-danger/30"
                    )}
                  >
                    {camActive ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                    <span>{camActive ? 'Stop Video' : 'Start Video'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => toast.success('Screen share request sent.')}
                    className="h-8.5 px-3 rounded-xl bg-[var(--portal-surface)] border border-[var(--portal-border)] hover:bg-[var(--portal-elevated)] flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors select-none cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#0ea5e9]" />
                    <span>Share</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setRecording(!recording);
                      toast.info(recording ? 'Recording session archived.' : 'Session recording initiated.');
                    }}
                    className={cn(
                      "h-8.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border select-none cursor-pointer",
                      recording ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-[var(--portal-surface)] border-[var(--portal-border)] hover:bg-[var(--portal-elevated)] text-[var(--portal-muted)]"
                    )}
                  >
                    <Disc className={cn("h-3.5 w-3.5", recording && "text-red-500 animate-spin")} />
                    <span>{recording ? 'Stop REC' : 'Record'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveTab('copilot');
                      toast.info('EMR Prescription editor active on right panel.');
                    }}
                    className="h-8.5 px-3 rounded-xl bg-[var(--portal-surface)] border border-[var(--portal-border)] hover:bg-[var(--portal-elevated)] flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors select-none cursor-pointer"
                  >
                    <ClipboardList className="h-3.5 w-3.5 text-[#7f77dd]" />
                    <span>Prescriptions</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Right Column: Tabbed Side Panels (4 columns) */}
            <article className="lg:col-span-4 app-card p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden">
                
                {/* Tabs bar */}
                <div className="flex border-b border-[var(--portal-border)] shrink-0 gap-1 mb-3.5 pb-0.5 overflow-x-auto">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('copilot')}
                    className={cn(
                      "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 border-transparent transition-colors select-none cursor-pointer",
                      activeTab === 'copilot' ? "border-[#7f77dd] text-[var(--portal-text)]" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    AI Copilot
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('transcript')}
                    className={cn(
                      "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 border-transparent transition-colors select-none cursor-pointer",
                      activeTab === 'transcript' ? "border-[#7f77dd] text-[var(--portal-text)]" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    Transcript
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('biomarkers')}
                    className={cn(
                      "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 border-transparent transition-colors select-none cursor-pointer",
                      activeTab === 'biomarkers' ? "border-[#7f77dd] text-[var(--portal-text)]" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    Biomarkers
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={cn(
                      "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 border-transparent transition-colors select-none cursor-pointer",
                      activeTab === 'history' ? "border-[#7f77dd] text-[var(--portal-text)]" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    History
                  </button>
                </div>

                {/* Scrollable Content Pane */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-2">
                  
                  {/* TAB 1: AI Copilot Recommendations */}
                  {activeTab === 'copilot' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      
                      {/* Live recommendations feed */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">AI Live Insights</label>
                          {aiSuggestions.length > 0 && (
                            <span className="text-[8px] font-bold bg-[#7f77dd]/15 text-[#7f77dd] px-1.5 py-0.5 rounded animate-pulse uppercase tracking-wider">
                              {aiSuggestions.length} suggestions
                            </span>
                          )}
                        </div>

                        {aiSuggestions.length === 0 ? (
                          <div className="bg-[var(--portal-elevated)]/25 border border-[var(--portal-border)] rounded-xl p-4 text-center text-xs text-[var(--portal-muted)]">
                            <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto mb-1.5" />
                            All suggestions processed. No new diagnostic telemetry flags.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {aiSuggestions.map((sug) => (
                              <div key={sug.id} className="bg-[#7f77dd]/5 border border-[#7f77dd]/15 rounded-xl p-3 flex flex-col justify-between gap-2.5">
                                <div className="flex items-start gap-2 text-xs">
                                  <Sparkles className="h-3.5 w-3.5 text-[#7f77dd] shrink-0 mt-0.5" />
                                  <p className="text-[11px] text-[var(--portal-text)] leading-snug">{sug.text}</p>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleExecuteSuggestion(sug.id)}
                                    className="h-6.5 px-2.5 bg-[#7f77dd]/20 hover:bg-[#7f77dd] text-[#7f77dd] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer"
                                  >
                                    {sug.actionLabel}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Active Prescription block */}
                      <div className="space-y-2.5 border-t border-[var(--portal-border)] pt-3.5">
                        <label className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Active Prescriptions</label>
                        <div className="space-y-1.5">
                          {prescription.map((rx, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[var(--portal-elevated)] border border-[var(--portal-border)] p-2.5 rounded-xl text-xs">
                              <div>
                                <span className="font-bold">{rx.drug}</span>
                                <span className="block text-[9px] text-[var(--portal-muted)] mt-0.5">{rx.dose}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setPrescription(prev => prev.filter((_, i) => i !== idx));
                                  toast.error(`Removed ${rx.drug} from active list.`);
                                }}
                                className="text-[10px] text-red-400 font-bold uppercase hover:underline select-none cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes logging */}
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wide ml-1">Live Notes</label>
                        <textarea 
                          value={sessionNotes}
                          onChange={(e) => setSessionNotes(e.target.value)}
                          placeholder="Type session remarks directly..."
                          className="input-premium w-full h-16 py-2 text-xs resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Live Transcripts */}
                  {activeTab === 'transcript' && (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                      {transcripts.map((t, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "space-y-1 p-2.5 rounded-xl border text-[11px] leading-relaxed",
                            t.speaker === 'AI Insight' 
                              ? "bg-[#7f77dd]/5 border-[#7f77dd]/15 text-[#7f77dd] italic font-semibold" 
                              : t.speaker === 'Doctor'
                                ? "bg-[#0ea5e9]/5 border-[#0ea5e9]/15 text-[var(--portal-text)]"
                                : "bg-[var(--portal-elevated)] border-[var(--portal-border)] text-[var(--portal-text)]"
                          )}
                        >
                          <span className="font-bold uppercase tracking-wider text-[9px] block opacity-80">{t.speaker}</span>
                          <p>{t.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: Vitals & Biomarkers */}
                  {activeTab === 'biomarkers' && (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl p-3 flex items-start gap-2.5">
                        <Activity className="h-4.5 w-4.5 text-[#0ea5e9] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[var(--portal-text)] text-xs">Vitals Sync Feed</p>
                          <p className="text-[10px] text-[var(--portal-muted)] mt-0.5">Telemetry synced via Smart Companion App.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <BiomarkerVitalsRow name="LDL Cholesterol" value="182 mg/dL" refVal="50-100" status="HIGH" />
                        <BiomarkerVitalsRow name="Hemoglobin" value="11.2 g/dL" refVal="13.5-17.5" status="LOW" />
                        <BiomarkerVitalsRow name="Ferritin Serum" value="18 ng/mL" refVal="24-336" status="LOW" />
                        <BiomarkerVitalsRow name="Serum Glucose" value="105 mg/dL" refVal="70-100" status="HIGH" />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Previous Reports list */}
                  {activeTab === 'history' && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] bg-[var(--portal-elevated)] border border-[var(--portal-border)] p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#0ea5e9]" />
                          <span className="font-bold">Lipid Profile - Dec 2025</span>
                        </div>
                        <span className="text-[9px] text-[var(--portal-muted)]">3 months ago</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] bg-[var(--portal-elevated)] border border-[var(--portal-border)] p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#0ea5e9]" />
                          <span className="font-bold">CBC Report - Aug 2025</span>
                        </div>
                        <span className="text-[9px] text-[var(--portal-muted)]">7 months ago</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] bg-[var(--portal-elevated)] border border-[var(--portal-border)] p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#0ea5e9]" />
                          <span className="font-bold">Cardiology stress test</span>
                        </div>
                        <span className="text-[9px] text-[var(--portal-muted)]">1 year ago</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right panel save */}
                <div className="pt-2 border-t border-[var(--portal-border)] shrink-0">
                  <button 
                    onClick={handleEndCall}
                    disabled={endingCall}
                    className="btn-premium btn-premium-primary w-full h-9.5 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                  >
                    Save & Close Consultation
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

const BiomarkerVitalsRow = ({ name, value, refVal, status }: { name: string; value: string; refVal: string; status: 'HIGH' | 'LOW' | 'NORMAL' }) => (
  <div className="flex justify-between items-center p-2.5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] text-xs">
    <div>
      <span className="font-bold text-[var(--portal-text)]">{name}</span>
      <span className="block text-[9px] text-[var(--portal-muted)] mt-0.5">Reference: {refVal}</span>
    </div>
    <div className="text-right">
      <span className="font-mono font-bold block text-[var(--portal-text)]">{value}</span>
      <span className={cn(
        "text-[8px] font-bold uppercase tracking-wider px-1.5 rounded",
        status === 'HIGH' && "bg-red-500/10 text-red-500",
        status === 'LOW' && "bg-amber-500/10 text-amber-500",
        status === 'NORMAL' && "bg-emerald-500/10 text-emerald-500"
      )}>{status}</span>
    </div>
  </div>
);
