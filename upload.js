var client = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora(chalk.green('正在发布到服务器...'));
spinner.start();

client.scp('./dist/', {    // 本地打包文件的位置
  "host": '47.116.64.105', // 服务器的IP地址
  "port": '22',            // 服务器端口， 一般为 22
  "username": 'root',       // 用户名
  "password": 'liaoyu1997..',     // 密码
  "path": '/www/wwwroot/frp.hhh233.xyz/admin/'            // 项目部署的服务器目标位置
}, err =>{
  spinner.stop();
  if (!err) {
    console.log("项目发布完毕!")
  } else {
    console.log("err", err)
  }
})
