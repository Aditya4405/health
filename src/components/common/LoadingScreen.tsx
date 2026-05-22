import { Skeleton } from '@/components/ui/skeleton';

export const LoadingScreen = () => (
  <div className="space-y-5 p-6">
    <Skeleton className="h-9 w-56" />
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <Skeleton className="h-72 w-full" />
  </div>
);

