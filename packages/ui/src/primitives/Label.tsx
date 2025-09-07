import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  hint?: string;
};

export const Label = ({ className = "", hint, children, ...props }: LabelProps) => (
  <label
    className={["block text-sm font-medium text-slate-700", className].join(" ")}
    {...props}
  >
    {children}
    {hint ? <span className="ml-2 text-xs text-slate-500">{hint}</span> : null}
  </label>
);
