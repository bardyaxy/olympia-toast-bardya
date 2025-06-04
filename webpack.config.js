const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './scripts/app.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'assets'),
    filename: 'main.[contenthash].js',
    assetModuleFilename: '[name].[contenthash][ext]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|svg|ico|woff2?|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
  ],
  mode: 'production',
};
