const { defineConfig } = require('@vue/cli-service')
const PreRenderSPAPlugin = require("prerender-spa-plugin-next");


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new PreRenderSPAPlugin({
        routes: ["/", "/LoginPanel", '/SignPanel'],
      })
    ],
  },
  // devServer: {
  //   proxy: {
  //     '/98t': {
  //       target: 'http://45.76.182.7', // 请求接口的 api 地址
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
  // publicPath: '/'
})
