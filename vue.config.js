/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-06 18:21:11
 * @LastEditors: ankeji
 * @LastEditTime: 2020-10-20 11:22:02
 */
const path = require('path')
// 拼接路径
function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    publicPath: '/', // 默认为'/'

    // 将构建好的文件输出到哪里，本司要求
    outputDir: 'dist',

    // 放置生成的静态资源(js、css、img、fonts)的目录。
    assetsDir: 'static',

    // 指定生成的 index.html 的输出路径
    indexPath: 'index.html',

    // 是否使用包含运行时编译器的 Vue 构建版本。
    runtimeCompiler: false,

    transpileDependencies: [],

    // 如果你不需要生产环境的 source map
    productionSourceMap: false,
    // 是一个函数，允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: (config) => {
        // 配置别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
        /**
        * 删除懒加载模块的 prefetch preload，降低带宽压力
        * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
        * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
        * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
        */
        config.plugins
            .delete('prefetch')
            .delete('preload')
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
            .symlinks(true)
        if (process.env.NODE_ENV === 'production') {
            /**
            * 生产环境用远程cdn包缩小项目体积，优化首页加载速度
            */
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
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
            if (process.env.npm_config_report) {
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'server',
                        analyzerHost: '127.0.0.1',
                        analyzerPort: 8889,
                        reportFilename: 'report.html',
                        defaultSizes: 'parsed',
                        openAnalyzer: true,
                        generateStatsFile: false,
                        statsFilename: 'stats.json',
                        statsOptions: null,
                        logLevel: 'info'
                    }))
            }
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|.\css/, //匹配文件名
                        threshold: 10240, //对超过10k的数据压缩
                        deleteOriginalAssets: false //不删除源文件
                    })
                ],
                output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
                    filename: `./assets/js/[name].[chunkhash].js`, //不加版本号
                    chunkFilename: `./assets/js/[name].[chunkhash].js`
                }
            }

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
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,
}
