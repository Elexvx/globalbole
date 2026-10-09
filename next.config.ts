import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Share cacheable stylesheets instead of duplicating CSS in every HTML/RSC file.
};

export default nextConfig;
