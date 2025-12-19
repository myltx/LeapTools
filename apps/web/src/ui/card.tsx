"use client";

import type { ComponentProps } from "react";
import {
  Card as NextUICard,
  CardBody as NextUICardBody,
  CardFooter as NextUICardFooter,
  CardHeader as NextUICardHeader
} from "@nextui-org/react";

export type CardProps = ComponentProps<typeof NextUICard>;

export function Card(props: CardProps) {
  return <NextUICard shadow="none" {...props} />;
}

export const CardHeader = NextUICardHeader;
export const CardBody = NextUICardBody;
export const CardFooter = NextUICardFooter;
