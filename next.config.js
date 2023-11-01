/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        port: '',
        // pathname: '/**',
      },
    ],
  },
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
