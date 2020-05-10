//格式化时间
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        //RegExp.$1是/(y+)/.test(fmt)匹配到的对象，substr截取字符串
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
//前置添加0 4:4:4 => 04:04:04
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}




// import getToken from "../api/token"
// import axios from "axios"
//
// const domin = 'https://upload-z2.qiniup.com';
// const qiniuaddr = 'https://assets.hhh233.xyz';
//
// export default function(req) {
//     return new Promise((resolve, reject) => {
//         // let filetype = '';
//         // 重命名要上传的文件
//         // const keyname = this.getUserInfo.username + new Date() + Math.floor(Math.random() * 100) + '.' + filetype;
//         const keyname = btoa(req.file.name.split(".")[0]) + "." + req.file.name.split(".")[1];
//
//         //axio配置
//         const config = {
//             headers: {'Content-Type': 'multipart/form-data'},
//         };
//
//         // if (req.file.type === 'image/png') {
//         //     filetype = 'png'
//         // } else {
//         //     filetype = 'jpg'
//         // }
//         //获取七牛云token
//         getToken().then(res => {
//             let formdata = new FormData();
//             formdata.append('file', req.file);
//             formdata.append('token', res.uploadToken);
//             formdata.append('key', keyname);
//             // 获取到凭证之后再将文件上传到七牛云空间
//             axios.post(domin, formdata, config).then(res => {
//                 console.log(res);
//                 let url = qiniuaddr + '/' + res.data.key;
//                 resolve({
//                     url,
//                     req
//                 })
//                 // req.onSuccess(req.file);
//             }).catch(err => {
//                 console.log(err);
//                 //上传失败事件
//                 reject({
//                     err,
//                     req
//                 })
//                 // req.onError(req.file);
//             })
//         })
//     })
//
// }
