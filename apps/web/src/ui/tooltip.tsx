"use client";

import type { ComponentProps } from "react";
import { Tooltip as NextUITooltip } from "@nextui-org/react";

export type TooltipProps = ComponentProps<typeof NextUITooltip>;

export const Tooltip = NextUITooltip;
