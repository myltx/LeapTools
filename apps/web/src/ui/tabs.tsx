"use client";

import type { CSSProperties, ReactNode } from "react";
import type { TabsProps as NextUITabsProps } from "@nextui-org/react";
import { Tab, Tabs as NextUITabs } from "@nextui-org/react";
import { usePrefersReducedMotion } from "@leaptools/hooks";

export type TabsItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
};

export type TabsProps = {
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  items: TabsItem[];
  disableAnimation?: boolean;
  disableCursorAnimation?: boolean;
  motionProps?: NextUITabsProps["motionProps"];
  className?: string;
  style?: CSSProperties;
};

export function Tabs({
  selectedKey,
  onSelectionChange,
  items,
  disableAnimation,
  disableCursorAnimation,
  motionProps,
  className,
  style
}: TabsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const disableAnimationResolved = disableAnimation ?? prefersReducedMotion;

  return (
    <NextUITabs
      selectedKey={selectedKey}
      onSelectionChange={(k) => {
        if (typeof k === "string") onSelectionChange(k);
      }}
      disableAnimation={disableAnimationResolved}
      {...(disableCursorAnimation === undefined ? {} : { disableCursorAnimation })}
      {...(disableAnimationResolved
        ? {}
        : {
            motionProps:
              motionProps ??
              ({
                transition: { type: "spring", bounce: 0, duration: 0.22 }
              } satisfies NextUITabsProps["motionProps"])
          })}
      {...(className === undefined ? {} : { className })}
      {...(style === undefined ? {} : { style })}
    >
      {items.map((item) => (
        <Tab key={item.key} title={item.title}>
          {item.content}
        </Tab>
      ))}
    </NextUITabs>
  );
}
