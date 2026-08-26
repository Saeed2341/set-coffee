/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
    appDir: true,
    serverActions: true,
    viewTransition: true,
  },
  allowedDevOrigins: ["192.168.113.50"],
};

module.exports = nextConfig;
