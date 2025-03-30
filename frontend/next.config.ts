import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    swcMinify: true,

    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    /* config options here */
}

export default nextConfig
