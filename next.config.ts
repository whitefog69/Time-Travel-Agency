import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * TODO: replace image — placeholder art is served from Unsplash. When you
     * swap in your own images, either move them into `/public` (and delete
     * this block) or replace the hostname with your own CDN.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
