"use client";

import type { CSSProperties } from "react";
import { Slider as NextUISlider } from "@nextui-org/react";

export type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  formatOptions?: Intl.NumberFormatOptions;
  className?: string;
  style?: CSSProperties;
};

export function Slider({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  label,
  formatOptions,
  className,
  style
}: SliderProps) {
  return (
    <NextUISlider
      value={value}
      onChange={(v) => {
        if (typeof v === "number") onChange(v);
      }}
      minValue={min}
      maxValue={max}
      {...(step === undefined ? {} : { step })}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(label === undefined ? {} : { label })}
      aria-label={label ?? "slider"}
      {...(formatOptions === undefined ? {} : { formatOptions })}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
    />
  );
}
