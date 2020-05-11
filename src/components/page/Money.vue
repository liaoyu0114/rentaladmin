<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-money"></i> 租金管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="dialogVisiable = true">新增</el-button>
                <el-tabs v-model="message" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="first"></el-tab-pane>
                    <el-tab-pane label="未缴纳" name="second"></el-tab-pane>
                    <el-tab-pane label="已缴纳" name="third"></el-tab-pane>
                </el-tabs>
            </div>
            <el-table
                :data="showData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="rent_id" label="租金ID" width="70" align="center"></el-table-column>
                <el-table-column label="租客昵称" align="center">
                    <template slot-scope="scope">{{scope.row.tenant.tenant_nickname}}</template>
                </el-table-column>
                <el-table-column label="应交租金" align="center">
                    <template slot-scope="scope">￥{{scope.row.rent_price}}</template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template
                        slot-scope="scope"
                    >{{scope.row.rent_time | formatDate("YYYY-MM-DD HH:mm")}}</template>
                </el-table-column>
                <el-table-column label="截止时间" align="center">
                    <template
                        slot-scope="scope"
                    >{{scope.row.rent_endtime | formatDate("YYYY-MM-DD HH:mm")}}</template>
                </el-table-column>
                <el-table-column label="缴纳状态" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.rent_type === 1" style="color:#409eff;">已缴纳</span>
                        <span v-else style="color: #f56c6c">未缴纳</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                         <el-button
                            size="mini"
                            type="primary"
                            v-if="scope.row.rent_type === 0"
                            @click="scope.row.rent_type = 1"
                        >确认收租</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            style="float: right"
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
                    :total="tableData.length"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 新建 -->
        <el-dialog title="新增租金管理" :visible.sync="dialogVisiable" width="30%">
            <div class="from-box">
                <el-form :model="newMoney" label-position="left" label-width="80px">
                    <el-form-item label="选择租客">
                        <el-select v-model="newMoney.tenant.tenant_nickname" placeholder="选择租客">
                            <el-option label="新建租客一" value="新建租客一"></el-option>
                            <el-option label="新建租客二" value="新建租客二"></el-option>
                            <el-option label="新建租客三" value="新建租客三"></el-option>
                            <el-option label="新建租客四" value="新建租客四"></el-option>
                            <el-option label="新建租客五" value="新建租客五"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="输入租金" style="width: 274px">
                        <el-input v-model="newMoney.rent_price" placeholder="输入每月租金" min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" style="width: 274px">
                        <el-date-picker
                            type="date"
                            placeholder="开始日期"
                            v-model="newMoney.rent_time"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" style="width: 274px">
                        <el-date-picker
                            type="date"
                            placeholder="开始日期"
                            v-model="newMoney.rent_endtime"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onChange">确认</el-button>
                        <el-button @click="dialogVisiable = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'upload',
    data: function() {
        return {
            message: 'first',
            dialogVisiable: false,
            showData: [],
            tableData: [],
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            newMoney: {
                rent_id: '',
                tenant: {
                    tenant_nickname: ''
                },
                rent_price: '',
                rent_time: '',
                rent_endtime: ''
            },
            temp: {
                rent_id: 29123,
                landlord: {},
                tenant: {},
                rent_price: 920,
                rent_time: new Date().getTime(),
                rent_endtime: new Date().getTime(),
                rent_type: 1
            },
            temp2: {
                rent_id: 19283,
                landlord: {},
                tenant: {},
                rent_price: 920,
                rent_time: new Date().getTime(),
                rent_endtime: new Date().getTime(),
                rent_type: 0
            }
        };
    },
    created() {
        this.temp.landlord = this.userInfo;
        this.temp.tenant = this.userInfoU;
        this.temp2.landlord = this.userInfo;
        this.temp2.tenant = this.userInfoU;
        for (let i = 0; i < 8; i++) {
            this.temp.rent_price += 100 * (i + 1);
            this.temp2.rent_price += 200 * (i + 1);
            this.tableData.push(this.temp);
            this.tableData.push(this.temp2);
        }
        this.showData = this.tableData.slice(0, 10);
    },
    computed: {
        ...mapGetters(['userInfo', 'house', 'userInfoU'])
    },
    methods: {
        onChange() {
            this.newMoney.rent_type = 0;
            this.newMoney.rent_id = 21231;
            this.newMoney.tenant.tenant_realname = '新建realname';
            this.showData = [this.newMoney].concat(this.showData);
            this.dialogVisiable = false;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.showData.splice(index, 1);
                    this.$message({
                        message: `删除了ID为${row.rent_id}的条目`,
                        type: 'success'
                    });
                })
                .catch(() => {
                    this.$message.error('发生未知错误，删除失败');
                });
        },
        // 编辑操作
        handleEdit(index, row) {},
        handleSearch() {},
        handlePageChange(val) {
            console.log(val);
            let count = 0;
            let min = 10 * (val - 1);
            let max = 10 * (val - 1) + 10;
            if (max > this.tableData.length + 1) {
                count = this.tableData.length + 1 - min;
            }

            this.showData = this.tableData.slice(min, max);
        },
        handleClick(tab, event) {
            console.log(tab, event);
            if (tab.index === '0') {
                this.showAll();
            } else if (tab.index === '1') {
                this.showNO();
            } else {
                this.showYes();
            }
        },
        showAll() {
            this.showData = this.tableData.slice(0, 10);
        },
        showNO() {
            this.showData = this.tableData.filter(item => {
                return item.rent_type === 0;
            });
        },
        showYes() {
            this.showData = this.tableData.filter(item => {
                return item.rent_type === 1;
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
.from-box {
    display: flex;
    justify-content: center;
}
</style>