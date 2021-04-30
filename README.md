# vue-demo

deploy //一键自动发布代码
--index.js
--products.js
public
--index.html
src
--api  //所有的接口管理
---modules //各种类型接口的分类管理（会自动导出）
----userApi.js //请求接口样例
----.....
---axiosConfig.js //全局axios的配置
---index.js //所有接口api的导出文件
---service.js //axios全局拦截和各种接口请求方式的封装
assets //静态文件的目录
components //所有组件的目录文件
--models //各种组件的分类管理（会自动导出）
---test.vue //模板实例
--index.js //导出所有组件的文件
directive//全局公共指令的文件夹
--Tool//指令方法的文件夹
--directives.js//指令的统一注册文件
plugin //全局异常的拦截
--error.js//全局异常拦截文件
router//全局路由的文件夹
--index.js //路由配置文件
--routes.js //路由的地址文件
store //vuex文件夹
--models //各种vuex模块的管理文件
---log.js //状态管理事例
--index.js //统一导出文件
system //系统页面文件（login，404,500报错页面）
--error
---404.vue
---login.vue
util //全局方法文件夹
--util.cookies.js //cookies方法的封装
--util.js //全局方法的导出
--util.log.js //全局console.log的封装
views//页面文件
--Home.vue
App.vue //入口页面
main.js //入口js
.env.development //开发环境变量
.env.production  //生产环境变量
.gitignore //屏蔽文件
babel.config.js
bus.js //全局bus的通信文件
dist.zip  //build打包后自动压缩的文件
package-lock.json
package.json
vue.config.js  //webpack的配置
zip.js //打包后自动压缩的脚本文件