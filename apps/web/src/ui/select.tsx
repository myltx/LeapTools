"use client";

import { Select as NextUISelect, SelectItem } from "@nextui-org/react";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
};

export function Select({ value, onChange, options, disabled, label, placeholder, className }: SelectProps) {
  const fallbackAriaLabel = label ?? placeholder ?? "select";

  return (
    <NextUISelect
      selectedKeys={new Set([value])}
      onSelectionChange={(keys) => {
        if (keys === "all") return;
        const next = Array.from(keys)[0];
        if (typeof next === "string") onChange(next);
      }}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(label === undefined ? {} : { label })}
      {...(placeholder === undefined ? {} : { placeholder })}
      {...(className === undefined ? {} : { className })}
      aria-label={fallbackAriaLabel}
      selectionMode="single"
      disallowEmptySelection
    >
      {options.map((opt) => (
        <SelectItem key={opt.value}>{opt.label}</SelectItem>
      ))}
    </NextUISelect>
  );
}
