/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-06 18:21:11
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-06 19:31:15
 */
const path = require('path')

// 拼接路径
function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
module.exports = {
    // 是一个函数，允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: (config) => {
        // 配置别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer('terser').tap((args) => {
                // 去除生产环境console
                args[0].terserOptions.compress.drop_console = true
                return args
            })
    
          config.externals({
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'axios': 'axios'
            })
        }  
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(
                new CompressionPlugin({
                    // gzip压缩配置
                    test: /\.js$|\.html$|\.css/, // 匹配文件名
                    threshold: 10240, // 对超过10kb的数据进行压缩
                    deleteOriginalAssets: false, // 是否删除原文件
                }),
                new BundleAnalyzerPlugin()
            )
        }
    },
    lintOnSave: false,
    devServer: {
        host: '0.0.0.0',
        port: 8088, // 端口号
        https: false, // https:{type:Boolean}
        open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'https://www.mock.com',
                ws: true, // 代理的WebSockets
                changeOrigin: true, // 允许websockets跨域
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    }
}