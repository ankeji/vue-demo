/* eslint-disable no-undef */
/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-06 17:57:44
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-06 22:09:33
 */ 
import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import bus from "../bus"
import api from '@/api'
import util from './util/util'
Vue.prototype.$util = util
Vue.prototype.$api = api
Vue.prototype.$bus = bus;


const testmodalfile = require("./components/test").default;

var allfiles = [...testmodalfile]
allfiles.forEach(e => {
  Vue.component(e.fileName, e.file);
});




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
