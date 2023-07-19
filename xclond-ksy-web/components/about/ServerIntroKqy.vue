<template>
  <div class="fwjs">
    <h2>服务介绍</h2>
    <p>
      专注为品牌出海企业提供全球工商注册、银行开户、地址租赁和年审报税服务。
    </p>

    <div class="content ksy-w1320">
      <div class="item box1 mrn">
        <h3>公司注册</h3>
        <p>资料简单、方便快速</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box2 mrn">
        <h3>银行开户</h3>
        <p>全程线上开户、快速开通</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box3 mrn">
        <h3>营商咨询</h3>
        <p>东南亚本地团队、提供专业营商咨询</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box4">
        <h3>代理记账</h3>
        <p>提供财税合规方案、无微不至服务</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  methods: {
    handleLinkTo() {
      this.$router.push("/productservice");
    },
    handleLinkToTransfer() {
      // this.$router.push("/trademarktransfer");
    },
  },
};
</script>
<style lang="less" scoped>
.fwjs {
  h2 {
    height: 40px;
    font-size: 28px;
    color: @textColor;
    text-align: center;
    margin-top: 70px;
    margin-bottom: 10px;
  }
  p {
    height: 60px;
    font-size: 14px;
    text-align: center;
    width: 50%;
    margin: 0 auto;
    line-height: 25px;
    color: @textColor6;
  }
  .content {
    margin: 0 auto;
    display: flex;
    margin-top: 40px;
    margin-bottom: 80px;
    .box1 {
      background-image: url(@/assets/images/kqyfw1.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box2 {
      background-image: url(@/assets/images/kqyfw2.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box3 {
      background-image: url(@/assets/images/kqyfw3.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box4 {
      background-image: url(@/assets/images/kqyfw4.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
      background-origin: padding-box;
    }
    .box1:hover {
      background-image: url(@/assets/images/kqyfwbg1.png) !important;
    }
    .box2:hover {
      background-image: url(@/assets/images/kqyfwbg2.png) !important;
    }
    .box3:hover {
      background-image: url(@/assets/images/kqyfwbg3.png) !important;
    }
    .box4:hover {
      background-image: url(@/assets/images/kqyfwbg4.png) !important;
    }
    .item {
      width: 33%;
      // width: 424px;
      height: 260px;
      border-radius: 4px 4px 4px 4px;
      opacity: 0.9;
      margin: 0 auto;
      transition: all 0.4s ease 0s;
      h3 {
        font-size: 20px;
        color: @textColor;
        text-align: center;
        margin-top: 70px;
        margin-bottom: 24px;
      }
      p {
        font-size: 14px;
        color: @textColor;
        width: 65%;
      }
      .link {
        display: none;
        margin-top: 20px;
      }
    }
    .item:hover {
      background-image: url(@/assets/images/fwjshover.png);
      transition: all 0.6s ease 0s;
      -webkit-transform: scale(1.05);
      // transform: translateY(-3px);
      h3 {
        color: @whiteTextColor;
        margin-top: 55px;
        margin-bottom: 24px;
      }
      p {
        color: @whiteTextColor;
      }
      .link {
        display: block;
        cursor: pointer;
      }
    }
    .mrn {
      margin-right: 36px;
    }
  }
}
</style>
