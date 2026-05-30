import { useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  UserCircle, 
  BellRing, 
  Sparkles,
  ShieldAlert,
  Building,
  KeyRound,
  Sliders
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

type SettingsTab = 'profile' | 'practice' | 'billing' | 'notifications' | 'ai' | 'security';

export const DoctorSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Form States
  const [docName, setDocName] = useState('Dr. Rahul Mehta');
  const [license, setLicense] = useState('MC-987452-MD');
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [email, setEmail] = useState('doctor@mediscan.ai');
  const [clinic, setClinic] = useState('Cardiology Wing A, City Hospital');
  
  // Alert Thresholds
  const [ldlAlert, setLdlAlert] = useState(true);
  const [hbAlert, setHbAlert] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);
  
  // AI Configs
  const [aiModel, setAiModel] = useState('BioGPT-Clinical-4B');
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Clinical console settings updated successfully.');
    }, 1000);
  };

  const handleBillingAction = (act: 'change' | 'manage') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: act === 'change' ? 'Syncing Stripe clinical plans...' : 'Opening Stripe Secure Customer Portal...',
        success: act === 'change' ? 'Plan updated to Practice Premium Tier!' : 'Redirected successfully!',
        error: 'Failed to access billing.',
      }
    );
  };

  return (
    <DashboardLayout title="Settings">
      <PageTransition>
        <div className="space-y-5 text-[var(--portal-text)] max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="pb-3 border-b border-[var(--portal-border)]">
            <h2 className="text-section-title text-[var(--portal-text)] font-bold">Clinical Console Settings</h2>
            <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
              Configure clinic credentials, model thresholds, and Stripe subscription plans
            </p>
          </div>

          {/* Settings Tabs Navigation */}
          <div className="flex bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] rounded-xl p-0.5 overflow-x-auto gap-0.5 select-none scrollbar-none">
            {[
              { id: 'profile', label: 'Profile', icon: UserCircle },
              { id: 'practice', label: 'Practice Details', icon: Building },
              { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
              { id: 'notifications', label: 'Clinical Alerts', icon: BellRing },
              { id: 'ai', label: 'AI Preferences', icon: Sliders },
              { id: 'security', label: 'Security & 2FA', icon: KeyRound }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" 
                    : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Settings Panel */}
          <article className="app-card p-6 min-h-[350px]">
            <form onSubmit={handleSaveConfig} className="space-y-5">
              
              {/* TAB 1: Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <UserCircle className="h-4.5 w-4.5 text-[#0ea5e9]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Licensing & Credentials</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={docName} 
                        onChange={(e) => setDocName(e.target.value)} 
                        className="input-premium w-full"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Medical License Number (EHR Pinned)</label>
                      <input 
                        type="text" 
                        value={license} 
                        className="input-premium w-full opacity-60"
                        disabled
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Primary Specialty</label>
                      <input 
                        type="text" 
                        value={specialty} 
                        onChange={(e) => setSpecialty(e.target.value)} 
                        className="input-premium w-full"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Clinical Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input-premium w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Practice Details */}
              {activeTab === 'practice' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <Building className="h-4.5 w-4.5 text-[#0ea5e9]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Clinic Location & Operations</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Clinic Facility / Location</label>
                      <input 
                        type="text" 
                        value={clinic} 
                        onChange={(e) => setClinic(e.target.value)} 
                        className="input-premium w-full"
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Consultation Mode</label>
                        <select className="input-premium w-full font-semibold text-xs">
                          <option value="both" className="bg-[#0B1020]">Telehealth + In-Clinic</option>
                          <option value="tele" className="bg-[#0B1020]">Telehealth Only</option>
                          <option value="clinic" className="bg-[#0B1020]">In-Clinic Only</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">TimeZone</label>
                        <select className="input-premium w-full font-semibold text-xs">
                          <option value="ist" className="bg-[#0B1020]">India Standard Time (IST)</option>
                          <option value="utc" className="bg-[#0B1020]">UTC Coordinated Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Billing & Plans */}
              {activeTab === 'billing' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <CreditCard className="h-4.5 w-4.5 text-[#0ea5e9]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Stripe Billing & Subscriptions</h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_360px]">
                    <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 p-4 space-y-2">
                      <h4 className="text-xs font-bold text-[var(--portal-text)]">Practice Pro License Tier</h4>
                      <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase">₹2,499/mo • Renews June 15, 2026</p>
                      <span className="inline-block mt-2 bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                        Active Syncing
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      <button 
                        type="button" 
                        onClick={() => handleBillingAction('change')} 
                        className="btn-premium btn-premium-primary text-[10px] w-full text-center"
                      >
                        Change License Tier
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleBillingAction('manage')} 
                        className="btn-premium btn-premium-secondary text-[10px] w-full border-[var(--portal-border)] bg-[var(--portal-surface)]"
                      >
                        Launch Stripe Portal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Clinical Alerts */}
              {activeTab === 'notifications' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <BellRing className="h-4.5 w-4.5 text-[#0ea5e9]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Clinical Threshold Alerts</h3>
                  </div>

                  <div className="space-y-3.5 max-w-xl">
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25">
                      <div>
                        <p className="text-xs font-bold text-[var(--portal-text)]">LDL Cholesterol Alarm</p>
                        <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Trigger alerts on LDL &gt; 180 mg/dL</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setLdlAlert(!ldlAlert)}
                        className={cn(
                          "h-5.5 w-10 rounded-full p-0.5 transition-colors relative shrink-0",
                          ldlAlert ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                        )}
                      >
                        <span className={cn(
                          "block h-4.5 w-4.5 rounded-full bg-white transition-transform shadow-sm",
                          ldlAlert ? "translate-x-4.5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25">
                      <div>
                        <p className="text-xs font-bold text-[var(--portal-text)]">Hemoglobin Alarm</p>
                        <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Trigger alerts on Hemoglobin &lt; 11.0 g/dL</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setHbAlert(!hbAlert)}
                        className={cn(
                          "h-5.5 w-10 rounded-full p-0.5 transition-colors relative shrink-0",
                          hbAlert ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                        )}
                      >
                        <span className={cn(
                          "block h-4.5 w-4.5 rounded-full bg-white transition-transform shadow-sm",
                          hbAlert ? "translate-x-4.5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25">
                      <div>
                        <p className="text-xs font-bold text-[var(--portal-text)]">Emergency SMS Ping</p>
                        <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Alert mobile phone instantly on critical laboratory files</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setCriticalSms(!criticalSms)}
                        className={cn(
                          "h-5.5 w-10 rounded-full p-0.5 transition-colors relative shrink-0",
                          criticalSms ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                        )}
                      >
                        <span className={cn(
                          "block h-4.5 w-4.5 rounded-full bg-white transition-transform shadow-sm",
                          criticalSms ? "translate-x-4.5" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AI Preferences */}
              {activeTab === 'ai' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <Sparkles className="h-4.5 w-4.5 text-[#7f77dd]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Clinical Model Preferences</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">Clinical AI Model</label>
                      <select 
                        value={aiModel} 
                        onChange={(e) => setAiModel(e.target.value)} 
                        className="input-premium w-full font-bold text-xs"
                      >
                        <option value="BioGPT-Clinical-4B">BioGPT-Clinical-4B (Primary)</option>
                        <option value="LLaMA3-Med-8B">LLaMA3-Med-8B (High Efficacy)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[var(--portal-muted)] uppercase ml-1">AI Confidence Alert Threshold ({confidenceThreshold}%)</label>
                      <div className="flex items-center gap-3 mt-1.5">
                        <input 
                          type="range" 
                          min="50" 
                          max="99" 
                          value={confidenceThreshold} 
                          onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                          className="w-full h-1 bg-[var(--portal-border)] rounded-lg appearance-none cursor-pointer accent-[#7f77dd]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Security */}
              {activeTab === 'security' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                    <KeyRound className="h-4.5 w-4.5 text-[#0ea5e9]" />
                    <h3 className="text-card-title font-bold text-[var(--portal-text)]">Security & Authentication</h3>
                  </div>

                  <div className="space-y-3.5 max-w-xl">
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25">
                      <div>
                        <p className="text-xs font-bold text-[var(--portal-text)]">Two-Factor Authentication (2FA)</p>
                        <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Grounded authentication block via clinical device OTP</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={cn(
                          "h-5.5 w-10 rounded-full p-0.5 transition-colors relative shrink-0",
                          twoFactor ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                        )}
                      >
                        <span className={cn(
                          "block h-4.5 w-4.5 rounded-full bg-white transition-transform shadow-sm",
                          twoFactor ? "translate-x-4.5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-[var(--portal-border)] text-xs text-[var(--portal-muted)]">
                      <div>
                        <p className="font-bold text-[var(--portal-text)] uppercase text-[9px] tracking-wider">HIPAA Audit Logs</p>
                        <p className="text-[10px] mt-0.5 leading-relaxed">License validations and EHR data sync audits are compiled hourly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions row */}
              <div className="pt-4 border-t border-[var(--portal-border)]/55 flex gap-2">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-premium btn-premium-primary text-[10px] font-bold uppercase tracking-wider"
                >
                  {saving ? 'Syncing...' : 'Save System Settings'}
                </button>
              </div>

            </form>
          </article>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
