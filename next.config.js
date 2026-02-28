/** @type {import('next').NextConfig} */
process.env.NEXT_TELEMETRY_DISABLED = '1';

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig
