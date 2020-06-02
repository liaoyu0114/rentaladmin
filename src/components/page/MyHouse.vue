<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i> 房源管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.housingresources_name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" v-if="showCannel" @click="handleCannel">取消</el-button>
        <el-button type="primary" @click="newVisible = true">发布新房源</el-button>
      </div>
      <el-table
        :data="showData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column prop="housingresources_id" label="房源ID" width="70" align="center"></el-table-column>
        <el-table-column prop="housingresources_name" label="房源名称"></el-table-column>
        <el-table-column label="租金/月">
          <template slot-scope="scope">￥{{scope.row.housingresources_price}}</template>
        </el-table-column>
        <el-table-column label="图片(点击查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              fit="cover"
              :src="scope.row.housingresources_pic[0]"
              :preview-src-list="scope.row.housingresources_pic"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="housingresources_address" label="地址"></el-table-column>
        <el-table-column label="房型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.housingresources_type.first}}室{{scope.row.housingresources_type.second}}厅{{scope.row.housingresources_type.third}}卫</span>

          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.prevent="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
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
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑房源" :visible.sync="editVisible" width="50%">
      <el-form ref="editForm" :model="editForm" label-width="70px" >
        <el-form-item label="房源ID" prop="">
          <el-input v-model="editForm.housingresources_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="房源名称">
          <el-input v-model="editForm.housingresources_name" placeholder="输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="所在小区">

          <el-input v-model="editForm.housingresources_village" placeholder="输入小区"></el-input>
        </el-form-item>
        <el-form-item label="房源地址">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="editForm.housingresources_address"
            class="search-el"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            style="width: 100%"
          >
            <i class="el-icon-edit el-input__icon"
               slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>

              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete>
          <!--<el-input v-model="editForm.housingresources_address" placeholder="搜索地址"></el-input>-->
        </el-form-item>
        <el-form-item label="出租类型">
          <el-select v-model="editForm.housingresources_category" placeholder="选择出租类型">
            <el-option label="整套出租" value="整套出租"></el-option>
            <el-option label="单间出租" value="单间出租"></el-option>
            <el-option label="短租/日租" value="短租/日租"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房型">
          <el-select v-model="editForm.housingresources_type.first" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>
          <span class="h-type">室</span>
          <el-select v-model="editForm.housingresources_type.second" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="0" value="0"></el-option>
          </el-select>
          <span class="h-type">厅</span>
          <el-select v-model="editForm.housingresources_type.third" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="0" value="0"></el-option>
          </el-select>
          <span class="h-type">卫</span>
        </el-form-item>

        <el-form-item label="楼层">
          <el-select v-model="editForm.housingresources_floor" placeholder="选择出租类型">
            <el-option label="高层" value="高层"></el-option>
            <el-option label="中层" value="中层"></el-option>
            <el-option label="低层" value="低层"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="朝向">
          <el-select v-model="editForm.housingresources_orientations" placeholder="选择朝向">
            <el-option label="南" value="南"></el-option>
            <el-option label="东南" value="东南"></el-option>
            <el-option label="东" value="东"></el-option>
            <el-option label="东北" value="东北"></el-option>
            <el-option label=北 value="北"></el-option>
            <el-option label="西北" value="西北"></el-option>
            <el-option label="西" value="西"></el-option>
            <el-option label="西南" value="西南"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="押金类型">
          <el-select v-model="editForm.housingresources_renttype" placeholder="选择押金类型">
            <el-option label="押一付一" value="押一付一"></el-option>
            <el-option label="押一付三" value="押一付三"></el-option>
            <el-option label="半年付" value="半年付"></el-option>
            <el-option label="年" value="年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每月租金">
          <el-input v-model="editForm.housingresources_price" placeholder="输入每月租金" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="房屋面积">
          <el-input v-model="editForm.housingresources_area" placeholder="输入房屋面积" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="写点描述">
          <el-input v-model="editForm.housingresources_introduce" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="实景照片">
          <el-row :gutter="10">
            <el-col :span="7" v-for="(item,index) in editForm.housingresources_pic" :key="index">
              <el-image :src="item" style="border-radius: 10px"></el-image>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
    </el-dialog>
    <!--新房源弹出框-->
    <el-dialog title="发布新房源" :visible.sync="newVisible" width="50%" top="5vh">
      <el-form ref="newForm" :model="newForm" label-width="80px" :rules="newFormRule">
        <el-form-item label="房源名称" prop="housingresources_name">
          <el-input v-model="newForm.housingresources_name" placeholder="输入房源名称"></el-input>
        </el-form-item>
        <el-form-item label="所在小区" prop="housingresources_village">
          <el-input v-model="newForm.housingresources_village" placeholder="输入小区"></el-input>
        </el-form-item>
        <el-form-item label="房源地址" prop="housingresources_address">
          <!--<el-input v-model="newForm.housingresources_address" placeholder="搜索地址"></el-input>-->
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="newForm.housingresources_address"
            class="search-el"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            style="width: 100%"
          >
            <i class="el-icon-edit el-input__icon"
               slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>

              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="出租类型" prop="housingresources_category">
          <el-select v-model="newForm.housingresources_category" placeholder="选择出租类型">
            <el-option label="整套出租" value="整套出租"></el-option>
            <el-option label="单间出租" value="单间出租"></el-option>
            <el-option label="短租/日租" value="短租/日租"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房型" prop="housingresources_type">
          <el-select v-model="newForm.housingresources_type.first" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>
          <span class="h-type">室</span>
          <el-select v-model="newForm.housingresources_type.second" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="0" value="0"></el-option>
          </el-select>
          <span class="h-type">厅</span>
          <el-select v-model="newForm.housingresources_type.third" style="width: 60px">
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="0" value="0"></el-option>
          </el-select>
          <span class="h-type">卫</span>
        </el-form-item>

        <el-form-item label="楼层" prop="housingresources_floor">
          <el-select v-model="newForm.housingresources_floor" placeholder="选择出租类型">
            <el-option label="高层" value="高层"></el-option>
            <el-option label="中层" value="中层"></el-option>
            <el-option label="低层" value="低层"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="朝向" prop="housingresources_orientations">
          <el-select v-model="newForm.housingresources_orientations" placeholder="选择朝向">
            <el-option label="南" value="南"></el-option>
            <el-option label="东南" value="东南"></el-option>
            <el-option label="东" value="东"></el-option>
            <el-option label="东北" value="东北"></el-option>
            <el-option label=北 value="北"></el-option>
            <el-option label="西北" value="西北"></el-option>
            <el-option label="西" value="西"></el-option>
            <el-option label="西南" value="西南"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="押金类型" prop="housingresources_renttype">
          <el-select v-model="newForm.housingresources_renttype" placeholder="选择押金类型">
            <el-option label="押一付一" value="押一付一"></el-option>
            <el-option label="押一付三" value="押一付三"></el-option>
            <el-option label="半年付" value="半年付"></el-option>
            <el-option label="年付" value="年付"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每月租金" prop="housingresources_price">
          <el-input v-model="newForm.housingresources_price" placeholder="输入每月租金" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="房屋面积" prop="housingresources_area">
          <el-input v-model="newForm.housingresources_area" placeholder="输入房屋面积㎡" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="写点描述" prop="housingresources_introduce">
          <el-input v-model="newForm.housingresources_introduce" type="textarea" placeholder="写点描述"></el-input>
        </el-form-item>
        <el-form-item label="实景照片" prop="housingresources_pic">
          <el-upload
            ref="upload"
            :action="domin"
            :http-request='qiniuUp'
            multiple
            :limit="9"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-remove="remove"
            :file-list="newForm.housingresources_pic"
          >
            <el-button size="small" type="primary" plain>点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10mb</div>
          </el-upload>
          <el-row :gutter="10" v-if="newForm.housingresources_pic.length !== 0">
            <el-col :span="8" v-for="(item,index) in newForm.pic" :key="index">
              <el-image :src="item" style="border-radius: 10px"></el-image>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="cannelNewHouse">取 消</el-button>
                <el-button type="primary" @click="newHouse('newForm')" >确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import getToken from '../../api/token';
  import axios from 'axios';
  import { text } from '../../api/map';

  export default {
    name: 'basetable',
    data() {
      return {
        loading: true,
        appKey: "abe346ab804b17ebc88f74f3c0173935",
        newVisible: false,
        newForm: {
          housingresources_category: '',
          housingresources_village: "",
          housingresources_type: {
            first: "1",
            second: "1",
            third: "1"
          },
          housingresources_introduce: '',
          housingresources_floor: '',
          housingresources_orientations: '',
          housingresources_renttype: '',
          housingresources_price: '',
          housingresources_area: '',
          housingresources_longitude: '',
          housingresources_latitude: '',
          housingresources_address: '',
          housingresources_pic: []
        },
        newFormRule: {
          housingresources_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          housingresources_village: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
          housingresources_address: [{ required: true, message: '请输入小区地址', trigger: ['blur','change'] }],
          housingresources_category: [{ required: true, message: '请选择出租类型', trigger: 'blur' }],
          housingresources_type: [{ required: true, message: '请选择房型', trigger: 'blur' }],
          housingresources_introduce: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
          housingresources_floor: [{ required: true, message: '请选择楼层', trigger: 'blur' }],
          housingresources_orientations: [{ required: true, message: '请选择朝向', trigger: 'blur' }],
          housingresources_renttype: [{ required: true, message: '请选择押金类型', trigger: 'blur' }],
          housingresources_price: [{ required: true, message: '请输入每月租金', trigger: 'blur' }],
          housingresources_area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
          housingresources_pic: [{ required: true, message: '至少上传一张图片', trigger: 'blur' }]
        },
        query: {
          "landlord_id": "",
          "housingresources_name": '',
          "currIndex": 1,
          "pageSize": 15
        },
        showData: [],
        tableData: [],
        editVisible: false,
        pageTotal: 0,
        editForm: {
          "housingresources_category": '',
          "housingresources_village": "",
          "housingresources_type": {
            first: "1",
            second: "1",
            third: "1"
          },
          "housingresources_introduce": '',
          "housingresources_floor": '',
          "housingresources_orientations": '',
          "housingresources_renttype": '',
          "housingresources_price": '',
          "housingresources_area": '',
          "housingresources_longitude": '',
          "housingresources_latitude": '',
          "housingresources_address": '',
          "housingresources_pic": []
        },
        idx: -1,
        id: -1,
        data: {},
        showCannel: false,
        dialogImageUrl: '',
        dialogVisible: false,
        //七牛云配置
        domin:'https://upload-z2.qiniup.com',
        qiniuaddr:'https://assets.hhh233.xyz',
      };
    },
    created() {
      this.query.landlord_id = this.userInfo.landlord_id;
      this.loadHouse();
    },
    activated() {
      this.loadHouse()
    },
    methods: {
      remove(file, fileList) {
        console.log(file);
        console.log(fileList);
      },
      loadHouse() {
        this.$post("/selectHousingresourcesByLandlordId", this.query).then(res => {
          if (res.code === "000") {
            this.pageTotal = res.count;

            this.showData = res.housingresourceslist.map(item => {
              item.housingresources_pic = JSON.parse(item.housingresources_pic);
              item.housingresources_type = JSON.parse(item.housingresources_type)
              return item
            })

          } else {
            this.$message.warning(res.msg)
          }
          this.loading = false
        }).catch(err => {
          console.log(err);
          this.$message.error("网络错误");
          this.loading = false;
        })
      },
      handleSelect(item) {
        console.log(item);
        if (this.newVisible) {
          this.newForm.housingresources_address = item.pname + item.cityname + item.adname  + item.address + item.name;
          this.newForm.housingresources_latitude = item.location.split(",")[1];
          this.newForm.housingresources_longitude = item.location.split(",")[0];
        }

        if (this.editVisible) {
          this.editForm.housingresources_address = item.pname + item.cityname + item.adname + item.name + item.address;
          this.editForm.housingresources_latitude = item.location.split(",")[1];
          this.editForm.housingresources_longitude = item.location.split(",")[0];
        }

      },
      querySearchAsync(queryString, cb) {
        let params = {
          key: this.appKey,
          keywords: queryString,
          city: "成都"
        };

        text(params).then(res => {
          var restaurants = res.pois;
          var results = queryString
            ? restaurants.filter(this.createStateFilter(queryString))
            : restaurants;
          cb(results);
        });
      },
      createStateFilter(queryString) {
        return state => {
          return (
            state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          );
        };
      },
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt10M;
      },
      uploadSuccess(response, file, fileList) {
        // this.$message.success(`${file}`)
        this.$message.success(`${file.name} 上传成功`)
      },
      cannelNewHouse() {
        this.newVisible = false
      },
      newHouse(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newForm.landlord_id = this.userInfo.landlord_id;
            let data = JSON.parse(JSON.stringify(this.newForm));
            data.housingresources_pic = data.housingresources_pic.map(item => {
              return item.url
            });
            data.housingresources_pic = JSON.stringify(data.housingresources_pic)
            data.housingresources_type = JSON.stringify(data.housingresources_type)
            this.$post("/addHousingresources",data).then(res => {
              if (res.code === "000") {
                this.$message.success("添加成功");
                this.newVisible = false;
                self.$refs.newForm.resetFields();
                this.newForm.housingresources_pic = []
                this.loading = true;
                this.loadHouse()
              } else {
                this.$message.warning(res.msg)
              }

            }).catch(err => {
              console.log(err);
              this.$message.warning("网络错误")
            })
            // this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      qiniuUp(req) {
        // 重命名要上传的文件
        const keyname = btoa(req.file.name.split(".")[0]) + "." + req.file.name.split(".")[1];

        //axio配置
        const config = {
          headers: {'Content-Type': 'multipart/form-data'},
        };

        //获取七牛云token
        getToken().then(res => {
          let formdata = new FormData();
          formdata.append('file', req.file);
          formdata.append('token', res.uploadToken);
          formdata.append('key', keyname);
          // 获取到凭证之后再将文件上传到七牛云空间
          axios.post(this.domin, formdata, config).then(res => {
            console.log(res);
            let url = this.qiniuaddr + '/' + res.data.key;
            this.newForm.housingresources_pic.push({
              name: req.file.name,
              url: url
            });
            req.onSuccess(req.file);
          }).catch(err => {
            console.log(err);
            //上传失败事件
            req.onError(req.file);
          })
        })
      },
      // 触发搜索按钮
      handleSearch() {
        if (this.query.housingresources_name === '') return;
        this.$set(this.query, 'pageIndex', 1);
        this.loading = true;
        this.loadHouse();
        this.showCannel = true;
      },
      handleCannel() {
        this.showCannel = false;
        this.query.pageIndex = 1;
        this.query.housingresources_name = "";
        this.loading = true;
        this.loadHouse()
      },
      // 删除操作
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.$post("/delectHousingresources", {
              "housingresources_id": this.showData[index].housingresources_id
            }).then(res => {
              if (res.code === "000") {
                this.$message.success("删除成功");
                this.loading = true
                this.loadHouse()
              } else {
                this.$message.warning(res.msg)
              }
            }).catch(err => {
              console.log(err);
              this.$message.error("网络错误")
            })
          })
          .catch(() => {});
      },
      // 编辑操作
      handleEdit(index, row) {
        this.idx = index;
        this.editForm = row;
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
      ...mapGetters(["userInfo", "house"])
    }
  };
</script>
<style>
  .el-upload--text {
    width: auto;
    height: auto;
    border: none;
  }
  .el-upload__tip {
    margin: 0;
  }
</style>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }
  .h-type {
    padding: 0 10px;
    line-height: 32px;
    font-size: 16px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .table {
    width: 100%;
    font-size: 14px;
  }
  .addr {
    color: #999;
    font-size: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
