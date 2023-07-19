<template>
  <div class="fwjs">
    <h2>服务介绍</h2>
    <p v-if="NODE_PLA === 'kby'">
      通过”大数据+AI智能+资深律师团队“帮用户快速甄别商标信息，推荐优质商标命名方案，提高注册通过率，助力跨境电商卖家开启全球品牌之路。
    </p>
    <p v-else>
      跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax
      system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为10万+卖家提供服务。
    </p>

    <div class="content ksy-w1320" v-if="NODE_PLA === 'kby'">
      <div class="item box4 mrn">
        <h3>国际商标注册</h3>
        <p>商标服务覆盖国家和地区200+，累计注册超10万个商标，是5W+跨境企业的选择</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box5 mrn">
        <h3>国际外观专利</h3>
        <p>专家一对一顾问式服务，全程辅助撰写所有材料，服务周期内AI智能监控，通过率高下证快</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box6">
        <h3>R标</h3>
        <p>3000+优质商标可选，严格把关商标真实性，为卖家提供便捷、安全可靠的交易平台</p>
        <p class="link" @click="handleLinkToTransfer">了解更多></p>
      </div>
    </div>

    <div class="content ksy-w1320" v-else>
      <div class="item box1 mrn">
        <h3>VAT服务</h3>
        <p>现已上线VAT国家20+，已入驻税号20万+， 服务卖家10万+。</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box2 mrn">
        <h3>EPR服务</h3>
        <p>德国法国EPR，千万卖家的选择。 快至一周下号，资深团队一对一服务。</p>
        <p class="link" @click="handleLinkTo">了解更多></p>
      </div>
      <div class="item box3">
        <h3>欧代/英代</h3>
        <p>时效快，专业度高，直连当地政府，自有专业 产品合规团队、律师一对一协助客户解决问题。</p>
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
      this.$router.push("/trademarktransfer");
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
      background-image: url(@/assets/images/fwjsbg1.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box2 {
      background-image: url(@/assets/images/fwjsbg2.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box3 {
      background-image: url(@/assets/images/fwjsbg3.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
    }
    .box4 {
      background-image: url(@/assets/images/fwjsbg4.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
      background-origin: padding-box;
    }
    .box5 {
      background-image: url(@/assets/images/fwjsbg5.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
      background-origin: padding-box;
    }
    .box6 {
      background-image: url(@/assets/images/fwjsbg6.png);
      background-color: #f7faff;
      background-repeat: no-repeat;
      background-origin: padding-box;
    }
    .box4:hover {
      background-image: url(@/assets/images/fwjshover4.png) !important;
    }
    .box5:hover {
      background-image: url(@/assets/images/fwjshover5.png) !important;
    }
    .box6:hover {
      background-image: url(@/assets/images/fwjshover6.png) !important;
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
      margin-right: 25px;
    }
  }
}
</style>
