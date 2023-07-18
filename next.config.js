/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },

    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser';
        }
    
        return config;
      },
    output: 'export'
}

module.exports = nextConfig
