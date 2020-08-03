import { get } from 'lodash'

/* eslint-disable no-undef */
/*
 * @Descripttion:
 * @version:
 * @Author: ankeji
 * @Date: 2020-07-06 17:57:44
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-07 09:11:24
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})



export default new Vuex.Store({
  namespaced: true,
  modules
})
