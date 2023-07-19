<template>
  <div class="couponContent">
    <div class="goback-box">
      <span class="goback hand" @click="$router.push('/coupon')">
        <img src="@/assets/images/common/toleft.svg" alt="意见反馈" />
        返回上一级
      </span>
    </div>
    <div class=" my-card iipto-coupon">
      <!-- <div class="title"><img src="@/assets/images/setting/settingIcon.svg" alt="" />领券中心</div> -->
      <ReceiveCoupon />
    </div>
  </div>
</template>
<script>
import ReceiveCoupon from './../../../../xcloud-client-components-web/coupon/receiveCoupon.vue';
export default {
  components: {
    ReceiveCoupon,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>
<style lang="less" scoped>
.couponContent {
  width: 964px;
  display: inline-block;
  vertical-align: top;
}
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
  padding: 0;
  /deep/.content {
    min-width: auto;

    .my-card {
      padding: 0;
      margin: 0;
      .myVATFilter {
        padding: 0;
      }
    }
  }
}
.goback {
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  margin-bottom: 16px;
}
.goback-box {
  margin-bottom: 16px;
}
</style>
