import { useState } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, BrainCircuit, Activity, ClipboardCheck, Terminal } from 'lucide-react';
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

const templates = [
  { label: 'Analyze Aarav LDL Spike', prompt: 'Summarize Aarav Kapoor LDL lipid trend and suggest therapeutic clinical interventions.' },
  { label: 'Beta-Blocker Guidelines', prompt: 'Provide contemporary dosing guidelines for Metoprolol in Stage 1 hypertension.' },
  { label: 'Anemia Diet Recommendations', prompt: 'Draft a patient-facing dietary guide for iron-deficiency anemia (low hemoglobin).' },
];

export const DoctorAssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Clinical companion active. Select a patient context or type a clinical inquiry below. I can search medical guidelines, summarize report histories, or draft therapeutic options.',
      timestamp: '10:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newDocMessage: ChatMessage = {
      id: `d-${Date.now()}`,
      sender: 'doctor',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newDocMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI clinical reasoning
    setTimeout(() => {
      let aiText = '';
      if (textToSend.toLowerCase().includes('aarav') || textToSend.toLowerCase().includes('ldl')) {
        aiText = `### Clinical Synthesis: Aarav Kapoor (Age 29)
**Biomarker Telemetry:** 
* LDL Cholesterol: **182 mg/dL** (Reference range: < 100 mg/dL) — HIGH RISK.
* Hemoglobin: **11.2 g/dL** (Reference range: 13.5 - 17.5 g/dL) — MILD ANEMIA.

**Therapeutic Recommendations Draft:**
1. **Pharmacological**: Initiate low-intensity statin therapy: **Atorvastatin 10 mg** once daily at bedtime.
2. **Investigation**: Order full Ferritin & TIBC panel to check microcytic anemia status.
3. **Lifestyle**: Dietary intake modifications (omega-3 fatty acids, iron-rich spinach/lentils) and follow-up lipid panel in 6 weeks.`;
      } else if (textToSend.toLowerCase().includes('beta-blocker') || textToSend.toLowerCase().includes('metoprolol')) {
        aiText = `### Metoprolol Dosing Protocols: Stage 1 Hypertension
**Dosing Ranges:**
* **Metoprolol Succinate (ER)**: Start at **25 mg to 50 mg** once daily. Titrate weekly based on systolic pressures. Target heart rate: 55-60 bpm at rest.
* **Metoprolol Tartrate (IR)**: Typically **50 mg** twice daily. 

**Contraindications:**
* Severe bradycardia (< 45 bpm).
* Second or third-degree heart blocks.
* Decompensated heart failure states.`;
      } else {
        aiText = `I have logged your query. Recommending a check of clinical criteria:
- **Biomarker correlation**: Ensure that lipid markers are compared dynamically with renal values.
- **Guideline check**: Standard pharmacological options can be drafted using the sidebar templates. 
- Please provide more clinical parameters or specify the patient profile.`;
      }

      const newAiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStructured: true
      };

      setMessages((prev) => [...prev, newAiMessage]);
      setLoading(false);
      toast.success('Clinical synthesis generated.');
    }, 1500);
  };

  return (
    <DashboardLayout title="Clinical Assistant">
      <PageTransition>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] text-[var(--portal-text)] h-[calc(100vh-100px)] min-h-[500px]">
          
          {/* Left panel: Quick Prompt Templates */}
          <aside className="app-card p-5 space-y-4 h-full flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <BrainCircuit className="h-4.5 w-4.5 text-[#7f77dd]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Clinical Shortcuts</h4>
              </div>
              <p className="text-secondary-premium text-[var(--portal-muted)]">
                Select a template below to auto-inject clinical prompts into the assistant.
              </p>
              
              <div className="space-y-2">
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(tpl.prompt)}
                    className="w-full p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 hover:bg-[#7f77dd]/5 hover:border-[#7f77dd]/30 transition-all text-left text-xs font-semibold leading-relaxed text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/40 p-3 space-y-1.5">
              <p className="text-[9px] font-bold text-[#7f77dd] uppercase tracking-wider flex items-center gap-1">
                <Terminal className="h-3 w-3 animate-pulse" /> Telemetry Synced
              </p>
              <p className="text-[10px] text-[var(--portal-muted)] leading-tight">
                Model: BioGPT-Clinical-4B • Context window: 32K tokens.
              </p>
            </div>
          </aside>

          {/* Right Panel: Chat interface */}
          <section className="app-card flex flex-col justify-between h-full relative overflow-hidden">
            
            {/* Header banner */}
            <div className="p-4 border-b border-[var(--portal-border)] flex items-center gap-2 bg-[var(--portal-elevated)]/40">
              <Bot className="h-5 w-5 text-[#7f77dd]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">AI Clinical Companion Chat</h3>
                <p className="text-[10px] text-[var(--portal-muted)]">HIPAA-compliant assistant framework</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-200",
                    msg.sender === 'doctor' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {/* Avatar Icon */}
                  <span className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center border text-white font-bold shrink-0",
                    msg.sender === 'doctor' ? "bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9] border-[#0ea5e9]/20" : "bg-[#7f77dd] border-[#7f77dd]/20"
                  )}>
                    {msg.sender === 'doctor' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>

                  {/* Message body */}
                  <div className={cn(
                    "rounded-2xl p-4 text-xs leading-relaxed space-y-2 border",
                    msg.sender === 'doctor' 
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/20 text-[var(--portal-text)] rounded-tr-none" 
                      : "bg-[var(--portal-elevated)] border-[var(--portal-border)] text-[var(--portal-text)] rounded-tl-none"
                  )}>
                    {msg.isStructured ? (
                      <div className="space-y-3">
                        {msg.text.split('\n\n').map((block, idx) => {
                          if (block.startsWith('###')) {
                            return <h4 key={idx} className="font-bold text-[#7f77dd] text-sm pt-1 first:pt-0">{block.replace('###', '')}</h4>;
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
                    <span className="block text-[9px] text-[var(--portal-muted)] mt-1.5 text-right font-medium">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[85%] animate-pulse mr-auto">
                  <span className="h-8 w-8 rounded-lg bg-[#7f77dd] flex items-center justify-center text-white shrink-0">
                    <Bot className="h-4 w-4 animate-bounce" />
                  </span>
                  <div className="rounded-2xl p-4 bg-[var(--portal-elevated)] border border-[var(--portal-border)] text-xs rounded-tl-none flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#7f77dd] animate-spin" />
                    <span>Clinical reasoning in progress...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <div className="p-4 border-t border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2.5"
              >
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Query clinical biomarkers, guidelines, or write drug protocols..." 
                  className="input-premium flex-1 focus:border-[#7f77dd] focus:ring-[#7f77dd]/15"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="btn-premium btn-premium-primary h-10 w-10 p-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#7f77dd] to-[#6d66cc]"
                  disabled={loading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
