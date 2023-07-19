<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="listQuery" inline label-width="90px">
          <el-form-item label="销售订单号">
            <el-input v-model="listQuery.orderNo" placeholder="请输入销售订单号" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="客户手机号">
            <el-input v-model="listQuery.userMobile" placeholder="请输入客户手机号" clearable style="width: 168px" size="small" />
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
            <el-button size="small" type="warning" :loading="btnLoading" @click="exportBtn" class="yellow-btn" v-if="hasAuthority('B2_1')">
              <i class="icon icon-export"></i>
              导出Excel
            </el-button>
          </div>
          <!-- 折叠部分 -->
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="支付单号">
              <el-input v-model="listQuery.payNo" placeholder="请输入支付单号" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="收款方式">
              <el-select v-model="listQuery.paymentChannel" placeholder="请选择" size="small" style="width: 168px" clearable>
                <el-option :label="item.dataValue" :value="item.dataCode" v-for="item in payChannelList" :key="item.baseDataId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款账户">
              <el-select v-model="listQuery.acceptAccountNo" placeholder="请选择" size="small" style="width: 168px" clearable filterable>
                <el-option-group style="width: 450px">
                  <div class="option_title" style="background: #f6f8fa">
                    <span>银行账号</span>
                    <span>账户名称</span>
                    <span>开户银行</span>
                  </div>

                  <el-option v-for="(item, index) in collectionList" :key="index" :label="item.accountName" :value="item.bankAccount" class="option_title">
                    <span>{{ item.bankAccount }}</span>
                    &nbsp;
                    <span>{{ item.accountName }}</span>
                    &nbsp;
                    <span>{{ item.bankName }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="支付时间">
              <el-date-picker
                v-model="listQuery.orderPayTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select v-model="listQuery.orderType" placeholder="请选择" size="small" style="width: 168px" clearable>
                <el-option :label="item.dataValue" :value="item.dataCode" v-for="item in orderTypeList" :key="item.baseDataId"></el-option>
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
        <el-table-column align="center" label="支付单号" width="200" prop="platformTradeNo"></el-table-column>
        <el-table-column align="center" label="销售订单号" width="200" prop="orderNo"></el-table-column>
        <el-table-column align="center" label="应付金额(元)" width="130" prop="orderPaymentMoney" sortable>
          <template slot-scope="scope">￥{{ scope.row.orderPaymentMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="支付金额(元)" width="130" prop="paymentAmount" sortable>
          <template slot-scope="scope">￥{{ scope.row.paymentAmount | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="支付时间" width="200" prop="paymentTime" sortable></el-table-column>
        <el-table-column align="center" label="收款方式" width="120" prop="paymentChannel">
          <!-- <template slot-scope="scope">
            {{ scope.row.paymentChannel | filterPayment(payChannelList) }}
          </template> -->
        </el-table-column>
        <!-- <el-table-column align="center" label="收款账号" width="150" prop="acceptAccountName"></el-table-column> -->
        <el-table-column align="center" label="订单状态" width="150" prop="orderStatus">
          <!-- <template slot-scope="scope">
            {{ scope.row.orderStatus | filterOrderStatus(orderStatusList) }}
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="订单类型" width="120" prop="orderType"></el-table-column>
        <el-table-column align="center" label="客户手机号" width="120" prop="userMobile">
          <template slot-scope="{ row }">{{ row.userMobile | filterMobile(hasAuthority('B2_14')) }}</template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" width="200" prop="products"></el-table-column>
        <el-table-column align="center" label="销售人员" width="120" prop="attributionName"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getList, exportExcel, paymentList } from '@/api/newApi/finance/collection.js';
import { getBankAccountList, getBaseDataByDataType } from '@/api/newApi/common.js';
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
      collectionList: [], //收款账户列表
      payChannelList: [], // 支付方式列表
      orderStatusList: [], // 订单状态列表
      orderTypeList: [], // 订单类型列表
      listTotal: 0, // 分页
      btnLoading: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        payNo: '',
        orderNo: '',
        userMobile: '',
        paymentChannel: '',
        acceptAccountNo: '',
        orderType: '',
        orderPayTime: [],
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      totalPrice: {}, //合计金额列表
      searchFlag: false,
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
    filterOrderStatus(orderStatus, orderStatusList) {
      let temp = orderStatusList.find((item) => item.dataCode === orderStatus);
      return temp ? temp.dataValue : orderStatus;
    },
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryData();
    this.getOptionList();
    this.getBank(); //收款账户列表
  },
  methods: {
    formatTime() {
      [this.listQuery.paymentTimeStart, this.listQuery.paymentTimeEnd] = this.listQuery.orderPayTime && this.listQuery.orderPayTime.length ? this.listQuery.orderPayTime : ['', ''];
    },
    formatFormData() {
      let { orderPayTime, ...formData } = this.listQuery;
      return formData;
    },
    /**
     *
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
        orderStatusList: 'ORDER_STATUS_TYPE',
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
    /**
     * 获取收款账户
     */
    getBank() {
      getBankAccountList({
        enterpriseId: localStorage.getItem('enterpriseId'),
      }).then((res) => {
        if (res.code == 0) {
          this.collectionList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /** 底部合计 */
    getTotalList() {
      paymentList(this.formatFormData()).then((res) => {
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
    //金额合计显示
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          // 应付金额
          case 'orderPaymentMoney': //这是是根据prop来判断是那一列的数据
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice.orderPaymentAmountTotal); //sums[index]是固定写法  表示的是每一空格是要写什么内容,this.totalPrice就是后台的数据
            break;
          // 支付金额
          case 'paymentAmount':
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice.payMoneyTotal);
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
          this.$util.exportExcel(res, '收款明细');
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
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 1;
  }
}
</style>
