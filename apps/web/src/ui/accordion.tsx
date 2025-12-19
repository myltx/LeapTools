"use client";

import type { CSSProperties, ReactNode } from "react";
import type { AccordionProps as NextUIAccordionProps } from "@nextui-org/react";
import { Accordion as NextUIAccordion, AccordionItem as NextUIAccordionItem } from "@nextui-org/react";
import { usePrefersReducedMotion } from "@leaptools/hooks";

export type AccordionItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
  ariaLabel?: string;
};

export type AccordionProps = {
  items: AccordionItem[];
  defaultExpandedKeys?: string[];
  disableAnimation?: boolean;
  motionProps?: NextUIAccordionProps["motionProps"];
  className?: string;
  style?: CSSProperties;
};

export function Accordion({
  items,
  defaultExpandedKeys,
  disableAnimation,
  motionProps,
  className,
  style
}: AccordionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const disableAnimationResolved = disableAnimation ?? prefersReducedMotion;

  return (
    <NextUIAccordion
      {...(defaultExpandedKeys ? { defaultExpandedKeys: new Set(defaultExpandedKeys) } : {})}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
      selectionMode="multiple"
      disableAnimation={disableAnimationResolved}
      {...(disableAnimationResolved || motionProps === undefined ? {} : { motionProps })}
    >
      {items.map((item) => (
        <NextUIAccordionItem key={item.key} aria-label={item.ariaLabel ?? String(item.title)} title={item.title}>
          {item.content}
        </NextUIAccordionItem>
      ))}
    </NextUIAccordion>
  );
}
