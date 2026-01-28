import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'standalone',
    images: {
      remotePatterns: [new URL('http://localhost:8080/assets/images/**'),
          new URL('http://localhost:8080/*')] // Not sure why this is needed, but it won't work without it
    }
};

export default nextConfig;
