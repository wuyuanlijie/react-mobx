// 开发阶段的测试

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 不要画蛇添足 不要随意的添加.
module.exports = {
  // 生成Source Maps 使得调试更容易。
  // 调试工具的、快速的找到代码的出错的位置！
  devtool: "eval-source-map", // （快速的找到错误的位置，很好的调试的工具）

  entry:[
    "react-hot-loader/patch",
    __dirname + '/app.js',// 唯一的入口文件
  ], 
  output: {
    path: __dirname + '/build', // 打包后文件存放的地方
    filename: 'bundle.js' // 打包后输出文件的文件名
  },
  devServer: {
    //webpack-dev-server 会为根的文件夹提供本地的服务器
    // port: 8080,  // 设置监听的端口 默认为8080
    contentBase: './public', // 本地的服务器所加载的页面所在的目录
    historyApiFallback: true,  // 开发单页的应用的时候非常的有用，依赖于HTML5 history API, 设置为true，所有的跳转都指向index.html
    inline: true,  // true： 当源文件改变时候会自动的去刷新，
    hot: true,
  },

  //resolve的配置是用来影响webpack的模块解析（检索）。配置索引规则能够缩短webpack的解析时间，提升打包的速度
  resolve: {
    extensions: [".js", ".css", ".jsx"]
  },

  // loaders 使用的不同的laoder，对不同格式的文件进行处理，
  module: {
    // 可以将babel 单独的拿出来给 .babelrc 来配置
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader",  // 进行babel的转义
          // options: {
          //   presets: [
          //     "env", "react"  // babel-preset-env 解析ES6的包     babel-preset-react解析JSX的包
          //   ]
          // }
          // babel-preset-env
          // options 可以通过.babelrc 来配置
        },
        exclude: /node_modules/
      },
      // 工具处理的样式表 css-loader 和 style-loader
      // css-loader 使得@import 和 url（...）的方法来实现require（）
      // style-loader 是将计算后的样式加入页面中，
      // 二者组合在一起可以使你能够把样式表嵌入到webpack打包后的js文件中！
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: "style-loader" },
          { 
            loader: "css-loader",
            // css modules css的模块 使得所有的类名、动画名都只作用于当前的模块（不会出现模块中出现相同的类名的冲突）
            // options: { modules: true },
          },
          // 这里存在很多预处理： stylus-loader  
          {
            loader: "postcss-loader", // postcss是为autoprefixer 自动添加前缀的插件,
            options: {
              plugins: () => [
                require('autoprefixer')() // css浏览器的兼容)
              ]
            }
          },
          {
            loader: "sass-loader"
          }
        ],
        // loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // limit 限时图片的大小，小于限制的时候会自动转为base64码运行
      },

    ]
  },

  // 插件的使用
  plugins: [
    // 添加版权声明的插件
    new webpack.BannerPlugin('JerryLee版权所有，翻版必究！！'),
    // HtmlWebpackPlugin 根据一个简单的index.html模版，生成一个自动引用你打包后的js文件（js文件添加hash值）
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html'
    }),
    // HMR Hot Module Replacement 允许你在修改组件的代码后，自动的去刷新实时预览修改后的效果
    new webpack.HotModuleReplacementPlugin() // 热更新的插件
    // Babel有一个叫做react-transform-hrm 可以对reacr的模块进行的额外的配置的前提下让HMR的正常的工作(配置React的 热加载的模块)
  ]
}