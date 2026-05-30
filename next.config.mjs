import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (a parent lockfile exists too).
  outputFileTracingRoot: __dirname,
  // Keep the native SQLite addon out of the server bundle.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
