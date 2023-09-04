/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "http://146.190.87.142:8000"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "146.190.87.142",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
