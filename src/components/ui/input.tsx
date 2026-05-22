import * as React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'focus-ring flex h-11 w-full rounded-sm border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[#8797a6] dark:bg-[#0f2d4a]',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };

