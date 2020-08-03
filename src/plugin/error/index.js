import util from '@/util/util'
import { get, isObject } from 'lodash'
import store from "@/store"
function isPromise(ret) {
    return (ret && typeof ret.then === 'function' && typeof ret.catch === "function")
}
const errorHandler = (error, vm, info) => {
    console.error('抛出全局异常')
    util.log.capsule('D2Admin', 'ErrorHandler')
    console.log(store);
    store.dispatch('log/push', {
        message: `${info}: ${isObject(error) ? error.message : error}`
    })
    if (process.env.NODE_ENV !== 'development') return
    util.log.danger('>>>>>> 错误信息导航 >>>>>>')
    console.log(info)
    util.log.danger('>>>>>> Error信息详情 >>>>>>')
    console.log(error)
    util.log.danger('>>>>>> Vue 实例 >>>>>>')
    console.log(vm)

}
function registerActionHandle(actions) {
    Object.keys(actions).forEach(key => {
        let fn = actions[key]
        actions[key] = function (...args) {
            let ret = fn.apply(this, args)
            if (isPromise(ret)) {
                return ret.catch(errorHandler)
            } else { // 默认错误处理
                return ret
            }
        }
    })
}
const registerVuex = (instance) => {
    if (instance.$options['store']) {
        let actions = instance.$options['store']['_actions'] || {}
        if (actions) {
            let tempActions = {}
            Object.keys(actions).forEach(key => {
                tempActions[key] = actions[key][0]
            })
            registerActionHandle(tempActions)
        }
    }
}
const registerVue = (instance) => {
    if (instance.$options.methods) {
        let actions = instance.$options.methods || {}
        if (actions) {
            registerActionHandle(actions)
        }
    }
}

let VueError = {
    install: (Vue, options) => {
        /**
         * 全局异常处理
         * @param {
         * } error
         * @param {*} vm
         */
        // 配置Vue.config.errorHandler
        Vue.config.errorHandler = errorHandler
        Vue.mixin({
            beforeCreate() {
                registerVue(this)
                registerVuex(this)
            }
        })
        Vue.prototype.$throw = errorHandler
    }
}

export default VueError
