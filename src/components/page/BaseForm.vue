<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>新增菜品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px" label-position="left">
                    <el-form-item label="菜品名称">
                        <el-input v-model="form.name" placeholder="输入菜品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="菜品原材料">
                        <el-input v-model="form.region" placeholder="请以逗号分隔"></el-input>
                    </el-form-item>
                    <el-form-item label="菜品图片">
                        <el-col>
                            <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                multiple
                                :file-list="form.filelist"
                                :limit="3"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="菜品价格">
                        <el-input type="number" v-model="form.price"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                name: '',
                region: '',
                filelist:[],
                price: ''
            }
        };
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
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
        }
    }
};
</script>

<style>
.el-upload--text{
    width: auto;
    height: auto;
    border: none;
}
</style>