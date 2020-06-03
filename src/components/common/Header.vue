<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo" @click="$router.push('/')">RENTALHOUSE管理平台</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <el-popover placement="bottom" trigger="hover" width="80">
          <div class="user-avator" slot="reference">
            <el-avatar :src="userInfo.landlord_pic"></el-avatar>
          </div>
          <div class="user-name">
            <div class="el-dropdown-link" @click="showProfileFunc">个人信息</div>
            <div class="el-dropdown-link" @click="changPassWord">修改密码</div>
            <div class="el-dropdown-link" @click="handleCommand">退出登录</div>
          </div>
        </el-popover>
      </div>
    </div>

    <el-dialog :title="title"
               :visible.sync="diaVisiable"
               width="35%">
      <el-form :model="temp"
               ref="temp"
               :rules="tempRules"
               label-position="left"
               label-width="80px"
               v-if="showProfile">
        <el-form-item label="用户名" prop="landlord_nickname">
          <el-input v-model="temp.landlord_nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="landlord_realname">
          <el-input v-model="temp.landlord_realname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="landlord_IDnumber">
          <el-input v-model="temp.landlord_IDnumber" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="landlord_contact">
          <el-input v-model="temp.landlord_contact" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="landlord_mail">
          <el-input v-model="temp.landlord_mail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="landlord_pic">
          <div class="pic-box">
            <!--<el-avatar :src="temp.landlord_pic" style="border: dashed 0.5px #9fcda1"></el-avatar>-->
            <!--&lt;!&ndash; <div> &ndash;&gt;-->
            <!--<el-upload action class="upload-box">-->
            <!--<el-button type="primary" size="mini" plain>点击修改</el-button>-->
            <!--</el-upload>-->
            <!--&lt;!&ndash; </div> &ndash;&gt;-->
            <el-upload
              ref="upload"
              :action="domin"
              class="home-upload"
              :show-file-list="false"
              :http-request="qiniuUp"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :multiple="false"
            >
              <el-avatar v-if="temp.landlord_pic !== '' || temp.landlord_pic " :src="temp.landlord_pic" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="性别" prop="landlord_sex">
          <el-radio v-model="temp.landlord_sex" :label="1">男</el-radio>
          <el-radio v-model="temp.landlord_sex" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeProfile">确定</el-button>
          <el-button type="danger" @click="diaVisiable = false">取消</el-button>
        </el-form-item>
      </el-form>

      <el-form
        :model="rePassword"
        label-width="80px"
        label-position="left"
        :rules="rePasswordRule"
        v-if="changePass"
        ref="changePass"
      >
        <el-form-item label="旧密码" prop="old">
          <el-input v-model="rePassword.old" placeholder="请输入旧密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input v-model="rePassword.new" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="reNew">
          <el-input v-model="rePassword.reNew" placeholder="再次输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassFunc('changePass')">确定</el-button>
          <el-button type="danger" @click="diaVisiable = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import bus from '../common/bus';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      let valiteReNew = (rule, value, callback) => {
        if (value !== this.rePassword.new) {
          callback('两次密码不匹配');
        }
        callback();
      };
      let valitIDCard = (rule, value, callback) => {
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
          callback("请输入正确身份证号码");
        }
        callback();
      };
      let validateName = (rule, value, callback) => {
        if (
          !/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/.test(
            value
          )
        ) {
          callback("输入正确的手机号");
        }
        callback();
      };
      return {
        domin: "https://upload-z2.qiniup.com",
        qiniuaddr: "https://assets.hhh233.xyz",
        diaVisiable: false,
        showProfile: false,
        changePass: false,
        collapse: false,
        message: 2,
        rePassword: {
          old: '',
          new: '',
          reNew: ''
        },
        title: "",
        rePasswordRule: {
          old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
          new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
          reNew: [
            { required: true, message: '请重复输入新密码', trigger: 'blur' },
            { validator: valiteReNew, trigger: 'blur' }
          ]
        },
        temp: {},
        tempRules: {
          "landlord_mail": [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          "landlord_nickname": [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' }
          ],
          "landlord_realname": [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' }
          ],
          "landlord_IDnumber": [
            { required: true, message: "请输入身份证号码", trigger: "blur" },
            { validator: valitIDCard, trigger: "blur" }
          ],
          "landlord_contact": [
            { required: true, message: "请输入联系方式", trigger: "blur" },
            { validator: validateName, trigger: "blur" }
          ],
          "landlord_pic": [
            { required: true, message: "请输入联系方式", trigger: "blur" },
          ],
          "landlord_sex": [
            { required: true, message: "请选择性别", trigger: "change" }
          ]
        }
      };
    },
    computed: {
      ...mapGetters(['userInfo']),
      username() {
        let username = localStorage.getItem('ms_username');
        return username ? username : this.name;
      }
    },
    methods: {
      // 展示弹窗
      showProfileFunc() {
        this.diaVisiable = true;
        this.showProfile = true;
        this.changePass = false;
        this.title = '查看/修改个人信息';
      },
      // 修改房东信息
      changeProfile() {
        this.$refs.temp.validate(valid => {
          if (valid) {
            let data = {
              "landlord_id": this.userInfo.landlord_id,
              "landlord_mail": this.temp.landlord_mail,
              "landlord_nickname": this.temp.landlord_nickname,
              "landlord_realname": this.temp.landlord_realname,
              "landlord_IDnumber": this.temp.landlord_IDnumber,
              "landlord_contact": this.temp.landlord_contact,
              "landlord_pic": this.temp.landlord_pic,
              "landlord_sex": this.temp.landlord_sex
            };
            this.$post("/updateLandlord", data).then(res => {
              console.log(res);
              if (res.code === "000") {
                this.$store.commit("setUserInfo", res.Landlord);
                this.$message.success("修改成功");
                this.diaVisiable = false;
                this.$refs.temp.resetFields()
              } else {
                this.$message.warning(res.msg)
              }
            }).catch(err => {
              console.log(err);
              this.$message.error("网络错误")
            })

          }
        })
      },
      changPassWord() {
        this.diaVisiable = true;
        this.showProfile = false;
        this.changePass = true;
        this.title = '修改密码';
      },
      changePassFunc(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$post("/updateLandlord", {
              "landlord_id": this.userInfo.landlord_id,
              "landlord_password": this.rePassword.new
            }).then(res => {
              console.log(res);
              if (res.code === "000") {
                this.$message.success("修改成功, 请重新登录")
                this.handleCommand()
                this.$store.commit("setUserInfo", {})
                // this.diaVisiable = false
                // this.$refs.changePass.resetFields()
              } else {
                this.$message.warning(res.msg)
              }
            }).catch(err => {
              console.log(err);
              this.$message.error("未知错误")
            })
          }
        });
      },
      // 用户名下拉菜单选择事件
      handleCommand() {
        localStorage.removeItem("phone");
        localStorage.removeItem("password");
        this.$router.push('/login');
      },
      // 侧边栏折叠
      collapseChage() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
      uploadSuccess() {
        this.$message.success("上传成功");
      },
      uploadError() {
        this.$message.error("上传失败");
      },
      qiniuUp(req) {
        const keyname =
          btoa(req.file.name.split(".")[0]) + "." + req.file.name.split(".")[1];

        const config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        this.$token().then(res => {
          let formdata = new FormData();
          formdata.append("file", req.file);
          formdata.append("token", res.uploadToken);
          formdata.append("key", keyname);
          // 获取到凭证之后再将文件上传到七牛云空间
          this.$axios
            .post(this.domin, formdata, config)
            .then(res => {
              console.log(res);
              this.temp.landlord_pic = this.qiniuaddr +
                "/" +
                res.data.key +
                "?imageView2/1/w/200/h/200/format/webp/q/75";
              req.onSuccess(req.file);
            })
            .catch(err => {
              console.log(err);
              req.onError(req.file);
            });
        });
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

    },
    mounted() {
      this.temp = JSON.parse(JSON.stringify(this.userInfo));
      if (document.body.clientWidth < 1500) {
        this.collapseChage();
      }
    }
  };
</script>
<style scoped>
  .upload-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .pic-box {
    display: flex;
    height: 100%;
    align-items: center;
  }
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
  }
  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }
  .header .logo {
    float: left;
    width: 280px;
    line-height: 70px;
    cursor: pointer;
  }
  .header-right {
    float: right;
    padding-right: 100px;
  }
  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }
  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }
  .btn-bell,
  .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
  }
  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
  }
  .btn-bell .el-icon-bell {
    color: #fff;
  }
  .user-name {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
  .el-dropdown-link:hover {
    color: #9fcda1;
  }
  .user-avator {
    margin-left: 20px;
  }
  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .el-dropdown-link {
    /* color: #fff; */
    padding: 5px 0;
    cursor: pointer;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
</style>
