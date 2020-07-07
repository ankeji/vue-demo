/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-07-07 09:20:31
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-07 09:31:13
 */ 
/*
 *读取env环境变量
 */
const fs = require('fs');
const path = require('path');
// env 文件 判断打包环境指定对应的服务器id
const envfile = process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development';
// env环境变量的路径
const envPath = path.resolve(__dirname, envfile);
// env对象
const envObj = parse(fs.readFileSync(envPath, 'utf8'));
const SERVER_ID = parseInt(envObj['VUE_APP_SERVER_ID']);

function parse(src) {
    // 解析KEY=VAL的文件
    const res = {};
    src.split('\n').forEach(line => {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        // eslint-disable-next-line no-useless-escape
        const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        // matched?
        if (keyValueArr != null) {
            const key = keyValueArr[1];
            let value = keyValueArr[2] || '';

            // expand newlines in quoted values
            const len = value ? value.length : 0;
            if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
                value = value.replace(/\\n/gm, '\n');
            }

            // remove any surrounding quotes and extra spaces
            value = value.replace(/(^['"]|['"]$)/g, '').trim();

            res[key] = value;
        }
    });
    return res;
}

/*
 *定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
 */
const SERVER_LIST = [
    {
        id: 0,
        name: 'A-生产环境',
        domain: 'www.production.com',// 域名
        host: '47.240.26.200',// ip
        port: 21,// 端口
        username: 's6180819', // 登录服务器的账号
        password: 'gvDW62cfIR',// 登录服务器的账号
        path: '/wwwroot'// 发布至静态服务器的项目路径
    },
    {
        id: 1,
        name: 'B-测试环境',
        domain: 'test.xxx.com',
        host: '47.240.26.200',
        port: 21,
        username: 's6180819',
        password: 'gvDW62cfIR',
        path: '/wwwroot'
    }
];

module.exports = SERVER_LIST[SERVER_ID];