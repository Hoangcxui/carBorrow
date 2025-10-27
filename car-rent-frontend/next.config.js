/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7000',
        pathname: '/uploads/**',
      }
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://localhost:7000/api',
  },
}

module.exports = nextConfig