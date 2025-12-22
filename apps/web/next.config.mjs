import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const turbopackRoot = resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  transpilePackages: ["@leaptools/hooks", "@leaptools/utils", "@leaptools/api", "@leaptools/config"],
  turbopack: {
    root: turbopackRoot
  },
  experimental: {
    externalDir: true
  }
};

export default nextConfig;
