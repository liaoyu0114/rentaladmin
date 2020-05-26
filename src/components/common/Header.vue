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
        <el-dialog :title="title" :visible.sync="diaVisiable" width="35%">
            <el-form :model="temp" label-position="left" label-width="80px" v-if="showProfile">
                <el-form-item label="用户名">
                    <el-input v-model="temp.landlord_nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="temp.landlord_realname" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="temp.landlord_IDnumber" placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="temp.landlord_contact" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="temp.landlord_mail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <div class="pic-box">
                        <el-avatar :src="temp.landlord_pic" style="border: dashed 0.5px #9fcda1"></el-avatar>
                        <!-- <div> -->
                        <el-upload action class="upload-box">
                            <el-button type="primary" size="mini" plain>点击修改</el-button>
                        </el-upload>
                        <!-- </div> -->
                    </div>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="temp.landlord_sex" label="1">男</el-radio>
                    <el-radio v-model="temp.landlord_sex" label="0">女</el-radio>
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
                    <el-input v-model="rePassword.old" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new">
                    <el-input v-model="rePassword.new" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="reNew">
                    <el-input v-model="rePassword.reNew" placeholder="再次输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="changePassFunc('changePass')">确定</el-button>
                    <el-button type="danger" @click="diaVisiable = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--  landlord_phone: 18382389882,
        landlord_password: "",
        landlord_mail: "1453473547@qq.com",
        landlord_nickname: "昵称测试",
        landlord_realname: "真实姓名",
        landlord_IDnumber: "身份证510xxxxxxxxx",
        landlord_contact: "联系电话",
        landlord_pic: "https://s1.ax1x.com/2020/04/17/JVI740.jpg",
        landlord_sex: "1",-->
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
        let validateName = (rule, value, callback) => {
            console.log(value);
            if (value === '') {
                callback(new Error('请输入账号'));
            } else if (!/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/.test(value)) {
                callback('输入正确的手机号');
            }
            callback();
        };
        return {
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
            rePasswordRule: {
                old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                reNew: [
                    { required: true, message: '请重复输入新密码', trigger: 'blur' },
                    { validator: valiteReNew, trigger: 'blur' }
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
        showProfileFunc() {
            this.diaVisiable = true;
            this.showProfile = true;
            this.changePass = false;
            this.title = '查看/修改个人信息';
        },
        changeProfile() {
            this.$post("/updateLandlord", this.temp).then( res => {
                console.log(res);
                if (res.code === "000") {

                }
            }).catch(err => {
                this.$message.error("网络错误")
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
                    this.$message.success('修改成功');
                    this.diaVisiable = false;
                }
            });
        },
        // 用户名下拉菜单选择事件
        handleCommand() {
            this.$router.push('/login');
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        }
    },
    mounted() {
        this.temp = this.userInfo;
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
    width: 250px;
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
