<template>
  <a-modal
    :visible="visible"
    :maskClosable="false"
    title="国际支付"
    @cancel="$emit('cancel')"
    @ok="$emit('ok')"
    width="1000px"
    :zIndex="2000"
  >
    <iframe ref="paymentIframe" class="payment-iframe" :src="`${httpsPay}/client/cashieret?${payParams}`"></iframe>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
    },
    payParams: {
      type: String,
    },
  },
  data() {
    return {
      spinning: true,
      httpsPay: 'https://www.chenhaicloud.hk',
    };
  },
  created() {
    if (['production'].includes(process.env.NODE_ENV) || ['prod'].includes(process.env.CH_ENV)) {
      this.httpsPay = 'https://www.chenhaicloud.hk';
    } else if (['staging', 'uatenvironment2'].includes(process.env.NODE_ENV) || ['uat2'].includes(process.env.CH_ENV)) {
      this.httpsPay = 'https://uathk.chenhaicloud.com';
    } else {
      this.httpsPay = 'https://sithk.chenhaicloud.com';
    }
    this.spinning = true;
    let _this = this;
    setTimeout(() => {
      _this.$refs.paymentIframe.onload = function() {
        _this.spinning = false;
      };
    }, 0);
  },
};
</script>
<style lang="less" scoped>
.payment-iframe {
  border: none;
  width: 100%;
  height: 480px;
}
</style>
