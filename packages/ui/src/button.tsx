import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 120ms ease, transform 120ms ease"
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "linear-gradient(180deg, rgba(91,140,255,0.95), rgba(42,91,255,0.9))",
    border: "1px solid rgba(91,140,255,0.5)"
  },
  secondary: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)"
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", style, disabled, ...props },
  ref
) {
  const mergedStyle: CSSProperties = {
    ...baseStyle,
    ...variants[variant],
    ...(disabled
      ? { cursor: "not-allowed", opacity: 0.6, transform: "none" }
      : { transform: "translateY(0px)" }),
    ...style
  };

  return <button ref={ref} {...props} disabled={disabled} style={mergedStyle} />;
});
