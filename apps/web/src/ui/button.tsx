"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as NextUIButton } from "@nextui-org/react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  variant?: ButtonVariant;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading, startIcon, endIcon, fullWidth, size = "md", ...props },
  ref
) {
  const mapped = (() => {
    if (variant === "secondary") {
      return { color: "default" as const, variant: "bordered" as const };
    }
    if (variant === "danger") {
      return { color: "danger" as const, variant: "solid" as const };
    }
    return { color: "primary" as const, variant: "solid" as const };
  })();

  return (
    <NextUIButton
      {...(props as unknown as object)}
      ref={ref}
      color={mapped.color}
      variant={mapped.variant}
      {...(loading === undefined ? {} : { isLoading: loading })}
      {...(startIcon === undefined ? {} : { startContent: startIcon })}
      {...(endIcon === undefined ? {} : { endContent: endIcon })}
      {...(fullWidth === undefined ? {} : { fullWidth })}
      size={size}
    />
  );
});
