const path = require('path')

module.exports = {
  entry: {
    main: './src/index.ts',
    nuxt: './src/nuxt/index.ts',
  },
  target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ejs$/,
        use: [{ loader: 'raw-loader', options: { esModule: false } }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      Templates: path.resolve(__dirname, 'templates'),
    },
    fallback: {
      lodash: false,
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'vueApiServices',
      type: 'umd',
    },
  },
}
