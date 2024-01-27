import axios from 'axios';
import router from "@/router";

// axios 配置跨域添加 cookie
axios.defaults.withCredentials = true;
// axios 全局响应拦截器
axios.interceptors.response.use(
    response => {
        const statusCode = response.status;
        if (statusCode === 400) {
            // 请求错误
            router.push("/400")
        }
         else if (statusCode === 404) {
            router.push("/404")
        } else if (statusCode === 500) {
            // 服务器内部错误
            router.push("/500")
        } else if (statusCode === 200) {
            const resultCode = response.data.code;
            if (resultCode === 1 || resultCode === 0) {
                return response;
            } else {
                // sa-token 响应都是 200，返回体内部 code 不同
                // 1.未登录 (无 token，token 失效)
                // 2.绕过网关直接访问子服务
                router.push("/401");
            }
        }
    },
    error => {
        return Promise.reject(error)
    }
)


export default axios;