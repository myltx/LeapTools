"use client";

import type { TextareaHTMLAttributes } from "react";

export type LegacyTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function LegacyTextarea(props: LegacyTextareaProps) {
  return <textarea {...props} />;
}
