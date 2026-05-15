import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // @react-oauth/google calls GSI initialize() in an effect with no cleanup for the
  // button path; React Strict Mode runs that effect twice in dev and breaks the button.
  reactStrictMode: false,
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
};

export default nextConfig;
