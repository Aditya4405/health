import { useState, useMemo } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BrainCircuit, 
  Activity, 
  Terminal, 
  UserCheck, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'assistant';
  text: string;
  timestamp: string;
  isStructured?: boolean;
}

interface PatientContextData {
  id: string;
  name: string;
  age: number;
  gender: string;
  reports: string[];
  meds: string[];
  conditions: string[];
}

const mockPatientsContext: PatientContextData[] = [
  {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    age: 29,
    gender: 'Male',
    reports: ['CBC Blood Count (2 days ago)', 'Lipid Profile (3 months ago)'],
    meds: ['Atorvastatin 10mg once daily', 'Carbonyl Iron 45mg once daily'],
    conditions: ['LDL Cholesterol Elevation', 'Mild Anemia']
  },
  {
    id: 'pt-002',
    name: 'Isha Verma',
    age: 41,
    gender: 'Female',
    reports: ['Glucose panel (Yesterday)'],
    meds: ['Ferrous Gluconate 324mg once daily'],
    conditions: ['Microcytic Anemia Watch', 'Pre-diabetic baseline']
  },
  {
    id: 'pt-003',
    name: 'Rohan Das',
    age: 36,
    gender: 'Male',
    reports: ['Thyroid Baseline Test (3 days ago)'],
    meds: ['None logged'],
    conditions: ['Stable metabolic baseline']
  },
  {
    id: 'pt-004',
    name: 'Karan Malhotra',
    age: 52,
    gender: 'Male',
    reports: ['Stress EKG (4 weeks ago)', 'Cardiovascular Lipid Panel (Today)'],
    meds: ['Beta blockers 25mg (IR)'],
    conditions: ['Stage 1 Hypertension', 'Extreme Hypercholesterolemia']
  }
];

const templates = [
  { label: 'LDL Variance Analysis', prompt: 'Analyze [PATIENT] LDL cholesterol trends and draft a low-dose statin intervention protocol.' },
  { label: 'Anemia Dietary Guidelines', prompt: 'Draft patient-facing nutrition instructions regarding iron deficiency anemia for [PATIENT].' },
  { label: 'EHR Diagnosis Summary', prompt: 'Summarize clinical telemetry and biomarker alerts for [PATIENT] to sync to EMR files.' }
];

export const DoctorAssistantPage = () => {
  const [activePatient, setActivePatient] = useState<PatientContextData>(mockPatientsContext[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Clinical AI companion active. Grounded with Aarav Kapoor's patient context. Select a patient on the right panel or select a template to query therapeutic recommendations.`,
      timestamp: '10:00 AM'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle changing the active patient context
  const handleSelectPatient = (id: string) => {
    const found = mockPatientsContext.find(p => p.id === id);
    if (!found) return;
    setActivePatient(found);
    
    // Inject system confirmation message
    const sysMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'assistant',
      text: `AI Context successfully synced to patient: ${found.name} (Age ${found.age}, ${found.gender}). Context includes ${found.reports.length} reports and ${found.meds.length} active medications.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, sysMsg]);
    toast.info(`AI context synced to ${found.name}`);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Replace template tags
    const formattedText = textToSend.replace('[PATIENT]', activePatient.name);

    const newDocMsg: ChatMessage = {
      id: `doc-${Date.now()}`,
      sender: 'doctor',
      text: formattedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newDocMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI clinical guidelines search
    setTimeout(() => {
      let aiResponse = '';
      const textLower = formattedText.toLowerCase();

      if (textLower.includes('ldl') || textLower.includes('cholesterol')) {
        aiResponse = `### Clinical Synthesis: ${activePatient.name} (EHR-Grounded)
**Biomarker Watch:** Patient LDL cholesterol remains elevated. Prior lipid panels report high readings.
**Therapeutic Protocol:**
1. **Atorvastatin 10 mg** once daily at bedtime.
2. Order follow-up lipid profile in 6 weeks to check therapeutic response.
3. Lifestyle: Reduce saturated fat intake and implement moderate cardio (30 mins, 4x weekly).`;
      } else if (textLower.includes('anemia') || textLower.includes('iron') || textLower.includes('nutrition')) {
        aiResponse = `### Nutrition & Therapy: Anemia Watch for ${activePatient.name}
**Diagnostic Insights:** Current hemoglobin is below normal threshold. Iron supplements recommended.
**Dietary Guidelines:**
1. Focus on iron-rich foods: lean red meat, spinach, lentils, pumpkin seeds.
2. Take iron supplements with Vitamin C (e.g. orange juice) to enhance absorption.
3. Avoid taking iron supplements with tea, coffee, or calcium-rich meals.`;
      } else {
        aiResponse = `### Clinical Synthesis: ${activePatient.name}
**EHR Summary:** 
* Conditions: ${activePatient.conditions.join(', ')}
* Active Meds: ${activePatient.meds.join(', ')}
* Diagnostic Plan: Monitor vitals, check lipid parameters weekly, and schedule secondary panels as logged in the EMR timeline.`;
      }

      const newAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStructured: true
      };

      setMessages(prev => [...prev, newAiMsg]);
      setLoading(false);
      toast.success('Clinical recommendations drafted.');
    }, 1500);
  };

  const handleTemplateClick = (promptTpl: string) => {
    const text = promptTpl.replace('[PATIENT]', activePatient.name);
    handleSend(text);
  };

  return (
    <DashboardLayout title="Clinical AI Assistant">
      <PageTransition>
        <div className="grid gap-5 lg:grid-cols-[280px_1fr_320px] text-[var(--portal-text)] h-[calc(100vh-140px)] min-h-[580px]">
          
          {/* LEFT PANEL: Prompt presets */}
          <aside className="app-card p-4 flex flex-col justify-between h-full overflow-y-auto select-none">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <BrainCircuit className="h-4.5 w-4.5 text-[#7f77dd]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Clinical Presets</h4>
              </div>
              <p className="text-[11px] text-[var(--portal-muted)]">
                Select an automated preset below to query clinical suggestions for the active patient.
              </p>

              <div className="space-y-2">
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTemplateClick(tpl.prompt)}
                    className="w-full p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 hover:bg-[#7f77dd]/5 hover:border-[#7f77dd]/20 transition-all text-left text-xs font-semibold leading-relaxed text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25 p-3 space-y-1.5 mt-4">
              <p className="text-[9px] font-bold text-[#7f77dd] uppercase tracking-wider flex items-center gap-1">
                <Terminal className="h-3 w-3 animate-pulse" /> HIPAA COMPLIANT SECURED
              </p>
              <p className="text-[10px] text-[var(--portal-muted)] leading-tight">
                Model: BioGPT-Clinical-4B. Patient credentials encrypted.
              </p>
            </div>
          </aside>

          {/* CENTER PANEL: Chat conversation */}
          <section className="app-card flex flex-col justify-between h-full relative overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-[var(--portal-border)] flex items-center justify-between bg-[var(--portal-elevated)]/30 shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-4.5 w-4.5 text-[#7f77dd]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Clinical Copilot Sandbox</h3>
                  <p className="text-[9px] text-[var(--portal-muted)] font-semibold uppercase">HIPAA-compliant diagnostic recommendations</p>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/10 flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Grounded: {activePatient.name}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-200",
                    msg.sender === 'doctor' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <span className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border",
                    msg.sender === 'doctor' ? "bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9] border-[#0ea5e9]/20" : "bg-[#7f77dd] border-[#7f77dd]/20"
                  )}>
                    {msg.sender === 'doctor' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>

                  <div className={cn(
                    "rounded-xl p-3.5 text-xs leading-relaxed space-y-2 border",
                    msg.sender === 'doctor' 
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/20 text-[var(--portal-text)] rounded-tr-none" 
                      : "bg-[var(--portal-elevated)]/50 border-[var(--portal-border)] text-[var(--portal-text)] rounded-tl-none"
                  )}>
                    {msg.isStructured ? (
                      <div className="space-y-3">
                        {msg.text.split('\n\n').map((block, idx) => {
                          if (block.startsWith('###')) {
                            return <h4 key={idx} className="font-bold text-[#7f77dd] text-sm pt-1 first:pt-0 border-b border-[var(--portal-border)] pb-1">{block.replace('###', '')}</h4>;
                          }
                          if (block.startsWith('**')) {
                            return (
                              <div key={idx} className="space-y-1">
                                {block.split('\n').map((line, lIdx) => (
                                  <p key={lIdx} className="text-[var(--portal-muted)]">{line.replace('**', '').replace('**', '')}</p>
                                ))}
                              </div>
                            );
                          }
                          return <p key={idx}>{block}</p>;
                        })}
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="block text-[8px] text-[var(--portal-muted)] mt-1.5 text-right font-medium">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[85%] animate-pulse mr-auto">
                  <span className="h-8 w-8 rounded-lg bg-[#7f77dd] flex items-center justify-center text-white shrink-0">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="rounded-xl p-3.5 bg-[var(--portal-elevated)] border border-[var(--portal-border)] text-xs rounded-tl-none flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#7f77dd] animate-spin" />
                    <span>BioGPT clinically synthesizing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form input */}
            <div className="p-3 border-t border-[var(--portal-border)] bg-[var(--portal-surface)] shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder={`Ask companion about ${activePatient.name}'s lab results, dosage guidelines...`} 
                  className="input-premium flex-1 focus:border-[#7f77dd] focus:ring-[#7f77dd]/10"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="btn-premium btn-premium-primary h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br from-[#7f77dd] to-[#6c64cb] shrink-0"
                  disabled={loading || !input.trim()}
                >
                  Ask AI
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT PANEL: Active Patient Context */}
          <aside className="app-card p-4 flex flex-col justify-between h-full overflow-y-auto select-none">
            <div className="space-y-4">
              
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <UserCheck className="h-4.5 w-4.5 text-[#0ea5e9]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Active Patient</h4>
              </div>

              {/* Patient context selector */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wide ml-1">Select Patient Context</label>
                <select 
                  value={activePatient.id}
                  onChange={(e) => handleSelectPatient(e.target.value)}
                  className="input-premium w-full text-xs font-bold"
                >
                  {mockPatientsContext.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#0B1020] text-[var(--portal-text)]">
                      {p.name} (Age {p.age})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recent Reports */}
              <div className="space-y-2 pt-2">
                <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider ml-1">Recent Lab Reports</p>
                <div className="space-y-1.5">
                  {activePatient.reports.map((rep, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--portal-elevated)]/30 border border-[var(--portal-border)] text-[10px] font-semibold text-[var(--portal-muted)]">
                      <FileText className="h-3.5 w-3.5 text-[#0ea5e9] shrink-0" />
                      <span className="truncate">{rep}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div className="space-y-2 pt-2">
                <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider ml-1">Current Medications</p>
                <div className="space-y-1.5">
                  {activePatient.meds.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--portal-elevated)]/30 border border-[var(--portal-border)] text-[10px] font-semibold text-[var(--portal-muted)]">
                      <Activity className="h-3.5 w-3.5 text-[#7f77dd] shrink-0" />
                      <span className="truncate">{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Conditions */}
              <div className="space-y-2 pt-2">
                <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider ml-1">Active Conditions</p>
                <div className="space-y-1.5">
                  {activePatient.conditions.map((cond, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-danger/5 border border-danger/20 text-[10px] font-semibold text-danger">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
