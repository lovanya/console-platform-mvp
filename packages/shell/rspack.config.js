const path = require('path')
const rspack = require('@rspack/core')
const { ModuleFederationPlugin } = require('@module-federation/rspack')

// NODE_ENV=production AND no PREVIEW_LOCAL flag → use CDN URLs (real production)
// PREVIEW_LOCAL=1 OR NODE_ENV != 'production' → use localhost URLs (dev or local preview)
const isDev = process.env.NODE_ENV !== 'production' || process.env.PREVIEW_LOCAL === '1'

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    // Use '/' instead of 'auto' so script src is absolute.
    // 'auto' doesn't work reliably when serving from a deep path
    // (e.g., /products/slb) with a static file server.
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                // Use production JSX runtime even in dev mode to avoid
                // react-jsx-dev-runtime module-init edge cases with MF shared singleton
                development: false,
                refresh: false,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    // Force React to load the production JSX runtime even in dev mode.
    // React 18.3's .development.js variants have edge cases that
    // trigger 'Cannot read properties of undefined (reading call)'
    // during module init when MF shared singleton is involved.
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        ecs: isDev
          ? 'ecs@http://localhost:3001/remoteEntry.js'
          : 'ecs@https://cdn.console.aliyun.com/ecs/remoteEntry.js',
        common: isDev
          ? 'common@http://localhost:3002/remoteEntry.var.js'
          : 'common@https://cdn.console.aliyun.com/common/remoteEntry.var.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0', eager: true },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0', eager: true },
        'react-router-dom': { singleton: true, requiredVersion: '^6.20.0' },
      },
    }),
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  experiments: {
    outputModule: true,
  },
  devtool: isDev ? 'cheap-module-source-map' : false,
}