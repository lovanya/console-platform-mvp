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
          // singleton: get from host's shared scope, no fallback bundle
          // packageName + version required for shared scope resolution
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
            packageName: 'react',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
            packageName: 'react-dom',
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.20.0',
            eager: true,
            packageName: 'react-router-dom',
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
      }),
    ],
    optimization: {
      splitChunks: false, // MF handles code splitting at runtime
    },
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
    },
    // Use cheap-module-source-map in dev (not eval-source-map which inlines)
    // This produces external .map files instead of 5MB inline data
    devtool: isDev ? 'cheap-module-source-map' : false,
    performance: {
      hints: false,
    },
  }
}
