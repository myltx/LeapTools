"use client";

import type { CSSProperties, ReactNode } from "react";
import { Accordion as NextUIAccordion, AccordionItem as NextUIAccordionItem } from "@nextui-org/react";

export type AccordionItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
  ariaLabel?: string;
};

export type AccordionProps = {
  items: AccordionItem[];
  defaultExpandedKeys?: string[];
  className?: string;
  style?: CSSProperties;
};

export function Accordion({ items, defaultExpandedKeys, className, style }: AccordionProps) {
  return (
    <NextUIAccordion
      {...(defaultExpandedKeys ? { defaultExpandedKeys: new Set(defaultExpandedKeys) } : {})}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
      selectionMode="multiple"
    >
      {items.map((item) => (
        <NextUIAccordionItem key={item.key} aria-label={item.ariaLabel ?? String(item.title)} title={item.title}>
          {item.content}
        </NextUIAccordionItem>
      ))}
    </NextUIAccordion>
  );
}
