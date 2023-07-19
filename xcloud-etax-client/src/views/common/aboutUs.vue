<template>
  <div class="login-all">
    <div class="top-banner">
      <p class="weAre">WHO WE ARE</p>
      <p class="whoWe">我们是谁？</p>
    </div>
    <div class="platform">
      <div class="center-box clearfix">
        <div class="fl">
          <p class="title">平台介绍</p>
          <p class="sub-title">Platform Introduction</p>
          <div class="line"></div>
          <p class="content">跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为3000+卖家提供服务。</p>
        </div>
        <div class="fl right-content">
          <div class="img"></div>
        </div>
      </div>
    </div>
    <div class="company">
      <div class="center-box clearfix">
        <div class="fl left-content">
          <div class="img"></div>
        </div>
        <div class="fl right-content">
          <p class="title">公司介绍</p>
          <p class="sub-title">Company Introduction</p>
          <div class="line"></div>
          <p class="content">跨税云（深圳）科技有限公司位于跨境电商创新之都深圳，由37位海外税务专家、IT工程师、国内税务顾问组成，为跨境电商卖家提供VAT自主申报智能SAAS平台，推动VAT税务合规化、标准化、智能化。<br>公司地址：广东省深圳市龙岗区天安云谷2期4栋34楼 <br> 联系电话：15323756779
          </p>
        </div>
      </div>
    </div>
    <OtherFooter></OtherFooter>
  </div>
</template>
<script>
import "@/styles/common.less";
import OtherFooter from '@/views/common/otherFooter'
export default {
  components: {
    OtherFooter
  },
  props: {},
  data() {
    return {};

  },
  metaInfo: {
    title: '关于我们_跨税云（itaxs)-智能税务平台', // set a title
    meta: [{                 // set meta
      name: 'keyWords',
      content: 'VAT注册，VAT申报，跨税云，智能税务系统'
    },
    {
      name: 'description',
      content: '跨税云（itaxs) 是一家智能税务平台，直连海外税局，为卖家提供更高效的VAT处理平台，更低的VAT服务价格，更快的税号注册时效以及更透明的操作流程，期待与每一位卖家朋友携手前行'
    },
    {
      property: 'og:title',
      content: '关于我们_跨税云（itaxs)-智能税务平台'
    },
    {
      property: 'og:description',
      content: '跨税云（itaxs) 是一家智能税务平台，直连海外税局，为卖家提供更高效的VAT处理平台，更低的VAT服务价格，更快的税号注册时效以及更透明的操作流程，期待与每一位卖家朋友携手前行'
    },
    ],
    link: [{                 // set link
      rel: 'asstes',
      href: 'https://www.itaxs.com/aboutUs'
    }]
  },
  watch: {},
  methods: {},
  created() { }
};
</script>
<style lang='less' scoped>
.login-all {
  background-color: #ffffff;
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: 0;
  left: 0;
  .loginHead {
    background-color: #ffffff;
    height: 71px;
    .loginImg {
      width: 80%;
      margin: 0 auto;
      img {
        float: left;
        padding-top: 10px;
      }
    }
  }
  .top-banner {
    width: 100%;
    height: 350px;
    background: url('../../assets/images/aboutHome/aboutUs.png') center center
      no-repeat;
    text-align: center;
    color: #ffffff;
    margin-top: 60px;
    padding-top: 100px;
    .weAre {
      font-size: 55px;
      font-weight: 400;
      text-shadow: 0px 20px 54px rgba(12, 44, 139, 1);
    }
    .whoWe {
      font-size: 20px;
      margin-top: 10px;
    }
  }
  .platform,
  .company {
    font-family: 'PingFangSC-Regular', 'PingFang SC';
    font-size: 14px;
    height: 450px;
    width: 100%;
    background-color: #ffffff;
    .fl {
      width: 48%;
      margin-right: 4%;
      .img {
        width: 100%;
        height: 100%;
        // background-color: #eeebee;
      }
    }
    .right-content,
    .left-content {
      margin-right: 0;
      height: 287px;
    }
    .center-box {
      max-width: 1200px;
      margin: auto;
      background-color: #fff;
      padding: 80px 100px 84px 100px;
      .title {
        font-size: 32px;
        color: #303033;
        font-weight: 500;
        font-family: 'PingFangSC-Regular', 'PingFang SC';
      }
      .sub-title {
        font-size: 14px;
        color: #626266;
        margin-top: 16px;
      }
      .line {
        width: 23px;
        height: 4px;
        background: rgba(48, 48, 51, 1);
        margin-top: 26px;
      }
      .content {
        margin-top: 10px;
        color: #626266;
        line-height: 36px;
      }
    }
  }
  .platform {
    .right-content {
      .img {
        background: url('../../assets/images/aboutHome/platImg.jpg') center
          center no-repeat;
      }
    }
  }
  .company {
    background-color: #f9f9fb;
    height: 550px;
    .center-box {
      background-color: #f9f9fb;
    }
    .left-content {
      margin-right: 4%;
    }
    .img {
      background: url('../../assets/images/aboutHome/companyImg.jpg') center
        center no-repeat;
    }
  }
}
</style>