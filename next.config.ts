import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Vercelビルド時にESLint警告でビルドを停止しない
    ignoreDuringBuilds: false,
  },
  typescript: {
    // TypeScript型チェックエラーでビルドを停止しない（開発用）
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
