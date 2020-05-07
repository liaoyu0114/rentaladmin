module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
    configureWebpack: {
        externals: {
            'AMap': 'AMap',
          },
          resolve: {
            //省略文件后缀
            // extensions: {},
            //配置文件别名
            alias: {
              'api': '/api',
              'common': '/common',
              'components': '/components',
              'network': '/network',
            }
          },
    }

}