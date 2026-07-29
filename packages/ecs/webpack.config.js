const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('@module-federation/enhanced')

module.exports = (_env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
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
        name: 'ecs',
        filename: 'remoteEntry.js',
        exposes: {
          './routes': './src/router.tsx',
          './InstanceTable': './src/components/InstanceTable.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.2.0', eager: true },
          'react-dom': { singleton: true, requiredVersion: '^18.2.0', eager: true },
          'react-router-dom': { singleton: true, requiredVersion: '^6.20.0', eager: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
      }),
    ],
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
  }
}
