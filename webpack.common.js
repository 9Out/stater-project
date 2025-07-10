const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development', // Atau 'production' jika ingin build untuk produksi

  entry: {
    app: path.resolve(__dirname, './src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../starter-project-with-webpack/src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/public/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
         {
          from: path.resolve(__dirname, 'node_modules/leaflet/dist/images'),
          to: path.resolve(__dirname, 'dist/images'), // Salin ikon Leaflet ke dist/images
        },
        {
          from: path.resolve(__dirname, './src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, './src/sw.js'),
      swDest: 'sw.js',
    }),
  ],
};