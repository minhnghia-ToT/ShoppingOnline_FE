/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7011",
        pathname: "/uploads/**",
      },
    ],

    // QUAN TRỌNG
    dangerouslyAllowLocalIP: true,
  },
};

module.exports = nextConfig;