<template>
  <div class="lease-item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="lease-id">订单号：{{scope.lease.lease_id}}</span>
        <!--<span class="lease-house">房屋名称：<span>{{scope.house.housingresources_name}}</span></span>-->
        <div class="header-button">
          <div v-if="scope.lease.lease_type === '0'">
            <el-button type="primary" plain size="small" @click="cannelLease">退房</el-button>
          </div>
          <div v-else>
            <el-button type="danger" plain size="small" @click="deleteLease">删除</el-button>
          </div>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6" class="lease-user">
          <div class="lease-user-avatar">
            <el-avatar :src="scope.tenant.tenant_pic" :size="75"></el-avatar>
          </div>
          <div class="lease-user-name">{{scope.tenant.tenant_nickname}}</div>
          <div class="lease-user-contact">{{scope.tenant.tenant_contact}}</div>
        </el-col>
        <el-col :span="6" class="lease-house-pic">
          <el-image
            class="item-image"
            fit="contain"
            :src="scope.house.housingresources_pic[0]"
            :preview-src-list="scope.house.housingresources_pic"
          ></el-image>
        </el-col>
        <el-col :span="12" class="lease-houser">
          <div class="lease-house-name">
            <span>房屋名称：{{scope.house.housingresources_name}}</span>
            <br />
            <span>月租金：{{scope.house.housingresources_price}}</span>
            <br />
            <span>地址：{{scope.house.housingresources_address}}</span>
            <br />
            <span>押金类型：{{scope.house.housingresources_renttype}}</span>
            <br />
            <span>所在小区：{{scope.house.housingresources_village}}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'LeaseItem',
    props: {
      scope: {}
    },
    computed: {
      ...mapGetters(['house', 'userInfo', 'userInfoU'])
    },
    created() {
      // this.loadHouse()
    },
    methods: {
      loadHouse() {
        this.$post("/selectHousingresourcesById", {
          "housingresources_id": this.scope.lease.housingresources_id
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
      cannelLease() {
        this.$confirm('即将取消此租赁关系, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$emit('cannelLease', this.scope);
          })
          .catch(() => {
            this.$message.error('出错啦');
          });
      },
      deleteLease() {
        this.$confirm('即将删除此租赁关系, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$emit('deleteLease', this.scope);
          })
          .catch(() => {
            this.$message.error('出错啦');
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
  .lease-house span {
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
