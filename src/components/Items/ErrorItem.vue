<template>
  <div class="lease-item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="lease-id">ID：{{scope.row.obstacle_id}}</span>
        <span class="show-time">
          创建时间：{{scope.row.obstacle_time | formatDate("YYYY-MM-DD HH:mm")}}
        </span>
        <span class="com-time">完成时间： <span v-if="scope.row.obstacle_completiontime">{{scope.row.obstacle_completiontime | formatDate("YYYY-MM-DD HH:mm")}}</span>
        <span v-else>未完成</span></span>
        <div class="header-button">
          <div v-if="scope.row.obstacle_state !== 2" style="margin-right: 10px">
            <el-button type="primary" plain  size="small" @click="beginDone" v-if="scope.row.obstacle_state === 0">开始处理</el-button>
            <el-button type="primary" plain  size="small" @click="finishDone" v-if="scope.row.obstacle_state === 1">处理完成</el-button>
          </div>
          <div><el-button type="danger" plain  size="small" @click="deleteShow">删除</el-button></div>
        </div>

      </div>
      <el-row :gutter="10">
        <el-col :span="6" class="lease-user">
          <div class="lease-user-avatar">
            <el-avatar :src="scope.row.tenant.tenant_pic" :size="75"></el-avatar>
          </div>
          <div class="lease-user-name">
            {{scope.row.tenant.tenant_nickname}}
          </div>
          <div class="lease-user-contact">
            {{scope.row.tenant.tenant_contact}}
          </div>
        </el-col>
        <el-col :span="6" class="lease-house-pic">
          <el-image
                  class="item-image"
                        fit="contain"
                  :src="scope.row.house.housingresources_pic[0]"
                  :preview-src-list="scope.row.house.housingresources_pic"></el-image>
        </el-col>
        <el-col :span="12" class="lease-houser">
          <div class="lease-house-name">
            <span>房屋名称：{{scope.row.house.housingresources_name}}</span><br>
            <span>月租金：{{scope.row.house.housingresources_price}}</span><br>
            <span>地址：{{scope.row.house.housingresources_address}}</span><br>
            <span>押金类型：{{scope.row.house.housingresources_renttype}}</span><br>
            <span>所在小区：{{scope.row.house.housingresources_village}}</span>
          </div>
        </el-col>
        <el-col :span="24" class="show-remark">
          {{scope.row.obstacle_detail}}
        </el-col>
      </el-row>
    </el-card>


  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'ShowHouseItem',
        props: {
            scope: {
            }
        },
        mounted() {
            this.scope.row.landlord = this.userInfo;
            this.scope.row.house = this.house[0]
            this.scope.row.tenant = this.userInfoU
        },
        computed: {
            ...mapGetters(["house","userInfo", "userInfoU"])
        },
        methods: {
            beginDone() {
                this.$confirm('即将开始处理, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('show');
                    this.$emit("beginDone",this.scope.row)
                }).catch(() => {

                });
            },
            finishDone() {
                this.$confirm('即将完成本次报障处理, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('show');
                    this.$emit("finishDone",this.scope.row)
                }).catch(() => {

                });
            },
            deleteShow() {
                this.$confirm('即将删除此报障, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("deleteShow", this.scope.row)
                }).catch(() => {

                });
            }

        }
    };
</script>

<style scoped>
  .header-button {
    display: flex;
    float: right;
    padding: 3px 0;
  }
  .lease-id {
    margin-right: 10px;

  }
  .lease-house span{
    font-size: 15px;
    color: #409eff;
    font-weight: 500;
  }
  .lease-user {
    display: flex;
    justify-content: center;
    align-content: flex-start;
    flex-wrap: wrap;
    border-right: #bbb solid 1px;
  }
  .lease-user-avatar,
  .lease-user-name,
  .lease-user-contact {
    width: 100%;
    text-align: center;
  }
  .lease-houser {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }
  .lease-house-pic {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lease-house-name {
    width: 100%;
  }
</style>