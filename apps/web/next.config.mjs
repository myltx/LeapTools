/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  transpilePackages: ["@my-app/ui", "@my-app/hooks", "@my-app/utils", "@my-app/api", "@my-app/config"],
  experimental: {
    externalDir: true
  }
};

export default nextConfig;
