'use strict';
/*
 * Copyright (c) 2023 by MILOSZ GILGA <https://miloszgilga.pl>
 * For check application license, check LICENSE file.
 */

const path = require('path');
const { DefinePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = isProd => ({
  entry: {
    app: [path.resolve(__dirname, '..', 'src', 'index.tsx')],
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: `js/__react.[${isProd ? 'contenthash:10' : 'name'}].bundle.js`,
    chunkFilename: `js/__react.[${
      isProd ? 'contenthash:10' : 'name'
    }].chunk.js`,
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules'],
    alias: {
      '~/app-algorithms': path.resolve(__dirname, '..', 'src', 'algorithms'),
      '~/app-components': path.resolve(__dirname, '..', 'src', 'components'),
      '~/app-hooks': path.resolve(__dirname, '..', 'src', 'hooks'),
      '~/app-pages': path.resolve(__dirname, '..', 'src', 'pages'),
      '~/app-redux': path.resolve(__dirname, '..', 'src', 'redux'),
      '~/app-router': path.resolve(__dirname, '..', 'src', 'router'),
      '~/app-utils': path.resolve(__dirname, '..', 'src', 'utils'),
      '~/app-styles': path.resolve(__dirname, '..', 'src', 'styles'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /\/node_modules\//,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                [
                  'babel-plugin-styled-components',
                  {
                    displayName: !isProd,
                    ssr: true,
                    fileName: isProd,
                  },
                ],
              ],
            },
          },
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!react|react-dom|react-router-dom).*/,
          name: 'vendors',
          chunks: 'all',
        },
        reactVendor: {
          test: /[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env.BUILD_ENV': JSON.stringify(isProd ? 'prod' : 'dev'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src', 'index.html'),
      minify: {
        removeComments: false,
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'src', 'assets'),
          to: path.resolve(__dirname, '..', 'dist', 'assets'),
        },
        {
          from: path.resolve(__dirname, '..', '.htaccess'),
          to: path.resolve(__dirname, '..', 'dist'),
        },
      ],
    }),
  ],
});