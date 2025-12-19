"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as NextUILink } from "@nextui-org/react";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextUILink href={href} {...(props as unknown as object)}>
      {children}
    </NextUILink>
  );
}
