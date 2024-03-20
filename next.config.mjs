/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.MINIO_ENDPOINT,
        port: "9000",
      }
    ]
  },
  transpilePackages: ['@mdxeditor/editor'],
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
      topLevelAwait: true
    });
    // 添加别名解析
    return config;
  }
};

export default nextConfig;
