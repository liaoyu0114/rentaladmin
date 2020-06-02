<template>
  <div class>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 租赁管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`出租中`" name="first">
          <el-table :data="leaseOrderOne" :show-header="false" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <lease-item
                  :scope="scope.row"
                  @cannelLease="cannelLease"
                  @deleteLease="deleteLease"
                ></lease-item>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page="leaseOneQuery.currIndex"
              :page-size="leaseOneQuery.pageSize"
              :total="leaseOrderOne.length"
              @current-change="pageOneChange"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="`租赁完成`" name="second">
          <template>
            <el-table :data="leaseOrderTwo" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <lease-item
                    :scope="scope.row"
                    @cannelLease="cannelLease"
                    @deleteLease="deleteLease"
                  ></lease-item>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="leaseTwoQuery.currIndex"
                :page-size="leaseTwoQuery.pageSize"
                :total="leaseOrderTwo.length"
                @current-change="pageTwoChange"
              ></el-pagination>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="`新增租赁`" name="third">
          <template>
            <el-form :model="newRental" ref="newRental" label-width="100px" label-position="left">
              <el-form-item label="选择租客"  style="width:294px">
                <!--<el-input v-model="newRental.tenant.tenant_nickname" placeholder="搜索租客"></el-input>-->
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="newRental.tenant.tenant_nickname"
                  clearable
                  class="search-el"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="输入租客id搜索"
                  @select="handleSelect"
                >
                  <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                  <template slot-scope="{ item }">
                    <div class="name">ID: {{ item.tenant_id }}</div>

                    <span class="addr">name: {{ item.tenant_nickname }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="选择房源">
                <el-select v-model="newRental.house.housingresources_name" placeholder="选择房源">
                  <el-option v-for="item in house"
                             :key="item.housingresources_id"
                             @change="selcetChange"
                             :label="item.housingresources_name"
                             :value="item.housingresources_id"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onChange" style="width:194px">确认</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-tab-pane>
        <!--<el-tab-pane :label="`搜索`" name="forth">-->
        <!--<template>-->
        <!--<el-input v-model="searchInput" placeholder="请输入内容" @input="inputSearch"></el-input>-->
        <!--<el-table :data="search" :show-header="false" style="width: 100%">-->
        <!--<el-table-column>-->
        <!--<template slot-scope="scope">-->
        <!--<lease-item :scope="scope" @stateAdd="stateAdd"></lease-item>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->

        <!--<div class="pagination" v-if="leaseOrderThree.length !== 0">-->
        <!--<el-pagination-->
        <!--background-->
        <!--layout="total, prev, pager, next"-->
        <!--:current-page="leaseThreeQuery.currIndex"-->
        <!--:page-size="leaseThreeQuery.pageSize"-->
        <!--:total="pageTotal"-->
        <!--@current-change="pageThreeChange"-->
        <!--&gt;</el-pagination>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import LeaseItem from '../Items/LeaseItem';
  import { mapGetters } from 'vuex';
  export default {
    name: 'tabs',
    components: {
      LeaseItem
    },
    data() {
      return {
        onefirst: false,
        twofirst: false,
        dialogVisiable: false,
        message: 'first',
        searchInput: '',
        loading: false,
        search: [],
        newRental: {
          tenant: {
            tenant_nickname: ''
          },
          house: {
            housingresources_name: ""
          }
        },
        leaseOrderOne: [

        ],
        leaseOrderTwo: [

        ],
        leaseOrderThree: [],
        leaseOneQuery: {

          "lease_type": '0',
          "currIndex": 1,
          "pageSize": 9999
        },
        leaseTwoQuery: {
          "lease_type": '1',
          "currIndex": 1,
          "pageSize": 9999
        },
        leaseThreeQuery: {
          "name": '',
          "currIndex": 1,
          "pageSize": 10
        },
        query: {
          "landlord_id": "",
          "housingresources_name": '',
          "currIndex": 1,
          "pageSize": 9999
        },
        house:[]
      };
    },
    created() {
      this.loadLeaseOne();
      this.loadLeaseTwo();
      this.loadHouse();
      this.onefirst = true;
      this.twofirst = true;
    },
    // activated() {
    //     this.loadLeaseOne()
    //   this.loadLeaseTwo()
    //   this.loadHouse()
    // },
    methods: {
      selcetChange(item) {
        console.log(item);
      },
      handleSelect(item) {
        console.log(item);
        this.newRental.tenant.tenant_nickname = item.tenant_nickname
        this.newRental.tenant.tenant_id = item.tenant_id
      },
      querySearchAsync(queryString, cb) {
        let params = {
          "tenant_id": queryString
        };
        if (queryString === '') cb();
        else {
          this.$post("/selectTenantById", params).then(res => {
            if (res.code === "000") {
              cb([res.tenant])
            } else {
              // this.$message.warning(res.msg)
            }
          }).catch(err => {
            console.log(err);
          });
        }
      },
      loadHouse() {
        this.query.landlord_id = this.userInfo.landlord_id
        this.$post("/selectHousingresourcesByLandlordId", this.query).then(res => {
          if (res.code === "000") {

            this.house = res.housingresourceslist.map(item => {
              item.housingresources_pic = JSON.parse(item.housingresources_pic);
              item.housingresources_type = JSON.parse(item.housingresources_type)
              return item
            })

          } else {
            this.$message.warning(res.msg)
          }
          // this.loading = false
        }).catch(err => {
          console.log(err);
          this.$message.error("网络错误");
          // this.loading = false;
        })
      },
      loadLeaseOne() {
        // if (!this.onefirst) {
        this.leaseOneQuery.landlord_id  = this.userInfo.landlord_id;
        this.$post("/selectLeaseListByLandlordId", this.leaseOneQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.leaseOrderOne = res.leaseInfoList.map(item => {
              item.house = {
                housingresources_pic: [],
                housingresources_type: {
                  first: "",
                  second: "",
                  third: ""
                }
              }
              return item
            });
          } else {
            this.$message.warning(res.msg);
          }
        }).catch(err => {
          console.log(err);
        })
        // }

      },
      loadLeaseTwo() {
        // if (!this.twofirst) {
        this.leaseTwoQuery.landlord_id = this.userInfo.landlord_id;
        this.$post("/selectLeaseListByLandlordId", this.leaseTwoQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.leaseOrderTwo = res.leaseInfoList.map(item => {
              item.house = {
                housingresources_pic: [],
                housingresources_type: {
                  first: "",
                  second: "",
                  third: ""
                }
              };
              return item
            });
          } else {
            this.$message.warning(res.msg);
          }
        }).catch(err => {
          console.log(err);
        })
        // }
      },

      onChange() {
        let data = {
          "tenant_id": this.newRental.tenant.tenant_id,
          "housingresources_id": this.newRental.house.housingresources_name
        }
        this.$post("/AddLease", data).then(res => {
          if (res.code === "000") {
            this.$message.success("添加成功")
            this.$refs.newRental.resetFields()
            this.newRental.tenant.tenant_nickname = ""
            this.newRental.house.housingresources_name = ""
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      inputSearch() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.search = this.orders;
        }, 3000 * Math.random());
      },
      cannelLease(payload) {
        this.$post("/updateLease", {
          "lease_id": payload.lease.lease_id,
          "housingresources_id": payload.house.housingresources_id
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("成功退房");
            this.loadLeaseOne();
            this.loadLeaseTwo();
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })
      },
      deleteLease(payload) {
        let index = this.leaseOrderTwo.findIndex(item => {
          return item.lease_id === payload.lease_id;
        });
        this.leaseOrderTwo.splice(index, 1);
      },
      pageOneChange(val) {},
      pageTwoChange(val) {},
      pageThreeChange(val) {}
    },
    computed: {
      ...mapGetters(['userInfo'])
    }
  };
</script>

<style>
  .message-title {
    cursor: pointer;
  }
  .handle-row {
    margin-top: 30px;
  }
  .name {
    font-size: 12px;
    color: #999999;
  }
</style>

