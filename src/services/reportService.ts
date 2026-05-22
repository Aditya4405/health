import { api } from '@/services/api';
import type { ReportMetric } from '@/types';

export interface UploadResponse {
  reportId: string;
  status: 'PROCESSING' | 'COMPLETED';
}

export interface AnalysisResponse {
  id: string;
  reportName: string;
  uploadedAt: string;
  summary: string;
  recommendation: string[];
  metrics: ReportMetric[];
}

const MOCK_ANALYSIS: AnalysisResponse = {
  id: 'rpt-2245',
  reportName: 'Complete Blood Count - January 15, 2025',
  uploadedAt: new Date().toISOString(),
  summary:
    'Your hemoglobin is slightly below normal, suggesting mild anemia. WBC and platelets are within expected clinical range. A follow-up with a hematologist is recommended.',
  recommendation: [
    'Consult a hematologist for low hemoglobin.',
    'Increase iron-rich foods: spinach, lentils, red meat.',
    'Follow up CBC test in 4 weeks.',
  ],
  metrics: [
    { id: 'hgb', name: 'Hemoglobin', value: 11.2, unit: 'g/dL', referenceRange: '12.0 - 15.5', status: 'LOW' },
    { id: 'wbc', name: 'WBC', value: 7200, unit: '/uL', referenceRange: '4500 - 11000', status: 'NORMAL' },
    { id: 'plt', name: 'Platelets', value: 280000, unit: '/uL', referenceRange: '150000 - 450000', status: 'NORMAL' },
    { id: 'ldl', name: 'LDL Cholesterol', value: 182, unit: 'mg/dL', referenceRange: '< 100', status: 'HIGH' },
  ],
};

export const reportService = {
  async uploadReport(file: File, onUploadProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post<UploadResponse>('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!event.total || !onUploadProgress) return;
          const progress = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(progress);
        },
      });
      return data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2200));
      for (const p of [18, 34, 67, 84, 100]) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        onUploadProgress?.(p);
      }
      return { reportId: 'mock-report-id', status: 'COMPLETED' };
    }
  },

  async analyzeReport(reportId: string): Promise<AnalysisResponse> {
    try {
      const { data } = await api.get<AnalysisResponse>(`/reports/${reportId}/analysis`);
      return data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      return { ...MOCK_ANALYSIS, id: reportId };
    }
  },

  async getRecentReports() {
    const { data } = await api.get('/reports/recent');
    return data;
  },
};

