"use client";

import type { ButtonHTMLAttributes } from "react";

export type LegacyButtonVariant = "primary" | "secondary";

export type LegacyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: LegacyButtonVariant;
};

export function LegacyButton({ variant = "secondary", className, ...props }: LegacyButtonProps) {
  const mergedClassName = [
    variant === "primary" ? "action-btn-primary" : "action-btn",
    "action-btn-inline",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <button {...props} className={mergedClassName} />;
}
