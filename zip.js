/* eslint-disable no-unused-vars */
/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-07 09:17:35
 * @LastEditors: ankeji
 * @LastEditTime: 2020-10-20 11:34:16
 */ 
const compressing = require('compressing');
const fs = require('fs');

// 压缩命令
function compressDir(name) {
    compressing.zip.compressDir('./dist', `${name}.zip`)
        .then(() => {
            console.log('压缩成功！');
        })
        .catch(err => {
            console.error(err);
        });
}


//删除原来版本
function unlink(name) {
    fs.unlink(`${name}.zip`, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('文件删除成功，开始压缩...');
        compressDir(name);
    });
}


//判断文件是否存在
function stat(name) {
    fs.stat(`${name}.zip`, (err, stats) => {
        if (err) {
            console.log('文件不存在，直接压缩！');
            compressDir(name);
        } else {
            console.log('文件存在，正在删除...');
            unlink(name);
        }
    });
}

stat('dist');