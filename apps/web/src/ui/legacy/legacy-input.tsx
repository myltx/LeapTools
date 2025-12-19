"use client";

import type { InputHTMLAttributes } from "react";

export type LegacyInputProps = InputHTMLAttributes<HTMLInputElement>;

export function LegacyInput(props: LegacyInputProps) {
  const mergedClassName = ["legacy-field", props.className].filter(Boolean).join(" ");
  return <input {...props} className={mergedClassName} />;
}
