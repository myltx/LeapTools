"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export type HiddenFileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  onFilesSelected: (files: File[]) => void;
};

export const HiddenFileInput = forwardRef<HTMLInputElement, HiddenFileInputProps>(function HiddenFileInput(
  { onFilesSelected, ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      type="file"
      style={{ display: "none", ...(props.style ?? {}) }}
      onChange={(e) => {
        const list = Array.from(e.target.files ?? []);
        onFilesSelected(list);
        e.currentTarget.value = "";
      }}
    />
  );
});
