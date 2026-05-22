import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'focus-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-[#2d7fcf] shadow-card',
        secondary: 'bg-white text-navy border border-[#d6e2ee] hover:bg-[#eef5fc]',
        ghost: 'bg-transparent text-navy hover:bg-[#e8f0f8] dark:text-white dark:hover:bg-white/10',
        outline: 'border border-primary text-primary hover:bg-[#eaf3fb]',
        danger: 'bg-[#e24b4a] text-white hover:bg-[#d73c3b]',
        success: 'bg-teal text-white hover:bg-[#158863]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

