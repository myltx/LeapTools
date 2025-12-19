"use client";

import type { CSSProperties, ReactNode } from "react";
import { Tab, Tabs as NextUITabs } from "@nextui-org/react";

export type TabsItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
};

export type TabsProps = {
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  items: TabsItem[];
  className?: string;
  style?: CSSProperties;
};

export function Tabs({ selectedKey, onSelectionChange, items, className, style }: TabsProps) {
  return (
    <NextUITabs
      selectedKey={selectedKey}
      onSelectionChange={(k) => {
        if (typeof k === "string") onSelectionChange(k);
      }}
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
