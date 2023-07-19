<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="form.categoryName" placeholder="请输入分类名称" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.status">
              <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button type="primary" size="small" class="green-btn" @click="addDialogVisible = true" v-show="hasAuthority('H2_1')">
                <i class="icon icon-square-add"></i>
                <span>新增分类</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.name" :name="item.value" v-for="(item, index) in moduleList" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="600">
        <Empty slot="empty" />
        <el-table-column align="center" label="分类名称" show-overflow-tooltip prop="categoryName"></el-table-column>
        <el-table-column align="center" label="产品大类" show-overflow-tooltip prop="productCategoryName"></el-table-column>
        <el-table-column align="center" label="排序" show-overflow-tooltip prop="sort"></el-table-column>
        <el-table-column align="center" label="状态" width="200" show-overflow-tooltip prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">
              <span class="dot-success"></span>
              启用
            </span>
            <span v-if="scope.row.status === 2">
              <span class="dot-danger"></span>
              禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="200" show-overflow-tooltip prop="createName"></el-table-column>
        <el-table-column align="center" width="300" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" width="250" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" :underline="false" icon="icon icon-edit" @click="edit(scope.row)" v-show="hasAuthority('H2_2')">
                <!-- 编辑 -->
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-link type="primary" :underline="false" @click="del(scope.row.id)" icon="icon icon-del" v-if="hasAuthority('H2_3') && scope.row.status === 2">
                <!-- 删除 -->
              </el-link>
            </el-tooltip>
            <el-tooltip :content="(3 - scope.row.status) | filterStatus" placement="top">
              <el-link type="primary" :underline="false" :icon="scope.row.status === 2 ? 'icon icon-use' : 'icon icon-disable'" @click="disabled(scope.row)" v-show="hasAuthority('H2_4')">
                <!-- {{ (3-scope.row.status) | filterStatus }} -->
              </el-link>
            </el-tooltip>
            <el-link type="primary" :underline="false" @click="editSeoFrom(scope.row)" v-if="activeName !== '1'" v-show="hasAuthority('CATE_ADD')"> SEO设置 </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-container">
      <el-dialog :title="!this.editId ? '新增' : '编辑' + '分类'" :visible.sync="addDialogVisible" width="460px" center @close="resetAddFields">
        <el-form :model="addForm" :rules="formRule" ref="addDialogForm" label-width="120px">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="addForm.categoryName" placeholder="请输入分类名称" clearable style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="关联产品大类" prop="status">
            <el-select placeholder="请选择" size="small" style="width: 200px" clearable v-model="addForm.productCategoryId">
              <el-option v-for="item in productList" :key="item.id" :label="item.productCategoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="addForm.sort" :min="0" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="item.value" v-for="item in statusList" :key="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="buttonLoading" @click="submit">保 存</el-button>
          <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- seo设置 -->
    <el-dialog title="seo设置" :visible="editSEO" :close-on-click-modal="false" width="550px" :before-close="handleClose" :destroy-on-close="true">
      <EditSEO :info="info" v-if="editSEO" :type="'product'" @subSeoInfo="subSeoInfo" />
    </el-dialog>
  </div>
</template>

<script>
import { getDocumentCategoryList, getDocumentCategoryInfo, addDocumentCategory, updateDocumentCategory, delDocumentCategory, disabledDocumentCategory, getProductBigList } from '@/api/newApi/consultingCenter/classifiManage';
import cacheQuery from '@/mixins/cacheQuery';
import EditSEO from '@/components/siteconfig/EditSeo.vue';
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        categoryName: '',
        moduleType: '4',
        status: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      moduleList: [
        { name: '行业报告', value: '4' },
        { name: '资讯管理', value: '2' },
        { name: '案例库', value: '3' },
        { name: '出海问答', value: '5' },
        { name: '操作指引', value: '1' },
      ],
      // 关联产品大类
      productList: [],
      statusList: [
        { name: '启用', value: 1 },
        { name: '禁用', value: 2 },
      ],
      searchFlag: false,
      addDialogVisible: false,
      buttonLoading: false,
      addForm: {
        categoryName: '',
        moduleType: '',
        status: 1,
        sort: 0,
        productCategoryId: '',
      },
      formRule: {
        moduleType: [{ required: true, message: '请选择模块类型', trigger: 'blur' }],
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        // status: [{required: true, message: '请选择状态', trigger: 'blur'}],
      },
      editId: 0,
      activeName: '4', // 表格上tab切换 值
      editSEO: false,
      info: {}, // seo设置
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return '启用';
        case 2:
          return '禁用';
      }
    },
  },
  components: {
    EditSEO,
  },
  mixins: [cacheQuery],
  created() {
    // 新增分类弹窗，关联产品大类下来数据
    this.getProductBigList();
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
  },
  methods: {
    getProductBigList() {
      getProductBigList().then((res) => {
        if (res.code === 0) {
          this.productList = res.data;
        }
      });
    },
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getDocumentCategoryList(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.form.moduleType = this.activeName;
      this.getList();
    },
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    handleClick(tab, event) {
      this.search();
    },
    edit(row) {
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.addForm = {
          moduleType: row.moduleType,
          categoryName: row.categoryName,
          status: row.status,
        };
      });
      this.editId = row.id;
    },
    del(id) {
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        delDocumentCategory(id).then((res) => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
    disabled(row) {
      this.$confirm(`是否确认${row.status === 1 ? '禁用' : '启用'}?`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.tableLoading = true;
        disabledDocumentCategory(row.id, 3 - row.status)
          .then((res) => {
            if (res.code == 0) {
              this.$message('操作成功');
              this.getList();
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
    submit() {
      this.$refs.addDialogForm.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.addForm.moduleType = this.activeName;
          if (!this.editId) {
            // 新增
            this._addDocumentCategory();
          } else {
            this._updateDocumentCategory();
          }
        }
      });
    },
    _addDocumentCategory() {
      addDocumentCategory(this.addForm).then((res) => {
        this.$message.success('添加成功');
        this.addOrEditSuccess();
      });
    },
    _updateDocumentCategory() {
      updateDocumentCategory({
        ...this.addForm,
        id: this.editId,
      }).then((res) => {
        this.$message.success('修改成功');
        this.addOrEditSuccess();
      });
    },
    addOrEditSuccess() {
      this.buttonLoading = false;
      this.addDialogVisible = false;
      this.getList();
    },
    resetAddFields() {
      this.editId = 0;
      if (this.$refs.addDialogForm) {
        this.$refs.addDialogForm.resetFields();
      }
      if (this.buttonLoading) {
        this.buttonLoading = false;
      }
    },
    editSeoFrom(row) {
      let { seoTitle, keyword, seoDescribe, id } = row;
      this.info.seoTitle = seoTitle;
      this.info.keyword = keyword;
      this.info.seoDescribe = seoDescribe;
      this.info.id = id;
      this.editSEO = true;
    },
    subSeoInfo() {
      this.editSEO = false;
      this.search();
    },
    handleClose() {
      this.editSEO = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
