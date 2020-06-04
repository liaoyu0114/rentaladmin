<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-money"></i> 租金管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!--<el-input v-model="query.name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>-->
        <!--<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
        <el-button type="primary" @click="dialogVisiable = true">新增</el-button>
        <el-tabs v-model="message" @tab-click="handleClick">
          <!--<el-tab-pane label="全部" name="first"></el-tab-pane>-->
          <el-tab-pane label="未缴纳" name="first"></el-tab-pane>
          <el-tab-pane label="已缴纳" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <el-table
        :data="showData"
        v-loading="loading"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="rent.rent_id" label="租金ID" width="70" align="center"></el-table-column>
        <el-table-column label="租客昵称" align="center">
          <template slot-scope="scope">{{scope.row.tenant.tenant_nickname}}（ID: {{scope.row.tenant.tenant_id}}）</template>
        </el-table-column>
        <el-table-column label="应交租金" align="center">
          <template slot-scope="scope">￥{{scope.row.rent.rent_price }}</template>
        </el-table-column>
        <el-table-column label="截止日期" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.rent.rent_time | formatDate("YYYY-MM-DD")}}</template>
        </el-table-column>
        <el-table-column label="缴纳时间" align="center">
          <template
            slot-scope="scope"
          >
            <span v-if="scope.row.rent.rent_endtime">{{scope.row.rent.rent_endtime | formatDate("YYYY-MM-DD")}}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="缴纳状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.rent.rent_type === 1" style="color:#409eff;">已缴纳</span>
            <span v-else style="color: #f56c6c">未缴纳</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.rent.rent_type === 0"
              @click="confirmRent(scope.row)"
            >确认收租</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.prevent="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--这里是分页-->
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.currIndex"
          :page-size="query.pageSize"
          :total="showData.length"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 新建 -->
    <el-dialog title="新增租金管理" :visible.sync="dialogVisiable" width="30%">
      <div class="from-box">
        <el-form :model="newMoney"
                 ref="newMoney" label-position="left" label-width="80px">
          <el-form-item label="选择租客">
            <el-select v-model="newMoney.tenant_id" placeholder="选择租客">
              <el-option v-for="(item, index) in lease" :label="item.tenant_nickname" :value="item.tenant_id"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="输入租金" style="width: 274px">
            <el-input v-model="newMoney.rent_price" placeholder="输入每月租金" min="0"></el-input>
          </el-form-item>
          <!--<el-form-item label="开始时间" style="width: 274px">-->
            <!--<el-date-picker-->
              <!--type="date"-->
              <!--placeholder="开始日期"-->
              <!--v-model="newMoney.rent_time"-->
              <!--style="width: 100%;"-->
            <!--&gt;</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="截止日期" style="width: 274px">
            <el-date-picker
              type="date"
              placeholder="截止日期"
              v-model="newMoney.rent_time"
              style="width: 100%;"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onChange">确认</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'upload',
    data: function() {
      return {
        message: 'first',
        count: 0,
        dialogVisiable: false,
        showData: [],
        tableData: [],
        loading: true,
        query: {
          "rent_type": 0,
          "currIndex": 1,
          "pageSize": 9999
        },
        newMoney: {
            tenant_id: '',
          rent_price: '',
          rent_time: '',
          rent_endtime: ''
        },
        temp: {
        },
        temp2: {
        },
        leaseOneQuery: {
          "lease_type": 0,
          "currIndex": 1,
          "pageSize": 9999
        },
        // 租客
        lease: []
      };
    },
    created() {
      this.query.landlord_id = this.userInfo.landlord_id;
      this.leaseOneQuery.landlord_id = this.userInfo.landlord_id;
      this.newMoney.landlord_id = this.userInfo.landlord_id;
      this.showNO();
        this.loadRentOne();
    },
    activated() {
      this.showNO();
      this.loadRentOne();
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      cancel() {
        for (let key in this.newMoney) {
          this.newMoney[key] = ""
        }
        this.dialogVisiable = false;
      },
      confirmRent(scope) {
        this.$post("/payRent", {
          "rent_id": scope.rent.rent_id
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("修改成功");
            this.showNO()
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })
      },
      loadRentOne() {
        this.leaseOneQuery.landlord_id  = this.userInfo.landlord_id;
        this.$post("/selectLeaseListByLandlordId", this.leaseOneQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.lease = res.leaseInfoList.map(item => {
              return item.tenant
            })
          } else {
            this.$message.warning(res.msg);
          }
        }).catch(err => {
          console.log(err);
        })

      },
      onChange() {
        this.$post("/AddRent", {
          "landlord_id": this.userInfo.landlord_id,
          "tenant_id": this.newMoney.tenant_id,
          "rent_price": this.newMoney.rent_price,
          "rent_time": this.newMoney.rent_time
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("添加成功")
            this.dialogVisiable = false;
            for (let key in this.newMoney) {
              this.newMoney[key] = ""
            }
            this.showNO()
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })

      },
      // 删除操作
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.showData.splice(index, 1)
            this.$message({
              message: `删除了ID为${row.rent.rent_id}的条目`,
              type: 'success'
            });
          })
          .catch(() => {
            this.$message.error('发生未知错误，删除失败');
          });
      },
      // 编辑操作
      handleEdit(index, row) {},
      handleSearch() {},
      handlePageChange(val) {
        console.log(val);
        let count = 0;
        let min = 10 * (val - 1);
        let max = 10 * (val - 1) + 10;
        if (max > this.tableData.length + 1) {
          count = this.tableData.length + 1 - min;
        }

        this.showData = this.tableData.slice(min, max);
      },
      handleClick(tab, event) {
        console.log(tab, event);
        this.loading = true;

        if (tab.index === '0') {
          this.showNO();
        } else if (tab.index === '1') {
          this.showYes();
        } else {

        }
      },
      showNO() {
        this.query.rent_type = 0;
        this.query.currIndex = 1;
        this.$post("/selectRentListByLandlordId", this.query).then(res => {
          console.log(res);
          if (res.code === "000") {
              this.tableData = res.rentInfoList
            this.handlePageChange(1)
          } else {

          }
          this.loading = false
        }).catch(err => {
          console.log(err);
          this.loading = false
        })
      },
      showYes() {
        this.query.rent_type = 1;
        this.query.currIndex = 1;
        this.$post("/selectRentListByLandlordId", this.query).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.tableData = res.rentInfoList;
            this.handlePageChange(1)
          } else {

          }
          this.loading = false
        }).catch(err => {
          console.log(err);
          this.loading = false
        })
      }
    }
  };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .table {
    width: 100%;
    font-size: 14px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .from-box {
    display: flex;
    justify-content: center;
  }
</style>
