/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost'],
    },
    env: {
        NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === 'production'
            ? 'https://app.clendr.com'
            : 'http://localhost:3000'
    }
}

module.exports = nextConfig 