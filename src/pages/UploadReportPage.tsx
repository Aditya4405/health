import { type DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, FileImage, FileText, LoaderCircle, Sparkles, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { reportService } from '@/services/reportService';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/utils/cn';

const statusMessages = ['Reading values...', 'Identifying markers...', 'Comparing to reference ranges...', 'Generating summary...'];
type UploadState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export const UploadReportPage = () => {
  usePageTitle('Upload Report');

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
  const [reportId, setReportId] = useState<string | null>(null);

  const recentUploads = useMemo(
    () => [
      { name: 'CBC_Report_Jan_2026.pdf', date: 'Today, 10:45 AM', status: 'Analyzed' },
      { name: 'LipidPanel_Dec_2025.pdf', date: 'Yesterday, 6:20 PM', status: 'Analyzed' },
      { name: 'ThyroidPanel_Nov_2025.png', date: '2 days ago', status: 'Analyzed' },
    ],
    [],
  );

  useEffect(() => {
    if (uploadState !== 'analyzing') return;
    const interval = setInterval(() => setStatusMessageIndex((current) => (current + 1) % statusMessages.length), 1200);
    return () => clearInterval(interval);
  }, [uploadState]);

  const validateFile = (file: File) => {
    const validType = acceptedTypes.includes(file.type);
    const validSize = file.size <= 20 * 1024 * 1024;
    if (!validType || !validSize) {
      setUploadState('error');
      toast.error('Upload failed. Please try a PDF or image file under 20MB.');
      return false;
    }
    return true;
  };

  const onFileSelected = (file: File) => {
    if (!validateFile(file)) return;
    setUploadState('idle');
    setProgress(0);
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setUploadState('uploading');

    try {
      const uploadResponse = await reportService.uploadReport(selectedFile, setProgress);
      setUploadState('analyzing');
      const analysis = await reportService.analyzeReport(uploadResponse.reportId);
      setReportId(analysis.id);
      setUploadState('success');
      toast.success('Analysis complete. Your report is ready.');
    } catch {
      setUploadState('error');
      toast.error('Upload failed. Please try again.');
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setProgress(0);
    setReportId(null);
  };

  return (
    <DashboardLayout title="Upload & Analyze">
      <PageTransition>
        <div className="mx-auto max-w-5xl space-y-5">
          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 shadow-[var(--portal-shadow)] sm:p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--portal-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
                AI Upload Studio
              </p>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={cnUploadZone(dragging)}
              >
                <motion.div
                  animate={{ scale: dragging ? 1.08 : 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-surface)]"
                >
                  <UploadCloud className="h-8 w-8 text-[var(--landing-primary)]" />
                </motion.div>
                <h3 className="font-display text-2xl font-semibold">Drop your report for AI interpretation</h3>
                <p className="mt-2 text-sm text-[var(--portal-muted)]">Supports PDF, JPG, PNG up to 20MB. Parsing begins immediately after upload.</p>
                <Button className="mt-5 h-11 rounded-full border border-[var(--portal-border)] bg-[var(--portal-surface)] px-5 text-sm text-[var(--portal-text)]" onClick={() => inputRef.current?.click()}>
                  Choose file
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onFileSelected(file);
                  }}
                />
              </div>

              {selectedFile && (
                <div className="mt-5 rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                        {selectedFile.type.includes('pdf') ? <FileText className="h-5 w-5 text-[#FCA5A5]" /> : <FileImage className="h-5 w-5 text-[#93C5FD]" />}
                      </span>
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="mt-1 text-xs text-[var(--portal-muted)]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove file">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {uploadState === 'uploading' && (
                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--portal-muted)_24%,transparent)]">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,var(--landing-primary),var(--landing-accent))]"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-[var(--portal-muted)]">Uploading and encrypting... {progress}%</p>
                    </div>
                  )}

                  {uploadState === 'analyzing' && (
                    <div className="mt-4 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold">
                        <LoaderCircle className="h-4 w-4 animate-spin text-[var(--landing-accent)]" />
                        {statusMessages[statusMessageIndex]}
                      </div>
                      <p className="mt-2 text-xs text-[var(--portal-muted)]">AI is extracting biomarkers and generating contextual interpretation.</p>
                      <Button className="mt-3 h-9 rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-4 text-xs text-[var(--portal-text)]" onClick={reset}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  {uploadState === 'success' && (
                    <div className="mt-4 rounded-xl border border-[#2f5f47] bg-[#123223] p-4">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6EE7B7]">
                        <CheckCircle2 className="h-5 w-5" />
                        Analysis Complete
                      </div>
                      <p className="mt-2 text-xs text-[#9BE7C5]">Your report is now available with AI-generated insights and flagged abnormalities.</p>
                      <Button
                        className="mt-3 h-10 rounded-full px-4 text-sm text-white"
                        style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                        onClick={() => navigate(`/app/patient/analysis/${reportId ?? 'mock-report-id'}`)}
                      >
                        View Report Analysis
                      </Button>
                    </div>
                  )}

                  {uploadState === 'error' && (
                    <div className="mt-4 rounded-xl border border-[#6f3232] bg-[#341919] p-4">
                      <p className="text-sm text-[#FCA5A5]">Upload failed. Please try a PDF or image file under 20MB.</p>
                      <Button className="mt-3 h-9 rounded-full border border-[#6f3232] bg-[#341919] px-4 text-xs text-[#FCA5A5]" onClick={startAnalysis}>
                        Retry
                      </Button>
                    </div>
                  )}

                  {uploadState === 'idle' && (
                    <Button
                      className="mt-4 h-11 w-full rounded-full text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)]"
                      style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                      onClick={startAnalysis}
                    >
                      Analyze Report
                    </Button>
                  )}
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 shadow-[var(--portal-shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--portal-muted)]">Live AI Parsing Preview</p>
              <div className="relative mt-4 rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] p-4">
                <motion.div
                  className="absolute inset-x-3 h-8 rounded-xl bg-gradient-to-b from-transparent via-[#06B6D4]/25 to-transparent"
                  animate={{ y: ['-12%', '150%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative z-10 space-y-2">
                  <ParsingRow label="Hemoglobin" value="11.2 g/dL" tone="amber" />
                  <ParsingRow label="LDL Cholesterol" value="182 mg/dL" tone="red" />
                  <ParsingRow label="Ferritin" value="18 ng/mL" tone="amber" />
                  <ParsingRow label="WBC" value="7,200 /uL" tone="green" />
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-[var(--portal-muted)]">
                <p className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 py-2">Potential Iron Deficiency detected from combined CBC + Ferritin pattern.</p>
                <p className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 py-2">LDL marker indicates elevated cardiovascular risk trend.</p>
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 shadow-[var(--portal-shadow)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Recent uploads</h3>
              <p className="text-xs text-[var(--portal-muted)]">Last 72 hours</p>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {recentUploads.map((upload) => (
                <div key={upload.name} className="rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] p-3">
                  <p className="truncate text-sm font-medium">{upload.name}</p>
                  <p className="mt-1 text-xs text-[var(--portal-muted)]">{upload.date}</p>
                  <span className="mt-2 inline-flex rounded-full border border-[#2f5f47] bg-[#123223] px-2.5 py-1 text-[11px] font-medium text-[#6EE7B7]">{upload.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const cnUploadZone = (dragging: boolean) =>
  cn(
    'mt-4 rounded-3xl border border-dashed p-8 text-center transition-all sm:p-10',
    dragging
      ? 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_8%,var(--portal-elevated))]'
      : 'border-[var(--portal-border)] bg-[var(--portal-elevated)]',
  );

const ParsingRow = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'red';
}) => (
  <div className="grid grid-cols-[1fr_auto] items-center rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-3 py-2">
    <span className="text-xs text-[var(--portal-muted)]">{label}</span>
    <span
      className={
        {
          green: 'inline-flex rounded-full border border-[#2f5f47] bg-[#123223] px-2 py-0.5 text-[10px] font-medium text-[#6EE7B7]',
          amber: 'inline-flex rounded-full border border-[#6d5523] bg-[#312613] px-2 py-0.5 text-[10px] font-medium text-[#FCD34D]',
          red: 'inline-flex rounded-full border border-[#6f3232] bg-[#341919] px-2 py-0.5 text-[10px] font-medium text-[#FCA5A5]',
        }[tone]
      }
    >
      {value}
    </span>
  </div>
);
