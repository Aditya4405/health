import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page px-4 text-center">
    <p className="font-display text-6xl font-bold text-primary">404</p>
    <h1 className="font-display text-2xl font-semibold">Page not found</h1>
    <p className="max-w-md text-[#617a8f]">The page you requested does not exist. Return to the dashboard or homepage.</p>
    <div className="flex gap-2">
      <Link to="/">
        <Button variant="secondary">Go Home</Button>
      </Link>
      <Link to="/app">
        <Button>Go to App</Button>
      </Link>
    </div>
  </div>
);

