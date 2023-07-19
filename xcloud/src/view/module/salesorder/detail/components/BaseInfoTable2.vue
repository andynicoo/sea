<template>
  <table class="el-table__header">
    <tr>
      <th class="el-table__cell"><div class="cell">销售订单号</div></th>
      <th class="el-table__cell"><div class="cell">客户手机号</div></th>
      <th class="el-table__cell"><div class="cell">销售人员</div></th>
      <th class="el-table__cell"><div class="cell">订单金额</div></th>
      <th class="el-table__cell"><div class="cell">优惠金额</div></th>
      <th class="el-table__cell" v-if="info.orderTypeEn === 'EXCHANGE'"><div class="cell">换货金额</div></th>
      <th class="el-table__cell"><div class="cell">应付金额</div></th>
      <th class="el-table__cell"><div class="cell">实付金额</div></th>
      <th class="el-table__cell"><div class="cell">剩余尾款</div></th>
    </tr>
    <tbody></tbody>
    <td class="el-table__cell">
      <div class="cell">{{ info.orderNo }} {{ info.paymentBatchNo ? '批' : '' }}</div>
    </td>
    <td class="el-table__cell">
      <div class="cell">{{ info.userMobile }}</div>
    </td>
    <td class="el-table__cell">
      <div class="cell">{{ info.attributionName }}</div>
    </td>
    <!-- 订单金额 -->
    <td class="el-table__cell">
      <div class="cell">￥{{ info.orderMoney | formatQianFenWei }}元</div>
    </td>
    <!-- 优惠金额 -->
    <td class="el-table__cell">
      <div class="cell">￥{{ (info.discountMoney > 0 ? info.discountMoney : 0) | formatQianFenWei }}元</div>
    </td>
    <!-- 换货金额 -->
    <td class="el-table__cell EXCHANGE" v-if="info.orderTypeEn === 'EXCHANGE'">
      <div class="cell">￥{{ info.exchangeMoney | formatQianFenWei }}元</div>
    </td>
    <!-- 应付金额 -->
    <!-- 应付金额=订单总应付金额+税额 -->
    <td class="el-table__cell">
      <div class="cell">￥{{ $util.accAdd(info.orderPaymentMoney, info.invoiceMoney) | formatQianFenWei }}元</div>
    </td>
    <!-- 实付金额 -->
    <td class="el-table__cell">
      <div class="cell">
        <!-- 订单已付款 orderStatus = "PAID"的时候，实付金额要把orderPaidMoney和invoiceMoney加起来,,,,,又去掉了 -->
        <!-- <template v-if="info.orderStatus === 'PAID'">
          {{ $util.accAdd(info.orderPaidMoney, info.invoiceMoney) | formatQianFenWei }}
        </template> -->
        <template>
          ￥{{ info.orderPaidMoney | formatQianFenWei }}
        </template>
        <!-- 国际支付并且已支付才显示 -->
        <p v-if="info.payMethod === 'INTL_PAY'">
          <span v-for="(item, index) in info.intlOrderPaidList" :key="index"> {{ currency[item.currency] }}{{ item.num | formatQianFenWei }} </span>
        </p>
      </div>
    </td>
    <!-- 剩余尾款 -->
    <td class="el-table__cell">
      <div class="cell">￥{{ info.unPaidMoney | formatQianFenWei }}元</div>
    </td>
  </table>
</template>

<script>
import currency from '@/utils/currency.js';
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currency: currency,
    };
  },
};
</script>
