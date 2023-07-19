<template>
  <div class="container">
    <div class="order-info">
      <img src="../images/common/pay-success.png" alt />

      <p>支付成功</p>
      <!-- <span class="pay-process-info">
        可进入官网查看订单服务或下载发票，客户端地址：
        <a v-if="linkedUrl" class="link" :href="linkedUrl" target="_blank">
         {{ linkedUrl }} 
        </a>
      </span> -->
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
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.order-info {
  text-align: center;
  p {
    color: #333;
    font-size: 18px;
    margin: 10px 0 20px;
  }
  .pay-process-info {
    font-size: 15px;
  }
  .link {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
