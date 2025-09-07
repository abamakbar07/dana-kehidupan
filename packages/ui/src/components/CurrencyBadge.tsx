import * as React from "react";

export const CurrencyBadge: React.FC<{ code: string; className?: string }>
  = ({ code, className = "" }) => (
  <span className={[
    "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700",
    className,
  ].join(" ")}>{code.toUpperCase()}</span>
);
