/*
 * @Descripttion:
 * @version:
 * @Author: ankeji
 * @Date: 2020-07-06 18:10:08
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-06 18:23:10
 */
import cookies from './util.cookies'
import log from './util.log'
const util = {
    cookies,
    log
}


/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
    const processTitle = process.env.VUE_APP_TITLE || 'vue-demo'
    window.document.title = titleText || processTitle
    // window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'd2admin-link-temp')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

util.deepClone = function (obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0; i < obj.length; i++) {
            copy.push(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Object) {
        let copy = {};
        for (var key in obj) { //递归 
            if (obj.hasOwnProperty(key)) {
                copy[key] = $utils.deepClone(obj[key]);
            }
        }
        return copy;
    }
}

export default util
