import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-[#e6f1fb] text-primary',
      teal: 'bg-[#ddf4ed] text-[#0b6c4f]',
      warning: 'bg-[#faeeda] text-[#854f0b]',
      danger: 'bg-[#faece7] text-[#993c1d]',
      success: 'bg-[#eaf3de] text-[#3b6d11]',
      outline: 'border border-[#bfd4e8] text-[#355772]',
      purple: 'bg-[#eeedfe] text-[#4a439f]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

