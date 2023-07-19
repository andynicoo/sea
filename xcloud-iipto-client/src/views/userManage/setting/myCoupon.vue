<template>
  <div class="mainContent my-card iipto-coupon">
    <div class="title">
      <img src="@/assets/images/setting/settingIcon.svg" alt="" />优惠券 <span class="line"></span>
    </div>
    <MyCoupon />
  </div>
</template>
<script>
import MyCoupon from './../../../../xcloud-client-components-web/coupon/myCoupon.vue';
export default {
  components: {
    MyCoupon,
  },
  data() {
    return {};
  },

  methods: {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 964px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .title {
    padding-bottom: 22px;
    border-bottom: 1px solid #ebebeb;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 20px;
    font-weight: 500;
    img {
      vertical-align: middle;
    }
    span.title {
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 20px;
      font-weight: 500;
      border: none;
    }
    span.line {
      width: 2px;
      height: 30px;
      background: #333333;
      opacity: 0.1;
      display: inline-block;
      margin: 0 16px;
      vertical-align: top;
    }
    span.status {
      display: inline-block;
      padding: 0 30px;
      font-size: 14px;
      text-align: center;
      background: #f1f1f1;
      border-radius: 16px;
      margin-right: 10px;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      color: #666;
    }
    span.status.active {
      background-color: #00a3ff;
      color: #fff;
    }
  }
}
.iipto-coupon {
  position: relative;
}
</style>
