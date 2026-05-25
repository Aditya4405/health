import { useState, type ReactNode } from 'react';
import { Bell, CreditCard, MoonStar, ShieldCheck, UserCircle2, ArrowRight, Sparkles, Camera } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/utils/cn';

export const UserSettingsPage = () => {
  usePageTitle('Settings');
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const processFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setTimeout(() => {
        updateUser({ avatarUrl: result });
        setUploading(false);
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <DashboardLayout title="Settings">
      <PageTransition>
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)]">
            <h2 className="text-section-title text-[var(--portal-text)]">Preferences</h2>
            <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Manage your personal healthcare profile account logs and companion preferences</p>
          </div>

          {/* Account Profile Section */}
          <section className="grid gap-6 md:grid-cols-[1fr_260px]">
            {/* Form */}
            <article className="app-card p-6 shadow-sm space-y-5">
              {/* Account Identity Header with Upload Widget */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-5 border-b border-[var(--portal-border)]">
                <div 
                  className="relative group cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="h-24 w-24 rounded-full overflow-hidden relative shadow-md border-2 border-[#0ea5e9]/20 group-hover:border-[#0ea5e9]/60 transition-all duration-300">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-[#3b82f6] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-bold tracking-wider relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                        {user?.avatarInitials ?? "AK"}
                      </div>
                    )}
                    
                    {/* Hover Change Photo state */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-semibold uppercase tracking-wide transition-opacity duration-200">
                      <Camera className="h-4.5 w-4.5 mb-1" />
                      <span>Change photo</span>
                    </div>

                    {/* Loader overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-[var(--portal-surface)] flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full border-2 border-[#0ea5e9] border-t-transparent animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload profile photo"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-card-title text-[var(--portal-text)] font-bold">{user?.name ?? 'Aarav Kapoor'}</h3>
                    <span className="border border-success/20 bg-success/10 text-success text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                      Verified Profile
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    Health synced • Companion Active
                  </p>
                  <p className="text-secondary-premium text-[var(--portal-muted)] pt-1">
                    Last sync: Just now
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-label-premium text-[var(--portal-muted)] ml-1">Full Name</label>
                  <input placeholder="Full name" defaultValue={user?.name ?? 'Aarav Kapoor'} className="input-premium w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-label-premium text-[var(--portal-muted)] ml-1">Email Address</label>
                  <input placeholder="Email" defaultValue="patient@mediscan.ai" className="input-premium w-full" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-label-premium text-[var(--portal-muted)] ml-1">Phone Number</label>
                  <input placeholder="Phone" defaultValue="+91 98765 43210" className="input-premium w-full" />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button className="btn-premium btn-premium-primary">
                  Save Changes
                </button>
                <button className="btn-premium btn-premium-secondary">
                  Cancel
                </button>
              </div>
            </article>

            {/* Completion indicator */}
            <article className="app-card p-6 shadow-sm flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.04),transparent_60%)] pointer-events-none" />
              <p className="text-label-premium text-[var(--portal-muted)]">Completion Status</p>
              
              <div className="my-1">
                <CompletionRing progress={82} />
              </div>
              
              <div className="space-y-2">
                <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed">
                  Provide emergency contact history to complete security verification.
                </p>
                <span className="border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full inline-block">Pro Account</span>
              </div>
            </article>
          </section>

          {/* Preferences Settings (Apple/Notion style list rows) */}
          <section className="grid gap-6 md:grid-cols-2">
            
            {/* System Notifications preferences */}
            <article className="app-card p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <Bell className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">System Alerts</h3>
              </div>
              <div className="divide-y divide-[var(--portal-border)]">
                <SettingRow label="Critical health indicators" description="Alerts for critical biomarker variances." />
                <SettingRow label="Analysis completions" description="Get notified when AI interpretations are ready." defaultChecked />
                <SettingRow label="Consultation nudges" description="Appointment confirmation and follow-up prompts." defaultChecked />
              </div>
            </article>

            {/* Security and controls */}
            <article className="app-card p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <ShieldCheck className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Security & Theme</h3>
              </div>
              <div className="divide-y divide-[var(--portal-border)]">
                <SecurityRowItem
                  icon={UserCircle2}
                  title="Two-factor authentication"
                  body="Secure account entry using verification codes."
                />
                <SecurityRowItem
                  icon={MoonStar}
                  title="Dark theme preference"
                  body={`Display mode: ${theme}`}
                  action={
                    <button 
                      className="btn-premium btn-premium-secondary h-8 px-3 text-[10px] font-bold uppercase tracking-wider" 
                      onClick={toggleTheme}
                    >
                      Toggle
                    </button>
                  }
                />
              </div>
            </article>

          </section>

          <section className="grid gap-6 md:grid-cols-2">
            
            {/* AI Personalization */}
            <article className="app-card p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <Sparkles className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">AI Personalization</h3>
              </div>
              <div className="divide-y divide-[var(--portal-border)]">
                <SettingRow label="Detailed medical contexts" description="Include clinical insights in AI explanations." defaultChecked />
                <SettingRow label="Lifestyle-first recommendations" description="Prioritize nutrition guidance over clinical targets." defaultChecked />
                <SettingRow label="Timing smart nudges" description="Smart reminders synchronized with biological clock." />
              </div>
            </article>

            {/* Subscription Card */}
            <article className="app-card p-6 md:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-gradient-to-br from-[#0ea5e9]/5 to-transparent blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                  <CreditCard className="h-4 w-4 text-[#0ea5e9]" />
                  <h3 className="text-card-title text-[var(--portal-text)] font-bold">Billing & Plan</h3>
                </div>

                <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-body-premium font-semibold text-[var(--portal-text)]">MediScan Pro</h4>
                    <p className="text-secondary-premium text-[var(--portal-muted)] mt-1">₹299/mo • Renews May 20, 2026</p>
                  </div>
                  <span className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.25)] border border-[#0ea5e9]/20">
                    Pro Active
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="btn-premium btn-premium-secondary w-full text-[11px] h-9 px-3">
                  Change Plan
                </button>
                <button className="btn-premium btn-premium-secondary w-full text-[11px] h-9 px-3">
                  Manage Billing
                </button>
              </div>
            </article>

          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const CompletionRing = ({ progress }: { progress: number }) => (
  <div
    className="relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_8px_20px_-8px_rgba(14,165,233,0.1)]"
    style={{
      background: `conic-gradient(#0ea5e9 ${progress * 3.6}deg, color-mix(in_srgb,var(--portal-border)_24%,transparent) 0deg)`,
    }}
  >
    <div className="absolute inset-[8px] rounded-full bg-[var(--portal-surface)]" />
    <p className="relative font-display text-xl font-bold text-[var(--portal-text)]">{progress}%</p>
  </div>
);

const SettingRow = ({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) => (
  <div className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1">
    <div className="space-y-0.5">
      <p className="text-body-premium font-semibold text-[var(--portal-text)]">{label}</p>
      <p className="text-secondary-premium text-[var(--portal-muted)]">{description}</p>
    </div>
    <Switch defaultChecked={defaultChecked} className="data-[state=checked]:bg-[#0ea5e9]" />
  </div>
);

const SecurityRowItem = ({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
  action?: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1">
    <div className="flex items-start gap-2.5">
      <Icon className="h-4.5 w-4.5 mt-0.5 text-[#0ea5e9]" />
      <div className="space-y-0.5">
        <p className="text-body-premium font-semibold text-[var(--portal-text)]">{title}</p>
        <p className="text-secondary-premium text-[var(--portal-muted)]">{body}</p>
      </div>
    </div>
    {action ?? <Switch className="data-[state=checked]:bg-[#0ea5e9]" />}
  </div>
);
