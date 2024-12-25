import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["bctn-sao.s3.amazonaws.com"], // Add the domain to the list
  },
};

export default nextConfig;
