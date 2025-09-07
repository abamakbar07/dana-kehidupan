import * as React from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={[
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
