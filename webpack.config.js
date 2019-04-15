const path = require('path');
const outputDirectory = 'public/js';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: {
    Library: './Client/Library/index.js'
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Match both .js and .jsx files
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {
          presets: ['@babel/react', '@babel/preset-env'],
          plugins: ['@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-decorators', {
            legacy: true
          }],
            ['@babel/plugin-proposal-class-properties', {
              loose: true
            }]]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false
          }
        }
      })
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  devServer: {
    port: 3001,
    open: true,
    proxy: {
      '/': 'http://localhost:8887'
    }
  }
};
