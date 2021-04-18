/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-06 18:21:11
 * @LastEditors: ankeji
 * @LastEditTime: 2021-03-03 11:57:05
 */
const path = require('path')
// 拼接路径
function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { HashedModuleIdsPlugin } = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
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

    // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性（注：仅影响构建时注入的标签）
    crossorigin: '',

    // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
    integrity: false,

    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
    lintOnSave: process.env.NODE_ENV !== 'production',

    // css的处理
    css: {
        // 从 v4 起已弃用，请使用css.requireModuleExtension。 在 v3 中，这个选项含义与 css.requireModuleExtension 相反。
        modules: true,
        // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
        requireModuleExtension: true,
        // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
        // 默认生产环境下是 true，开发环境下是 false
        extract: false,
        // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
        sourceMap: false,
        //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
        loaderOptions: {
            css: {},
            less: {}
        }
    },

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
        if (isProduction) {
            /**
            * 生产环境用远程cdn包缩小项目体积，优化首页加载速度
            */
            config.externals({
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'axios': 'axios'
            })
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(
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
                        })
                    )
            }
        }
    },
    configureWebpack: (config) => {
        const plugins = [];
        if (isProduction) {
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                })
            )
            plugins.push(
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据压缩
                    deleteOriginalAssets: false //不删除源文件
                })
            )
            // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
            plugins.push(
                new HashedModuleIdsPlugin()
            )
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 1000 * 60,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // 排除node_modules 然后吧 @ 替换为空 ,考虑到服务器的兼容
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            };
            // 取消webpack警告的性能提示
            config.performance = {
                hints: 'warning',
                //入口起点的最大体积
                maxEntrypointSize: 1000 * 500,
                //生成文件的最大体积
                maxAssetSize: 1000 * 1000,
                //只给出 js 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.js');
                }
            };
            //优化项配置
            config.optimization = {
                splitChunks: { // 分割代码块
                    cacheGroups: {
                        vendor: {//第三方库抽离
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                            maxInitialRequests: 5,
                            minSize: 0,//大于0个字节
                            priority: 100//权重
                        },
                        common: {  //公用模块抽离
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                            maxInitialRequests: 5,
                            minSize: 0,//大于0个字节
                            priority: 60
                        },
                        styles: { //样式抽离
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true
                        },
                        runtimeChunk: {
                            name: 'manifest'
                        }
                    }
                }
            }
        }
        return { plugins }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8088, // 端口号
        https: false, // https:{type:Boolean}
        open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
        overlay: {
            warnings: false,
            errors: false
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
