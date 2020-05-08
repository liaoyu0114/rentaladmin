import axios from 'axios'

function mapReq(config) {
  //1.创建axios实例
  const instance = axios.create({
    baseURL: 'https://restapi.amap.com/v3/place',
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

export function around(data) {
  return mapReq({
    method: 'get',
    url: '/around',
    params: data
  })
}

export function text(params) {
  return mapReq({
    method: 'get',
    url: '/text',
    params: params
  })
}