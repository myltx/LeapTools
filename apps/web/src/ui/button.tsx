"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as NextUIButton } from "@nextui-org/react";

export type ButtonVariant = "primary" | "secondary" | "danger";
type NextUIButtonAppearance = "solid" | "bordered" | "light" | "flat";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  variant?: ButtonVariant;
  appearance?: NextUIButtonAppearance;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    appearance,
    loading,
    startIcon,
    endIcon,
    iconOnly,
    fullWidth,
    size = "md",
    ...props
  },
  ref
) {
  const mapped = (() => {
    if (variant === "secondary") {
      return { color: "default" as const, variant: (appearance ?? "bordered") as NextUIButtonAppearance };
    }
    if (variant === "danger") {
      return { color: "danger" as const, variant: (appearance ?? "solid") as NextUIButtonAppearance };
    }
    return { color: "primary" as const, variant: (appearance ?? "solid") as NextUIButtonAppearance };
  })();

  return (
    <NextUIButton
      {...(props as unknown as object)}
      ref={ref}
      color={mapped.color}
      variant={mapped.variant}
      {...(iconOnly === undefined ? {} : { isIconOnly: iconOnly })}
      {...(loading === undefined ? {} : { isLoading: loading })}
      {...(startIcon === undefined ? {} : { startContent: startIcon })}
      {...(endIcon === undefined ? {} : { endContent: endIcon })}
      {...(fullWidth === undefined ? {} : { fullWidth })}
      size={size}
    />
  );
});
