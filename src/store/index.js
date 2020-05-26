import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
    userInfo: {

    },
    userInfoU: {
        tenant_id: 2123,
        tenant_phone: 18382389882,
        tenant_password: "",
        tenant_mail: "example@hhh233.xyz",
        tenant_nickname: "租客昵称",
        tenant_realname: "租客姓名",
        tenant_IDnumber: "身份证510xxxxxx",
        tenant_contact: "联系电话",
        tenant_sex: 1,
        tenant_pic: "https://assets.hhh233.xyz/20200404232344_TYdzz.jpeg",
        tenant_time: new Date().getTime()
    },
    house: [
        {
            housingresources_id: 1982,
            housingresources_name: "测试测试测试测试才素材素材素材",
            housingresources_category: "整套出租",
            housingresources_village: "小区校区",
            housingresources_type: {first: '1',second: '1',third: '1'},
            housingresources_introduce: "基本介绍",
            housingresources_floor: "楼层",
            housingresources_orientations: "朝向",
            housingresources_renttype: "押一付三",
            housingresources_price: 920,
            housingresources_area: "80",
            housingresources_longitude: "",
            housingresources_latitude: "",
            housingresources_address: "地址地址地址",
            housingresources_pic: [
                "https://s1.ax1x.com/2020/04/14/Gxx9yR.jpg",
                "https://s1.ax1x.com/2020/04/14/GznAK0.jpg",
                "https://s1.ax1x.com/2020/04/14/Gznlx1.jpg"
            ],
            housingresources_state: ""
        }
    ]
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});

export default store