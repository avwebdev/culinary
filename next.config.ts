import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.imghippo.com", "images.unsplash.com"],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
