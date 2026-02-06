import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'standalone',
    images: {
        unoptimized: true,
      remotePatterns: [new URL('http://localhost:8080/assets/images/**'),
          new URL('http://localhost:8080/*'),
          {
              protocol: 'http',
              hostname: 'localbooru-be', // Docker service name
              port: '8080',
              pathname: '/assets/images/**',

          },
          new URL(process.env.NEXT_PUBLIC_API_URL + "*" || 'https://localhost:8081'),
          ]
        // Not sure why this is needed, but it won't work without it

    }
};

export default nextConfig;
