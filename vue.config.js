const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    productionSourceMap: false,
    transpileDependencies: true,
    devServer: {
        port: 7070,
        proxy: {
            '/api': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
