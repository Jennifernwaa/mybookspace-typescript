import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: [
      "covers.openlibrary.org",
      // add more domains if needed
    ],
  },
};

export default nextConfig;
