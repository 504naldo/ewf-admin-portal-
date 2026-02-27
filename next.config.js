/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper production builds
  reactStrictMode: true,
  
  // Disable static optimization for dynamic routes
  // This ensures all pages are server-rendered
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ewf-emergency-call-backend-production.up.railway.app',
  },
};

module.exports = nextConfig;
