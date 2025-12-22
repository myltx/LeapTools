"use client";

import type { CSSProperties, ChangeEventHandler } from "react";
import { forwardRef } from "react";
import { Textarea as NextUITextarea } from "@nextui-org/react";

export type TextareaProps = {
  value: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  disableAutosize?: boolean;
  minRows?: number;
  maxRows?: number;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  style?: CSSProperties;
  inputClassName?: string;
  inputWrapperClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    disableAutosize,
    minRows,
    maxRows,
    size = "md",
    variant,
    color,
    className,
    style,
    inputClassName,
    inputWrapperClassName
  },
  ref
) {
  const fallbackAriaLabel =
    typeof placeholder === "string" && placeholder.trim() ? placeholder : "textarea";

  return (
    <NextUITextarea
      ref={ref as unknown as never}
      value={value}
      {...(onChange === undefined ? {} : { onChange: onChange as unknown as ChangeEventHandler<HTMLInputElement> })}
      {...(placeholder === undefined ? {} : { placeholder })}
      aria-label={fallbackAriaLabel}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
      {...(disableAutosize === undefined ? {} : { disableAutosize })}
      {...(minRows === undefined ? {} : { minRows })}
      {...(maxRows === undefined ? {} : { maxRows })}
      size={size}
      {...(variant === undefined ? {} : { variant })}
      {...(color === undefined ? {} : { color })}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
      classNames={{
        input: inputClassName,
        inputWrapper: inputWrapperClassName
      }}
    />
  );
});
