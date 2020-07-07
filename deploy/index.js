/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-07 09:20:31
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-07 09:32:08
 */ 
const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const server = require('./products');
const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'production' ? '生产' : '测试') + '服务器...');
spinner.start();
scpClient.scp(
    'dist/',
    {
        host: server.host,
        port: server.port,
        username: server.username,
        password: server.password,
        path: server.path
    },
    function (err) {
        spinner.stop();
        if (err) {
            console.log(chalk.red('发布失败.\n'));
            throw err;
        } else {
            console.log(chalk.green('Success! 成功发布到' + (process.env.NODE_ENV === 'production' ? '生产' : '测试') + '服务器! \n'));
        }
    }
);