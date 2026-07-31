const path = require('node:path')
const rspack = require('@rspack/core')
const { ModuleFederationPlugin } = require('@module-federation/rspack')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  // Common is a Module Federation remote, not a standalone app.
  // The entry exists only to satisfy Rspack's bundling requirement.
  // The actual exports are declared in `exposes` below.
  entry: path.resolve(__dirname, './src/entry.tsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'auto',
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
            parser: { syntax: 'typescript', tsx: true },
            transform: {
              react: {
                runtime: 'automatic',
                development: isDev,
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
    new ModuleFederationPlugin({
      name: 'common',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components/index.ts',
        './tools': './src/tools/index.ts',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
          // eager: false — Shell is the only eager provider.
          // If both are eager, the first one to load wins, which may
          // not be Shell. Common's React stays as fallback that gets
          // overridden by Shell's React via shared scope.
          packageName: 'react',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
          packageName: 'react-dom',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.20.0',
          packageName: 'react-router-dom',
        },
      },
    }),
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
  },
  experiments: {
    outputModule: true,
  },
  devtool: isDev ? 'cheap-module-source-map' : false,
  performance: {
    hints: false,
  },
}
