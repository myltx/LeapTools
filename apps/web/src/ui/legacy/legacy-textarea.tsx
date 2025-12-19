"use client";

import type { TextareaHTMLAttributes } from "react";

export type LegacyTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function LegacyTextarea(props: LegacyTextareaProps) {
  const mergedClassName = ["legacy-field", props.className].filter(Boolean).join(" ");
  return <textarea {...props} className={mergedClassName} />;
}
