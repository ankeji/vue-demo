/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-06-09 16:03:53
 * @LastEditors: ankeji
 * @LastEditTime: 2020-07-02 13:51:51
 */ 
import axios from 'axios'
import util from "../util/util"
import qs from "qs";
import axiosConfig from "./axiosConfig";
/**
 * @description 创建请求实例
 */
function createService (intercept=true) {
    
    // 创建一个 axios 实例
    const service = axios.create({
        baseURL: axiosConfig.baseURL, // api的base_url
        timeout: axiosConfig.timeout, // 请求超时时间
    })
    // 请求拦截
    service.interceptors.request.use(
        intercept?config => {
            if (util.cookies.get("token")) {
                config.headers.Authorization = "Bearer" + " " + util.cookies.get("token");
            }
            config.headers["Content-Type"] = "application/json";
            return config;
        }:config=>config,
        error => {
            // 发送失败
            console.log(error)
            return Promise.reject(error)
        }
    )
    // 响应拦截
    service.interceptors.response.use(
        response => {
            // dataAxios 是 axios 返回数据中的 data
            const dataAxios = response
            return dataAxios;
            // console.log(dataAxios);
            // // 这个状态码是和后端约定的
            // const { status } = dataAxios
            // console.log(status);
            // // 根据 code 进行判断
            // if (status === undefined) {
            //     // 如果没有 code 代表这不是项目后端开发的接口
            //     return dataAxios
            // } else {
            //     // 有 code 代表这是一个后端接口 可以进行进一步的判断
            //     switch (status) {
            //         case 200:
            //             // [ 示例 ] status === 200 代表没有错误
            //             return dataAxios.data
            //         case 'xxx':
            //             // [ 示例 ] 其它和后台约定的 code
            //             // errorCreate(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
            //             break
            //         default:
            //             // 不是正确的 code
            //             // errorCreate(`${dataAxios.msg}: ${response.config.url}`)
            //             break
            //     }
            // }
        },
        error => {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400: error.message = '请求错误'; break
                    case 401: error.message = '未授权，请登录'; break
                    case 403: error.message = '拒绝访问'; break
                    case 404: error.message = `请求地址出错`; break
                    case 408: error.message = '请求超时'; break
                    case 500: error.message = '服务器内部错误'; break
                    case 501: error.message = '服务未实现'; break
                    case 502: error.message = '网关错误'; break
                    case 503: error.message = '服务不可用'; break
                    case 504: error.message = '网关超时'; break
                    case 505: error.message = 'HTTP版本不受支持'; break
                    default: break
                }
            }
            return Promise.reject(error.response.data)
        }
    )
    return service
}


// 用于真实网络请求的实例和请求方法
const service = createService();//默认拦截
const request = createService(false);//传false就是不拦截



// 接口的请求类型
// get请求不处理数据类型的
var CancelToken = axios.CancelToken;
let cancelRequest;
const method = {};



/**
 * 不拦截的接口封装开始
 */
method.noGet = (url, config = {}) => {
    return request.get(url, config);
}
//post请求类型，不处理数据类型的
method.nopostJson = ( url, body = {}, config = {}) => {
    return request.post(url, body, config);
}
method.noPostFormData = ( url, body = {}, config = {}) => {
    let f = new FormData();
    Object.entries(body).forEach(data => {
        f.append(...data);
    });
    return request.post(url, f, config);
}
//不拦截的接口封装结束







method.get = (url, config = {}) => {
    return service.get(url, config);
}
method.getOrCancel = ( url) => {
    if (cancelRequest) {
        cancelRequest()
    }
    return service.get(url, {
        cancelToken: new CancelToken(c => {
            cancelRequest = c;
        })
    }).then(res => {
        cancelRequest = null
        return res
    });
}
method.postJsonOrCancel = ( url, params) => {
    if (cancelRequest) {
        cancelRequest()
    }
    return service.post(url, params, {
        cancelToken: new CancelToken(c => {
            cancelRequest = c;
        })
    }).then(res => {
        cancelRequest = null
        return res
    });
}

method.del = ( url, body = {}, config = {}) => {
    config.params = body;
    return service.delete(url, body, config);
}

//put请求类型，不处理数据类型的
method.putJson = ( url, body = {}, config = {}) => {
    return service.put(url, body, config);
}

//post请求类型，不处理数据类型的
method.postJson = ( url, body = {}, config = {}) => {
    return service.post(url, body, config);
}


//post请求接口，用了qs做了处理，传过去的参数不带引号
method.postForm = ( url, body = {}, config = {}) => {
    return service.post(url, qs.stringify(body), config);
}

method.postFormData = ( url, body = {}, config = {}) => {
    let f = new FormData();
    Object.entries(body).forEach(data => {
        f.append(...data);
    });
    return service.post(url, f, config);
}

export default method;