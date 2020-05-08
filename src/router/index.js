import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/myhouse',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/MyHouse.vue'),
                    meta: { title: '房源管理' }
                },
                {
                    path: '/rental',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Rental.vue'),
                    meta: { title: '租赁管理' }
                },
                {
                    path: '/showhouse',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/ShowHouse.vue'),
                    meta: { title: '看房管理' }
                },
                {
                    path: '/delhouse',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/DelHouse.vue'),
                    meta: { title: '看房管理' }
                },
                {
                    path: '/error',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Error.vue'),
                    meta: { title: '报障管理' }
                },
                {
                    path: '/money',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Money.vue'),
                    meta: { title: '租金管理' }
                },
                {
                    path: '/paper',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Paper.vue'),
                    meta: { title: '合同管理' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
