<template>
  <div class="container">
    <div class="order-info">
      <img src="../images/common/pay-reject.png" alt />

      <div class="title">很抱歉，该订单正在线下处理中或已失效， 请联系客户经理</div>
    </div>
  </div>
</template>

<script>
import '../styles/common.less';
export default {
  data() {
    return {};
  },
  watch: {},
  components: {},
  computed: {
    linkedUrl() {
      if (this.$route.query.enterpriseId === '29') {
        return 'https://pro.itaxs.com';
      } else if (this.$route.query.enterpriseId === '30') {
        return 'https://pro.iipto.com';
      } else if (this.$route.query.enterpriseId === '40') {
        return 'https://tax.sellergrowth.com';
      } else if (this.$route.query.enterpriseId === '28') {
        return 'https://tm.sellergrowth.com';
      }
      return '';
    },
  },
  mounted() {
    this.$Modal.remove();
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.order-info {
  text-align: center;
  .pay-process-info {
    font-size: 15px;
  }
  .link {
    color: #1890ff;
    cursor: pointer;
  }
  .title {
    margin-top: 15px;
    width: 260px;
    line-height: 30px;
    text-align: center;
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
    margin-left: 27px;
  }
}
</style>
