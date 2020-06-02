<template>
  <div class="lease-item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="lease-id">ID：{{scope.obstacle.obstacle_id}}</span>
        <span class="show-time">
          创建时间：{{scope.obstacle.obstacle_time}}
        </span>
        <span class="com-time">完成时间： <span v-if="scope.obstacle.obstacle_completiontime">{{scope.obstacle.obstacle_completiontime}}</span>
        <span v-else>未完成</span></span>
        <div class="header-button">
          <div v-if="scope.obstacle.obstacle_state !== 2" style="margin-right: 10px">
            <el-button type="primary" plain  size="small" @click="beginDone" v-if="scope.obstacle.obstacle_state === 0">开始处理</el-button>
            <el-button type="primary" plain  size="small" @click="finishDone" v-if="scope.obstacle.obstacle_state === 1">处理完成</el-button>
          </div>
          <div><el-button type="danger" plain  size="small" @click="deleteShow">删除</el-button></div>
        </div>

      </div>
      <el-row :gutter="10">
        <el-col :span="6" class="lease-user">
          <div class="lease-user-avatar">
            <el-avatar :src="scope.tenant.tenant_pic" :size="75"></el-avatar>
          </div>
          <div class="lease-user-name">
            {{scope.tenant.tenant_nickname}}
          </div>
          <div class="lease-user-contact">
            {{scope.tenant.tenant_contact}}
          </div>
        </el-col>
        <el-col :span="6" class="lease-house-pic">
          <el-image
                  class="item-image"
                        fit="contain"
                  :src="scope.house.housingresources_pic[0]"
                  :preview-src-list="scope.house.housingresources_pic"></el-image>
        </el-col>
        <el-col :span="12" class="lease-houser">
          <div class="lease-house-name">
            <span>房屋名称：{{scope.house.housingresources_name}}</span><br>
            <span>月租金：{{scope.house.housingresources_price}}</span><br>
            <span>地址：{{scope.house.housingresources_address}}</span><br>
            <span>押金类型：{{scope.house.housingresources_renttype}}</span><br>
            <span>所在小区：{{scope.house.housingresources_village}}</span>
          </div>
        </el-col>
        <el-col :span="24" class="show-remark">
          {{scope.obstacle.obstacle_detail}}
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
        computed: {
            ...mapGetters(["userInfo"])
        },
      created() {
        this.loadHouse()
      },
        methods: {
          loadHouse() {
            this.$post("/selectHousingresourcesById", {
              "housingresources_id": this.scope.obstacle.housingresources_id
            }).then(res => {
              if (res.code === "000") {
                let house = res.housingresources;
                house.housingresources_type = JSON.parse(house.housingresources_type);
                house.housingresources_pic = JSON.parse(house.housingresources_pic);
                this.scope.house = house;
              } else {
                this.$message.warning(res.msg);
              }
            }).catch(err => {
              console.log(err);
              this.$message.error("网络错误");
            });
          },
            beginDone() {
                this.$confirm('即将开始处理, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('show');
                    this.$emit("beginDone",this.scope)
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
                    this.$emit("finishDone",this.scope)
                }).catch(() => {

                });
            },
            deleteShow() {
                this.$confirm('即将删除此报障, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("deleteShow", this.scope)
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
