// 产品的阶段的构建！需要去配置的production的js的文件

const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: {
    index: __dirname + "/app.js",
    vendor: ["react", "react-dom"]
  },
  output: {
    path: __dirname + "/build",
    // 添加哈希值，去除缓存（内容的改变，使得文件的内容也改变）
    // hash和chunkhash区别：
    filename: "[name]-[hash].js",
    // publicPath: 'dist/'  // 处理静态资源的引用地址是使用
  },
  devtool: 'null', // 去掉 调试的工具 大大的压缩我们的打包的代码

  //resolve的配置是用来影响webpack的模块解析（检索）。配置索引规则能够缩短webpack的解析时间，提升打包的速度
  resolve: {
    extensions: [".js", ".css", ".jsx"]
  },

  // devServer: {
  //   contentBase: "./public",  // 本地的服务器所加载的目录
  //   historyApiFallback: true, // 不挑转
  //   inline: true,
  //   hot: true
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({ // 抽离css的样式，防止打包的js中引起样式加载错乱的现象
          fallback: "style-loader", //编译后使用什么loader来提取css文件
          use: [
            {
              loader: "css-loader",
              // options: { modules: true }
              options: {
                minimize: true // 对css的文件进行压缩
              }
            },
            {
              loader: "postcss-loader", // postcss是为autoprefixer 自动添加前缀的插件,
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: ['last 5 versions']
                  }) 
                ]
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        })
      },
      {
        // 图片的加载的问题
        test: /\.(png|jpg)$/, 
        loader: 'url-loader?limit=8192' // limit 限时图片的大小，小于限制的时候会自动转为base64码运行
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('版本所有，翻版必究'),
    new htmlWebpackPlugin({
      template: __dirname + '/index.html' 
    }),

    // new webpack.HotModuleReplacementPlugin(),

    new ExtractTextPlugin('[name].css'),
    // 优化插件的使用！
    // OccurenceOrderPlugin 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并且为它们分配最小的ID
    // UglifyPlugin 压缩js的代码
    // ExtractTextPlugn 分离css和js的代码
    new webpack.optimize.UglifyJsPlugin(),  // 很大的减少js的大小
    new webpack.optimize.OccurrenceOrderPlugin(),

    // 去除build文件中的残余文件（这样打包成不同的js的文件的残文件，就可以清除）
    new CleanWebpackPlugin('build/*.*', {
      root: __dirname,
      verbose: true,
      dry: false
    }),

    // 第三方库的打包 因为第三方库的内容基本都不会改变，我们可以将其与业务代码分离出来，
    // 这样就可以将类库的代码缓存在客户端，减少请求，
    // 1、第三方的类库的单独打包 第一个参数为对应的chunk（对应entry中的属性名字） 第二个参数为生成的文件名
    // 1.5 通用的模块打包
    new webpack.optimize.CommonsChunkPlugin({ 
      name: ['common', 'vendor'], 
      filename: '[name].js',
      minChunks: 2, // 公共模块被使用的最小的次数，也及时同一个模块只有被2个外的页面同时引用才会被提取出来作为common chunks
    }),
    // 2、按需加载
    new webpack.optimize.AggressiveMergingPlugin()


    // 解决webpack打包的文件过大的问题！！！
    // 1、去处不必要的插件，比如去除HotModuleReplacementPlugin, NoErrorsPlugin...
    // 2、提取第三方的库，除此之外，还可通过引用外部的文件的方式引入第三方的库
    // 3、js、css代码压缩，自带的UglifyJsPlugin和css-loader的minimize，服务器段还可以开启gzip的压缩，优化的效果更加明显
    // 4、代码的分割
    // 5、设置缓存
  ]

}