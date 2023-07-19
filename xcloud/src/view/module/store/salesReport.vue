<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px" @keydown.enter.native="search">
          <el-form-item label="服务号">
            <el-input v-model="form.serverNo" placeholder="服务号" />
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
            <div class="header-btn-group" v-show="hasAuthority('xcloudplat_store_salesReport_2')">
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
            <el-form-item label="申报类型">
              <el-select clearable v-model="form.declarePeriod" placeholder="申报类型">
                <el-option value="0" label="月报"></el-option>
                <el-option value="1" label="季报"></el-option>
                <el-option value="2" label="年报"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报告生成状态">
              <el-select clearable v-model="form.status" placeholder="报告生成状态">
                <el-option value="1" label="已生成"></el-option>
                <el-option value="2" label="部分生成"></el-option>
                <el-option value="3" label="生成失败"></el-option>
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
        <el-table-column align="center" label="服务号" show-overflow-tooltip prop="serverNo" />
        <el-table-column align="center" label="用户账号" show-overflow-tooltip prop="userAccount" />
        <el-table-column align="center" label="站点" show-overflow-tooltip prop="countryName" />
        <el-table-column
          align="center"
          label="获取数据申报周期"
          show-overflow-tooltip
          prop="firstOrderNum"
          width="300px"
        >
          <template slot-scope="scope"> {{ scope.row.reportStartTime }} 至 {{ scope.row.reportEndTime }} </template>
        </el-table-column>
        <el-table-column align="center" label="申报类型" show-overflow-tooltip prop="declarePeriod">
          <template slot-scope="scope">
            <p v-if="scope.row.declarePeriod === 0">月报</p>
            <p v-else-if="scope.row.declarePeriod === 1">季报</p>
            <p v-else-if="scope.row.declarePeriod === 2">年报</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数据生成状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">
            <p style="color: green" v-if="scope.row.status === 1">已生成</p>
            <p style="color: #666" v-else-if="scope.row.status === 2">部分生成</p>
            <p style="color: red" v-else-if="scope.row.status === 3">生成失败</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="报告最新生成时间" show-overflow-tooltip prop="reportGetTime" />
        <el-table-column align="center" label="操作" show-overflow-tooltip prop="firstOrderNum">
          <template slot-scope="scope">
            <span @click="salesReportDownLoad(scope.row)">查看报告</span>
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
    <SalesReportDownLoad ref="SalesReportDownLoad" :record="record" />
  </div>
</template>

<script>
import { getCountryList, getAmazonSalesReportList, exportList } from '@/api/newApi/workOrder/store.js';
import SalesReportDownLoad from './components/SalesReportDownLoad.vue';
export default {
  components: {
    SalesReportDownLoad,
  },
  data() {
    return {
      moreSerch: false,
      tableLoading: false,
      exportLoading: false,
      record: {},
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
    //查看报告
    salesReportDownLoad(row) {
      this.record = row;
      this.$refs.SalesReportDownLoad.showModal = true;
    },
    // 搜索
    search() {
      this.page.page = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      this.tableLoading = true;
      getAmazonSalesReportList(Object.assign({}, this.page, this.form))
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
      exportList(this.form)
        .then((res) => {
          this.exportLoading = false;
          this.$util.exportExcel(res, '销售报告管理');
        })
        .catch((e) => {
          this.exportLoading = false;
        });
    },
    // 重置
    resetForm() {
      this.page.page = 1;
      this.form = {
        serverNo: '',
        userAccount: '',
        countryCode: '',
        declarePeriod: '',
        status: '',
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
