import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
  userInfo: {
      landlord_id: 123,
      landlord_phone: 18382389882,
      landlord_password: "",
      landlord_mail: "1453473547@qq.com",
      landlord_nickname: "昵称测试",
      landlord_realname: "真实姓名",
      landlord_IDnumber: "身份证510xxxxxxxxx",
      landlord_contact: "联系电话",
      landlord_pic: "https://s1.ax1x.com/2020/04/17/JVI740.jpg",
      landlord_sex: "1",
      landlord_time: new Date()
  },
    house: [
        {
            housingresources_id: 1982,
            housingresources_name: "测试测试测试测试才素材素材素材",
            housingresources_category: "整套出租",
            housingresources_village: "小区校区",
            housingresources_type: "两室一厅一卫",
            housingresources_introduce: "基本介绍",
            housingresources_floor: "楼层",
            housingresources_orientations: "朝向",
            housingresources_renttype: "押一付三",
            housingresources_price: 920,
            housingresources_area: "面积",
            housingresources_longitude: "",
            housingresources_latitude: "",
            housingresources_address: "地址地址地址",
            housingresources_pic: [
                "https://assets.hhh233.xyz/181.jpg",
                "https://assets.hhh233.xyz/045%20%282%29.jpg",
                "https://assets.hhh233.xyz/05-8.jpg"
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