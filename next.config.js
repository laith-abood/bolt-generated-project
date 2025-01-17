const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com']
  },
  webpack: (config) => {
    // Handle Firebase and undici modules
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [
        /node_modules\/@firebase/,
        /node_modules\/firebase/,
        /node_modules\/undici/
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-property-in-object'
          ]
        }
      }
    });

    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, '.'),
      'components': path.join(__dirname, 'components'),
      'features': path.join(__dirname, 'features'),
      'lib': path.join(__dirname, 'lib'),
      'types': path.join(__dirname, 'types'),
      'shared': path.join(__dirname, 'shared')
    };

    return config;
  }
}

module.exports = nextConfig
