"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Button as NextUIButton } from "@nextui-org/react";
import type { ButtonVariant } from "./button";

type NextUIButtonAppearance = "solid" | "bordered" | "light" | "flat";

export type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  appearance?: NextUIButtonAppearance;
  loading?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  appearance,
  loading,
  ...props
}: ButtonLinkProps) {
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
      as="a"
      href={href}
      color={mapped.color}
      variant={mapped.variant}
      {...(loading === undefined ? {} : { isLoading: loading })}
      {...(props as unknown as object)}
    >
      {children}
    </NextUIButton>
  );
}
