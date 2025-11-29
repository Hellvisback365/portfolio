/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    qualities: [50, 70, 75, 80, 85, 90, 95, 100],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // experimental: {
  //   scrollRestoration: true,
  // },
};

module.exports = nextConfig;