<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i> 退房管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane label="退房申请" name="first">
          <el-table :data="showHouseOne" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <show-house-item
                  :scope="scope.row"
                  @cannelShow="cannelShow"
                  @deleteShow="deleteShow"
                ></show-house-item>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="showHouseOneQuery.pageIndex"
              :page-size="showHouseOneQuery.pageSize"
              :total="oneCount"
              @current-change="pageOneChange"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已退房" name="second">
          <template>
            <el-table :data="showHouseTwo" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <show-house-item
                    :scope="scope.row"
                    @cannelShow="cannelShow"
                    @deleteShow="deleteShow"></show-house-item>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="showHouseTwoQuery.pageIndex"
                :page-size="showHouseTwoQuery.pageSize"
                :total="twoCount"
                @current-change="pageTwoChange"
              ></el-pagination>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ShowHouseItem from '../Items/ShowHouseItem';
  import { mapGetters } from "vuex"
  export default {
    name: 'editor',
    data: function(){
      return {
        message: 'first',
        searchInput: '',
        oneCount: 0,
        twoCount: 0,
        loading: false,
        search: [],
        showHouseOne: [
          // {
          //   apply_id: 192873,
          //   apply_time: new Date().getTime(),
          //   apply_type: 0,
          //   apply_remake: "备注信息",
          //   apply_liaison: "看房人姓名",
          //   apply_contact: "看房人联系方式",
          //   apply_state: 0,
          //   landlord: this.userInfo,
          //   // house: this.house[0],
          //   tenant: this.userInfoU
          // }
        ],
        showHouseTwo: [
        ],
        showHouseOneQuery: {
          // 未执行
          "apply_type": 0,
          "apply_state": 0,
          "currIndex": 1,
          "pageSize": 10
        },
        showHouseTwoQuery: {
          // 已执行
          "apply_type": 0,
          "apply_state": 1,
          "currIndex": 1,
          "pageSize": 10
        }
      }
    },
    components: {
      ShowHouseItem
    },
    created() {
      this.showHouseTwoQuery.landlord_id = this.userInfo.landlord_id;
      this.showHouseOneQuery.landlord_id = this.userInfo.landlord_id;

      this.loadApplyUn();
      this.loadApplyDone()
    },
    activated() {
      this.loadApplyUn();
      this.loadApplyDone()
    },
    methods: {
      // 未执行
      loadApplyUn() {
        if (this.userInfo.landlord_id) {
          this.$post("/selectApplyListByLandlordId",  this.showHouseOneQuery).then(res => {
            console.log(res);
            if (res.code === "000") {
              this.oneCount = res.count;
              this.showHouseOne = res.applyInfoList.map(item => {
                // item.house = {
                //   housingresources_pic:[],
                //   housingresources_type: {
                //     first: "",
                //     second: "",
                //     third: ""
                //   }
                // };
                item.house = item.housingresources;
                item.house.housingresources_type = JSON.parse(item.house.housingresources_type);
                item.house.housingresources_pic = JSON.parse(item.house.housingresources_pic);
                return item
              })
            }
          })
        }
      },
      loadApplyDone() {
        if (this.userInfo.landlord_id) {
          this.$post("/selectApplyListByLandlordId", this.showHouseTwoQuery).then(res => {
            console.log(res);
            if (res.code === "000") {
              this.twoCount = res.count;
              this.showHouseTwo = res.applyInfoList.map(item => {
                // item.house = {
                //   housingresources_pic:[],
                //   housingresources_type: {
                //     first: "",
                //     second: "",
                //     third: ""
                //   }
                // };
                item.house = item.housingresources;
                item.house.housingresources_type = JSON.parse(item.house.housingresources_type);
                item.house.housingresources_pic = JSON.parse(item.house.housingresources_pic);
                return item
              })
            }
          })
        }
      },
      pageOneChange(val) {
        this.showHouseOneQuery.currIndex = val;
        this.loadApplyUn()
      },
      pageTwoChange(val) {
        this.showHouseTwoQuery.currIndex = val;
        this.loadApplyDone()
      },
      cannelShow(payload) {
        let index = this.showHouseOne.findIndex(item => {
          return item.apply_id === payload.apply_id
        });
        console.log(index);
        this.showHouseOne.splice(index, 1);
        payload.apply_state = 1;
        this.showHouseTwo.push(payload)
      },
      deleteShow(payload) {
        if (payload.apply_state === 0) {
          let index = this.showHouseOne.findIndex(item => {
            return item.apply_id === payload.apply_id
          });
          this.showHouseOne.splice(index, 1);
        } else {
          let index = this.showHouseTwo.findIndex(item => {
            return item.apply_id === payload.apply_id
          });this.showHouseTwo.splice(index, 1);

        }
      }
    },
    computed: {
      ...mapGetters(["userInfo", "house", "userInfoU"]),
    }
  }
</script>
<style scoped>
  .editor-btn{
    margin-top: 20px;
  }
</style>
