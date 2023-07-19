<!--  -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <el-form inline ref="searchForm">
        <el-form-item label="分类名称">
          <el-input placeholder="请输入商品名称" clearable style="width: 220px" size="small" v-model="listQuery.categoryName" @clear="queryData" />
        </el-form-item>
        <el-form-item label="分类状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search" :loading="listLoading">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-button type="success" size="small" @click="addClassify">新增分类</el-button>
      </el-form>
    </div>

    <!--表格  -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="分类名称" width="200">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
        </el-table-column>
        <el-table-column align="center" label="启用状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="(status) => statusChange(status, scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="最近修改时间" width="200">
          <template slot-scope="scope">{{ scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="editClassify(scope.row)">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="deleteClassify(scope.row)">
                <i class="icon icon-del"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="新增/编辑分类" :visible.sync="dialogVisible" width="420px" center destroy-on-close>
      <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRules" :model="editForm" label-width="120px">
        <el-form-item label="商品分类名称" prop="categoryName">
          <el-input placeholder="请输入商品分类名称" clearable style="width: 240px" size="small" v-model="editForm.categoryName" maxlength="12" />
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input-number v-model="editForm.sort" controls-position="right" placeholder="" style="width: 200px" clearable :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { integralClassify, integralClassifyDel, editIntegralClassify, addIntegralClassify } from '@/api/newApi/extension/coupon.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      initHeight: 65,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        categoryName: '',
        status: null, // 状态 0禁用 1启用
      },
      searchFlag: false,
      dialogVisible: false,
      type: 'add',
      editForm: {
        status: 1,
        sort: 0,
      },
      formRules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择启用类型', trigger: 'change' }],
      },
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },

  methods: {
    // 更新商品状态
    async statusChange(val, row) {
      let data = {
        categoryName: row.categoryName,
        sort: row.sort,
        status: val ? 1 : 0,
        integralProductCategoryId: row.integralProductCategoryId,
      };
      this.editIntegralClassifyBtn(data);
    },

    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      let param = JSON.parse(JSON.stringify(this.listQuery));
      if (param.couponType == 0) delete param.couponType;
      if (param.status == -1) param.status = null;
      integralClassify(param)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },

    async search() {
      this.searchFlag = true;
      this.listQuery.current = 1;
      await this.queryData();
    },

    handleReset() {
      this.listQuery = {
        current: 1,
        size: 20,
        goodsName: '',
        goodsType: null, // 商品类型 1实物商品 2优惠卷
        status: null, // 状态 0禁用 1启用
      };
      this.search();
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.queryData();
    },

    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.queryData();
    },

    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.current = 1;
      this.queryData();
    },

    /** 删除 */
    deleteClassify(row) {
      this.$confirm(`确定删除分类:${row.categoryName}?`, '删除产品', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        integralClassifyDel({ id: row.integralProductCategoryId }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '产品删除成功',
            });
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    editClassify(row) {
      this.dialogVisible = true;
      this.type = 'edit';
      this.editForm = {
        categoryName: row.categoryName,
        sort: row.sort,
        status: row.status ? 1 : 0,
        integralProductCategoryId: row.integralProductCategoryId,
      };
    },
    addClassify() {
      this.dialogVisible = true;
      this.type = 'add';
      this.editForm = {
        status: 1,
        sort: 0,
      };
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          let data = this.editForm;
          if (this.type == 'add') {
            this.addIntegralClassifyBtn(data);
          } else {
            this.editIntegralClassifyBtn(data);
          }
        } else {
          return false;
        }
      });
    },
    addIntegralClassifyBtn(data) {
      addIntegralClassify(data).then((res) => {
        if (res.code == 0) {
          this.dialogVisible = false;
          this.queryData();
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    editIntegralClassifyBtn(data) {
      editIntegralClassify(data).then((res) => {
        if (res.code == 0) {
          this.dialogVisible = false;
          this.queryData();
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
