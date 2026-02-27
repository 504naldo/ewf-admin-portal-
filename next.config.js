/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper production builds
  reactStrictMode: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ewf-emergency-call-backend-production.up.railway.app',
  },
};

module.exports = nextConfig;
