import { useState } from 'react';
import { Settings, CreditCard, ShieldCheck, UserCircle, BellRing, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export const DoctorSettingsPage = () => {
  const [docName, setDocName] = useState('Dr. Rahul Mehta');
  const [license, setLicense] = useState('MC-987452-MD');
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [email, setEmail] = useState('doctor@mediscan.ai');
  const [clinic, setClinic] = useState('Cardiology Wing A, City Hospital');
  const [loading, setLoading] = useState(false);

  // Alert Thresholds
  const [ldlAlert, setLdlAlert] = useState(() => localStorage.getItem('cfg_ldl_alert') !== 'false');
  const [hbAlert, setHbAlert] = useState(() => localStorage.getItem('cfg_hb_alert') !== 'false');
  const [criticalSms, setCriticalSms] = useState(() => localStorage.getItem('cfg_critical_sms') === 'true');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Clinical settings & credentials updated successfully.');
    }, 1000);
  };

  const handleToggleConfig = (key: string, currentVal: boolean, setter: (val: boolean) => void) => {
    const next = !currentVal;
    setter(next);
    localStorage.setItem(key, String(next));
    toast.info(`Alert threshold parameter modified.`);
  };

  const handleBillingAction = (act: 'change' | 'manage') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: act === 'change' ? 'Syncing Stripe clinical plans...' : 'Opening Stripe Secure Customer Portal...',
        success: act === 'change' ? 'Plan updated to Practice Premium!' : 'Redirected successfully!',
        error: 'Failed to access billing.',
      }
    );
  };

  return (
    <DashboardLayout title="Settings">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)] max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)]">
            <h2 className="text-section-title text-[var(--portal-text)] font-bold">Clinical Console Settings</h2>
            <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
              Manage clinical licensing credentials, alarm triggers, and subscriptions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_340px]">
            
            {/* Credentials profile form */}
            <article className="app-card p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--portal-border)]">
                <UserCircle className="h-4.5 w-4.5 text-[#0ea5e9]" />
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Licensing & Profile</h3>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-label-premium text-[var(--portal-muted)] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={docName} 
                      onChange={(e) => setDocName(e.target.value)} 
                      className="input-premium w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-premium text-[var(--portal-muted)] ml-1">Medical License Number</label>
                    <input 
                      type="text" 
                      value={license} 
                      onChange={(e) => setLicense(e.target.value)} 
                      className="input-premium w-full"
                      disabled
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-premium text-[var(--portal-muted)] ml-1">Practice Specialty</label>
                    <input 
                      type="text" 
                      value={specialty} 
                      onChange={(e) => setSpecialty(e.target.value)} 
                      className="input-premium w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-premium text-[var(--portal-muted)] ml-1">Clinical Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="input-premium w-full"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-label-premium text-[var(--portal-muted)] ml-1">Clinic Facility / Location</label>
                    <input 
                      type="text" 
                      value={clinic} 
                      onChange={(e) => setClinic(e.target.value)} 
                      className="input-premium w-full"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="submit" className="btn-premium btn-premium-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </article>

            {/* Right side: Subscription & Alert Thresholds */}
            <aside className="space-y-6">
              
              {/* Stripe Subscription details */}
              <div className="app-card p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                  <CreditCard className="h-4.5 w-4.5 text-[#0ea5e9]" />
                  <h3 className="text-card-title text-[var(--portal-text)] font-bold">Billing & Tier</h3>
                </div>

                <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/40 p-4 space-y-1">
                  <h4 className="text-xs font-bold text-[var(--portal-text)]">Practice Pro Plan</h4>
                  <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase mt-1">₹2,499/mo • Renews June 15, 2026</p>
                  <span className="inline-block mt-2 bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => handleBillingAction('change')} 
                    className="btn-premium btn-premium-secondary h-8 px-2 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Change Tier
                  </button>
                  <button 
                    onClick={() => handleBillingAction('manage')} 
                    className="btn-premium btn-premium-secondary h-8 px-2 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Stripe Portal
                  </button>
                </div>
              </div>

              {/* Alert thresholds tolerances */}
              <div className="app-card p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                  <BellRing className="h-4.5 w-4.5 text-[#0ea5e9]" />
                  <h3 className="text-card-title text-[var(--portal-text)] font-bold">Clinical Thresholds</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">LDL Cholesterol Alarm</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Trigger alerts on LDL &gt; 180 mg/dL</p>
                    </div>
                    <button 
                      onClick={() => handleToggleConfig('cfg_ldl_alert', ldlAlert, setLdlAlert)}
                      className={cn(
                        "h-5 w-9 rounded-full p-0.5 transition-colors relative",
                        ldlAlert ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                      )}
                    >
                      <span className={cn(
                        "block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                        ldlAlert ? "translate-x-4" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Hemoglobin Alert</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Trigger alerts on Hb &lt; 11 g/dL</p>
                    </div>
                    <button 
                      onClick={() => handleToggleConfig('cfg_hb_alert', hbAlert, setHbAlert)}
                      className={cn(
                        "h-5 w-9 rounded-full p-0.5 transition-colors relative",
                        hbAlert ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                      )}
                    >
                      <span className={cn(
                        "block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                        hbAlert ? "translate-x-4" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[var(--portal-border)]/50 pt-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Emergency SMS Ping</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Alert mobile phone on critical files</p>
                    </div>
                    <button 
                      onClick={() => handleToggleConfig('cfg_critical_sms', criticalSms, setCriticalSms)}
                      className={cn(
                        "h-5 w-9 rounded-full p-0.5 transition-colors relative",
                        criticalSms ? "bg-[#0ea5e9]" : "bg-[var(--portal-border)]"
                      )}
                    >
                      <span className={cn(
                        "block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                        criticalSms ? "translate-x-4" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

            </aside>

          </div>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
