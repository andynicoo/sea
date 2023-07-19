<!--  -->
<template>
  <div class="main">
    <!-- total bill -->
    <div class="head white-bg pd-auto">
      <el-row class="title">账单汇总</el-row>
      <el-table border :data="totalTableData" style="width: 100%">
        <el-table-column v-for="(item, index) in BILLSUMMARY" :prop="item.prop" :label="item.label" :key="index">
          <template v-slot="scope">
            <span v-if="item.prop == 'billType'">{{ scope.row[`${item.prop}`] == 'WEEK' ? '周结' : '月结' }}</span>
            <span v-else-if="item.prop == 'billStatus'">{{ billStatus(scope.row[`${item.prop}`]) }}</span>
            <span v-else> {{ ['billAmount', 'settledAmount', 'surplusAmount'].includes(item.prop) ? '¥' : '' }}{{ scope.row[`${item.prop}`] }} </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Bill Details -->
    <div class="content white-bg pd-auto">
      <el-row class="title">账单明细</el-row>
      <el-table border height="calc(100vh - 370px)" :data="detailstTableData" style="width: 100%">
        <el-table-column prop="productNames" label="服务名称" min-width="150px">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.productNames" placement="top">
              <p class="descStyle">{{ scope.row.productNames }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="auditTime" label="订单时间"></el-table-column>
        <el-table-column prop="customerInfo" label="客户信息" min-width="120px">
          <template slot-scope="{ row }">
            <el-tooltip :content="userInfo(row.customerInfo).name" placement="top">
              <div class="descStyle">{{ userInfo(row.customerInfo).name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="orderPaymentMoney" label="商品售价">
          <template slot-scope="{ row }">¥{{ row.orderPaymentMoney }}</template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="{ row }">{{ row.omsOrderProducts.length }}</template>
        </el-table-column>
        <el-table-column prop="discountMoney" label="优惠金额">
          <template slot-scope="{ row }">¥{{ row.discountMoney }}</template>
        </el-table-column>
        <el-table-column prop="invoiceMoney" label="税费">
          <template slot-scope="{ row }">¥{{ row.invoiceMoney }}</template>
        </el-table-column>
        <el-table-column prop="omsOrderInvoice" label="发票类型">
          <!-- 开票类型(GENERAL_PERSON:增值税普通发票(个人) GENERAL_ENTERPRISE:增值税普通发票(公司) SPECIAL:增值税专用发票 NONE：不开票) -->
          <template slot-scope="{ row }">
            {{ userInvocie(row.omsOrderInvoice) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderMoney" label="合计">
          <template slot-scope="{ row }">¥{{ totalPrice(row.orderPaymentMoney, row.invoiceMoney) }}</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="状态">
          <template slot-scope="{ row }">
            <!-- CANCEL:已取消 WAIT_AUDIT:待审核 WAIT_PAY:待付款 PAID:已付款 PART_PAID:部分付款 AUDIT_FAIL:审核不通过 APPLY_REFUND:申请退款) -->
            <span>
              {{ row.orderStatus == 'CANCEL' ? '已取消' : row.orderStatus == 'WAIT_AUDIT' ? '待审核' : row.orderStatus == 'WAIT_PAY' ? '待付款' : row.orderStatus == 'PAID' ? '已付款' : row.orderStatus == 'PART_PAID' ? '部分付款' : row.orderStatus == 'AUDIT_FAIL' ? '审核不通过' : '申请退款' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTime" label="支付时间"></el-table-column>
        <el-table-column prop="paymentChannel" label="支付方式">
          <!-- {{ row.paymentChannel.includes('WEIXIN') ? '微信' : row.paymentChannel.includes('ALIPAY') ? '支付宝' : row.paymentChannel.includes('ALIPAY') ? '银联' : '' }} -->
          <template slot-scope="{ row }">
            {{ setPaymentChannel(row.paymentChannel) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getBillDetailById } from '@/api/newApi/customer/billManage.js';
import { BILLSUMMARY, setInvocieType, billStatus as billStatusFun, setUserinfo, PAYMODE } from './util/billUtils';
export default {
  data() {
    return {
      detailstTableData: [],
      totalTableData: [],
      BILLSUMMARY: BILLSUMMARY,
    };
  },

  created() {
    this.init();
  },
  computed: {
    billStatus() {
      return (param) => billStatusFun(param);
    },

    userInvocie() {
      return (val) => setInvocieType(val);
    },

    userInfo() {
      return (val) => setUserinfo(val);
    },
    totalPrice() {
      return (orderPaymentMoney, invoiceMoney) => this.$util.parseAdd(orderPaymentMoney, invoiceMoney);
    },

    setPaymentChannel() {
      return (params) => {
        let payModeObj = PAYMODE.find((item) => item.key == params);
        return payModeObj ? payModeObj.label : '';
      };
    },
  },
  methods: {
    async init() {
      let id = this.$route.query.id || '';
      console.log(2222, id);
      if (id) {
        let { code, data } = await getBillDetailById({ id });
        if (code == 0) {
          let { omsChannelBillDetailVos, billAmount, settledAmount } = data;
          this.totalTableData = [{ ...data, surplusAmount: this.$util.parseAdd(billAmount, -settledAmount) }];
          let detailsList = omsChannelBillDetailVos.map((item) => {
            let orderPayments = item.omsOrderVO.orderPayments;
            if (orderPayments.length > 0) {
              let payItem = orderPayments.at(-1);
              let { paymentChannel, paymentTime } = payItem;
              return { ...item.omsOrderVO, paymentChannel, paymentTime };
            } else {
              return { ...item.omsOrderVO, paymentChannel: '', paymentTime: '' };
            }
          });
          this.detailstTableData = detailsList;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.descStyle {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1; //行数
  -webkit-box-orient: vertical;
}
.main {
  font-size: 15px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #666666;
}
.head {
}
.content {
  margin-top: 10px;
}
.white-bg {
  background-color: white;
}
.pd-auto {
  padding: 20px;
}

.title {
  padding: 10px 0px 20px 0px;
}
</style>
