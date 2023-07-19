<template>
  <div class="payment-wrap">
    <!-- 发票付款不变 -->
    <InvoicePayment v-if="$route.query.paymentSource === 'INVOICE'" />
    <!-- 订单付款改为新版支持国际支付 -->
    <OrderPayment v-else />
  </div>
</template>
<script>
import InvoicePayment from './invoicePayment.vue';
import OrderPayment from './orderPayment.vue';

export default {
  components: {
    InvoicePayment,
    OrderPayment,
  },
};
</script>
<style>
.payment-wrap p {
  margin: 0px;
}
</style>
