import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and finds
  // an unrelated package-lock.json in the user's home directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Dev only. Next treats 127.0.0.1 as cross-origin to localhost and
  // blocks /_next/* dev resources, which silently breaks dynamic
  // imports (the 3D scene chunk never resolves).
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Contributor avatars on /open-source. Next validates remote src
    // against this list even when a request is marked unoptimized.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
