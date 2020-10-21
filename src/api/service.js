/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-06-09 16:03:53
 * @LastEditors: ankeji
 * @LastEditTime: 2020-10-21 09:47:53
 */
import axios from 'axios'
import util from "../util/util"
import qs from "qs";
import axiosConfig from "./axiosConfig";
/**
 * @description 创建请求实例
 */
function createService(intercept = true) {

    // 创建一个 axios 实例
    const service = axios.create({
        baseURL: axiosConfig.baseURL, // api的base_url
        timeout: axiosConfig.timeout, // 请求超时时间
    })
    // 请求拦截
    service.interceptors.request.use(
        intercept ? config => {
            if (util.cookies.get("token")) {
                config.headers.Authorization = "Bearer" + " " + util.cookies.get("token");
            }
            config.headers["Content-Type"] = "application/json";
            return config;
        } : config => config,
        error => {
            // 发送失败
            console.log(error)
            return Promise.reject(error)
        }
    )
    // 响应拦截
    service.interceptors.response.use(
        response => {
            return response;
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
                return Promise.reject(error.response.data)
            } else {
                // 处理断网的情况
                // eg:请求超时或断网时，更新state的network状态
                // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
                // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
                if (!window.navigator.onLine) {
                    error.message = '您当前没有网络！'
                } else {
                    return Promise.reject(error);
                }
            }
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
method.nopostJson = (url, body = {}, config = {}) => {
    return request.post(url, body, config);
}
method.noPostFormData = (url, body = {}, config = {}) => {
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

// 可以取消前一次请求的接口封装，只执行最后一次请求的接口
method.getOrCancel = (url) => {
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
// 可以取消前一次请求的接口封装，只执行最后一次请求的接口
method.postJsonOrCancel = (url, params) => {
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

method.del = (url, body = {}, config = {}) => {
    config.params = body;
    return service.delete(url, body, config);
}

//put请求类型，不处理数据类型的
method.putJson = (url, body = {}, config = {}) => {
    return service.put(url, body, config);
}

//post请求类型，不处理数据类型的
method.postJson = (url, body = {}, config = {}) => {
    return service.post(url, body, config);
}


//post请求接口，用了qs做了处理，传过去的参数不带引号
method.postForm = (url, body = {}, config = {}) => {
    return service.post(url, qs.stringify(body), config);
}

method.postFormData = (url, body = {}, config = {}) => {
    let f = new FormData();
    Object.entries(body).forEach(data => {
        f.append(...data);
    });
    return service.post(url, f, config);
}

export default method;