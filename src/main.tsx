import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from '@/App';
import '@/index.css';
import { AppProviders } from '@/context/AppProviders';
import { useApiErrorToasts } from '@/hooks/useApiErrorToasts';

const AppRoot = () => {
  useApiErrorToasts();

  return (
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
    </AppProviders>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);

