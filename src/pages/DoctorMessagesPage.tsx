import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Search, ShieldCheck, UserCircle, MessageSquare, AlertCircle, Bot } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ChatThread {
  patientId: string;
  patientName: string;
  avatarInitials: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

const initialThreads: ChatThread[] = [
  {
    patientId: 'pt-001',
    patientName: 'Aarav Kapoor',
    avatarInitials: 'AK',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]',
    lastMessage: 'Can you check my Hemoglobin levels?',
    time: '2 hrs ago',
    unread: true
  },
  {
    patientId: 'pt-002',
    patientName: 'Isha Verma',
    avatarInitials: 'IV',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]',
    lastMessage: 'I started the iron supplements, thank you.',
    time: 'Yesterday',
    unread: false
  },
  {
    patientId: 'pt-003',
    patientName: 'Rohan Das',
    avatarInitials: 'RD',
    avatarBg: 'from-[#10b981] to-[#059669]',
    lastMessage: 'Will schedule my metabolic check next month.',
    time: '3 days ago',
    unread: false
  }
];

const conversations: Record<string, Message[]> = {
  'pt-001': [
    { id: 'm1', sender: 'patient', text: 'Hello Dr. Rahul, I uploaded my latest blood count. Can you check my Hemoglobin levels?', time: '2 hrs ago' },
    { id: 'm2', sender: 'doctor', text: 'Yes Aarav, I reviewed it. Your hemoglobin is slightly low at 11.2. We need to monitor your iron stores. Recommending a check of Ferritin next week.', time: '1 hr ago' },
    { id: 'm3', sender: 'patient', text: 'Got it. I will schedule a slot. Thank you!', time: '10 mins ago' }
  ],
  'pt-002': [
    { id: 'm4', sender: 'doctor', text: 'Hello Isha, let me know if you experience any nausea with the new iron dosage.', time: '2 days ago' },
    { id: 'm5', sender: 'patient', text: 'I started the iron supplements, thank you. No nausea so far.', time: 'Yesterday' }
  ],
  'pt-003': [
    { id: 'm6', sender: 'patient', text: 'Glucose values came back stable. Do I need to come in?', time: '4 days ago' },
    { id: 'm7', sender: 'doctor', text: 'Rohan, since your parameters are stable, you can skip the in-person consult. Will schedule my metabolic check next month.', time: '3 days ago' }
  ]
};

export const DoctorMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const defaultPt = searchParams.get('pt') || 'pt-001';
  
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activePt, setActivePt] = useState<string>(defaultPt);
  const [msgs, setMsgs] = useState<Record<string, Message[]>>(conversations);
  const [replyInput, setReplyInput] = useState('');

  const activeThread = useMemo(() => {
    return threads.find((t) => t.patientId === activePt) || threads[0];
  }, [threads, activePt]);

  const activeMsgs = useMemo(() => {
    return msgs[activePt] || [];
  }, [msgs, activePt]);

  const handleSelectThread = (ptId: string) => {
    setActivePt(ptId);
    setThreads(prev => 
      prev.map(t => t.patientId === ptId ? { ...t, unread: false } : t)
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      text: replyInput,
      time: 'Just now'
    };

    setMsgs(prev => ({
      ...prev,
      [activePt]: [...(prev[activePt] || []), newMsg]
    }));

    setThreads(prev => 
      prev.map(t => t.patientId === activePt ? { ...t, lastMessage: replyInput, time: 'Just now' } : t)
    );

    setReplyInput('');
    toast.success('Secure message sent successfully.');
  };

  return (
    <DashboardLayout title="Messages">
      <PageTransition>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] text-[var(--portal-text)] h-[calc(100vh-100px)] min-h-[500px]">
          
          {/* Left Panel: Threads List */}
          <aside className="app-card p-5 space-y-4 h-full flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
              <MessageSquare className="h-4.5 w-4.5 text-[#0ea5e9]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Patient Inquiries</h3>
            </div>
            
            <div className="space-y-2 flex-1">
              {threads.map((thread) => (
                <button
                  key={thread.patientId}
                  onClick={() => handleSelectThread(thread.patientId)}
                  className={cn(
                    "w-full p-3 rounded-xl border transition-all text-left flex items-start gap-3 relative",
                    activePt === thread.patientId 
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/30" 
                      : "bg-[var(--portal-elevated)]/50 border-[var(--portal-border)] hover:bg-[var(--portal-elevated)]"
                  )}
                >
                  {thread.unread && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  <div className={cn("h-9 w-9 rounded-lg bg-gradient-to-tr flex items-center justify-center text-white text-xs font-bold shrink-0", thread.avatarBg)}>
                    {thread.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--portal-text)] truncate">{thread.patientName}</span>
                      <span className="text-[9px] text-[var(--portal-muted)] shrink-0">{thread.time}</span>
                    </div>
                    <p className="text-[10px] text-[var(--portal-muted)] truncate mt-1 leading-normal">
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Center Panel: Messages Window */}
          <section className="app-card flex flex-col justify-between h-full relative overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-[var(--portal-border)] flex items-center justify-between bg-[var(--portal-elevated)]/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9] flex items-center justify-center text-white text-xs font-bold">
                  {activeThread?.avatarInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--portal-text)] leading-none">{activeThread?.patientName}</h4>
                  <p className="text-[9px] text-[var(--portal-muted)] mt-1">Direct Secure Line</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-3 w-3" /> HIPAA SECURE
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeMsgs.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[80%] animate-in fade-in duration-150",
                    msg.sender === 'doctor' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <span className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shrink-0",
                    msg.sender === 'doctor' ? "bg-[#0ea5e9]" : "bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9]"
                  )}>
                    {msg.sender === 'doctor' ? 'DR' : activeThread?.avatarInitials}
                  </span>
                  
                  <div className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed border",
                    msg.sender === 'doctor' 
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9]/20 text-[var(--portal-text)] rounded-tr-none" 
                      : "bg-[var(--portal-elevated)] border-[var(--portal-border)] text-[var(--portal-text)] rounded-tl-none"
                  )}>
                    <p>{msg.text}</p>
                    <span className="block text-[8px] text-[var(--portal-muted)] mt-1.5 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Text Input bar */}
            <div className="p-4 border-t border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                <input 
                  type="text" 
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Write a secure HIPAA-compliant reply to patient..." 
                  className="input-premium flex-1"
                />
                <button 
                  type="submit" 
                  className="btn-premium btn-premium-primary h-10 w-10 p-0 rounded-xl flex items-center justify-center"
                  disabled={!replyInput.trim()}
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
