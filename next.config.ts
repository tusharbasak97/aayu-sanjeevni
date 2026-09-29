import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OWASP A05: Disable X-Powered-By header to minimize information disclosure
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Enable server-side Sharp and FFmpeg processing
  serverExternalPackages: ["sharp", "fluent-ffmpeg"],

  // OWASP Top 10 Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // OWASP: Clickjacking prevention
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // OWASP: MIME-sniffing prevention
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
