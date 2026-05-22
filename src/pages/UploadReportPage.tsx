import { type DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, FileImage, FileText, UploadCloud, X, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { reportService } from '@/services/reportService';
import { usePageTitle } from '@/hooks/usePageTitle';

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
      { name: 'CBC_Report_Jan_2025.pdf', date: 'Today, 10:45 AM', status: 'Completed' },
      { name: 'LipidPanel_Dec_2024.pdf', date: 'Yesterday, 6:20 PM', status: 'Completed' },
      { name: 'ThyroidPanel_Nov_2024.png', date: '2 days ago', status: 'Completed' },
    ],
    [],
  );

  useEffect(() => {
    if (uploadState !== 'analyzing') return;
    const interval = setInterval(() => {
      setStatusMessageIndex((current) => (current + 1) % statusMessages.length);
    }, 1200);

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
    <DashboardLayout title="Upload Report">
      <PageTransition>
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="rounded-lg">
            <CardContent className="p-7">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-lg border-2 border-dashed p-10 text-center transition-all ${
                  dragging
                    ? 'border-primary bg-[#e6f1fb]'
                    : 'border-[#b5d4f4] bg-white hover:border-[#7db6ea] hover:bg-[#f8fbff]'
                }`}
              >
                <motion.div animate={{ scale: dragging ? 1.1 : 1 }}>
                  <UploadCloud className="mx-auto h-12 w-12 text-primary" />
                </motion.div>
                <h3 className="mt-4 font-display text-2xl font-semibold">Drop your report here</h3>
                <p className="mt-2 text-[#5f7388]">Supports PDF, JPG, PNG - up to 20MB</p>
                <Button variant="outline" className="mt-6" onClick={() => inputRef.current?.click()}>
                  Or browse files
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
                <div className="mt-5 rounded-md border border-[#d8e7f4] bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {selectedFile.type.includes('pdf') ? (
                        <FileText className="h-9 w-9 text-[#d85a30]" />
                      ) : (
                        <FileImage className="h-9 w-9 text-primary" />
                      )}
                      <div>
                        <p className="font-medium text-[#2e4f68]">{selectedFile.name}</p>
                        <p className="text-sm text-[#5f7388]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove file">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {uploadState === 'uploading' && (
                    <div className="mt-4 space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-[#4f6780]">Uploading... {progress}%</p>
                    </div>
                  )}

                  {uploadState === 'analyzing' && (
                    <div className="mt-4 rounded-md bg-[#edf2ff] p-4 text-center">
                      <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-purple" />
                      <BrainCircuit className="mx-auto mt-2 h-8 w-8 animate-pulse text-purple" />
                      <p className="mt-3 text-sm font-medium text-[#4e5f8c]">{statusMessages[statusMessageIndex]}</p>
                      <Button className="mt-3" variant="outline" onClick={reset}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  {uploadState === 'success' && (
                    <div className="mt-4 rounded-md bg-[#eaf3de] p-4">
                      <div className="flex items-center gap-2 text-[#3b6d11]">
                        <CheckCircle2 className="h-5 w-5" />
                        Analysis Complete
                      </div>
                      <Button className="mt-3 w-full" onClick={() => navigate(`/app/patient/analysis/${reportId ?? 'mock-report-id'}`)}>
                        View Report Analysis
                      </Button>
                    </div>
                  )}

                  {uploadState === 'error' && (
                    <div className="mt-4 rounded-md border border-[#efc7be] bg-[#faece7] p-4">
                      <p className="text-sm text-[#993c1d]">Upload failed. Please try a PDF or image file under 20MB.</p>
                      <Button className="mt-3" variant="danger" onClick={startAnalysis}>
                        Retry
                      </Button>
                    </div>
                  )}

                  {uploadState === 'idle' && (
                    <Button className="mt-4 w-full" onClick={startAnalysis}>
                      Analyze Report
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload.name} className="flex items-center justify-between rounded-md border border-[#d8e7f4] px-4 py-3">
                  <div>
                    <p className="font-medium text-[#2d4f68]">{upload.name}</p>
                    <p className="text-sm text-[#647c92]">{upload.date}</p>
                  </div>
                  <span className="rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-semibold text-[#3b6d11]">{upload.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};


