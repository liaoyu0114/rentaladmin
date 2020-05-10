import axios from "axios"

function request(config) {
    //1.创建axios实例
    const instance = axios.create({
        baseURL: 'https://token.hhh233.xyz',
        timeout: 5000,
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    //response拦截器
    instance.interceptors.response.use(res => {
        return res.data
    }, error => {
        console.log(error);
    });

    //3.发生网络请求
    return instance(config)
}

export default function() {
    return request({
        url: "/",
        method: "get"
    })
}