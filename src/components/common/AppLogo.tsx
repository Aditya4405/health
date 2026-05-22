import { ActivitySquare } from 'lucide-react';
import { cn } from '@/utils/cn';

export const AppLogo = ({ compact = false, className }: { compact?: boolean; className?: string }) => (
  <div className={cn('inline-flex items-center gap-2', className)}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white shadow-md backdrop-blur-sm">
      <ActivitySquare className="h-5 w-5" />
    </span>
    {!compact && <span className="font-display text-lg font-semibold tracking-tight text-white">MediScan AI</span>}
  </div>
);

