const path = require("path");
const glob = require("glob-all");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const resolve = dir => path.resolve(__dirname, dir);
// const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const env = process.env.NODE_ENV

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8088,
    // 不设置代理时，直接看页面  接入后台加代理 不能直接访问页面
    // // 设置代理
    proxy: {
      '/': {
        // 目标IP 后台
        // target: 'http://192.168.30.74:9998/',
        target: 'http://192.168.30.136:8080/',
        ws: false,
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  // assetsDir: './',
  configureWebpack: config => {
    if (env === 'production') {
      const plugins = [];
      // 代码压缩
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      config.plugins = [...config.plugins, ...plugins];
    }
  }
}
