/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-06 18:16:23
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-06 18:17:23
 */ 
const test = require.context('./models', false, /\.vue$/);
var testfile = []
test.keys().forEach(key => {
    var a = {
        fileName:'',
        file:''
    }
    const fileName = key.slice(2, -4);
    const file = test(key).default;
    a.fileName = fileName
    a.file = file
    testfile.push(a)
  })


export default testfile;