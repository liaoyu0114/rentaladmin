<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20">
                    <div slot="header" class="clearfix">
                        <span>商户详情</span>
                        <el-button type="text" v-if="userInfo.isshop === 0" style="float: right; padding: 3px 0">修改信息</el-button>
                    </div>
                    <div class="user-info">
                        <img :src="userInfo.business_pic" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userInfo.business_nickname}}</div>
                            <div>{{userInfo.contact_number}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{date}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>成都</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>店铺详情</span>
                        <el-button type="text" v-if="userInfo.isshop === 0" style="float: right; padding: 3px 0">修改信息</el-button>
                    </div>
                    <el-row v-if="this.userInfo.isshop === 0">
                        <el-col :span="4"><el-image :src="shop.shop_pic"></el-image> </el-col>
                        <el-col :span="20">{{shop.shop_name}}</el-col>
                        <el-col :span="24">地址： {{shop.shop_address}}</el-col>
                        <el-col :span="24">公告： {{shop.shop_notice}}</el-col>
                    </el-row>
                    <el-row v-else>
                      <el-col :span="24">
                          还没有店铺哦，你可以申请一个👇<br>
                          <el-button type="primary">申请店铺</el-button>
                      </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="16">
                
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div
                                    class="todo-item"
                                    :class="{'todo-item-del': scope.row.status}"
                                >{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import { mapGetters } from 'vuex';
import { selectshopforbusiness } from '../../api/index';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            date: new Date().toLocaleDateString(),
            shop: {},
            todoList: [
                {
                    title: '东西没了要下架',
                    status: false
                },
                {
                    title: '今天要买100个苹果',
                    status: false
                },
                {
                    title: '明天要新增菜品',
                    status: false
                },
                {
                    title: '明天下架脆皮鸡和xxxx',
                    status: false
                },
                {
                    title: '今天要买100斤葱',
                    status: true
                },
                {
                    title: '今天要写五点打烊',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '最近一周新增用户和销量图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '新增用户',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '销量',
                        data: [164, 178, 190, 135, 160]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '品类1',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '品类2',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '品类3',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        ...mapGetters(['userInfo']),
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        if (this.userInfo.isshop === 0) {
            selectshopforbusiness({ business_id: this.userInfo.business_id })
                .then(res => {
                    if (res.code === '000') {
                        this.shop = res.isShop;
                    } else {
                        this.$message('出现了未知错误');
                    }
                })
                .catch(() => {
                    this.$message('网络错误');
                });
        }
    },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
