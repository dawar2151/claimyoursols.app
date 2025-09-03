/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    };
    config.externals.push("encoding");

    return config;
  },
  async redirects() {
    return [
      // Redirect non-www to www (specific root)
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "claimyoursols.app",
          },
        ],
        destination: "https://www.claimyoursols.app/",
        permanent: true,
      },
      // Redirect non-www to www (all paths)
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "claimyoursols.app",
          },
        ],
        destination: "https://www.claimyoursols.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
