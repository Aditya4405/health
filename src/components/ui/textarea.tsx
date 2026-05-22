import * as React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'focus-ring min-h-[96px] w-full rounded-md border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm placeholder:text-[#8797a6] dark:bg-[#0f2d4a]',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };

