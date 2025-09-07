import * as React from "react";

export const PeriodPicker: React.FC<{
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
  onChange: (s: string, e: string) => void;
}> = ({ start, end, onChange }) => {
  const [s, setS] = React.useState(start ?? new Date().toISOString().slice(0, 10));
  const [e, setE] = React.useState(end ?? new Date().toISOString().slice(0, 10));
  React.useEffect(() => onChange(s, e), [s, e]);
  return (
    <div className="flex items-center gap-2">
      <input className="rounded border px-2 py-1" type="date" value={s} onChange={(ev) => setS(ev.target.value)} />
      <span>→</span>
      <input className="rounded border px-2 py-1" type="date" value={e} onChange={(ev) => setE(ev.target.value)} />
    </div>
  );
};
