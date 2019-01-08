const webpack = require('webpack')
const { join, resolve } = require('path')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const phaserPath = join(__dirname, '/node_modules/phaser/dist/phaser.js')
const srcPath = join(__dirname, 'src')
const distPath = resolve(__dirname, 'www')

module.exports = {
  entry: join(srcPath, 'index.ts'),
  output: {
    filename: '[name].bundle.js',
    path: distPath
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.sass$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  devServer: {
    // serve assets from dist
    contentBase: distPath,
    // не показывает инфу а bundle
    noInfo: true,
    // overlay с ошибками
    overlay: true
  },
  plugins: [
    new CleanWebpackPlugin([distPath]),
    new HtmlWebpackPlugin({
      title: 'My page',
      template: join(srcPath, 'index.html')
    }),
    new CopyWebpackPlugin([
      // copy all assets to dist
      {
        from: join(srcPath, 'assets'),
        to: join(distPath, 'assets')
      },
    ])
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaserPath,
      '~': srcPath
    }
  }
}
