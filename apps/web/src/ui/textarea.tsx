"use client";

import type { ChangeEventHandler } from "react";
import { forwardRef } from "react";
import { Textarea as NextUITextarea } from "@nextui-org/react";

export type TextareaProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  className?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { value, onChange, placeholder, disabled, minRows, maxRows, className, inputClassName, inputWrapperClassName },
  ref
) {
  const fallbackAriaLabel =
    typeof placeholder === "string" && placeholder.trim() ? placeholder : "textarea";

  return (
    <NextUITextarea
      ref={ref as unknown as never}
      value={value}
      onChange={onChange as unknown as ChangeEventHandler<HTMLInputElement>}
      {...(placeholder === undefined ? {} : { placeholder })}
      aria-label={fallbackAriaLabel}
      {...(disabled === undefined ? {} : { isDisabled: disabled })}
      {...(minRows === undefined ? {} : { minRows })}
      {...(maxRows === undefined ? {} : { maxRows })}
      {...(className === undefined ? {} : { className })}
      classNames={{
        input: inputClassName,
        inputWrapper: inputWrapperClassName
      }}
    />
  );
});
