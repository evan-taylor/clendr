/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        dirs: ['src'],
    },
    // Generate a unique build ID to prevent caching issues
    generateBuildId: async () => {
        return `build-${new Date().getTime()}`;
    },
    // Output static assets to a standard directory
    distDir: '.next',
    // Configure asset output settings to ensure correct paths
    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
    // Prevent the usage of stale assets
    onDemandEntries: {
        // period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 2,
    },
    // Ensure landing page works correctly with the intended domain
    // This will be useful when deploying to production
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        // Prevent caching issues with static assets
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig; 