<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-error"></i> 报障管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane label="未处理报障" name="first">
          <el-table :data="showErrorOne" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <error-item
                  :scope="scope"
                  @beginDone="beginDone"
                  @finishDone="finishDone"
                  @deleteShow="deleteShow"
                ></error-item>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="showErrorOneQuery.currIndex"
              :page-size="showErrorOneQuery.pageSize"
              :total="oneCount"
              @current-change="pageOneChange"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="处理中" name="second">
          <template>
            <el-table :data="showErrorTwo" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <error-item
                    :scope="scope"
                    @beginDone="beginDone"
                    @finishDone="finishDone"
                    @deleteShow="deleteShow"></error-item>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="showErrorTwoQuery.currIndex"
                :page-size="showErrorTwoQuery.pageSize"
                :total="twoCount"
                @current-change="pageTwoChange"
              ></el-pagination>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="处理完成" name="third">
          <template>
            <el-table :data="showErrorThree" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <error-item
                    :scope="scope"
                    @beginDone="beginDone"
                    @finishDone="finishDone"
                    @deleteShow="deleteShow"></error-item>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="showErrorThreeQuery.currIndex"
                :page-size="showErrorThreeQuery.pageSize"
                :total="threeCount"
                @current-change="pageThreeChange"
              ></el-pagination>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ErrorItem from '../Items/ErrorItem';
  import { mapGetters } from "vuex"
  export default {
    name: 'markdown',
    data: function(){
      return {
        message: 'first',
        searchInput: '',
        oneCount: 0,
        twoCount: 0,
        threeCount: 0,
        loading: false,
        search: [],
        showErrorOne: [
          {
            obstacle_id: 192873,
            obstacle_time: new Date().getTime(),
            obstacle_state: 0,// 状态（0未处理、1正在处理、2已完成）
            obstacle_detail: "备注信息",
            // obstacle_completiontime: "",//完成时间
            obstacle_pic: [

            ],
            landlord: this.userInfo,
            // house: this.house[0],
            tenant: this.userInfoU
          }
        ],
        showErrorTwo: [
          {
            obstacle_id: 192873,
            obstacle_time: new Date().getTime(),
            obstacle_state: 1,// 状态（0未处理、1正在处理、2已完成）
            obstacle_detail: "备注信息",
            // obstacle_completiontime: new Date().getTime(),//完成时间
            obstacle_pic: [

            ],
            landlord: this.userInfo,
            // house: this.house[0],
            tenant: this.userInfoU
          }
        ],
        showErrorThree: [
          {
            obstacle_id: 192873,
            obstacle_time: new Date().getTime(),
            obstacle_state: 2,// 状态（0未处理、1正在处理、2已完成）
            obstacle_detail: "备注信息",
            obstacle_completiontime: new Date().getTime(),//完成时间
            obstacle_pic: [

            ],
            landlord: this.userInfo,
            // house: this.house[0],
            tenant: this.userInfoU
          }
        ],
        showErrorOneQuery: {
          "obstacle_state": 0,
          "currIndex": 1,
          "pageSize": 10
        },
        showErrorTwoQuery: {
          "obstacle_state": 1,
          "currIndex": 1,
          "pageSize": 10
        },
        showErrorThreeQuery: {
          "obstacle_state": 2,
          "currIndex": 1,
          "pageSize": 10
        }
      };

    },
    components: {
      ErrorItem
    },
    created() {
      this.showErrorOneQuery.landlord_id = this.userInfo.landlord_id;
      this.showErrorTwoQuery.landlord_id = this.userInfo.landlord_id;
      this.showErrorThreeQuery.landlord_id = this.userInfo.landlord_id;
      this.loadUnDo();
      this.loadDoing();
      this.loadDone();
    },
    activated() {
      this.loadUnDo();
      this.loadDoing();
      this.loadDone();
    },
    methods: {
      loadUnDo() {
        this.$post("/selectObstacleListByLandlordId", this.showErrorOneQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.oneCount = res.count
            this.showErrorOne = res.obstacleList
          }
        })
      },
      loadDoing() {
        this.$post("/selectObstacleListByLandlordId", this.showErrorTwoQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.twoCount = res.count;
            this.showErrorTwo = res.obstacleList
          }
        })
      },
      loadDone() {
        this.$post("/selectObstacleListByLandlordId", this.showErrorThreeQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.threeCount = res.count;
            this.showErrorThree = res.obstacleList
          }
        })
      },
      pageOneChange(val) {
        this.showErrorOneQuery.currIndex = val
        this.loadUnDo()
      },
      pageTwoChange(val) {
        this.showErrorTwoQuery.currIndex = val
        this.loadDoing()
      },
      pageThreeChange(val) {
        this.showErrorThreeQuery.currIndex = val
        this.loadDone()
      },
      beginDone(payload) {
        let index = this.showErrorOne.findIndex(item => {
          return item.obstacle_id === payload.obstacle_id
        });
        console.log(index);
        this.showErrorOne.splice(index, 1);
        payload.obstacle_state = 1;
        this.showErrorTwo.push(payload)
      },
      finishDone(payload) {
        let index = this.showErrorTwo.findIndex(item => {
          return item.obstacle_id === payload.obstacle_id
        });
        console.log(index);
        this.showErrorTwo.splice(index, 1);
        payload.obstacle_state = 2;
        payload.obstacle_completiontime = new Date().getTime()
        this.showErrorThree.push(payload)
      },
      deleteShow(payload) {
        if (payload.obstacle_state === 0) {
          let index = this.showErrorOne.findIndex(item => {
            return item.obstacle_id === payload.obstacle_id
          });
          this.showErrorOne.splice(index, 1);
        } else if (payload.obstacle_state === 1){
          let index = this.showErrorTwo.findIndex(item => {
            return item.obstacle_id === payload.obstacle_id
          });this.showErrorTwo.splice(index, 1);

        } else {
          let index = this.showErrorThree.findIndex(item => {
            return item.obstacle_id === payload.obstacle_id
          });this.showErrorThree.splice(index, 1);
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
