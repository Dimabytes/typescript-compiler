const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: {
    index: './src/index.ts'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  }
};
