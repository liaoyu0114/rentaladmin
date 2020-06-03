<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>看房管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane label="看房申请" name="first">
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
              :total="onecount"
              @current-change="pageOneChange"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已看房" name="second">
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
                :total="twocount"
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
    name: 'baseform',
    components: {
      ShowHouseItem
    },
    data() {
      return {
        message: 'first',

        searchInput: '',
        loading: false,
        search: [],
        onecount: 0,
        twocount: 0,
        showHouseOne: [],
        showHouseTwo: [],
        showHouseOneQuery: {
          // 未执行
          "apply_type": 1,
          "apply_state": 0,
          "currIndex": 1,
          "pageSize": 10
        },
        showHouseTwoQuery: {
          // 已执行
          "apply_type": 1,
          "apply_state": 1,
          "currIndex": 1,
          "pageSize": 10
        }
      };
    },
    created() {
      this.showHouseTwoQuery.landlord_id = this.userInfo.landlord_id
      this.showHouseOneQuery.landlord_id = this.userInfo.landlord_id

      this.loadApplyUn();
      this.loadApplyDone()
    },
    activated() {
      this.loadApplyUn();
      this.loadApplyDone();
    },
    methods: {
      // 未执行
      loadApplyUn() {
        if (this.userInfo.landlord_id) {
          this.$post("/selectApplyListByLandlordId",  this.showHouseOneQuery).then(res => {
            console.log(res);
            if (res.code === "000") {
              this.onecount = res.count
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
              this.twocount = res.count
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
      inputSearch() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.search = this.orders;
        }, 3000 * Math.random());
      },
      stateAdd(orderId) {
        this.orders.forEach(item => {
          console.log(item);
          if (item.orderId === orderId) {
            if (item.state <= 3) {
              item.state += 1;
            }
          }
        });
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
        this.$post("/updateApply", {
            "apply_id": payload.apply.apply_id,
          "apply_state": 1
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("修改成功");
            this.loadApplyDone();
            this.loadApplyUn();
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })
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
  };
</script>

<style>
  .el-upload--text{
    width: auto;
    height: auto;
    border: none;
  }
</style>
