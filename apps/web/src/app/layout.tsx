import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NexusTools Pro",
  description: "专业开发者工具工作台"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
