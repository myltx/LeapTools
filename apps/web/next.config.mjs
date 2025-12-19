/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  transpilePackages: ["@leaptools/hooks", "@leaptools/utils", "@leaptools/api", "@leaptools/config"],
  experimental: {
    externalDir: true
  }
};

export default nextConfig;
