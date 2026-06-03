import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-blue-950 text-white hover:bg-blue-900 focus-visible:ring-blue-950": variant === 'default',
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600": variant === 'destructive',
            "border border-blue-100 bg-white/90 hover:bg-blue-50 text-slate-700 focus-visible:ring-blue-950": variant === 'outline',
            "bg-blue-50 text-blue-950 hover:bg-blue-100 focus-visible:ring-blue-200": variant === 'secondary',
            "hover:bg-white/70 text-slate-700 hover:text-blue-950": variant === 'ghost',
            "text-blue-950 underline-offset-4 hover:underline": variant === 'link',
          },
          {
            "h-10 px-4 py-2": size === 'default',
            "h-9 rounded-lg px-3": size === 'sm',
            "h-11 rounded-xl px-8": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
