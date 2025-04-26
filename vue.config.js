const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9090,
    proxy: {
      '/api': {
        // target: 'http://localhost:9000',
        target: 'https://m1.apifoxmock.com/m1/6209932-5903327-default',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/oss': {
        target: 'https://web-lyt-tlias.oss-cn-beijing.aliyuncs.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/oss': ''
        }
      }
    }
  }
})
