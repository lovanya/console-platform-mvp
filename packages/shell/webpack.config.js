const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('@module-federation/enhanced')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: 'http://localhost:3000/',
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
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'shell',
        remotes: {
          ecs: isDev
            ? 'ecs@http://localhost:3001/remoteEntry.js'
            : 'ecs@https://cdn.console.aliyun.com/ecs/remoteEntry.js',
          common: isDev
            ? 'common@http://localhost:3002/remoteEntry.js'
            : 'common@https://cdn.console.aliyun.com/common/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.2.0', eager: true },
          'react-dom': { singleton: true, requiredVersion: '^18.2.0', eager: true },
          'react-router-dom': { singleton: true, requiredVersion: '^6.20.0' },
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
      }),
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
  }
}
