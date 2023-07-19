<template>
  <div class="container etax-sureOrder">
    <div class="headContent">
      <div class="bottom">确认{{isRenewal?'续费':''}}订单</div>
    </div>
    <SureOrder />
  </div>
</template>

<script>
import SureOrder from '@comp/sureOrder';

export default {
  data() {
    return {};
  },
  computed:{
    isRenewal() {
      return this.$route.query.from === 'renewal';
    },
  },
  components: {
    SureOrder,
  },

  mounted() {},
  methods: {},
  // 离开页面清除定时
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.container {
  margin-left: 24px;
  min-height: calc(100vh - 50px);
  .headContent {
    margin-left: -30px;
    background: #ffffff;
    // box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    margin-bottom: 24px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
}
</style>
