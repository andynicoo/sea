<template>
  <div class="paymentfooter">
    <div class="box">
      <div>
        <p>如果您遇到系统使用问题/有好的系统优化建议，欢迎您在此提出。我们将持续完善。</p>
        <p>购买咨询或服务问题反馈请联系专属客户经理。</p>
        <div class="button" @click="showFeedBack = true">投诉与建议</div>
      </div>
      <div class="qrcode" v-if="payQrcode">
        <img :src="payQrcode" />
        <p>扫码关注#{{ payName }}</p>
      </div>
    </div>

    <FeedBackCom
      :userId="userId"
      :enterpriseId="enterpriseId"
      :userMobile="userMobile"
      v-if="showFeedBack"
      @closeCom="showFeedBack = false"
    />
  </div>
</template>

<script>
import FeedBackCom from '../../module/components/feedBack';
import config from './../config';
export default {
  components: {
    FeedBackCom,
  },
  props: {
    enterpriseId: {
      type: Number | String,
      default: '',
    },
    userId: {
      type: Number | String,
      default: '',
    },
    userMobile: {
      type: Number | String,
      default: '',
    },
  },
  data() {
    return {
      util: this.$util,
      showFeedBack: false,
      config: config,
      payName: '',
      payQrcode: '',
    };
  },
  watch: {
    enterpriseId: {
      handler(v) {
        let enterpriseIdInfo = this.config[v];
        if (enterpriseIdInfo) {
          this.payName = enterpriseIdInfo.name ? enterpriseIdInfo.name : '';
          this.payQrcode = enterpriseIdInfo.qrcode ? enterpriseIdInfo.qrcode : '';
        } else {
          this.payName = '卖家成长';
          this.payQrcode = require(`../../images/payment/code28.png`);
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.paymentfooter {
  height: 160px;
  background: url('../../images/payment/payfooter.png') no-repeat;
  background-size: cover;
  margin-top: 60px;
  .box {
    width: 1000px;
    margin: 0 auto;
    padding-top: 36px;
    display: flex;
    p {
      font-size: 14px;
      font-weight: 400;
      color: #fafafa;
      line-height: 24px;
    }
    .button {
      width: 102px;
      height: 30px;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      border: 1px solid #fafafa;
      background: null;
      margin-top: 16px;
      font-size: 14px;
      text-align: center;
      color: #fff;
      line-height: 28px;
      cursor: pointer;
    }
    .qrcode {
      margin-left: auto;
      width: 125px;
      text-align: center;
      color: #fafafa;
      img {
        width: 80px;
      }
    }
  }
}
</style>
