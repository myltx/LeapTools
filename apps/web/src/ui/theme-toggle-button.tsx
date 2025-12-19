"use client";

import { useTheme } from "next-themes";
import { useIsMounted } from "@leaptools/hooks";
import { Button } from "./button";

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="切换主题"
    >
      {isDark ? "浅色" : "深色"}
    </Button>
  );
}
