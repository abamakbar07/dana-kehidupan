import * as React from "react";

type Tag = { id: string; name: string; color?: string };

export const TagPicker: React.FC<{
  available: Tag[];
  value: string[];
  onChange: (ids: string[]) => void;
}> = ({ available, value, onChange }) => {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {available.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => toggle(t.id)}
          className={[
            "rounded-full border px-2 py-0.5 text-xs",
            value.includes(t.id) ? "bg-blue-600 text-white border-blue-600" : "border-slate-300",
          ].join(" ")}
          aria-pressed={value.includes(t.id)}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
};
