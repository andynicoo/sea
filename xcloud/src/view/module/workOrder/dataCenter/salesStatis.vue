<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px" @keydown.enter.native="search">
          <el-form-item label="统计方式" prop="statisticsType">
            <el-select
              style="width: 168px"
              v-model="form.statisticsType"
              size="small"
              filterable
              placeholder="请选择"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in statisticsTypeList"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属企业" prop="enterpriseId">
            <el-select
              style="width: 168px"
              v-model="form.enterpriseId"
              size="small"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in firmList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="search"
            >
              搜索
            </el-button>
            <el-button
              icon="el-icon-refresh"
              @click="reset"
              size="small"
            >
              重置
            </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{moreSerch ? '收起' : '更多'}}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group" v-show="hasAuthority('K2_1')">
              <el-button size="small" type="primary" :loading="exportLoading" @click="_export" class="yellow-btn">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="统计周期">
              <el-date-picker
                v-model="durationTime"
                type="daterange"
                style="width: 340px"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单来源" prop="orderSource">
              <el-select
                style="width: 168px"
                v-model="form.orderSource"
                size="small"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in orderSourceList"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式" prop="payChannel">
              <el-select
                style="width: 168px"
                v-model="form.payChannel"
                size="small"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option :value="item.value" :label="item.label" v-for="item in payChannelList" :key="item.value"></el-option>
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
        show-summary
        :summary-method="getSummaries"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        :height="tableHeight"
      >
        <Empty slot="empty" />
        <el-table-column
          align="center"
          min-width="170"
          :label="statisticsTypeName"
          show-overflow-tooltip
          prop="statisticsTypeName"
          fixed="left"
        ></el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="销售额（元）"
          sortable
          show-overflow-tooltip
          prop="totalSale"
        >
          <template slot-scope="scope">{{scope.row.totalSale | formatQianFenWei}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="支付订单数"
          sortable
          show-overflow-tooltip
          prop="totalPayOrders"
        >
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="支付人数"
          sortable
          show-overflow-tooltip
          prop="payUsers"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="支付件数"
          width="250"
          sortable
          show-overflow-tooltip
          prop="totalThings"
        >
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="退款金额（元）"
          sortable
          show-overflow-tooltip
          prop="totalRefund"
        >
          <template slot-scope="scope">{{scope.row.totalRefund | formatQianFenWei}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="退款单量"
          sortable
          show-overflow-tooltip
          prop="totalRefundNum"
        >
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {salePage, saleTotalStatistic, saleExport} from '@/api/newApi/dataCenter/salesStatis'
import { getFirm } from "@/api/newApi/common.js";
export default {
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        statisticsType: 1,
        enterpriseId: '',
        orderSource: '',
        payChannel: '',
      },
      durationTime: [],
      summariesData: {},
      statisticsTypeList: [
        {label: '部门', value: 1},
        {label: '员工', value: 2},
        {label: '商品', value: 3},
        {label: '商品分类', value: 4},
      ],
      orderSourceList: [
        {label: 'PC网页端', value: 1},
        {label: 'H5', value: 2},
        {label: '手工录入', value: 3},
        {label: '微信小程序', value: 4},
      ],
      payChannelList: [
        {label: '未知', value: 0},
        {label: '微信', value: 1},
        {label: '支付宝', value: 2},
        {label: '银联', value: 3},
      ],
      firmList: [],
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      statisticsTypeName: '',
      exportLoading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.getTime()
      await this.getfirmList()
      this.getSummariesData()
      this.getList()
    },
    getTime() {
      let date = new Date()
      date.setDate(1)
      this.durationTime = this.$util.getEndTime([this.$util.formatDate(date), this.$util.formatDate(new Date())])
    },
    formatTime() {
      [this.form.startTime, this.form.endTime] = (this.durationTime && this.durationTime.length ? this.durationTime : ['', '']);
    },
    getList() {
      this.tableLoading = true
      this.formatTime()
      salePage(this.form).then(res => {
        this.list = res.data.records
        this.total = parseInt(res.data.total)
        this.tableLoading = false
        switch(this.form.statisticsType) {
          case 1:
            return this.statisticsTypeName = '部门名称'
          case 2:
            return this.statisticsTypeName = '员工姓名'
          case 3:
            return this.statisticsTypeName = '商品名称'
          case 4:
            return this.statisticsTypeName = '商品分类'
        }
        if (this.searchFlag) {
          this.$message({
            message: `搜索完成，为您搜索${this.total}条结果`,
            type: "success",
            duration: 2000,
          })
          this.searchFlag = false
        }
      }).catch(err => {
        this.searchFlag = false
      })
    },
    getSummariesData() {
      saleTotalStatistic(this.form).then(res => {
        if(res.code === 0) {
          this.summariesData = res.data
        }
      })
    },
    getSummaries(param) {
      const { columns } = param;
      let sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        let key = column.property;
        let formatQianFenWei = this.$options.filters["formatQianFenWei"];
        switch (key) {
          case "totalSale":
            return (sums[index] = formatQianFenWei(this.summariesData.totalSale));
          case "totalPayOrders":
            return (sums[index] = this.summariesData.totalPayOrders);
          case "payUsers":
            return (sums[index] = this.summariesData.payUsers);
          case "totalThings":
            return (sums[index] = this.summariesData.totalThings);
          case "totalRefund":
            return (sums[index] = formatQianFenWei(this.summariesData.totalRefund));
          case "totalRefundNum":
            return (sums[index] = this.summariesData.totalRefundNum);
        }
      });
      return sums;
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      return new Promise(resolve => {
        getFirm().then(res => {
          if (res.code === 0) {
            this.firmList = res.data
            if(res.data.length) {
              let enterprise = res.data.find(e => e.id+'' === localStorage.getItem('enterpriseId'))
              this.form.enterpriseId = enterprise ? enterprise.id : res.data[0].id
            }
          }
          resolve()
        });
      })
    },
    _export() {
      this.exportLoading = true
      saleExport(this.form).then(res => {
        this.exportLoading = false
        this.$util.exportExcel(res, '销售统计')
      }).catch(e => {
        this.exportLoading = false
      })
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList();
    },
    async search() {
      this.searchFlag = true
      this.form.page = 1
      this.getSummariesData()
      this.getList()
    },
    reset() {
      if(this.$refs.searchForm) {
        this.$refs.searchForm.resetFields()
      }
      if(this.firmList.length) {
        this.form.enterpriseId = this.firmList[0].id
      }
      this.getTime()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>