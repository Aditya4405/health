import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | MediScan AI`;
    return () => {
      document.title = previous;
    };
  }, [title]);
};

