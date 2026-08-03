import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets the dev server be reached from other devices on the same WiFi
  // (e.g. testing on an iPad/phone via the "Network" URL Next.js prints).
  allowedDevOrigins: ["192.168.1.70"],
};

export default nextConfig;
