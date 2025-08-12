import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com', // Domain yang sudah ada
        port: '',
        pathname: '/**',
      },
      // 👇 Tambahkan pola baru untuk Unsplash di sini
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Domain dari error sebelumnya
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;