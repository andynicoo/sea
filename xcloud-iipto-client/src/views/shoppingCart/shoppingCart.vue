<template>
  <div class="mainContent">
    <div class="my-card " :style="contentStyleObj">
      <div class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" />
        <span class="title">我的购物车</span>
      </div>
      <ShoppingCart />
    </div>
  </div>
</template>

<script>
import '@/assets/style/common.less';
import ShoppingCart from './../../../xcloud-client-components-web/shoppingCart/shoppingCart.vue';
export default {
  components: {
    ShoppingCart,
  },
  data() {
    return {};
  },
  computed: {
    contentStyleObj() {
      return { 'min-height': window.screen.height - 240 + 'px' };
    },
  },
  methods: {},
  async created() {},
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 1200px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      border-bottom: 1px solid #ebebeb;
      img {
        vertical-align: middle;
      }
      span.title {
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 20px;
        font-weight: 500;
        border: none;
      }
    }
    .no-data {
      margin: 56px auto;
      text-align: center;
      p {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-top: 10px;
      }
      button {
        width: 98px;
        height: 32px;
        background: #00a3ff;
        margin-top: 12px;
        border: none;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
