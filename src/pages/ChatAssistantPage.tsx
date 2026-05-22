import { useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Paperclip, SendHorizontal, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
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
  const [sessions] = useState([
    { id: 's1', title: 'Cholesterol follow-up', date: 'Today' },
    { id: 's2', title: 'CBC insights', date: 'Yesterday' },
    { id: 's3', title: 'Iron deficiency Q&A', date: '2 days ago' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <DashboardLayout title="Chat Assistant">
      <PageTransition>
        <div className="grid h-[calc(100vh-9.5rem)] gap-4 md:grid-cols-[260px_1fr]">
          <Card className="overflow-hidden">
            <CardContent className="h-full p-0">
              <div className="border-b border-[#dbe8f4] p-4">
                <h2 className="font-display text-base font-semibold">Conversations</h2>
              </div>
              <div className="hide-scrollbar h-[calc(100%-57px)] space-y-2 overflow-y-auto p-3">
                {sessions.map((session) => (
                  <button key={session.id} className="focus-ring w-full rounded-md border border-[#d8e6f3] bg-white p-3 text-left hover:bg-[#f5faff]">
                    <p className="text-sm font-medium text-[#32526b]">{session.title}</p>
                    <p className="mt-1 text-xs text-[#6b8195]">{session.date}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardContent className="flex h-full min-h-0 flex-col p-0">
              <header className="border-b border-[#dbe8f4] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eeedfe] text-purple">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">MediScan Assistant</h3>
                    <p className="text-xs text-[#6d8296]">
                      <span className="mr-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-[#1d9e75]" />
                      Connected to your health profile
                    </p>
                  </div>
                </div>
              </header>

              <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto bg-[#f7fafc] p-5">
                {groupedMessages.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-[#60758a]">Try asking:</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="focus-ring rounded-md border border-[#d6e4f0] bg-white px-4 py-3 text-left text-sm text-[#3d5c75] hover:bg-[#f2f8fe]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  groupedMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${message.role === 'user' ? 'bg-primary text-white' : 'border border-[#d3d1c7] bg-white text-[#314f67]'}`}>
                        {message.role === 'assistant' ? (
                          <ReactMarkdown className="prose prose-sm max-w-none leading-relaxed">{message.content}</ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <p className={`mt-2 text-[11px] ${message.role === 'user' ? 'text-white/75' : 'text-[#7b8fa2]'}`}>{message.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}

                {pending && (
                  <div className="inline-flex items-center gap-2 rounded-md border border-[#d3d1c7] bg-white px-4 py-2 text-[#61798f]">
                    <Sparkles className="h-4 w-4 text-purple" />
                    Thinking
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7f77dd]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7f77dd]" style={{ animationDelay: '160ms' }} />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7f77dd]" style={{ animationDelay: '320ms' }} />
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <footer className="border-t border-[#dbe8f4] bg-white p-4">
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" aria-label="Attach report">
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
                    placeholder="Ask about your report values..."
                    className="min-h-11 flex-1 resize-none"
                  />
                  <Button disabled={!canSend} onClick={() => void sendMessage()}>
                    <SendHorizontal className="mr-1 h-4 w-4" /> Send
                  </Button>
                </div>
              </footer>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

