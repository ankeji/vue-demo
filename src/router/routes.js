/*
 * @Descripttion:
 * @version:
 * @Author: ankeji
 * @Date: 2020-06-09 18:18:41
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-06 19:10:06
 */
const frameIn = [
    {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
        children: [
            // {
            //     path: '/',
            //     name: 'index',
            //     component: () => import(/* webpackChunkName: "about" */ '../components/page'),
            //     meta: {
            //         title: '首页',
            //         requireAuth: false,
            //         showFooter: true
            //     },
            // }
        ]
    }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '../system/error/login.vue')
    }
]

/**
 * 错误页面
 */
const errorPage = [
    {
        path: '*',
        name: '404',
        component: () => import(/* webpackChunkName: "about" */ '../system/error/404')
    }
]


// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]
