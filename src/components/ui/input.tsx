import * as React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'focus-ring flex h-11 w-full rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 py-2 text-sm text-[var(--portal-text)] placeholder:text-[var(--portal-muted)]',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };

