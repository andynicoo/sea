<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="国家" prop="countryCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode">
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类" prop="supplierId">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.supplierId">
              <el-option v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button type="primary" size="small" @click="refresh" v-show="hasAuthority('L2_11')">
                <i class="icon icon-refresh-white"></i>
                <span>刷新</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="订单号" min-width="200" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" label="工单号" min-width="150" show-overflow-tooltip prop="supplierName"></el-table-column>
        <el-table-column align="center" label="商品分类" min-width="150" show-overflow-tooltip prop="countryNameZh"> </el-table-column>
        <el-table-column align="center" label="国家" min-width="200" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
        <el-table-column align="center" label="商品名称" min-width="150" show-overflow-tooltip prop="userMobile"> </el-table-column>
        <el-table-column align="center" label="客户手机号" min-width="150" show-overflow-tooltip prop="declareUserName"> </el-table-column>
        <el-table-column align="center" label="公司中文名称" min-width="150" show-overflow-tooltip prop="companyNameZh">
          <template slot-scope="{ row }">
            <div class="column-content">{{ row.companyNameZh }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理人" min-width="150" show-overflow-tooltip prop="supplierName">
          <template slot-scope="{ row }">
            <div class="column-content">{{ row.supplierName }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单备注" min-width="200" show-overflow-tooltip prop="remark">
          <template slot-scope="{ row }">
            <div class="column-content">{{ row.remark }}</div>
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
import { serviceOrderDeclareWarnList } from '@/api/newApi/limitData/declareAbnormalWorkorder';
import { getCountrySelectList } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        productFunctionCode: '',
        countryCode: '',
        supplierId: '',
        searchContent: '',
        declareUserId: '',
        abnormalType: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      searchFlag: false,
      countrySelectList: [],
      merchantList: [],
      copyForm: {},
    };
  },
  mixins: [cacheQuery],
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      serviceOrderDeclareWarnList(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.copyForm = { ...this.form };
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
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    refresh() {},
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
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.column-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: pre-line;
}
</style>
