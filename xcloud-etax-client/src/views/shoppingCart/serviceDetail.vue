<template>
  <div class="container">
    <div class="headContent">
      <div class="top"></div>
      <div class="bottom">服务详情</div>
    </div>
    <ProductIntro />
  </div>
</template>

<script>
import ProductIntro from './../../../xcloud-client-components-web/productInfo/productIntro.vue';
export default {
  data() {
    return {};
  },
  components: {
    ProductIntro,
  },

  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  margin-left: 24px;
  margin-top: 10px;
  .headContent {
    margin-top: -10px;
    margin-left: -24px;
    margin-bottom: 24px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
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
  .subTitle {
    padding: 10px 40px;
    background: #ffffff;
    color: #333333;
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
  }
  .subContent {
    padding: 10px 40px;
    background: #ffffff;
    margin-top: 20px;
    img {
      width: 100%;
    }
  }
}
</style>
