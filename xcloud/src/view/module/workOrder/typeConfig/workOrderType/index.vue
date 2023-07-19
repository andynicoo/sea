<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="75px">
          <el-form-item label="业务分类" prop="categoryId">
            <el-select style="width: 168px" v-model="form.categoryId" size="small" clearable filterable placeholder="请选择" @change="changeWorkCategory">
              <el-option :label="item.name" :value="item.id" v-for="item in workCategoryList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单类型" prop="functionId">
            <el-select style="width: 168px" v-model="form.functionId" size="small" clearable filterable placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in workTypeList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh-left" @click="reset" size="small"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" min-width="200" label="业务分类" show-overflow-tooltip prop="categoryName"></el-table-column>
        <el-table-column align="center" min-width="200" label="工单类型" show-overflow-tooltip prop="functionName"></el-table-column>
        <el-table-column align="center" min-width="200" label="关联工单" show-overflow-tooltip prop="relationFunctionName"></el-table-column>
        <el-table-column align="center" min-width="150" label="已发布流程数" show-overflow-tooltip prop="nums"></el-table-column>
        <el-table-column align="center" min-width="150" label="更新时间" show-overflow-tooltip prop="updateTime">
          <template slot="header">
            更新时间
            <el-tooltip class="item" effect="dark" content="新建或编辑【确认】的时间" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row, 'detail')" v-show="hasAuthority('O2_3')">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row, 'edit')" v-show="hasAuthority('O2_4')">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getWorkflowRelationList, workCategory, workType } from '@/api/newApi/workOrder/typeConfig';
import { workFunction } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        categoryId: '',
        functionId: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      workCategoryList: [],
      workTypeList: [],
      allWorkTypeList: [],
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
    };
  },
  watch: {
    'form.categoryId'(val) {
      if (val) {
        this.getWorkType(this.form.categoryId);
      }
    },
  },
  mixins: [cacheQuery],
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getWorkCategory();
    this.getAllWorkType();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getWorkflowRelationList(this.form)
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
          this.searchFlag = false;
        });
    },
    /**
     * 获取业务分类
     */
    getWorkCategory() {
      workCategory().then((res) => {
        this.workCategoryList = res.data;
      });
    },
    changeWorkCategory(id) {
      this.form.functionId = '';
      if (!id) {
        this.workTypeList = this.allWorkTypeList;
        return;
      }
    },
    /**
     * 获取工单类型
     */
    getWorkType(id) {
      workType({
        categoryId: id,
      }).then((res) => {
        this.workTypeList = res.data;
      });
    },
    /**
     * 获取所有工单类型
     */
    getAllWorkType() {
      workFunction().then((res) => {
        this.workTypeList = res.data;
        this.allWorkTypeList = res.data;
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
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.workTypeList = this.allWorkTypeList;
      this.removePageCache();
    },
    detail(row, type) {
      let router = {
        path: '/workOrderType/detail',
        query: {
          type,
          categoryName: row.categoryName,
          functionName: row.functionName,
          functionCode: row.code,
        },
      };
      if (row) {
        router.query.functionId = row.functionId;
      }
      this.$router.push(router);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  text-align: right;
}
</style>
