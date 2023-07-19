<template>
    <div>
        <!-- 查询条件 -->
        <div class="header-container" style="padding-top:0">
            <el-button type="success" @click="addEditAttachspecs('')" v-show="hasAuthority('GC_9')">
                <i class="icon icon-adds"></i> 创建附加规格计算模板
            </el-button>
        </div>
        <!-- 表格 -->
        <div class="table-container">
            <el-table border :data="subClassList" v-loading="tableLoading" ref="table"
                element-loading-spinner="icon loading" element-loading-text="拼命加载中">
                <el-table-column align="center" label="模板名称" prop="templateName" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="商品分类" prop="specsName" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.productCategoryName}} / {{scope.row.subProductCategoryName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="规格名称" prop="specsName" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="计算公式类型" prop="specsName">
                    <template slot-scope="scope">
                        {{scope.row.calcType=="QUANTITY"?'数量计算':'阶梯计算'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime">
                </el-table-column>
                <el-table-column align="center" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top">
                            <el-link type="primary" class="icon icon-edit" :underline="false"
                                v-show="hasAuthority('GC_9')" @click="addEditAttachspecs(scope.row.id)">
                            </el-link>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-link type="primary" :underline="false" @click="del(scope.row.id)" v-show="hasAuthority('GC_10')">
                                <i class="icon icon-del"></i>
                                <!-- 删除 -->
                            </el-link>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 全部分页 -->
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>

    </div>
</template>

<script>
import {
    getSpecsPage,
    productAdditionSpecDelete,
    productAdditionSpecList
} from "@/api/newApi/servicemerchant/goodsCenter.js";

export default {
    name:'goodsAttachspecs',
    data() {
        return {
            total: 0,
            tableLoading: false,
            form: {
                size: 10,
                current: 1,
            },
            subClassList: []

        };
    },
    created() {
        this.getSpecsPageList();
    },
    methods: {
        //获取列表数据
        getSpecsPageList() {
            this.tableLoading = true;
            let data = this.form
            for (let key in data) {
                if (data[key] === '') {
                    delete data[key];
                }
            }
            productAdditionSpecList(data)
                .then((res) => {
                    this.subClassList = res.data.records;
                    this.total = parseInt(res.data.total);
                    this.tableLoading = false;

                    this.$message({
                        message: `搜索完成，为您搜索${this.total}条结果`,
                        type: "success",
                        duration: 2000,
                    });

                })
                .catch((err) => {
                    this.tableLoading = false;
                });
        },
        //新增编辑附加规格
        addEditAttachspecs(id){
            console.log(id)
            this.$router.push({path:'/serviceMerchant/channelGoods/addEditAttachspecs',query:{id}})
        },

        /**
         * 分页
         */
        handleSizeChange(val) {
            this.form.size = val;

            this.getSpecsPageList()

        },
        handleCurrentChange(val) {
            this.form.current = val;

            this.getSpecsPageList()

        },

        /**
         * 删除
         */
        del(id) {
            this.$confirm("确定删除？", "删除提示", {
                customClass: "custom-confirm",
                type: "warning",
                center: true,
            }).then(() => {
                productAdditionSpecDelete({
                    ids: [id],
                }).then((res) => {
                    if (res.code === 0) {

                        this.getSpecsPageList()

                    }
                });
            });
        },

    },
};
</script>

<style lang="less">
.yellow-btn {
    color: #fff !important;
}

.gs-custom-grouping {
    th .el-checkbox {
        display: none;
    }
}
</style>

