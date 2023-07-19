<template>
  <div class="container">
    <div class="order-info">
      <!-- <img src="@/assets/images/common/pay-success.png"
        alt /> -->

      <p>支付失败</p>
      <span class="pay-process-info">
        请登录客户端查看订单及对应的服务进度，客户端地址：
        <a class="link" href="https://pro.itaxs.com" target="_blank"> https://pro.itaxs.com </a>
      </span>
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
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  height: 150px;
  position: absolute;
  top: 50%;
  text-align: center;
  width: 100%;
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
