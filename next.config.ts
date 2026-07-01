import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/patients",
        destination: "/permintaan",
        permanent: true,
      },
      {
        source: "/appointments",
        destination: "/laporan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
