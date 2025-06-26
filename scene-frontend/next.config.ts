import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
const nextConfig: NextConfig = {
  images: {
    domains: [
      "wallpapers.com",
      "s7ap1.scene7.com",
      "media.gettyimages.com",
      "github.com",
      "lh3.googleusercontent.com",
      "plus.unsplash.com",
      "localhost:8000"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //         {
  //           key: "X-Frame-Options",
  //           value: "DENY",
  //         },
  //         {
  //           key: "Referrer-Policy",
  //           value: "strict-origin-when-cross-origin",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/sw.js",
  //       headers: [
  //         {
  //           key: "Content-Type",
  //           value: "application/javascript; charset=utf-8",
  //         },
  //         {
  //           key: "Cache-Control",
  //           value: "no-cache, no-store, must-revalidate",
  //         },
  //         {
  //           key: "Content-Security-Policy",
  //           value: "default-src 'self'; script-src 'self'",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // cacheOnNavigation: true,
  // disable: false,
});

export default withSerwist({
  ...nextConfig,
});
// export default nextConfig;