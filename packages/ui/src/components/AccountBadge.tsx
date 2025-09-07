import * as React from "react";

export const AccountBadge: React.FC<{ name: string; type?: string }>= ({ name, type }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-xs">
    <span className="font-medium">{name}</span>
    {type ? <span className="text-slate-500">({type})</span> : null}
  </span>
);
