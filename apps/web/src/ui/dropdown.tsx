"use client";

import type { ComponentProps } from "react";
import {
  Dropdown as NextUIDropdown,
  DropdownItem as NextUIDropdownItem,
  DropdownMenu as NextUIDropdownMenu,
  DropdownSection as NextUIDropdownSection,
  DropdownTrigger as NextUIDropdownTrigger
} from "@nextui-org/react";

export type DropdownProps = ComponentProps<typeof NextUIDropdown>;
export function Dropdown(props: DropdownProps) {
  return <NextUIDropdown {...props} />;
}

export type DropdownTriggerProps = ComponentProps<typeof NextUIDropdownTrigger>;
export const DropdownTrigger = NextUIDropdownTrigger;

export type DropdownMenuProps = ComponentProps<typeof NextUIDropdownMenu>;
export const DropdownMenu = NextUIDropdownMenu;

export type DropdownItemProps = ComponentProps<typeof NextUIDropdownItem>;
export const DropdownItem = NextUIDropdownItem;

export type DropdownSectionProps = ComponentProps<typeof NextUIDropdownSection>;
export const DropdownSection = NextUIDropdownSection;
