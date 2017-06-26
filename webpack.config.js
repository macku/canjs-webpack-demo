const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlTemplate = require('html-webpack-template');

process.env.BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV;

const webpackConfig = {
  entry: {
    index: './src/index.js',
    vendor: ['can-map', 'can-stache']
  },

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'public/dist'),
    pathinfo: true
  },

  resolve: {
    extensions: ['.js', '.less', '.stache']
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: process.env.NODE_ENV === 'development'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    }),

    new HtmlPlugin({
      filename: 'index.html',
      inject: false,
      template: htmlTemplate,
      title: 'CanJS3',
      appMountId: 'root',
      xhtml: true,
      mobile: true,
      chunks: [
        'runtime',
        'vendor',
        'index'
      ],
      minify: {
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        preserveLineBreaks: true
      }
    }),

    new webpack.NamedModulesPlugin(),

    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.modules.map(m => path.relative(m.context, m.request)).join('_');
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),

    {
      apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
          compilation.plugin('before-module-ids', (modules) => {
            modules.forEach((module) => {
              if (module.id !== null) {
                return;
              }

              module.id = module.identifier();
            });
          });
        });
      }
    }
  ],

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },

      {
        test: /\.js$/,

        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],

        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.stache$/,

        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],

        use: {
          loader: 'can-stache-loader'
        }
      },

      {
        test: /\.less$/,

        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],

        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }]
        }),
      },

      {
        test: /\.css$/,

        exclude: [
          path.resolve(__dirname, 'public/node_modules')
        ],

        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }]
        }),
      },

      {
        test: /\.(woff|eot|ttf|woff2)$/,
        use: {
          loader: 'url-loader'
        }
      },

      {
        test: /\.(jpg|gif|png|svg)$/,
        use: {
          loader: 'file-loader?name=[name].[ext]'
        }
      }
    ]
  }
};

if (process.env.NODE_ENV !== 'production') {
  webpackConfig.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8888,
    https: false,
    historyApiFallback: true,
    inline: true,
    hot: true
  };

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = webpackConfig;
