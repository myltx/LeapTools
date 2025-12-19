"use client";

import type { ComponentProps } from "react";
import { ButtonGroup as NextUIButtonGroup } from "@nextui-org/react";

export type ButtonGroupProps = ComponentProps<typeof NextUIButtonGroup>;

export function ButtonGroup(props: ButtonGroupProps) {
  return <NextUIButtonGroup {...props} />;
}
