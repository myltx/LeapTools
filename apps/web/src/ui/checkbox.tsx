"use client";

import type { CSSProperties, ReactNode } from "react";
import { Checkbox as NextUICheckbox } from "@nextui-org/react";

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Checkbox({ checked, onCheckedChange, disabled, className, style, children }: CheckboxProps) {
  return (
    <NextUICheckbox
      isSelected={checked}
      onValueChange={onCheckedChange}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
    >
      {children}
    </NextUICheckbox>
  );
}
