<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px" @keydown.enter.native="search">
          <el-form-item label="店铺名称">
            <el-input v-model="form.shopName" placeholder="店铺名称" />
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="form.userAccount" placeholder="用户账号" />
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm()" size="small">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group" v-show="hasAuthority('xcloudplat_store_list_1')">
              <el-button size="small" type="primary" :loading="exportLoading" @click="exportFile()" class="yellow-btn">
                <i class="icon icon-export"></i>
                <span>导出Excel</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="站点">
              <el-select clearable v-model="form.countryCode" placeholder="站点">
                <el-option
                  v-for="(item, index) in countryList"
                  :value="item.key"
                  :label="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑定状态">
              <el-select clearable v-model="form.authStatus" placeholder="绑定状态">
                <el-option value="1" label="已授权"></el-option>
                <el-option value="2" label="已解绑"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="table"
        border
        :data="list"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        :height="tableHeight"
        :default-sort="{ prop: 'firstOrderNum', order: 'descending' }"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="店铺名称" show-overflow-tooltip prop="shopName" />
        <el-table-column align="center" label="用户账号" show-overflow-tooltip prop="userAccont" />
        <el-table-column align="center" label="店铺别名" show-overflow-tooltip prop="shopNickName" />
        <el-table-column align="center" label="所属平台" show-overflow-tooltip prop="platformDesc" />
        <el-table-column align="center" label="开通站点" show-overflow-tooltip prop="siteCountryName" />
        <el-table-column align="center" label="授权状态" show-overflow-tooltip prop="authStatusDesc" />
        <el-table-column align="center" label="授权时间" show-overflow-tooltip prop="authTime" />
        <el-table-column align="center" label="关联税号" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-for="(li, index) of scope.row.relateTaxNoList || []">税号: {{ li || '-' }}</p>
            <p v-if="!scope.row.relateTaxNoList || scope.row.relateTaxNoList.length === 0">-</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAuthStore, getCountryList, authStoreExport } from '@/api/newApi/workOrder/store.js';
export default {
  data() {
    return {
      moreSerch: false,
      tableLoading: false,
      exportLoading: false,
      page: {
        page: 1,
        limit: 20,
      },
      total: 0,
      list: [],
      form: {},
      countryList: [], // 国家
    };
  },
  mounted() {
    this.getCountrySelectList();

    this.resetForm();
    this.search();
  },
  methods: {
    // 搜索
    search() {
      this.page.page = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      this.tableLoading = true;
      getAuthStore(Object.assign({}, this.page, this.form))
        .then((res) => {
          this.list = res.data.records || [];
          this.total = parseInt(res.data.total || 0);
          this.tableLoading = false;
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    // 导出文件
    exportFile() {
      this.exportLoading = true;
      authStoreExport(Object.assign({}, this.page, this.form))
        .then((res) => {
          this.exportLoading = false;
          this.$util.exportExcel(res, '店铺列表');
        })
        .catch((e) => {
          this.exportLoading = false;
        });
    },
    // 重置
    resetForm() {
      this.page.page = 1;
      this.form = {
        shopName: null,
        userAccount: null,
        countryCodes: null,
        authStatus: null,
      };
    },
    // 获取国家下拉框数据
    getCountrySelectList() {
      getCountryList().then((res) => {
        this.countryList = res.data;
      });
    },
    //分页
    handleSizeChange(val) {
      this.page.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped></style>
