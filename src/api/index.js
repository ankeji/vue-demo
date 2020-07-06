/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-06-09 16:04:03
 * @LastEditors: ankeji
 * @LastEditTime: 2020-06-30 12:01:41
 */ 

const files = require.context('./modules', false, /\.js$/)
const generators = files.keys().map(key => files(key).default)
const apiAll = {};
generators.forEach(e => {
    Object.assign(apiAll,e)
});
export default apiAll;
