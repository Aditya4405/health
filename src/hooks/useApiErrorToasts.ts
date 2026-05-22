import { useEffect } from 'react';
import { toast } from 'sonner';

interface ApiErrorDetail {
  message: string;
  status?: number;
}

export const useApiErrorToasts = () => {
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ApiErrorDetail>).detail;
      if (!detail?.message) return;
      toast.error(detail.message);
    };

    window.addEventListener('api:error', handler);
    return () => window.removeEventListener('api:error', handler);
  }, []);
};

