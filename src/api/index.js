import axios from 'axios'
import qs from "qs"

function request(config) {
  const instance = axios.create({
    baseURL: 'https://api.hhh233.xyz/onlineplatform',
    timeout: 5000,
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
function qsData(data) {
    return qs.stringify(data)
}
export function businessLogin(data) {
    /**
     * business_phone y
     * business_password y
     */
    return request({
        url: "/busineslogin",
        method: "post",
        data: qsData(data)
    })
}

export function updateBusinessInfo(data) {
    /**
     * business_id y
     * business_password
     * contact_number
     * business_nickname
     * business_pic
     * state
     */
    return request({
        url:"/updatebusinessinfo",
        method: "post",
        data: qsData(data)
    })
}

export function addShop(data) {
    return request({
        url: "/addShop",
        method: "post",
        data: qsData(data)
    })
}

export function selectshopforbusiness(data) {
    return request({
        url:"/selectshopforbusiness",
        method: "post",
        data: qsData(data)
    })
}

export function updateshopinfo(data) {
    return request({
        url: "/updateshopinfo",
        method: "post",
        data: qsData(data)
    })
}

export function selectDishesList(data) {
    return request({
        url: "/selectDishesList",
        method: "post",
        data: qsData(data)
    })
}
export function addDishes(data) {
    return request({
        url: "/addDishes",
        method: "post",
        data: qsData(data)
    })
}
export function updatedishesinfo(data) {
    return request({
        url: "/updatedishesinfo",
        method: "post",
        data: qsData(data)
    })
}

export function delectdishes(data) {
    return request({
        url: "/delectdishes",
        method: "post",
        data: qsData(data)
    })
}
