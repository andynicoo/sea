<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" inline label-width="90px">
          <el-form-item label="退款订单号">
            <el-input v-model="listQuery.refundNo" placeholder="请输入退款订单号" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="销售订单号">
            <el-input v-model="listQuery.orderNo" placeholder="请输入销售订单号" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="resetBtn">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <div class="header-btn-group" style="float: right">
            <el-button size="small" type="warning" :loading="btnLoading" @click="exportBtn" class="yellow-btn" v-if="hasAuthority('B2_2')">
              <i class="icon icon-export"></i>
              导出Excel
            </el-button>
          </div>
          <!-- 折叠部分 -->
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="客户手机号">
              <el-input placeholder="请输入客户手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" />
            </el-form-item>
            <el-form-item label="退款单号">
              <el-input placeholder="请输入退款单号" clearable style="width: 168px" size="small" v-model="listQuery.refundTradeNo" />
            </el-form-item>
            <el-form-item label="退款时间">
              <el-date-picker
                v-model="listQuery.refundTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 340px"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单类型" prop="orderType">
              <el-select v-model="listQuery.orderType" placeholder="请选择" size="small" style="width: 168px" clearable>
                <el-option :label="item.dataValue" :value="item.dataCode" v-for="item in orderTypeList" :key="item.baseDataId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退款路径" prop="refundMethod">
              <el-select style="width: 168px" placeholder="请选择" v-model="listQuery.refundMethod" clearable filterable>
                <el-option v-for="item in refundMethodList" :value="item.value" :key="item.value" :label="item.label" filterable></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" style="width: 100%" border highlight-current-row show-summary :summary-method="getSummaries" max-height="700" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款订单号" prop="refundNo" min-width="200"> </el-table-column>
        <el-table-column align="center" label="销售订单号" prop="orderNo" min-width="200"> </el-table-column>
        <el-table-column align="center" label="订单类型" prop="orderType" min-width="200"> </el-table-column>
        <el-table-column align="center" label="退款单号" prop="refundTradeNo" min-width="200"> </el-table-column>
        <el-table-column align="center" label="客户手机号" prop="userMobile" min-width="120">
          <template slot-scope="{ row }">{{ row.userMobile | filterMobile(hasAuthority('B2_15')) }}</template>
        </el-table-column>
        <el-table-column align="center" label="支付渠道" prop="paymentChannel" min-width="200">
          <!-- <template slot-scope="scope">
            {{ scope.row.paymentChannel | filterPayment(payChannelList) }}
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="退款路径" prop="refundMethod" min-width="120"></el-table-column>
        <el-table-column align="center" label="退款金额(元)" min-width="135" prop="refundMoney" sortable>
          <template slot-scope="scope"> ￥{{ scope.row.refundMoney | formatQianFenWei }} </template>
        </el-table-column>
        <el-table-column align="center" label="退款时间" min-width="200" sortable>
          <template slot-scope="scope">{{ scope.row.refundTime }}</template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getList, orderRefundList, exportExcel } from '@/api/newApi/finance/refund.js';
import { getBaseDataByDataType } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      // 查询日期区间配置
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      moreSerch: false, //更多查询条件
      list: [],
      payChannelList: [], // 支付方式列表
      orderTypeList: [],
      listTotal: 0, // 分页
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        refundNo: '',
        orderNo: '',
        userMobile: '',
        refundTradeNo: '',
        orderType: '',
        refundMethod: '',
        refundTime: [],
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      totalPrice: {},
      btnLoading: false,
      searchFlag: false,
      refundMethodList: [
        { value: 'RETURN_TO_SOURCE', label: '原路返回' },
        { value: 'RETURN_TO_BANK', label: '退回到银行卡' },
        { value: 'COUPON', label: '发放优惠券' },
        { value: 'VIRTUAL', label: '虚拟退款' },
      ],
    };
  },
  filters: {
    filterMobile(mobile, isShowMobile) {
      if (isShowMobile || !mobile) {
        return mobile;
      } else {
        try {
          return mobile.substr(0, 3) + '****' + mobile.substr(7);
        } catch (error) {
          return mobile;
        }
      }
    },
    filterPayment(paymentChannel, payChannelList) {
      let temp = payChannelList.find((item) => item.dataCode === paymentChannel);
      return temp ? temp.dataValue : paymentChannel;
    },
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryData();
    this.getOptionList();
  },

  methods: {
    formatTime() {
      [this.listQuery.refundTimeStart, this.listQuery.refundTimeEnd] = this.listQuery.refundTime && this.listQuery.refundTime.length ? this.listQuery.refundTime : ['', ''];
    },
    formatFormData() {
      let { refundTime, ...formData } = this.listQuery;
      return formData;
    },
    /**
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.formatTime();
      this.setPageCache();
      getList(this.formatFormData())
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
            this.getTotalList();
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    /** 重置 */
    resetBtn() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
    },
    /**
     * 获取基础数据
     */
    getOptionList() {
      const optionMap = {
        payChannelList: 'PAYMENT_CHANNEL_TYPE',
        orderTypeList: 'ORDER_TYPE',
      };
      Object.keys(optionMap).forEach((key) => {
        getBaseDataByDataType({
          dataType: this.$constant.dataType[optionMap[key]],
        }).then((res) => {
          this[key] = res.data;
        });
      });
    },
    /** 底部合计 */
    getTotalList() {
      orderRefundList(this.formatFormData()).then((res) => {
        if (res.code == 0) {
          this.totalPrice = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    //合计展示
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'refundMoney': //这是是根据prop来判断是那一列的数据
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice); //sums[index]是固定写法 ,this.totalPrice就是后台的数据
            break;
        }
      });
      return sums;
    },
    /**
     * 导出报表
     */
    exportBtn() {
      this.btnLoading = true;
      exportExcel(this.formatFormData())
        .then((res) => {
          this.btnLoading = false;
          this.$util.exportExcel(res, '退款明细');
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/fixedSearch.scss';
</style>
