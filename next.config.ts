import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbopack: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.json'
  },
  eslint: {
    dirs: ['app', 'lib', 'automation']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      }
    ]
  }
}

export default nextConfig 