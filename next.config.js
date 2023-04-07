/** @type {import('next').NextConfig} */

// Deploying to github pages requires a prefix for all static paths
const gitDeploy = process.env.GITHUB_DEPLOY != null;

const nextConfig = {
  assetPrefix: gitDeploy
    ? `/${process.env.GITHUB_REPO_NAME ?? 'BAD_REPO'}/`
    : '',
  // Hack to retain copy of wasm files in `.next/static/wasm`
  // Looks like we no longer need this (?)
  // cleanDistDir: false,
  experimental: {},
  // Taken from NextJS wasm example
  webpack(config, { isServer, dev }) {
    // In prod mode and in the server bundle (the place where this "chunks" bug
    // appears), use the client static directory for the same .wasm bundle
    config.output.webassemblyModuleFilename =
      isServer && !dev ? '../static/wasm/[id].wasm' : 'static/wasm/[id].wasm';

    // Ensure the filename for the .wasm bundle is the same on both the client
    // and the server (as in any other mode the ID's won't match)
    config.optimization.moduleIds = 'named';

    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },

  output: 'export',
};

module.exports = nextConfig;
