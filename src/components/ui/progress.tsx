import { cn } from '@/utils/cn';

export const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn('h-3 w-full overflow-hidden rounded-full bg-[#d7e8f8]', className)}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-[#378ADD] to-[#6aa7e5] transition-all duration-500"
      style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
    />
  </div>
);

