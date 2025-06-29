const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // Atau 'production' jika ingin build untuk produksi

  entry: {
    // Path ini benar jika webpack.common.js ada di root 'starter-project-with-webpack'
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
            // Jika ada masalah dengan @import di CSS, tambahkan options ini:
            // options: { importLoaders: 1 }
          },
        ],
        type: 'javascript/auto', // <--- Pastikan ini ada!
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
      // Path ini juga benar jika webpack.common.js ada di root 'starter-project-with-webpack'
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
      ],
    }),
  ],
};