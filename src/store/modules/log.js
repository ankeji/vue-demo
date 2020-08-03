import { get } from 'lodash'

export default {
    namespaced: true,
    state: {
        // 错误日志
        // + 日志条目的属性
        //   - message 必须 日志信息
        //   - type 非必须 类型 success | warning | info(默认) | danger
        //   - time 必须 日志记录时间
        log: []
    },
    getters: {
        /**
         * @description 返回现存 log (all) 的条数
         * @param {*} state vuex state
         */
        length (state) {
            return state.log.length
        },
        /**
         * @description 返回现存 log (error) 的条数
         * @param {*} state vuex state
         */
        lengthError (state) {
            return state.log.filter(log => log.type === 'danger').length
        }
    },
    actions: {
        /**.
         * @description 添加一个日志
         * @param {Object} context
         * @param {String} param message {String} 信息
         * @param {String} param type {String} 类型
         * @param {Object} payload meta {Object} 附带的信息
         */
        push ({ rootState, commit }, { message, type = 'info' }) {
            commit('push', {
                message,
                type,
                time: new Date().toLocaleString(),
                meta: {
                    // 当前地址
                    url: get(window, 'location.href', ''),
                }
            })
        }
    },
    mutations: {
        /**
         * @description 添加日志
         * @param {Object} state state
         * @param {Object} log data
         */
        push (state, log) {
            state.log.push(log)
        },
        /**
         * @description 清空日志
         * @param {Object} state state
         */
        clear (state) {
            // store 赋值
            state.log = []
        }
    }
}
