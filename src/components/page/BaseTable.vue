<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="菜名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" v-if="showCannel" @click="handleCannel">取消</el-button>
                <el-button type="primary" @click="newVisible = true">新增</el-button>
            </div>
            <el-table
                :data="showData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="dishes_id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="dishname" label="菜品名称"></el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">￥{{scope.row.dishes_price}}</template>
                </el-table-column>
                <el-table-column label="首图(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            fit="cover"
                            :src="scope.row.dishes_pic"
                            :preview-src-list="[scope.row.dishes_pic]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="shop" label="店铺"></el-table-column>
                <el-table-column label="销量" align="center">
                    <template slot-scope="scope">
                        <el-tag type="warning">{{scope.row.sales_volume}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="评分">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row.score" disabled show-score text-color="#ff9900"></el-rate>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                <el-form-item label="菜品ID">
                    <el-input v-model="form.dishes_id" disabled></el-input>
                </el-form-item>
                <el-form-item label="菜品名称">
                    <el-input v-model="form.dishname" placeholder="输入菜名"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.dishes_price" type="number"></el-input>
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
                        :file-list="fileList"
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
        <el-dialog title="新增菜品" :visible.sync="newVisible" width="50%">
             <el-form ref="newForm" :model="newForm" label-width="70px">
                <el-form-item label="菜品名称">
                    <el-input v-model="newForm.dishname" placeholder="输入菜名"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="newForm.dishes_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-image :src="newForm.dishes_pic" style="width: 30%"></el-image>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="原材料">
                    <el-input v-model="newForm.material"></el-input>
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
import { selectDishesList, selectshopforbusiness } from '../../api/index';
import { mapGetters } from 'vuex';
export default {
    name: 'basetable',
    data() {
        return {
            newVisible: false,
            newForm: {
                dishname: "",
                dishes_pic: "",
                dishes_price: 0,
                material: ""
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
            dataTemp: {
                list: [
                    {
                        id: 1,
                        name: '测试菜品',
                        money: 123,
                        shop: '测试店铺',
                        state: '在售',
                        date: '2019-11-1',
                        thumb: 'https://lin-xin.gitee.io/images/post/wms.png'
                    },
                    {
                        id: 2,
                        name: '测试菜品2',
                        money: 456,
                        shop: '测试店铺',
                        state: '在售',
                        date: '2019-10-11',
                        thumb: 'https://lin-xin.gitee.io/images/post/node3.png'
                    },
                    {
                        id: 3,
                        name: '测试菜品',
                        money: 789,
                        shop: '测试店铺',
                        state: '下架',
                        date: '2019-11-11',
                        thumb: 'https://lin-xin.gitee.io/images/post/parcel.png'
                    },
                    {
                        id: 4,
                        name: '测试菜品',
                        money: 1011,
                        shop: '测试店铺',
                        state: '在售',
                        date: '2019-10-20',
                        thumb: 'https://lin-xin.gitee.io/images/post/notice.png'
                    }
                ],
                pageTotal: 4
            },
            showCannel: false,
            shop: {},
            dialogImageUrl: '',
            dialogVisible: false
        };
    },
    created() {
        if (this.userInfo.isshop === 0) {
            this.getData();
        }
    },
    methods: {
         handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
        // 获取 easy-mock 的模拟数据
        getData() {
            selectshopforbusiness({ business_id: this.userInfo.business_id }).then(res => {
                if (res.code === '000') {
                    this.shop = res.isShop;
                    selectDishesList({ shop_id: this.shop.shop_id }).then(res => {
                        console.log(res);
                        this.tableData = res.disheslist.map(item => {
                            item.dishes_pic = 'https://assets.hhh233.xyz/dishesvictoria-shes-Qa29U4Crvn4-unsplash.jpg';
                            item.shop = this.shop.shop_name;
                            return item;
                        });
                        this.showData = this.tableData.slice(0, 10);

                        this.pageTotal = res.disheslist.length;
                    });
                }
            });
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
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].dishname + ' ';
            }
            this.tableData = [];
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
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
            // this.getData();
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
    border: none
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
