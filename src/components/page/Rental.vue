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
                                :current-page="leaseTwoQuery.pageIndex"
                                :page-size="leaseTwoQuery.pageSize"
                                :total="leaseOrderTwo.length"
                                @current-change="pageTwoChange"
                            ></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`新增租赁`" name="third">
                    <template>
                        <el-form :model="newRental" label-width="100px" label-position="left">
                            <el-form-item label="选择租客"  style="width:294px">
                                <el-input v-model="newRental.tenant.tenant_nickname" placeholder="搜索租客"></el-input>
                            </el-form-item>
                            <el-form-item label="选择房源">
                                <el-select v-model="newRental.house.housingresources_name" placeholder="选择房源">
                                  <el-option label="可出租房源一" value="可出租房源一"></el-option>
                                  <el-option label="可出租房源二" value="可出租房源二"></el-option>
                                  <el-option label="可出租房源三" value="可出租房源三"></el-option>
                                  <el-option label="可出租房源四" value="可出租房源四"></el-option>
                                  <el-option label="可出租房源五" value="可出租房源五"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                        <el-button type="primary" @click="onChange" style="width:194px">确认</el-button>
                    </el-form-item>
                        </el-form>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`搜索`" name="forth">
                    <template>
                        <el-input v-model="searchInput" placeholder="请输入内容" @input="inputSearch"></el-input>
                        <el-table :data="search" :show-header="false" style="width: 100%">
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
import { mapGetters } from 'vuex';
export default {
    name: 'tabs',
    components: {
        LeaseItem
    },
    data() {
        return {
            dialogVisiable: false,
            message: 'first',
            searchInput: '',
            loading: false,
            search: [],
            newRental: {
                tenant: {
                    tenant_nickname: ''
                },
                house: {
                    housingresources_name: ""
                }
            },
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
            }
        };
    },
    created() {},
    methods: {
        onChange() {
            this.house[0].housingresources_name = this.newRental.house.housingresources_name
            this.userInfoU.tenant_nickname = this.newRental.tenant.tenant_nickname
            this.newRental.lease_id = 123456
            this.newRental.lease_time = new Date().getTime() - 999999
            this.newRental.lease_type = 1
            this.newRental.house = this.house[0]
            this.newRental.tenant = this.userInfoU
            this.newRental.landlord = this.userInfo
            this.leaseOrderOne = [this.newRental].concat(this.leaseOrderOne)
            this.$message.success("添加成功")
            this.message = 'first'
        },
        inputSearch() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.search = this.orders;
            }, 3000 * Math.random());
        },
        cannelLease(payload) {
            let index = this.leaseOrderOne.findIndex(item => {
                return item.lease_id === payload.lease_id;
            });
            this.leaseOrderOne.splice(index, 1);
            payload.lease_type = 0;
            this.leaseOrderTwo.push(payload);
        },
        deleteLease(payload) {
            let index = this.leaseOrderTwo.findIndex(item => {
                return item.lease_id === payload.lease_id;
            });
            this.leaseOrderTwo.splice(index, 1);
        },
        pageOneChange(val) {},
        pageTwoChange(val) {},
        pageThreeChange(val) {}
    },
    computed: {
        ...mapGetters(['userInfo', 'house', 'userInfoU'])
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

