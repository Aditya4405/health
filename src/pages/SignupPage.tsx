import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseMedical,
  Building2,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Link2,
  ShieldCheck,
  Stethoscope,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { Role, SignupPayload } from '@/types';
import { cn } from '@/utils/cn';
import { usePageTitle } from '@/hooks/usePageTitle';

type SignupRole = Extract<Role, 'PATIENT' | 'DOCTOR'>;
type OnboardingStep = 1 | 2 | 3 | 4;

const onboardingSteps: Array<{ id: OnboardingStep; label: string; subtitle: string }> = [
  { id: 1, label: 'Role', subtitle: 'Choose user type' },
  { id: 2, label: 'Account', subtitle: 'Basic credentials' },
  { id: 3, label: 'Profile', subtitle: 'Role details' },
  { id: 4, label: 'Confirm', subtitle: 'Review and create' },
];

const roleOptions: Array<{
  value: SignupRole;
  title: string;
  description: string;
  icon: typeof HeartPulse;
}> = [
  {
    value: 'PATIENT',
    title: 'Patient',
    description: 'Track reports, receive AI explanations, and monitor your health journey.',
    icon: HeartPulse,
  },
  {
    value: 'DOCTOR',
    title: 'Doctor',
    description: 'Use clinical AI to analyze reports and collaborate with patient care teams.',
    icon: Stethoscope,
  },
];

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'PATIENT' as SignupRole,
  age: '',
  gender: '',
  bloodGroup: '',
  emergencyContact: '',
  licenseNumber: '',
  specialization: '',
  hospitalName: '',
  yearsOfExperience: '',
  consultationMode: '',
  verificationUploadName: '',
  linkedinProfile: '',
  availableTimings: '',
};

export const SignupPage = () => {
  usePageTitle('Create Account');

  const navigate = useNavigate();
  const { signup, getDefaultRoute } = useAuth();

  const [step, setStep] = useState<OnboardingStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  const stepProgress = useMemo(() => ((step - 1) / (onboardingSteps.length - 1)) * 100, [step]);

  const role = form.role;

  const isStep2Valid = form.name.trim().length > 1 && form.email.includes('@') && form.password.length >= 8;
  const isPatientStep3Valid =
    Number(form.age) > 0 && Number(form.age) < 121 && Boolean(form.gender) && Boolean(form.bloodGroup) && Boolean(form.emergencyContact.trim());
  const isDoctorStep3Valid =
    Boolean(form.licenseNumber.trim()) &&
    Boolean(form.specialization.trim()) &&
    Boolean(form.hospitalName.trim()) &&
    Number(form.yearsOfExperience) >= 0 &&
    Number(form.yearsOfExperience) <= 70 &&
    Boolean(form.consultationMode) &&
    Boolean(form.verificationUploadName.trim());

  const canContinue = (currentStep: OnboardingStep) => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return isStep2Valid;
    if (currentStep === 3) return role === 'PATIENT' ? isPatientStep3Valid : isDoctorStep3Valid;
    return true;
  };

  const goNext = () => {
    if (!canContinue(step) || step === 4) return;
    setStep((current) => (current + 1) as OnboardingStep);
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((current) => (current - 1) as OnboardingStep);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (step !== 4) {
      goNext();
      return;
    }

    setSubmitting(true);
    const payload: SignupPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      patientProfile:
        role === 'PATIENT'
          ? {
              age: Number(form.age),
              gender: form.gender as 'MALE' | 'FEMALE' | 'OTHER',
              bloodGroup: form.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
              emergencyContact: form.emergencyContact.trim(),
            }
          : undefined,
      doctorProfile:
        role === 'DOCTOR'
          ? {
              licenseNumber: form.licenseNumber.trim(),
              specialization: form.specialization.trim(),
              hospitalName: form.hospitalName.trim(),
              yearsOfExperience: Number(form.yearsOfExperience),
              consultationMode: form.consultationMode as 'IN_PERSON' | 'VIRTUAL' | 'HYBRID',
              verificationUploadName: form.verificationUploadName.trim(),
              linkedinProfile: form.linkedinProfile.trim() || undefined,
              availableTimings: form.availableTimings.trim() || undefined,
            }
          : undefined,
    };

    try {
      await signup(payload);
      toast.success('Your account is ready. Welcome to MediScan AI.');
      navigate(getDefaultRoute(role), { replace: true });
    } catch {
      toast.error('Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mx-auto w-full max-w-[520px]" onSubmit={onSubmit}>
      <div className="space-y-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
            Premium Onboarding
          </p>
          <h1 className="mt-4 font-display text-[clamp(30px,3.8vw,42px)] font-bold leading-tight">Create your MediScan AI account</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--landing-muted)]">
            Guided onboarding built for secure healthcare intelligence workflows.
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--landing-muted)_22%,transparent)]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--landing-primary),var(--landing-accent))]"
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {onboardingSteps.map((item) => {
              const isActive = step === item.id;
              const isCompleted = step > item.id;
              return (
                <div key={item.id} className="space-y-1 text-left">
                  <div
                    className={cn(
                      'inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[11px] font-semibold',
                      isCompleted && 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_14%,transparent)] text-[var(--landing-primary)]',
                      isActive && 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_10%,var(--landing-surface))] text-[var(--landing-primary)]',
                      !isCompleted && !isActive && 'border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)]',
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.id}
                  </div>
                  <p className="text-[11px] font-semibold text-[var(--landing-text)]">{item.label}</p>
                  <p className="hidden text-[10px] text-[var(--landing-muted)] sm:block">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">Choose your role</h2>
                  <p className="text-sm text-[var(--landing-muted)]">Select the onboarding path tailored to your workflow.</p>
                </div>
                <div className="space-y-4">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, role: option.value }))}
                      className={cn(
                        'focus-ring group w-full rounded-2xl border p-5 text-left transition-all duration-200',
                        role === option.value
                          ? 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_9%,var(--landing-surface))] shadow-[0_12px_28px_rgba(37,99,235,0.14)]'
                          : 'border-[var(--landing-border)] bg-[var(--landing-surface-2)] hover:-translate-y-0.5 hover:border-[var(--landing-primary)]/35',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
                            role === option.value
                              ? 'border-[var(--landing-primary)]/40 bg-[color-mix(in_srgb,var(--landing-primary)_13%,transparent)] text-[var(--landing-primary)]'
                              : 'border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)]',
                          )}
                        >
                          <option.icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-1">
                          <p className="font-display text-xl font-semibold">{option.title}</p>
                          <p className="text-sm leading-relaxed text-[var(--landing-muted)]">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">Set up your account</h2>
                  <p className="text-sm text-[var(--landing-muted)]">Use your primary email and a secure password.</p>
                </div>
                <div className="space-y-6">
                  <FloatingInput id="signup-name" label="Full Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                  <FloatingInput
                    id="signup-email"
                    type="email"
                    label="Email"
                    value={form.email}
                    onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                    required
                  />
                  <FloatingInput
                    id="signup-password"
                    type="password"
                    label="Password"
                    value={form.password}
                    onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                    minLength={8}
                    required
                    helper="Use at least 8 characters."
                  />
                </div>
              </div>
            )}

            {step === 3 && role === 'PATIENT' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">Patient details</h2>
                  <p className="text-sm text-[var(--landing-muted)]">These details help personalize health insights and safety alerts.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FloatingInput
                    id="patient-age"
                    type="number"
                    label="Age"
                    value={form.age}
                    onChange={(value) => setForm((current) => ({ ...current, age: value }))}
                    min={1}
                    max={120}
                    required
                  />
                  <SelectField
                    id="patient-gender"
                    label="Gender"
                    value={form.gender}
                    onChange={(value) => setForm((current) => ({ ...current, gender: value }))}
                    required
                    options={[
                      { value: '', label: 'Select gender' },
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other' },
                    ]}
                  />
                  <SelectField
                    id="patient-blood-group"
                    label="Blood Group"
                    value={form.bloodGroup}
                    onChange={(value) => setForm((current) => ({ ...current, bloodGroup: value }))}
                    required
                    options={[
                      { value: '', label: 'Select blood group' },
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' },
                    ]}
                  />
                  <FloatingInput
                    id="patient-emergency"
                    label="Emergency Contact"
                    value={form.emergencyContact}
                    onChange={(value) => setForm((current) => ({ ...current, emergencyContact: value }))}
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && role === 'DOCTOR' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">Doctor verification details</h2>
                  <p className="text-sm text-[var(--landing-muted)]">Complete your clinical profile for secure professional access.</p>
                </div>
                <div className="space-y-6">
                  <FloatingInput
                    id="doctor-license"
                    label="Medical License Number"
                    value={form.licenseNumber}
                    onChange={(value) => setForm((current) => ({ ...current, licenseNumber: value }))}
                    required
                  />
                  <FloatingInput
                    id="doctor-specialization"
                    label="Specialization"
                    value={form.specialization}
                    onChange={(value) => setForm((current) => ({ ...current, specialization: value }))}
                    required
                  />
                  <FloatingInput
                    id="doctor-hospital"
                    label="Hospital / Clinic Name"
                    value={form.hospitalName}
                    onChange={(value) => setForm((current) => ({ ...current, hospitalName: value }))}
                    icon={Building2}
                    required
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FloatingInput
                      id="doctor-experience"
                      type="number"
                      label="Years of Experience"
                      value={form.yearsOfExperience}
                      onChange={(value) => setForm((current) => ({ ...current, yearsOfExperience: value }))}
                      min={0}
                      max={70}
                      required
                    />
                    <SelectField
                      id="doctor-consultation-mode"
                      label="Consultation Mode"
                      value={form.consultationMode}
                      onChange={(value) => setForm((current) => ({ ...current, consultationMode: value }))}
                      required
                      options={[
                        { value: '', label: 'Select mode' },
                        { value: 'IN_PERSON', label: 'In-person' },
                        { value: 'VIRTUAL', label: 'Virtual' },
                        { value: 'HYBRID', label: 'Hybrid' },
                      ]}
                    />
                  </div>

                  <UploadField
                    value={form.verificationUploadName}
                    onFileSelect={(name) => setForm((current) => ({ ...current, verificationUploadName: name }))}
                  />

                  <FloatingInput
                    id="doctor-linkedin"
                    label="LinkedIn / Profile (Optional)"
                    value={form.linkedinProfile}
                    onChange={(value) => setForm((current) => ({ ...current, linkedinProfile: value }))}
                    icon={Link2}
                  />
                  <TextAreaField
                    id="doctor-availability"
                    label="Available Timings (Optional)"
                    value={form.availableTimings}
                    onChange={(value) => setForm((current) => ({ ...current, availableTimings: value }))}
                    icon={Clock3}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold">Review and confirm</h2>
                  <p className="text-sm text-[var(--landing-muted)]">Confirm your onboarding details before account creation.</p>
                </div>

                <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-5">
                  <div className="space-y-3 text-sm">
                    <SummaryRow label="Role" value={role === 'PATIENT' ? 'Patient' : 'Doctor'} />
                    <SummaryRow label="Full Name" value={form.name} />
                    <SummaryRow label="Email" value={form.email} />
                    {role === 'PATIENT' ? (
                      <>
                        <SummaryRow label="Age" value={form.age} />
                        <SummaryRow label="Gender" value={humanize(form.gender)} />
                        <SummaryRow label="Blood Group" value={form.bloodGroup} />
                        <SummaryRow label="Emergency Contact" value={form.emergencyContact} />
                      </>
                    ) : (
                      <>
                        <SummaryRow label="License Number" value={form.licenseNumber} />
                        <SummaryRow label="Specialization" value={form.specialization} />
                        <SummaryRow label="Hospital / Clinic" value={form.hospitalName} />
                        <SummaryRow label="Experience" value={`${form.yearsOfExperience} years`} />
                        <SummaryRow label="Consultation Mode" value={humanize(form.consultationMode)} />
                        <SummaryRow label="Verification File" value={form.verificationUploadName} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitting}
            className="h-12 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-6 text-sm font-semibold text-[var(--landing-text)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            Back
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canContinue(step) || submitting}
              className="h-12 rounded-full px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-full px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-[var(--landing-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--landing-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  minLength,
  min,
  max,
  icon: Icon,
  helper,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
  min?: number;
  max?: number;
  icon?: typeof Building2;
  helper?: string;
}) => (
  <div className="space-y-2">
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        min={min}
        max={max}
        className={cn(
          'peer h-14 w-full rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 pb-2 pt-6 text-sm text-[var(--landing-text)] transition-all',
          'focus:border-[var(--landing-primary)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_14%,transparent)]',
          Icon && 'pl-11',
        )}
      />
      {Icon && <Icon className="pointer-events-none absolute left-4 top-5 h-4 w-4 text-[var(--landing-muted)]" />}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute top-3 text-xs text-[var(--landing-muted)] transition-all',
          Icon ? 'left-11' : 'left-4',
          'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
          'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--landing-primary)]',
        )}
      >
        {label}
      </label>
    </div>
    {helper && <p className="text-xs text-[var(--landing-muted)]">{helper}</p>}
  </div>
);

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      className="h-14 w-full rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 text-sm text-[var(--landing-text)] transition-all focus:border-[var(--landing-primary)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_14%,transparent)]"
    >
      {options.map((option) => (
        <option key={option.value || option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const UploadField = ({ value, onFileSelect }: { value: string; onFileSelect: (value: string) => void }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">Verification Upload</p>
    <label className="group block cursor-pointer">
      <input type="file" accept=".pdf,image/*" className="sr-only" onChange={(event) => onFileSelect(event.target.files?.[0]?.name || '')} required />
      <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 transition-all group-hover:border-[var(--landing-primary)]/35">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
          <Upload className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
          Upload Document
        </p>
        <p className="mt-2 text-sm text-[var(--landing-text)]">{value || 'License/ID verification file (PDF or image)'}</p>
      </div>
    </label>
  </div>
);

const TextAreaField = ({
  id,
  label,
  value,
  onChange,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: typeof Clock3;
}) => (
  <div className="space-y-2">
    <div className="relative">
      <textarea
        id={id}
        placeholder=" "
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'peer min-h-[120px] w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 pb-2 pt-6 text-sm text-[var(--landing-text)] transition-all',
          'focus:border-[var(--landing-primary)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_14%,transparent)]',
          Icon && 'pl-11',
        )}
      />
      {Icon && <Icon className="pointer-events-none absolute left-4 top-5 h-4 w-4 text-[var(--landing-muted)]" />}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute top-3 text-xs text-[var(--landing-muted)] transition-all',
          Icon ? 'left-11' : 'left-4',
          'peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm',
          'peer-focus:top-3 peer-focus:text-xs peer-focus:text-[var(--landing-primary)]',
        )}
      >
        {label}
      </label>
    </div>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[140px_1fr] items-start gap-3 border-b border-[var(--landing-border)] pb-2 last:border-none">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">{label}</p>
    <p className="text-sm text-[var(--landing-text)]">{value}</p>
  </div>
);

const humanize = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());
