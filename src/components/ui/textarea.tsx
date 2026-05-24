import * as React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'focus-ring min-h-[96px] w-full rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 py-2 text-sm text-[var(--portal-text)] placeholder:text-[var(--portal-muted)]',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };

