import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import ElementUI from 'element-ui';
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(Vuex)
Vue.use(ElementUI, {
    size: 'small'
});


//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title}`;
//     const role = store.state.userInfo
    
//     console.log(role.business_id)
//     if (role.business_id && to.path !== '/login' ) {
//         // if () {
//         //     next("/login")
//         // } else {
//             next();
//         // }
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         // if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//         //     Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//         //         confirmButtonText: '确定'
//         //     });
//         // } else {
//             if (to.path === '/login') {
//                 next()
//             } else {
//                 next("/login");
//             }
//         // }
//     }
// });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
