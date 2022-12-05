// 开发环境配置：代码运行即可；

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // 模式配置；
  mode: "development",
  // 入口文件配置；
  entry: path.join(__dirname, "/src/app.js"),
  // 输出目录配置；
  output: {
    filename: "bundle.js",
    // 打包的所有资源都会输出到这个 bundle 目录下；
    path: path.join(__dirname, "/bundle"),
  },
  module: {
    rules: [
      // loader 的配置；
      {
        // 处理 less 文件资源；
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        // 处理 css 文件资源；
        test: /\.css$/,
        use: [
          // 创建 <style> 标签，将编译好的样式放在里面；
          "style-loader",
          // 将 css 文件整合到 js 文件中；
          "css-loader",
        ],
      },
      {
        // 处理样式文件中图片资源；
        test: /\.(jpg|png|jpeg|gif|svg)$/,
        loader: "url-loader",
        options: {
          // 规定 8KB 以下的图片做 base64 处理；
          // base64 处理的图片的文件大小会增大，因此大图片不适合做 base64 处理；
          // 限制图片在 8KB 以下才会进行 base64 处理；
          limit: 8 * 1024,
          // 给图片重新命名：用 hsah 值的前5位做图片名称；
          name: "[name].[ext]",
          // 关闭 ES Module 模块化模式；避免与 CommonJS 产生冲突；
          esModule: false,
          outputPath: "public/imgs",
        },
      },
      {
        // 处理 html 文件中的图片资源；
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        // 处理其他类型的资源，例如字体文件；
        // 排除其他的已经测试过的文件类型；
        // exclude: /\.(html|js|css|less|jpg|png|jpeg|gif|svg)/,
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "media/font",
        },
      },
      // 处理 shader 着色器文件；
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    // plugins 配置；
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/src/index.html"),
      filename: "index.html",
    }),
    // 设置一些文件不需要被打包；
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "./font"), to: "font" },
        { from: path.join(__dirname, "./sound"), to: "sound" },
        { from: path.join(__dirname, "./image"), to: "image" },
        { from: path.join(__dirname, "./static"), to: "static" },
      ],
    }),
  ],
  // 本地服务配置：保存文件后自动打包；
  // 开启本地服务端口浏览；
  devServer: {
    compress: true,
    port: 8000,
  },
  externals: {
    // 排除 three.js 依赖文件不进行打包，在 html 页面 CDN 引入
    three: "THREE",
  },
  devtool: "eval-source-map",
};
