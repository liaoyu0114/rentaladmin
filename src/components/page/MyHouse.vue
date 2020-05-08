<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 房源管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="输入关键字搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" v-if="showCannel" @click="handleCannel">取消</el-button>
                <el-button type="primary" @click="newVisible = true">发布新房源</el-button>
            </div>
            <el-table
                :data="showData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="housingresources_id" label="房源ID" width="70" align="center"></el-table-column>
                <el-table-column prop="housingresources_name" label="房源名称"></el-table-column>
                <el-table-column label="租金">
                    <template slot-scope="scope">￥{{scope.row.housingresources_price}}</template>
                </el-table-column>
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            fit="cover"
                            :src="scope.row.housingresources_pic[0]"
                            :preview-src-list="scope.row.housingresources_pic"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="housingresources_address" label="地址"></el-table-column>
                <el-table-column label="用户" align="center">
                    <template slot-scope="scope">
                        <el-popover
                                placement="top-start"
                                trigger="hover">
                            <el-row :gutter="10">
                                <el-col>这里放租客信息</el-col>
                            </el-row>
                            <el-avatar :src="scope.row.housingresources_pic[1]" slot="reference"></el-avatar>
                        </el-popover>
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
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="房源名称">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="房源地址">
                    <el-input v-model="form.address" placeholder="搜索地址"></el-input>
                </el-form-item>
                <el-form-item label="房型">
                    <el-radio-group v-model="form.hType">
                        <el-radio label="整套出租"></el-radio>
                        <el-radio label="单间出租"></el-radio>
                        <el-radio label="短租/日租"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片">
                    <el-image :src="form.dishes_pic" style="width: 30%"></el-image>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="原材料">
                    <el-input v-model="form.material"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发布新房源" :visible.sync="newVisible" width="50%">
            <el-form ref="newForm" :model="newForm" label-width="70px">
                <el-form-item label="房源名称">
                    <el-input v-model="form.name" placeholder="输入房源名称"></el-input>
                </el-form-item>
                <el-form-item label="房源地址">
                    <el-input v-model="form.address" placeholder="搜索地址"></el-input>
                </el-form-item>
                <el-form-item label="出租类型">
                    <el-select v-model="form.catalog" placeholder="选择出租类型">
                        <el-option label="整套出租" value="整套出租"></el-option>
                        <el-option label="单间出租" value="单间出租"></el-option>
                        <el-option label="短租/日租" value="短租/日租"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="房型">
                    <el-select v-model="form.hType" placeholder="选择房型">
                        <el-option label="三室一厅" value="三室一厅"></el-option>
                        <el-option label="三室二厅" value="三室二厅"></el-option>
                        <el-option label="两室一厅" value="两室一厅"></el-option>
                          <el-option label="一室一厅" value="一室一厅"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="楼层">
                   <el-select v-model="form.floor" placeholder="选择出租类型">
                        <el-option label="高层" value="高层"></el-option>
                        <el-option label="中层" value="中层"></el-option>
                        <el-option label="低层" value="低层"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="朝向">
                   <el-select v-model="form.dirction" placeholder="选择朝向">
                        <el-option label="南" value="南"></el-option>
                        <el-option label="东南" value="东南"></el-option>
                        <el-option label="东" value="东"></el-option>
                        <el-option label="东北" value="东北"></el-option>
                        <el-option label=北 value="北"></el-option>
                        <el-option label="西北" value="西北"></el-option>
                        <el-option label="西" value="西"></el-option>
                        <el-option label="西南" value="西南"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="押金类型">
                   <el-select v-model="form.mType" placeholder="选择押金类型">
                        <el-option label="押一付一" value="押一付一"></el-option>
                        <el-option label="押一付三" value="押一付三"></el-option>
                        <el-option label="半年付" value="半年付"></el-option>
                        <el-option label="年" value="年"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="每月租金">
                   <el-input v-model="form.price" placeholder="输入每月租金" type="number"></el-input>
                </el-form-item>
                <el-form-item label="房屋面积">
                   <el-input v-model="form.rect" placeholder="输入房屋面积" type="number"></el-input>
                </el-form-item>
                <el-form-item label="写点描述">
                    <el-input v-model="newForm.intraduce" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'basetable',
    data() {
        return {
            newVisible: false,
            newForm: {
                name: '',
                address: '',
                catalog: '',
                hType: '',
                intraduce: '',
                floor: '',
                dirction: '',
                mType: '',
                price: '',
                rect: '',
                lat: '',
                lng: ''
            },
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            showData: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            data: {},
            showCannel: false,
            shop: {},
            dialogImageUrl: '',
            dialogVisible: false
        };
    },
    created() {
        this.showData.push( {
            housingresources_id: "1827",
            housingresources_name: "测试测试测试测试测试测试测试测试测试",
            housingresources_price: 920,
            housingresources_address: "地址地址地址地址地址地址地址地址地址",
            housingresources_pic: [
                "https://assets.hhh233.xyz/181.jpg",
                "https://assets.hhh233.xyz/045%20%282%29.jpg",
                "https://assets.hhh233.xyz/05-8.jpg"
            ]
        })
    },
    methods: {
        tableRowClick(row, column, event) {
            console.log(row);
            this.$message("233")
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.showData = this.tableData.filter(state => {
                console.log(state);
                return state.dishname.toLowerCase().indexOf(this.query.name.toString()) === 0;
            });
            this.showCannel = true;
        },
        handleCannel() {
            this.showCannel = false;
            this.showData = this.tableData.slice(0, 10);
        },
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
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
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
        ...mapGetters(['userInfo'])
    }
};
</script>
<style>
.el-upload--text {
    width: auto;
    height: auto;
    border: none;
}
.el-upload__tip {
    margin: 0;
}
</style>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
