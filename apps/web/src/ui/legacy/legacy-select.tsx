"use client";

import type { SelectHTMLAttributes } from "react";

export type LegacySelectOption = {
  value: string;
  label: string;
};

export type LegacySelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  options: LegacySelectOption[];
};

export function LegacySelect({ value, onChange, options, ...props }: LegacySelectProps) {
  return (
    <select
      {...props}
      className={["legacy-field", props.className].filter(Boolean).join(" ")}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
