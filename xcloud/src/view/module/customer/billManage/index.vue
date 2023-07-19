<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="渠道名称" prop="channelName">
            <el-input v-model="form.channelName" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="手机号" prop="userMobile">
            <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="账单号" prop="billNo">
            <el-input v-model="form.billNo" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="结算时间" prop="settleTime">
            <el-date-picker v-model="form.settleTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-form-item>
          <el-form-item label="账单日" prop="billTime">
            <el-date-picker v-model="form.billTime" type="daterange" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="getList"> 搜索 </el-button>
            <el-button icon="el-icon-refrnesh" @click="reset"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="form.billStatus" @tab-click="getList">
        <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.lable" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-table border :data="tableData" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" style="width: 100%">
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="userMobile" label="手机号"></el-table-column>
        <el-table-column prop="billNo" label="账单号"></el-table-column>
        <el-table-column prop="billDateStr" label="账单日"></el-table-column>
        <el-table-column prop="billType" label="账单类型">
          <template slot-scope="scope">{{ scope.row.billType == 'WEEK' ? '周结' : '月结' }}</template>
        </el-table-column>
        <el-table-column prop="billAmount" label="账单金额">
          <template slot-scope="scope">￥{{ scope.row.billAmount || '0' }}</template>
        </el-table-column>
        <el-table-column prop="settledAmount" label="已结算金额">
          <template slot-scope="scope">￥{{ scope.row.settledAmount || '0' }}</template>
        </el-table-column>
        <el-table-column prop="billStatus" label="状态">
          <template slot-scope="scope">
            {{ getbillStatus(scope.row.billStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" label="结算时间">
          <template slot-scope="scope">
            {{ scope.row.settleTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="name7" label="操作">
          <template slot-scope="{ row }">
            <router-link :to="{ path: '/billManage/detail', query: { id: row.channelBillId } }" v-show="hasAuthority('C1_10')">
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-link type="primary" :underline="false" class="icon icon-see"></el-link>
              </el-tooltip>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import cacheQuery from '@/mixins/cacheQuery';
import { getChannelBillLists } from '@/api/newApi/customer/billManage.js';
import { billStatus as billStatusFun } from './util/billUtils';
const tabList = [
  { lable: '全部', name: '0' },
  { lable: '待结算/部分结算', name: '1' },
  { lable: '已结算', name: '2' },
];
export default {
  mixins: [cacheQuery],
  data() {
    return {
      total: 0,
      tableData: [],
      form: {
        page: 1,
        limit: 10,
        billStatus: '0',
      },
      tabList,
      copyListQuery: {},
      tableLoading: false,
    };
  },
  computed: {
    getbillStatus() {
      return (param) => billStatusFun(param);
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getList();
  },
  methods: {
    async getList() {
      this.tableLoading = true;
      let { billTime, settleTime, billNo, billStatus, channelName, userMobile, page, limit } = this.form;
      let params = { billNo, channelName, userMobile, billStatus, limit, page };
      billTime && (params = { billEndDate: billTime[1] + ' 23:59:59', billStartDate: billTime[0] + ' 00:00:00', ...params });
      if (settleTime) {
        params = { settleStartTime: settleTime[0], settleEndTime: settleTime[1], ...params };
      }
      let { code, data } = await getChannelBillLists(params);
      if (code == 0) {
        this.tableLoading = false;
        this.tableData = data.records;
        this.total = Number(data.total);
        this.$message({
          message: `搜索完成，为您搜索${this.total}条结果`,
          type: 'success',
          duration: 2000,
        });
      }
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
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped></style>
