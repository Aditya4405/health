import { cn } from '@/utils/cn';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-md bg-[#dce7f1] dark:bg-[#1f3b58]', className)} />
);

