<template>
  <div class="mainContent">
    <div class="my-card " :style="contentStyleObj">
      <div class="title">
        <img :src="settingIcon" alt="" />
        <span class="title">支付订单</span>
      </div>
      <div class="bottom">
        <img :src="paySuccess" alt="" />
        <p class="tip">支付成功</p>
        <div class="buttons">
          <Button class="home">返回首页</Button>
          <Button>查看订单</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingIcon: require('./../../images/sureOrder/settingIcon.png'),
      paySuccess: require('./../../images/sureOrder/paySuccess.png'),
      contentStyleObj: {
        'min-height': '',
      },
    };
  },
  methods: {
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 220 + 'px';
    },
  },
  created() {
    this.getHeight();
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
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
    .bottom {
      margin: 42px auto;
      text-align: center;
      .tip {
        margin-top: 22px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
      .buttons {
        margin-top: 24px;
        button {
          width: 88px;
          height: 32px;
          margin-right: 8px;
        }
        .home {
          background: #00a3ff;
          color: #fff;
        }
      }
    }
  }
}
</style>
