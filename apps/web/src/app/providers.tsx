"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UIProvider } from "@leaptools/ui";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return <UIProvider navigate={router.push}>{children}</UIProvider>;
}
