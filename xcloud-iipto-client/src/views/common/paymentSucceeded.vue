<template>
  <div class="mainContent">
    <PaymentSucceeded />
  </div>
</template>
<script>
import PaymentSucceeded from './../../../xcloud-client-components-web/module/components/paymentSucceeded.vue';
export default {
  components: {
    PaymentSucceeded,
  },
};
</script>
<style lang="less" scoped>
.mainContent .payment-succeeded {
  min-height: calc(100vh - 227px);
}
</style>
