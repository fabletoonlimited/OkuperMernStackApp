/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com'
      },
    ],
  },
  turbopack: {
    // Enable Turbopack settings here if needed in the future
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Explicitly ignore the fs module on the client-side
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
