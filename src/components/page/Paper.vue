<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 合同管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" @click="newVisible = true">新增合同</el-button>
            </div>
            <el-table
                    :data="showData"
                    border
                    class="table"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="contract_id" label="合同ID" width="70" align="center"></el-table-column>
                <el-table-column label="房源名称" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.house.housingresources_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="租金/月" align="center">
                    <template slot-scope="scope">￥{{scope.row.contract_price}}</template>
                </el-table-column>
                <el-table-column label="租客" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.tenant.tenant_realname}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="housingresources_renttype" label="租金类型" align="center"></el-table-column>
                <el-table-column label="起租时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.contract_begintime | formatDate("YYYY-MM-DD HH:mm")}}</span>

                    </template>
                </el-table-column>
                <el-table-column label="到期时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.contract_endtime | formatDate("YYYY-MM-DD HH:mm")}}</span>

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
                        :total="tableData.length"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ShowPaper from '../Items/ShowPaper';
    import { mapGetters } from "vuex"
export default {
    name: 'basecharts',
    components: {
        ShowPaper
    },
    data() {
        return {
            newVisible: false,
            showData: [],
            tableData: [],
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            editForm: { },
            temp: {
                contract_id: 2137812,
                contract_price: 927,
                housingresources_renttype: "年付",
                contract_begintime: new Date().getTime(),
                contract_endtime: new Date().getTime() + 99999
            }
        };
    },
    created() {
        this.temp.tenant = this.userInfoU
        this.temp.landlord = this.userInfo
        this.temp.house = this.house[0]
        for (let i=0; i<20; i++) {
            this.tableData.push(this.temp)
        }
        this.showData = this.tableData.slice(0,10)
    },
    methods: {
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.editForm = row;
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
        ...mapGetters(["userInfo", "house", "userInfoU"])
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
</style>