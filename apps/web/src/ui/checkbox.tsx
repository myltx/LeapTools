"use client";

import type { ReactNode } from "react";
import { Checkbox as NextUICheckbox } from "@nextui-org/react";

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Checkbox({ checked, onCheckedChange, disabled, className, children }: CheckboxProps) {
  return (
    <NextUICheckbox
      isSelected={checked}
      onValueChange={onCheckedChange}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(className === undefined ? {} : { className })}
    >
      {children}
    </NextUICheckbox>
  );
}
