"use client";

import type { InputHTMLAttributes } from "react";

export type LegacyInputProps = InputHTMLAttributes<HTMLInputElement>;

export function LegacyInput(props: LegacyInputProps) {
  return <input {...props} />;
}
