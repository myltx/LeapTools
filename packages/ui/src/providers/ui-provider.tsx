"use client";

import type { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type UIProviderProps = {
  children: ReactNode;
  navigate?: (href: string) => void;
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
  storageKey?: string;
};

export function UIProvider({
  children,
  navigate,
  defaultTheme = "light",
  enableSystem = false,
  storageKey = "theme"
}: UIProviderProps) {
  const nextUINavigation =
    navigate == null
      ? undefined
      : ((path: string, _routerOptions?: unknown) => {
          navigate(path);
        });

  return (
    <NextUIProvider {...(nextUINavigation ? { navigate: nextUINavigation } : {})}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        storageKey={storageKey}
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
