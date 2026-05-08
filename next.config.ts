import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Force apex (scoutingreportafrica.com) — redirect www to root.
  // Vercel does this at the edge too, but having it here covers preview
  // builds and any environment where the domain config drifts.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.scoutingreportafrica.com" }],
        destination: "https://scoutingreportafrica.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a1.espncdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a2.espncdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
