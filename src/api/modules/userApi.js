/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-06-09 16:06:11
 * @LastEditors: ankeji
 * @LastEditTime: 2021-03-03 11:52:41
 */ 
import method from "../service"
const login = {}


/**
 * @name 手机号登录
 * @username 用户名
 * @password 密 码
 */
login.iphone_login_in = (param)=>{
    return method.nopostJson(`http://172.0.0.0:8088/services/authentication/api/authenticate?provider=otp`, param)
}


export default login
