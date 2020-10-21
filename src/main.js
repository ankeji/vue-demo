/* eslint-disable no-undef */
/*
 * @Descripttion:
 * @version:
 * @Author: ankeji
 * @Date: 2020-07-06 17:57:44
 * @LastEditors: ankeji
 * @LastEditTime: 2020-10-21 15:55:14
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
import Directives from './directive/directives'

Vue.use(Directives);

const testmodalfile = require("./components/test").default;

var allfiles = [...testmodalfile]
allfiles.forEach(e => {
  Vue.component(e.fileName, e.file);
});


/**
 * 给图片添加自定义属性src
 * 用法 <img v-real-img="真是请求图片地址" src="默认图片地址" />
 */
Vue.directive('real-img', async function(el, binding) { //指令名称为：real-img
  let imgURL = binding.value; //获取图片地址
  if (imgURL) {
      if (imgURL.charAt(imgURL.length - 1) == '/') {
          return
      }
      if (imgURL && el.getAttribute('src') !== imgURL) {
          let res = await imageIsExist(imgURL, el)
          if (res) {
              el.setAttribute('src', imgURL)
          }
      }
  }
});

/**
 * 字符串的切割
 * @param {*} str 
 * @param {*} num 
 */
Vue.prototype.$strSlice = (str, num) => {
  if (!str) {
    return '-'
  }
  if (str.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str.slice(0, num)
  }
}


/**
 * 时间戳过滤器
 */
Vue.filter('formatDate', function(time) {
  if (time != null && time != '' && time != '-') {
      // 如果返回的是yyyy-MM-dd格式，直接返回
      if (time.toString().indexOf('-') > -1 && time.length > 4) {
          return time
      }
      var _time = parseInt(time)
      let date = new Date(_time);
      return dateFormat.formatDate(date, "yyyy-MM-dd");
  } else {
      return '-'
  }
})

/**
 * 过滤发送时间距离当前时间的分钟数（用于评论）
 */
Vue.filter('chaDate', function(time) {
  if (time != null && time != '' && time != '-') {
      let now = new Date();
      let cha = now.getTime() - Number(time);
      if (cha / (24 * 60 * 60 * 1000) > 1) {
          let date = new Date(parseInt(time));
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      } else if (cha / (60 * 60 * 1000) < 24 && cha / (60 * 60 * 1000) > 1) {
          return parseInt(cha / (60 * 60 * 1000)) + '小时前';
      } else if (cha / (60 * 1000) > 0 && cha / (60 * 1000) < 60) {
          return parseInt(cha / (60 * 1000)) + '分前'
      }
      return '-'
  } else {
      return '-'
  }
})


Vue.config.productionTip = false

import VueError from './plugin/error'
// 插件
Vue.use(VueError)
// Vue.use(pluginLog)



export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
