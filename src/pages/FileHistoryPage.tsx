import { Clock3, Download, FileText, Search } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';

const files = [
  { id: 'f1', name: 'CBC-Jan-2025.pdf', uploaded: '2 days ago', type: 'Blood Test', size: '1.4MB', status: 'Analyzed' },
  { id: 'f2', name: 'Lipid-Dec-2024.pdf', uploaded: '3 weeks ago', type: 'Cholesterol', size: '2.1MB', status: 'Analyzed' },
  { id: 'f3', name: 'Thyroid-Nov-2024.png', uploaded: '6 weeks ago', type: 'Hormones', size: '700KB', status: 'Analyzed' },
  { id: 'f4', name: 'Metabolic-Oct-2024.pdf', uploaded: '2 months ago', type: 'Metabolic', size: '1.8MB', status: 'Archived' },
];

export const FileHistoryPage = () => {
  usePageTitle('My Reports');

  return (
    <DashboardLayout title="My Reports">
      <PageTransition>
        <div className="space-y-5">
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d8296]" />
                <Input placeholder="Search report files..." className="pl-9" />
              </div>
              <Button>Upload New Report</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#d9e7f3] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#e6f1fb] text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-[#2d4f68]">{file.name}</p>
                      <p className="mt-1 inline-flex items-center gap-3 text-sm text-[#60758a]">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-4 w-4" /> {file.uploaded}
                        </span>
                        <span>{file.type}</span>
                        <span>{file.size}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={file.status === 'Analyzed' ? 'success' : 'outline'}>{file.status}</Badge>
                    <Button size="sm" variant="secondary">
                      <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                    <Button size="sm">View Analysis</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

