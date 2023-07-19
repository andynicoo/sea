<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline>
          <el-form-item label="" prop="orderNo">
            <el-select style="width: 168px" v-model="form.noType" size="small" filterable placeholder="请选择">
              <el-option value="orderNo" label="订单号">订单号</el-option>
              <el-option value="serviceNo" label="服务号">服务号</el-option>
              <el-option value="userMobile" label="客户手机号">客户手机号</el-option>
            </el-select>

            <el-input v-model="form.no" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <!-- <el-form-item label="服务号" prop="serviceNo">
            <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item> -->
          <el-form-item label="服务创建时间" prop="createTime">
            <el-date-picker v-model="createTime" type="daterange" align="right" size="small" clearable unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" range-separator="到" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 240px"></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" :loading="tableLoading" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh" @click="reset" size="small"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button size="small" type="primary" :loading="exportLoading" @click="exportForm" class="yellow-btn" v-show="hasAuthority('SQ_1')">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="商品名称" prop="serviceName">
              <el-input v-model="form.serviceName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select style="width: 168px" v-model="form.status" size="small" clearable filterable placeholder="请选择">
                <template v-for="item in statusList">
                  <el-option :value="item.code" :label="item.value" :key="item.code"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyNameZh">
              <el-input v-model="form.companyNameZh" placeholder="中文/英文名称" clearable style="width: 168px" size="small" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <!-- <h2 class="table-container-title">查询表格</h2> -->
      <el-table border :data="formatList" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="50" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" label="订单号" show-overflow-tooltip prop="orderNo" fixed="left"></el-table-column>
        <el-table-column align="center" width="150" label="商品名称" show-overflow-tooltip prop="productName" fixed="left"> </el-table-column>
        <el-table-column align="center" width="110" label="所属主体" show-overflow-tooltip prop="enterpriseName">
          <!-- <template slot-scope="scope">{{ scope.row.enterpriseId | getEnterpriseName(firmList) }}</template> -->
        </el-table-column>
        <el-table-column align="center" width="150" label="销售跟进人" show-overflow-tooltip prop="attributionName"></el-table-column>
        <el-table-column align="center" width="150" label="订单类型" show-overflow-tooltip prop="productOldMoney">
          <template slot-scope="scope">{{ scope.row.orderType | orderTypeFilter(orderTypeList) }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="客户手机号" show-overflow-tooltip prop="userMobile">
          <template slot-scope="scope">
            <span v-hidden>{{scope.row.userMobile}}</span>
          </template>
           </el-table-column>
        <el-table-column align="center" width="150" label="订单创建时间" show-overflow-tooltip prop="orderCreateTime"> </el-table-column>
        <el-table-column align="center" width="150" label="实付金额(元)" sortable show-overflow-tooltip prop="amountMoney">
          <template slot-scope="scope">{{ scope.row.amountMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="190" label="付款状态" show-overflow-tooltip prop="paymentStatus">
          <template slot-scope="scope">{{ scope.row.paymentStatus | filterOrderStatusType }}</template>
        </el-table-column>
        <el-table-column align="center" width="160" label="服务项目" show-overflow-tooltip prop="spcesName"></el-table-column>
        <el-table-column align="center" width="116" label="公司名称" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
        <el-table-column align="center" width="90" label="公司英文名称" show-overflow-tooltip prop="companyNameEn"></el-table-column>
        <el-table-column align="center" width="130" label="供应商" show-overflow-tooltip prop="supplierName"></el-table-column>

        <el-table-column align="center" width="110" label="服务状态" show-overflow-tooltip prop="serviceStatus">
          <template slot-scope="scope">{{ scope.row.serviceStatus | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="税号/受理号" show-overflow-tooltip prop="vatTaxNumber" sortable>
          <template slot-scope="scope">{{ scope.row.vatTaxNumber }}{{ scope.row.acceptNum }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="商标名称" show-overflow-tooltip prop="trademarkNameEn">
          <template slot-scope="scope">{{ scope.row.trademarkNameEn || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" label="处理人" prop="refundMoney" width="200">
          <template slot-scope="{ row }">
            <div v-if="row.handlerList.length > 0">
              <p style="margin-bottom: 4px" v-for="(item, index) in row.handlerList" :key="index">
                {{ item.handleTypeName }}：
                <span>{{ item.handlerUserName }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务创建时间" show-overflow-tooltip prop="createTime" sortable></el-table-column>
        <el-table-column align="center" width="150" label="服务号" show-overflow-tooltip prop="serviceNo" fixed="right"> </el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="serviceProgressName" fixed="right"> </el-table-column>
        <el-table-column align="center" width="150" label="操作" show-overflow-tooltip prop="acceptNum" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('SQ_2') && [1, 5, 2, 23, 31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 16, 61, 100].includes(scope.row.functionCode)">
              <el-link type="primary" :underline="false" class="icon-see icon" @click="showDetailModal(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <DetailDrawer :showDetailDrawer.sync="showDetailDrawer" :serviceId="serviceId" :functionCode="functionCode" :serviceProgressName="serviceProgressName" :detailData="detailData" />
  </div>
</template>

<script>
import { getServiceQueryList, exportExcel, getServiceQueryDetail } from '@/api/newApi/workOrder/serviceQuery';
import { serviceStatus } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
import { getBaseDataByDataType, getFirm } from '@/api/newApi/common';
import DetailDrawer from './components/detailDrawer';

import moment from 'moment';
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      list: [],
      statusList: [],
      formatList: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        orderNo: '',
        userMobile: '',
        companyNameZh: '',
        serviceNo: '',
        serviceName: '',
        status: '',
        noType: 'orderNo',
      },
      functionCode: '',
      detailData: {
        attachment: {},
      },
      cacheKey: 'form',
      copyListQuery: {},
      createTime: [],
      firmList: [],
      serviceId: '',
      showDetailDrawer: false,
      serviceProgressName: '',
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      exportLoading: false,
      orderTypeList: [],
    };
  },
  mixins: [cacheQuery],
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.code === status);
      return result ? result.value : '';
    },
    filterOrderStatus(orderStatus) {
      switch (orderStatus) {
        case 'CANCEL':
          return '已取消';
        case 'WAIT_AUDIT':
          return '待审核';
        case 'WAIT_PAY':
          return '待付款';
        case 'PAID':
          return '已付款';
        case 'PART_PAID':
          return '部分付款';
        case 'AUDIT_FAIL':
          return '审核不通过';
        case 'APPLY_REFUND':
          return '申请退款';
      }
    },
    filterOrderSource(orderSource) {
      switch (orderSource) {
        case 'PC':
          return 'PC网页端';
        case 'H5':
          return 'H5';
        case 'IN':
          return '手工录入';
        case 'MP':
          return '微信小程序';
        case 'CS':
          return '渠道系统';
        case 'GZH':
          return '公众号';
      }
    },
    filterOrderType(orderType) {
      switch (orderType) {
        case 'NORMAL':
          return '普通订单';
        case 'PROJECT':
          return '项目制订单';
        case 'PREMIUM':
          return '溢价订单';
        case 'EXCHANGE':
          return '退换货订单';
        case 'ACTIVITY':
          return '活动订单';
        default:
          return '';
      }
    },
    // 付款状态(WAIT_PAY:待付款 PAID:已付款 PART_PAID:部分付款 APPLY_REFUND:申请退款)
    filterOrderStatusType(orderStatus) {
      switch (orderStatus) {
        case 'WAIT_PAY':
          return '待付款';
        case 'PAID':
          return '已付款';
        case 'PART_PAID':
          return '部分付款';
        case 'APPLY_REFUND':
          return '申请退款';
        default:
          return '';
      }
    },
    getEnterpriseName(val, firmList) {
      let firm = firmList.find((item) => item.id == val);
      return firm ? firm.name : val;
    },
    orderTypeFilter(val, list) {
      let obj = list.find((item) => item.dataCode == val);
      return obj ? obj.dataValue : val;
    },
  },
  components: {
    DetailDrawer,
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getOptionList();
    // this.getFirmList();
    this.getPageCache();
    this.initCreateTime();
    this.getList();
    this.getStatus();
  },
  methods: {
    // 默认显示本周时间
    initCreateTime() {
      let date = new Date();
      let weekDay = date.getDay() - 1;
      let startDay = new Date(new Date().setDate(date.getDate() - weekDay));
      this.createTime = this.$util.getEndTime([this.$util.formatDate(startDay), this.$util.formatDate(date)]);
    },
    getOptionList() {
      getBaseDataByDataType({
        dataType: 'ORDER_TYPE',
      }).then((res) => {
        if (res.code == 0) {
          this.orderTypeList = res.data;
        }
      });
    },
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    getStatus() {
      serviceStatus().then((res) => {
        this.statusList = res.data;
      });
    },
    // 导出
    exportForm() {
      this.exportLoading = true;
      exportExcel(this.form).then((res) => {
        this.exportLoading = false;
        const fileName = '服务查询数据_' + moment().format('YYYYMMDD');
        this.$util.exportExcel(res, fileName);
      });
    },
    formatListData() {
      let list = [];
      this.list.forEach((item) => {
        item.orderServicesInfoVOList.forEach((infoList, i) => {
          list.push({
            ...item,
            rowspan: item.orderServicesInfoVOList.length,
            index: i,
            ...infoList,
          });
        });
      });
      console.log(111, list);
      this.formatList = list;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let combineList = ['orderNo', 'orderStatus', 'orderType', 'userMobile', 'productOldMoney', 'discAmount', 'amountMoney', 'orderCreateTime', 'orderSource', 'attributionName'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    setFormNo() {
      this.form.orderNo = '';
      this.form.serviceNo = '';
      this.form.userMobile = '';
      if (this.form.no) {
        this.form[this.form.noType] = this.form.no;
      }
    },
    showDetailModal({ serviceId, functionCode, serviceProgressName }) {
      getServiceQueryDetail({
        serviceId,
        functionCode,
      }).then((res) => {
        if (res.code === 0) {
          console.log(res);
          this.showDetailDrawer = true;
          this.detailData = res.data;
          this.functionCode = functionCode;
          this.serviceProgressName = serviceProgressName;
          this.serviceId = serviceId;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    getList() {
      this.tableLoading = true;
      [this.form.createStartTime, this.form.createEndTime] = this.createTime && this.createTime.length ? this.createTime : ['', ''];
      this.setFormNo();

      this.setPageCache();
      getServiceQueryList(this.form)
        .then((res) => {
          // this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          // this.formatListData();
          this.formatList = res.data.records;
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
      this.getList();
    },
    reset() {
      this.initCreateTime();
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
