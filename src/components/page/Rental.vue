<template>
    <div class>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> 租赁管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`出租中`" name="first">
                    <el-table :data="leaseOrderOne" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <lease-item
                                    :scope="scope"
                                    @cannelLease="cannelLease"
                                    @deleteLease="deleteLease"
                                ></lease-item>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagination">
                        <el-pagination
                                background
                                layout="total, prev, pager, next"
                                :current-page="leaseOneQuery.pageIndex"
                                :page-size="leaseOneQuery.pageSize"
                                :total="leaseOrderOne.length"
                                @current-change="pageOneChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="`租赁完成`" name="second">
                    <template>
                        <el-table :data="leaseOrderTwo" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <lease-item :scope="scope"
                                                @cannelLease="cannelLease"
                                                @deleteLease="deleteLease"></lease-item>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="pagination">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="leaseTwoQuery.pageIndex"
                                    :page-size="leaseTwoQuery.pageSize"
                                    :total="leaseOrderTwo.length"
                                    @current-change="pageTwoChange"
                            ></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>

                <el-tab-pane :label="`搜索`" name="sixth">
                    <template>
                        <el-input v-model="searchInput" placeholder="请输入内容" @input="inputSearch"></el-input>
                        <el-table
                            :data="search"
                            :show-header="false"
                            style="width: 100%"
                        >
                            <el-table-column>
                                <template slot-scope="scope">
                                    <lease-item :scope="scope" @stateAdd="stateAdd"></lease-item>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="pagination" v-if="leaseOrderThree.length !== 0">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="leaseThreeQuery.pageIndex"
                                    :page-size="leaseThreeQuery.pageSize"
                                    :total="pageTotal"
                                    @current-change="pageThreeChange"
                            ></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import LeaseItem from '../Items/LeaseItem';
import { mapGetters } from "vuex"
export default {
    name: 'tabs',
    components: {
        LeaseItem
    },
    data() {
        return {
            message: 'first',
            searchInput: '',
            loading: false,
            search: [],
            leaseOrderOne: [
                {
                    lease_id: 117632713,
                    lease_time: new Date().getTime(),
                    lease_type: 1,
                    landlord: this.userInfo,
                    // house: this.house[0],
                    tenant: this.userInfoU
                }
            ],
            leaseOrderTwo: [
                {
                    lease_id: 172838492,
                    lease_time: new Date().getTime(),
                    lease_type: 0,
                    landlord: this.userInfo,
                    // house: this.house[0],
                    tenant: this.userInfoU
                }
            ],
            leaseOrderThree: [],
            leaseOneQuery: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            leaseTwoQuery: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            leaseThreeQuery: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
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
        cannelLease(payload) {
            let index = this.leaseOrderOne.findIndex(item => {
                return item.lease_id === payload.lease_id
            });
            this.leaseOrderOne.splice(index, 1);
            payload.lease_type = 0
            this.leaseOrderTwo.push(payload)
        },
        deleteLease(payload) {
            let index = this.leaseOrderTwo.findIndex(item => {
                return item.lease_id === payload.lease_id
            });
            this.leaseOrderTwo.splice(index, 1);
        },
        pageOneChange(val) {

        },
        pageTwoChange(val) {

        },
        pageThreeChange(val) {

        }
    },
    computed: {
        ...mapGetters(["userInfo", "house", "userInfoU"]),
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

