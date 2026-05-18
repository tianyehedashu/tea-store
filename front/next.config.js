const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 缓存配置优化
  experimental: {
    staleTimes:
      process.env.NODE_ENV === "development"
        ? {
            dynamic: 0, // 开发环境：禁用动态页面缓存
            static: 0, // 开发环境：禁用静态页面缓存
          }
        : {
            dynamic: 30, // 生产环境：动态页面缓存 30 秒
            static: 180, // 生产环境：静态页面缓存 3 分钟
          },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "tea.leodennis.top",
      },
      {
        protocol: "http",
        hostname: "149.28.118.59",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

module.exports = nextConfig
