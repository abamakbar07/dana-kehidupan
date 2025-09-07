import * as React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => (
  <div className={["animate-pulse rounded-md bg-slate-200", className].join(" ")} />
);
