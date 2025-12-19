"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Input as NextUIInput } from "@nextui-org/react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, description, errorMessage, invalid, size = "md", ...props },
  ref
) {
  const ariaLabel = (props as Record<string, unknown>)["aria-label"];
  const ariaLabelledBy = (props as Record<string, unknown>)["aria-labelledby"];
  const hasA11yLabel = Boolean(label || ariaLabel || ariaLabelledBy);
  const fallbackAriaLabel =
    !hasA11yLabel && typeof props.placeholder === "string" && props.placeholder.trim()
      ? props.placeholder
      : undefined;

  return (
    <NextUIInput
      {...(props as unknown as object)}
      ref={ref}
      {...(fallbackAriaLabel ? { "aria-label": fallbackAriaLabel } : {})}
      {...(label === undefined ? {} : { label })}
      {...(description === undefined ? {} : { description })}
      {...(errorMessage === undefined ? {} : { errorMessage })}
      {...(invalid === undefined ? {} : { isInvalid: invalid })}
      size={size}
    />
  );
});
