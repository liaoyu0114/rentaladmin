<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-error"></i> 报障管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane label="未处理报障" name="first">
                    <el-table :data="showErrorOne" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <error-item
                                        :scope="scope"
                                        @beginDone="beginDone"
                                        @finishDone="finishDone"
                                        @deleteShow="deleteShow"
                                ></error-item>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagination">
                        <el-pagination
                                background
                                layout="total, prev, pager, next"
                                :current-page="showErrorOneQuery.pageIndex"
                                :page-size="showErrorOneQuery.pageSize"
                                :total="showErrorOne.length"
                                @current-change="pageOneChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="处理中" name="second">
                    <template>
                        <el-table :data="showErrorTwo" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <error-item
                                            :scope="scope"
                                            @beginDone="beginDone"
                                            @finishDone="finishDone"
                                            @deleteShow="deleteShow"></error-item>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="pagination">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="showErrorTwoQuery.pageIndex"
                                    :page-size="showErrorTwoQuery.pageSize"
                                    :total="showErrorTwo.length"
                                    @current-change="pageTwoChange"
                            ></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="处理完成" name="third">
                    <template>
                        <el-table :data="showErrorThree" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <error-item
                                            :scope="scope"
                                            @beginDone="beginDone"
                                            @finishDone="finishDone"
                                            @deleteShow="deleteShow"></error-item>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="pagination">
                            <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="showErrorThreeQuery.pageIndex"
                                    :page-size="showErrorThreeQuery.pageSize"
                                    :total="showErrorThree.length"
                                    @current-change="pageTwoChange"
                            ></el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import ErrorItem from '../Items/ErrorItem';
    import { mapGetters } from "vuex"
    export default {
        name: 'markdown',
        data: function(){
            return {
                message: 'first',
                searchInput: '',
                loading: false,
                search: [],
                showErrorOne: [
                    {
                        obstacle_id: 192873,
                        obstacle_time: new Date().getTime(),
                        obstacle_state: 0,// 状态（0未处理、1正在处理、2已完成）
                        obstacle_detail: "备注信息",
                        // obstacle_completiontime: "",//完成时间
                        obstacle_pic: [

                        ],
                        landlord: this.userInfo,
                        // house: this.house[0],
                        tenant: this.userInfoU
                    }
                ],
                showErrorTwo: [
                    {
                        obstacle_id: 192873,
                        obstacle_time: new Date().getTime(),
                        obstacle_state: 1,// 状态（0未处理、1正在处理、2已完成）
                        obstacle_detail: "备注信息",
                        // obstacle_completiontime: new Date().getTime(),//完成时间
                        obstacle_pic: [

                        ],
                        landlord: this.userInfo,
                        // house: this.house[0],
                        tenant: this.userInfoU
                    }
                ],
                showErrorThree: [
                    {
                        obstacle_id: 192873,
                        obstacle_time: new Date().getTime(),
                        obstacle_state: 2,// 状态（0未处理、1正在处理、2已完成）
                        obstacle_detail: "备注信息",
                        obstacle_completiontime: new Date().getTime(),//完成时间
                        obstacle_pic: [

                        ],
                        landlord: this.userInfo,
                        // house: this.house[0],
                        tenant: this.userInfoU
                    }
                ],
                showErrorOneQuery: {
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                showErrorTwoQuery: {
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                showErrorThreeQuery: {
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                }
            };

        },
        components: {
            ErrorItem
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
            },
            pageOneChange(val) {

            },
            pageTwoChange(val) {

            },
            beginDone(payload) {
                let index = this.showErrorOne.findIndex(item => {
                    return item.obstacle_id === payload.obstacle_id
                });
                console.log(index);
                this.showErrorOne.splice(index, 1);
                payload.obstacle_state = 1;
                this.showErrorTwo.push(payload)
            },
            finishDone(payload) {
                let index = this.showErrorTwo.findIndex(item => {
                    return item.obstacle_id === payload.obstacle_id
                });
                console.log(index);
                this.showErrorTwo.splice(index, 1);
                payload.obstacle_state = 2;
                payload.obstacle_completiontime = new Date().getTime()
                this.showErrorThree.push(payload)
            },
            deleteShow(payload) {
                if (payload.obstacle_state === 0) {
                    let index = this.showErrorOne.findIndex(item => {
                        return item.obstacle_id === payload.obstacle_id
                    });
                    this.showErrorOne.splice(index, 1);
                } else if (payload.obstacle_state === 1){
                    let index = this.showErrorTwo.findIndex(item => {
                        return item.obstacle_id === payload.obstacle_id
                    });this.showErrorTwo.splice(index, 1);

                } else {
                    let index = this.showErrorThree.findIndex(item => {
                        return item.obstacle_id === payload.obstacle_id
                    });this.showErrorThree.splice(index, 1);
                }
            }

        },
        computed: {
            ...mapGetters(["userInfo", "house", "userInfoU"]),
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }

</style>