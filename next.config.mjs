import { readFileSync } from 'node:fs'
const legacyRedirects = JSON.parse(readFileSync(new URL('./lib/legacy-redirects.json', import.meta.url), 'utf8'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() { return legacyRedirects },
  poweredByHeader: false,
  compress: true,
  pageExtensions: ['ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['next-mdx-remote'],
  },
}

export default nextConfig
