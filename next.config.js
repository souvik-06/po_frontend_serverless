/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     domains: ['i.pravatar.cc'],
//   },
// };
// module.exports = nextConfig;
const runtimeCaching = require('next-pwa/cache');

const nextConfig = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  mode: 'production',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
});
module.exports = nextConfig({
  buildTimeout: 600000,
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
});

// module.exports = withPWA({});
