<template>
  <div class="app-container" v-loading="loading">
    <div class="header-container" v-if="detailInfo">
      <!-- 基础信息 -->
      <baseinfo :detailInfo="detailInfo" :id="id" :statusList="statusList" :orderPayments="orderPayments" :paymentChannelList="paymentChannelList" :contractStatusList="contractStatusList" :isRenewal="isRenewal" />
      <!-- 退货商品 -->
      <ExchangeInfo :orderProductRefundDetailList="orderProductRefundDetailList" v-if="detailInfo.orderTypeEn === 'EXCHANGE'" />
      <!-- 商品信息 -->
      <orderinfo :paymentChannelList="paymentChannelList" :detailInfo="detailInfo" :orderProducts="orderProducts" :orderPayments="orderPayments" :id="id" />

      <!-- 开票信息 -->

      <!-- 付款信息 -->

      <el-tabs v-model="activeName" type="card" class="mb-20">
        <el-tab-pane label="付款信息" name="first">
          <payinfo :paymentChannelList="paymentChannelList" :orderPayments="orderPayments" :detailInfo="detailInfo" :id="id" />
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="second">
          <ContractInfo :detailInfo="detailInfo" />
        </el-tab-pane>
        <el-tab-pane label="开票信息" name="third">
          <InvoiceInfo :invoiceInfoList="invoiceInfoList" />
        </el-tab-pane>
        <el-tab-pane label="退款信息" name="fourth">
          <RefundInfo :detailInfo="detailInfo" />
        </el-tab-pane>
        <el-tab-pane label="退换货信息" name="fifth">
          <ExchangeProdInfo :detailInfo="detailInfo" :statusList="statusList" />
        </el-tab-pane>
      </el-tabs>

      <otherinfo :activities="activities" :orderNo="orderNo" />
    </div>
  </div>
</template>

<script>
import baseinfo from './components/BaseInfo';
import payinfo from './components/PayInfo';
import ExchangeInfo from './components/ExchangeInfo';
import InvoiceInfo from './components/InvoiceInfo';
import orderinfo from './components/OrderInfo';
import otherinfo from './components/OtherInfo';
import RefundInfo from './components/refundInfo';
import ExchangeProdInfo from './components/exchangeProdInfo';
import ContractInfo from './components/contract/contraInfo';
import { getBaseDataByDataType } from '@/api/newApi/common';
import { getDeatils, contractList } from '@/api/newApi/orderManage/salesorder.js';
import operateLog from '@/view/module/workOrder/mixin/operationLog';

export default {
  components: {
    baseinfo,
    payinfo,
    orderinfo,
    otherinfo,
    ContractInfo,
    ExchangeInfo,
    RefundInfo,
    ExchangeProdInfo,
    InvoiceInfo,
  },
  mixins: [operateLog],
  provide() {
    return {
      parentFn: this,
      activities: [],
    };
  },
  data() {
    return {
      loading: false, //加载提示
      detailInfo: null,
      orderPayments: [], //订单付款信息
      orderProducts: [], //订单服务信息
      orderProductRefundDetail: {}, // 退货信息
      invoiceInfoList: [],
      paymentChannelList: [],
      activeName: 'first',
      id: '',
      orderNo: '',
      contracts: [],

      statusList: [],
      orderList: [],

      contractStatusList: [],
      orderProductRefundDetailList: [],
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDeatilData();
    this.getOptionList();
  },
  watch: {
    '$route.query.id': {
      handler(val) {
        this.id = this.$route.query.id;
        this.getDeatilData();
        this.getOptionList();
      },
    },
  },
  computed: {
    isRenewal() {
      return this.$route.query.isRenewal === true || this.$route.query.isRenewal === 'true';
    },
  },
  methods: {
    goBack() {
      this.$router.push(path);
    },
    getOptionList() {
      const optMap = {
        statusList: 'ORDER_STATUS_TYPE',
        contractStatusList: 'ORDER_CONTRACT_STATUS_TYPE',
        paymentChannelList: 'PAYMENT_CHANNEL_TYPE',
      };
      Object.keys(optMap).map((item) => {
        getBaseDataByDataType({
          dataType: optMap[item],
        }).then((res) => {
          if (res.code == 0) {
            this[item] = res.data;
          }
        });
      });
    },
    getDeatilData() {
      this.detailInfo = null;
      this.loading = true;
      getDeatils(this.id)
        .then((res) => {
          this.loading = false;
          if (res.code == 0) {
            this.detailInfo = res.data;
            res.data.orderPaymentDetails.forEach((item) => {
              item.paymentFileList = item.paymentFile.split(',').filter((item) => item);
            });
            this.orderPayments = res.data.orderPaymentDetails;
            this.orderProducts = res.data.orderProductSpecsList;
            this.orderProductRefundDetail = res.data.orderProductRefundDetail;
            this.orderProductRefundDetailList = res.data.orderProductRefundDetailList;
            this.orderNo = res.data.orderNo;
            this.invoiceInfoList = res.data.invoiceInfoList;
            this.getOperationLog(this.orderNo, 1);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 500px;
}
.header-container {
  padding-left: 24px;
}
::v-deep .el-divider--vertical {
  height: 16px;
  margin-top: -6px;
}
.tittle {
  font-size: 16px;
  font-weight: bold;
}
.table {
  margin: 15px 20px;
  width: auto;
}
/deep/ .el-tabs__header {
  padding: 0 20px;
  border-bottom: none;
}

/deep/ .el-tabs__item {
  border-bottom: 1px solid #e4e7ed;
}
/deep/ .el-tabs__header {
  margin: 0 !important;
}
</style>
