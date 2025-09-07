import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors";
    const variants: Record<string, string> = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
    };
    const sizes: Record<string, string> = {
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-5 py-2.5 text-lg",
    };
    return (
      <button
        ref={ref}
        className={[base, variants[variant], sizes[size], className].join(" ")}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
