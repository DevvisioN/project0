var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=false',
    path.join(__dirname, 'src/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
       "process.env": {
          NODE_ENV: JSON.stringify("development")
        }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react', 
            ['es2015', { modules: false }]
          ]
        }
      },
      {test: /\.less$/, loader:'style-loader!css-loader!less-loader' },
      {test: /\.css$/, loader: 'style-loader!css-loader!less-loader' }
   ]
  }
}
