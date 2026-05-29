import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Bot, Paperclip, SendHorizontal, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chatService, type ChatMessage } from '@/services/chatService';
import { usePageTitle } from '@/hooks/usePageTitle';

const starterPrompts = [
  'Explain my cholesterol results',
  'What does high creatinine mean?',
  'Is my hemoglobin level dangerous?',
  'What foods improve iron levels?',
];

export const ChatAssistantPage = () => {
  usePageTitle('MediScan Assistant');

  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions] = useState([
    { id: 's1', title: 'Cholesterol follow-up', date: 'Today' },
    { id: 's2', title: 'CBC insights', date: 'Yesterday' },
    { id: 's3', title: 'Iron deficiency Q&A', date: '2 days ago' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleLoadSession = (sessionId: string, title: string) => {
    setActiveSessionId(sessionId);
    let mockMsgs: ChatMessage[] = [];
    if (sessionId === 's1') {
      mockMsgs = [
        {
          id: 'm1',
          role: 'user',
          content: 'My LDL cholesterol is 180, is that bad?',
          timestamp: '10:00 AM'
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'An LDL of 180 mg/dL is considered high (optimal is under 100 mg/dL). While it requires attention, it is not an immediate emergency. I recommend incorporating more soluble fiber (like oats and beans), reducing saturated fats, and consulting Dr. Aarav Kapoor to discuss whether a low-dose statin or lifestyle changes are the best next steps.',
          timestamp: '10:01 AM'
        }
      ];
    } else if (sessionId === 's2') {
      mockMsgs = [
        {
          id: 'm3',
          role: 'user',
          content: 'What does my hemoglobin level of 11.2 mean?',
          timestamp: 'Yesterday, 2:15 PM'
        },
        {
          id: 'm4',
          role: 'assistant',
          content: 'A hemoglobin level of 11.2 g/dL is slightly low for adults (normal is typically 12.0 - 15.5 g/dL for females and 13.5 - 17.5 g/dL for males). Combined with your low ferritin (18 ng/mL), this suggests mild iron deficiency anemia. You might experience mild fatigue. Increasing iron-rich foods and talking to a doctor about a gentle supplement is recommended.',
          timestamp: 'Yesterday, 2:16 PM'
        }
      ];
    } else if (sessionId === 's3') {
      mockMsgs = [
        {
          id: 'm5',
          role: 'user',
          content: 'What foods are best to raise my iron?',
          timestamp: '2 days ago'
        },
        {
          id: 'm6',
          role: 'assistant',
          content: 'To boost your iron levels, focus on two types of dietary iron:\n\n1. **Heme Iron (highly absorbable)**: Red meat, poultry, seafood.\n2. **Non-Heme Iron**: Spinach, lentils, beans, fortified cereals.\n\n*Tip*: Always pair non-heme iron with Vitamin C (like citrus fruits, bell peppers) to boost absorption, and avoid drinking tea or coffee with meals as they can block iron absorption.',
          timestamp: '2 days ago'
        }
      ];
    }
    setMessages(mockMsgs);
    toast.success(`Loaded session: ${title}`);
  };

  const canSend = input.trim().length > 0 && !pending;

  const sendMessage = async (content = input.trim()) => {
    if (!content || pending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setPending(true);

    const reply = await chatService.sendMessage(nextMessages);
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setPending(false);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const groupedMessages = useMemo(() => messages, [messages]);

  return (
    <DashboardLayout title="AI Health Assistant">
      <PageTransition>
        <div className="grid h-[calc(100vh-11rem)] gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="hidden overflow-hidden rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] shadow-[var(--portal-shadow)] xl:block">
            <div className="border-b border-[var(--portal-border)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--portal-muted)]">Conversation History</p>
              <h2 className="mt-1 font-display text-lg font-semibold">Sessions</h2>
            </div>
            <div className="hide-scrollbar h-[calc(100%-80px)] space-y-2 overflow-y-auto p-3">
              {sessions.map((session) => {
                const isActive = activeSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleLoadSession(session.id, session.title)}
                    className={`focus-ring w-full rounded-2xl border p-3 text-left transition-colors ${
                      isActive
                        ? 'border-[var(--landing-primary)] bg-[var(--portal-elevated)] text-[var(--landing-primary)]'
                        : 'border-[var(--portal-border)] bg-[var(--portal-elevated)] hover:border-[var(--landing-primary)]/35'
                    }`}
                  >
                    <p className="text-sm font-medium text-[var(--portal-text)]">{session.title}</p>
                    <p className="mt-1 text-xs text-[var(--portal-muted)]">{session.date}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] shadow-[var(--portal-shadow)]">
            <header className="border-b border-[var(--portal-border)] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--landing-accent)]">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">MediScan Assistant</h3>
                  <p className="text-xs text-[var(--portal-muted)]">
                    <span className="mr-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-[#6EE7B7]" />
                    Connected to your health profile
                  </p>
                </div>
              </div>
            </header>

            <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto bg-[var(--portal-elevated)] p-5">
              {groupedMessages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--portal-muted)]">Try a guided question:</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="focus-ring rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-4 py-3 text-left text-sm text-[var(--portal-text)] transition-transform hover:-translate-y-0.5"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                groupedMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[linear-gradient(90deg,var(--landing-primary),var(--landing-accent))] text-white'
                          : 'border border-[var(--portal-border)] bg-[var(--portal-surface)] text-[var(--portal-text)]'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm max-w-none text-[var(--portal-text)] dark:prose-invert">{message.content}</ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <p className={`mt-2 text-[11px] ${message.role === 'user' ? 'text-white/75' : 'text-[var(--portal-muted)]'}`}>{message.timestamp}</p>
                    </div>
                  </div>
                ))
              )}

              {pending && (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-4 py-2 text-[var(--portal-muted)]">
                  <Sparkles className="h-4 w-4 text-[var(--landing-accent)]" />
                  Thinking
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--landing-accent)]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--landing-accent)]" style={{ animationDelay: '160ms' }} />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--landing-accent)]" style={{ animationDelay: '320ms' }} />
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <footer className="border-t border-[var(--portal-border)] bg-[var(--portal-surface)] p-4">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Attach report"
                  className="h-11 w-11 rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-text)]"
                  onClick={() => toast.info('To discuss a report, please open it from your Reports page and select "Companion Analysis". You can also upload a new report in the Upload section.')}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask about biomarkers, report meaning, or next steps..."
                  className="min-h-11 flex-1 resize-none rounded-2xl"
                />
                <Button
                  disabled={!canSend}
                  onClick={() => void sendMessage()}
                  className="h-11 rounded-full px-4 text-sm text-white"
                  style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                >
                  <SendHorizontal className="mr-1 h-4 w-4" /> Send
                </Button>
              </div>
            </footer>
          </section>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
