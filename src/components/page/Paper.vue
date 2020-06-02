<template>
  <div class="paper">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-pie-chart"></i> 合同管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="newPaperFunc">新增合同</el-button>
      </div>
      <el-table :data="showData" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="contract.contract_id" label="合同ID" width="70" align="center"></el-table-column>
        <el-table-column label="房源名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.house.housingresources_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="租金/月" align="center">
          <template slot-scope="scope">￥{{scope.row.contract.contract_price}}</template>
        </el-table-column>
        <el-table-column label="租客" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tenant.tenant_realname}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="house.housingresources_renttype" label="租金类型" align="center"></el-table-column>
        <el-table-column label="起租时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.contract.contract_begintime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.contract.contract_endtime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.prevent="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button size="mini" @click="showPaperFunc(scope.$index, scope.row)">查看</el-button>
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
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="tableData.length"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="showPaper" title="查看/打印房屋租赁合同" custom-class="paper-show">
      <show-paper :scope="paper"></show-paper>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogVisiable" width="30%">
      <div class="from-box">
        <el-form ref="form" :model="paperForm" label-width="100px" label-position="left">
          <el-form-item label="合同ID" v-if="editPaper">
            <el-input v-model="paperForm.contract_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="房源">
            <el-select v-model="paperForm.house.housingresources_name" placeholder="请选择房源" :disabled="editPaper">
              <el-option v-for="(item, index) in house" :label="item.housingresources_name" :value="item.housingresources_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租客" style="width: 294px">
              <!--<el-input v-model="newRental.tenant.tenant_nickname" placeholder="搜索租客"></el-input>-->
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="paperForm.tenant.tenant_nickname"
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
            <!--<el-input v-model="paperForm.tenant.tenant_nickname" :disabled="editPaper" placeholder="搜索租客"></el-input>-->
          </el-form-item>
          <el-form-item label="价格" style="width: 294px">
            <el-input v-model="paperForm.contract_price" placeholder="输入每月租金" type="number"></el-input>
          </el-form-item>
          <el-form-item label="租金缴纳方式">
            <el-select v-model="paperForm.housingresources_renttype">
              <el-option label="押一付一" value="押一付一"></el-option>
              <el-option label="押一付三" value="押一付三"></el-option>
              <el-option label="半年付" value="半年付"></el-option>
              <el-option label="年付" value="年付"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期" style="width: 294px">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="paperForm.contract_begintime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" style="width: 294px">
            <el-date-picker
              placeholder="结束日期"
              type="date"
              v-model="paperForm.contract_endtime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-if="newPaper">立即创建</el-button>
            <el-button type="primary" @click="onChange" v-else>确认修改</el-button>
            <el-button @click="dialogVisiable = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import ShowPaper from '../Items/ShowPaper';
  import { mapGetters } from 'vuex';
  export default {
    name: 'basecharts',
    components: {
      ShowPaper
    },
    data() {
      return {
        newPaper: false,
        editPaper: false,
        showPaper: false,
        dialogVisiable: false,
        title: '',
        showData: [],
        tableData: [],
        query: {
          "currIndex": 1,
          "pageSize": 10
        },
        paperForm: {
          contract_id: '',
          contract_price: '',
          housingresources_renttype: '',
          contract_begintime: '',
          contract_endtime: '',
          house: {
            housingresources_name: ''
          },
          tenant: {
            tenant_nickname: ""
          }
        },
        paper: {},
        temp: {
          contract_id: 2137812,
          contract_price: 927,
          housingresources_renttype: '年付',
          contract_begintime: new Date().getTime(),
          contract_endtime: new Date().getTime() + 9999999999999
        },
        houseQuery: {

          "landlord_id": '0',
          "currIndex": 1,
          "pageSize": 9999
        },
        // 租客
        house: [],
        houseArr: []
      };
    },
    created() {
      this.query.landlord_id = this.userInfo.landlord_id;
      this.houseQuery.landlord_id = this.userInfo.landlord_id

      this.loadHouse();
      this.loadPaper()


    },
    activated() {
      this.loadHouse();
      this.loadPaper()

    },
    methods: {
      loadPaper() {
        this.$post("/selectContractListByLandlordId", this.query).then(res => {
          if (res.code === "000") {
            this.showData = res.contractInfoList.map(item => {
              item.house =  {
                housingresources_name:"21312",
                housingresources_renttype: "押一付一"
              }
              return item
            })
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      loadHouse() {
        this.houseQuery.landlord_id  = this.userInfo.landlord_id;
        this.$post("/selectHousingresourcesByLandlordId", this.houseQuery).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.house = res.housingresourceslist.map(item => {
              item.housingresources_pic = JSON.parse(item.housingresources_pic)
              item.housingresources_type = JSON.parse(item.housingresources_type)
              return item
            })
          } else {
            this.$message.warning(res.msg);
          }
        }).catch(err => {
          console.log(err);
        })

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
      handleSelect(item) {
        console.log(item);
        this.paperForm.tenant.tenant_nickname = item.tenant_nickname
        this.paperForm.tenant.tenant_id = item.tenant_id
      },
      onChange() {
        this.$post("/updateContract", {
          "contract_id": this.paperForm.contract_id,
          "housingresources_renttype": this.paperForm.housingresources_renttype,
          "contract_price": this.paperForm.contract_price,
          "contract_begintime": this.paperForm.contract_begintime,
          "contract_endtime": this.paperForm.contract_endtime
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("修改成功")
            this.loadPaper()
            this.dialogVisiable = false
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })
      },
      onSubmit() {
        this.$post("/AddContract", {
          "tenant_id": this.paperForm.tenant.tenant_id,
          "landlord_id": this.userInfo.landlord_id,
          "housingresources_id": this.paperForm.house.housingresources_name,
          "housingresources_renttype": this.paperForm.housingresources_renttype,
          "contract_price": this.paperForm.contract_price,
          "contract_begintime": this.paperForm.contract_begintime,
          "contract_endtime": this.paperForm.contract_endtime
        }).then(res => {
          console.log(res);
          if (res.code === "000") {
            this.$message.success("添加成功")
            this.dialogVisiable = false;
              this.loadPaper();
              this.$refs.form.resetFields()
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error("未知错误")
        })
      },
      newPaperFunc() {
        this.paperForm = {
          contract_id: '',
          contract_price: '',
          housingresources_renttype: '',
          contract_begintime: '',
          contract_endtime: '',
          house: {
            housingresources_name: ''
          },
          tenant: {
            tenant_nickname: ""
          }
        }
        this.dialogVisiable = true;
        this.newPaper = true;
        this.editPaper = false;
        this.title = "添加新合同"
      },
      showPaperFunc(index, row) {
        this.showPaper = true;
        this.paper = row;
      },
      //搜索
      handleSearch() {},
      // 删除操作
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.$message.success('删除成功');
            this.showData.splice(index, 1);
          })
          .catch(() => {});
      },
      // 编辑操作
      handleEdit(index, row) {
        this.dialogVisiable = true;
        this.newPaper = false;
        this.editPaper = true;
        this.title = "编辑合同";
        this.paperForm = {
          contract_id: row.contract.contract_id,
          contract_price: row.contract.contract_price,
          housingresources_renttype: row.contract.housingresources_renttype,
          contract_begintime: row.contract.contract_begintime,
          contract_endtime: row.contract.contract_endtime,
          house: row.house,
          tenant: row.tenant
        }
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val);
        let count = 0;
        let min = 10 * (val - 1);
        let max = 10 * (val - 1) + 10;
        if (max > this.tableData.length + 1) {
          count = this.tableData.length + 1 - min;
        }

        this.showData = this.tableData.slice(min, max);
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
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
<style>
  .paper-show > .el-dialog__body {
    padding: 0 20px !important;
  }
</style>
