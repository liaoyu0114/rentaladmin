<template>
    <div class>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`所有订单(${orders.length})`" name="first">
                    <el-table :data="orders" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <order-item
                                    :scope="scope"
                                    @stateAdd="stateAdd"
                                    @routeClick="drawer = true"
                                ></order-item>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index)">确认订单</el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary">全部确认</el-button>
                        <el-button type="primary" @click="drawer = true">全部确认</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="`未接单(${getOrders1.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="getOrders1" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <order-item :scope="scope" @stateAdd="stateAdd"></order-item>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">全部取消</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已接单(${getOrders2.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="getOrders2" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <order-item :scope="scope" @stateAdd="stateAdd"></order-item>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">全部确认</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`配送中(${getOrders3.length})`" name="fourth">
                    <template v-if="message === 'fourth'">
                        <el-table :data="getOrders3" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <order-item
                                        :scope="scope"
                                        @stateAdd="stateAdd"
                                        @routeClick="drawer = true"
                                    ></order-item>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">全部确认</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已完成(${getOrders4.length})`" name="fifth">
                    <template v-if="message === 'fifth'">
                        <el-table :data="getOrders4" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <order-item :scope="scope" @stateAdd="stateAdd"></order-item>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">全部确认</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`搜索${searchCount}`" name="sixth">
                    <template v-if="message === 'sixth'">
                        <el-input v-model="input" placeholder="请输入内容" @input="inputSearch"></el-input>
                        <el-table
                            :data="search"
                            :show-header="false"
                            style="width: 100%"
                            v-loading="loading"
                        >
                            <el-table-column>
                                <template slot-scope="scope">
                                    <order-item :scope="scope" @stateAdd="stateAdd"></order-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-drawer title="GdMap-测试样例（支持起终点拖拽）" :visible.sync="drawer" size="100%">
            <gd-map></gd-map>
        </el-drawer>
    </div>
</template>

<script>
import OrderItem from './OrderItem';
import GdMap from './GdMap';
import { mapGetters } from "vuex"
export default {
    name: 'tabs',
    components: {
        OrderItem,
        GdMap
    },
    data() {
        return {
            drawer: false,
            message: 'first',
            input: '',
            loading: false,
            search: [],
            orders: [
                {
                    orderId: '20191005170626623520',
                    createTime: new Date().toLocaleString(),
                    count: 5,
                    state: 1,
                    good: {
                        goodId: '1541',
                        name: 'KFC超级豪华套餐1',
                        price: 150.0,
                        pic:
                            'https://images.unsplash.com/photo-1585071863849-9c95194bc0d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                    },
                    user: {
                        name: 'HHH',
                        phone: '145644644',
                        avatar: 'https://assets.hhh233.xyz/001%20%284%29.jpg'
                    },
                    location: {
                        lpName: 'KKKK',
                        lpPhone: '45454545',
                        lpLoc: '测试地址测试地址测试地址测试地址测试地址测试地址'
                    }
                },
                {
                    orderId: '20191005170626623521',
                    createTime: new Date().toLocaleString(),
                    count: 5,
                    state: 2,
                    good: {
                        goodId: '1541',
                        name: 'KFC超级豪华套餐2',
                        price: 150.0
                    },
                    user: {
                        name: 'HHH',
                        phone: '145644644',
                        avatar: ''
                    },
                    location: {
                        lpName: 'KKKK',
                        lpPhone: '45454545',
                        lpLoc: '测试地址测试地址测试地址测试地址测试地址测试地址'
                    }
                },
                {
                    orderId: '20191005170626623522',
                    createTime: new Date().toLocaleString(),
                    count: 5,
                    state: 3,
                    good: {
                        goodId: '1541',
                        name: 'KFC超级豪华套餐3',
                        price: 150.0
                    },
                    user: {
                        name: 'HHH',
                        phone: '145644644',
                        avatar: ''
                    },
                    location: {
                        lpName: 'KKKK',
                        lpPhone: '45454545',
                        lpLoc: '测试地址测试地址测试地址测试地址测试地址测试地址'
                    }
                },
                {
                    orderId: '20191005170626623523',
                    createTime: new Date().toLocaleString(),
                    count: 5,
                    state: 4,
                    good: {
                        goodId: '1541',
                        name: 'KFC超级豪华套餐3',
                        price: 150.0
                    },
                    user: {
                        name: 'HHH',
                        phone: '145644644',
                        avatar: ''
                    },
                    location: {
                        lpName: 'KKKK',
                        lpPhone: '45454545',
                        lpLoc: '测试地址测试地址测试地址测试地址测试地址测试地址'
                    }
                }
            ]
        };
    },
    created() {
        
    },
    methods: {
        inputSearch() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.search = this.orders;
            }, 3000 * Math.random());
        },
        stateAdd(orderId) {
            this.orders.forEach(item => {
                console.log(item);
                if (item.orderId === orderId) {
                    if (item.state <= 3) {
                        item.state += 1;
                    }
                }
            });
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
        searchCount() {
            return this.search.length === 0 ? '' : '(' + this.search.length + ')';
        },
        getOrders1() {
            return this.orders.filter(item => {
                return item.state === 1;
            });
        },
        getOrders2() {
            return this.orders.filter(item => {
                return item.state === 2;
            });
        },
        getOrders3() {
            return this.orders.filter(item => {
                return item.state === 3;
            });
        },
        getOrders4() {
            return this.orders.filter(item => {
                return item.state === 4;
            });
        }
    }
};
</script>

<style>
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
</style>

