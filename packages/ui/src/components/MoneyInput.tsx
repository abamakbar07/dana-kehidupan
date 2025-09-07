import * as React from "react";
import { Input, InputProps } from "../primitives/Input";

export type MoneyInputProps = Omit<InputProps, "onChange" | "value"> & {
  value?: number; // minor units
  onChange?: (value: number) => void;
};

export const MoneyInput = ({ value = 0, onChange, ...props }: MoneyInputProps) => {
  const [text, setText] = React.useState<string>((value / 100).toFixed(2));
  React.useEffect(() => {
    setText((value / 100).toFixed(2));
  }, [value]);
  return (
    <Input
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        const n = Number(t.replace(/[^0-9.]/g, ""));
        if (!Number.isNaN(n) && onChange) onChange(Math.round(n * 100));
      }}
      {...props}
    />
  );
};
