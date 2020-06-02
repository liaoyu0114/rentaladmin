<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">房屋租赁后台管理</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入账号">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-switch
                            v-model="value"
                            active-text="记住我">
                    </el-switch>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" style="font-size: 18px; letter-spacing: 5px">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="text" class="reg-btn" @click="dialogTableVisible = true">注册</el-button>
                </div>
            </el-form>
            <el-dialog title="注册账号" :visible.sync="dialogTableVisible">
                <div style="display: flex;width: 100%;justify-content: center">
                    <el-form :model="paramRegist"
                             :rules="rulesRegist"
                             ref="regist"
                             label-width="80px"
                             label-position="left"
                             class="ms-content" style="width: 50%">
                        <el-form-item prop="landlord_phone" label="用户名">
                            <el-input v-model="paramRegist.landlord_phone" placeholder="请输入账号">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="landlord_password" label="密码">
                            <el-input
                                    type="password"
                                    placeholder="请输入密码"
                                    v-model="paramRegist.landlord_password"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="landlord_repeat" label="重复密码">
                            <el-input
                                    type="password"
                                    placeholder="请再次输入密码"
                                    v-model="paramRegist.landlord_repeat"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="landlord_mail" label="邮箱">
                            <el-input
                                    type="text"
                                    placeholder="请再次输入密码"
                                    v-model="paramRegist.landlord_mail"
                            >
                            </el-input>
                        </el-form-item>
                        <div class="login-btn" style="display: flex;justify-content: center">
                            <el-button type="primary"
                                       @click="registLandlord"
                                       class="reg-btn"
                                       style="width: 50%">注册</el-button>
                        </div>
                    </el-form>
                </div>

            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
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
        let validatePass = (rule, value, callback) => {
            if (!/^.{6,16}$/.test(value)) {
                callback("密码长度必须大于6位或者小于16位");
            }
            callback();
        };
        let validateRepeat = (rule, value, callback) => {
            if (value !== this.paramRegist.landlord_password) {
                callback(new Error("两次输入密码不正确"));
            }
            callback();
        };
        let validateEmail = (rule, value, callback) => {
            let email_reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if (!email_reg.test(value)) {
                callback(new Error("邮箱格式不正确，重新输入"));
            } else {
                callback();
            }
        };
        return {
            value: false,
            param: {
                username: '18382389882',
                password: '123456'
            },
            paramRegist: {
                "landlord_phone": "",
                "landlord_password": "",
                "landlord_repeat": "",
                "landlord_mail": ""
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            dialogTableVisible: false,
            rulesRegist: {
                "landlord_phone": [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { validator: validateName, trigger: "blur" }],
                "landlord_password": [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: "blur" }],
                "landlord_repeat": [
                    { required: true, message: "请输入密码" },
                    { validator: validateRepeat, trigger: "blur" }],
                "landlord_mail": [
                    { required: true, message: "邮箱不能为空" },
                    { validator: validateEmail, trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    let data = {
                        landlord_phone: this.param.username,
                        landlord_password: this.param.password
                    };
                   this.$post('/loginLandlord', data).then(res => {
                       if (res.code === "000") {
                         this.$store.commit("setUserInfo", res.Landlord);
                         if (this.value) {
                             this.saveLocal()
                         }
                         this.$router.push("/")
                       } else {
                           this.$message.warning("账号密码不匹配")
                       }
                   })
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        registLandlord() {
            this.$refs.regist.validate(valit => {
                if (valit) {
                    this.$post("/registLandlord", this.paramRegist).then(res => {
                        if (res.code === "000") {
                            let data = {
                                landlord_phone: this.paramRegist.landlord_phone,
                                landlord_password: this.paramRegist.landlord_password
                            };
                            this.$post('/loginLandlord', data).then(res => {
                                if (res.code === "000") {
                                    this.$store.commit("setUserInfo", res.Landlord);
                                    if (this.value) {
                                        this.saveLocal()
                                    }
                                    this.$router.push("/")
                                } else {
                                    this.$message.warning("登陆失败，手动登录")
                                }
                            })
                        } else {
                            this.$message.error('登陆失败');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
        },
        saveLocal() {
            localStorage.phone = this.param.username
            localStorage.password = this.param.password
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/YEiVBT.jpg);
    background-size: cover;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #888;
    border-bottom: 1px solid #ddd;
}
.reg-btn {
    color: white;
    font-size: 14px;
    letter-spacing: 4px;
}
.reg-btn:hover {
 text-decoration: underline;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
