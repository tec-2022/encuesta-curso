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
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            // Default: Navy Blue
            "bg-blue-900 text-white hover:bg-blue-800 focus-visible:ring-blue-900": variant === 'default',
            // Destructive: Red
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600": variant === 'destructive',
            // Outline: Navy Border
            "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-blue-900": variant === 'outline',
            // Secondary: Light gold or light grey/blue
            "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500": variant === 'secondary',
            // Ghost: Text-only hoverbg
            "hover:bg-slate-100 text-slate-700 hover:text-slate-900": variant === 'ghost',
            // Link: Underlined text
            "text-blue-900 underline-offset-4 hover:underline": variant === 'link',
          },
          {
            "h-10 px-4 py-2": size === 'default',
            "h-9 rounded-md px-3": size === 'sm',
            "h-11 rounded-md px-8": size === 'lg',
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
