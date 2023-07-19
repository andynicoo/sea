<template>
  <div
    class="about-companies-speak"
    :class="{ 'about-companies-speak-kby': NODE_PLA === 'kby', 'about-companies-speak-wg': NODE_PLA === 'wg' }"
  >
    <div class="about-companies-speak-head">
      <template v-if="NODE_PLA === 'ksy'">
        <h4>20万+客户的共同选择</h4>
        <p>用户好评度95%以上，专业贴心的服务，为跨境卖家保驾护航</p>
      </template>
      <template v-if="NODE_PLA === 'kby'">
        <h4>10万+客户的共同选择</h4>
        <p>用户好评度95%以上，专业贴心的服务，为跨境卖家保驾护航</p>
      </template>
      <template v-if="NODE_PLA === 'wg'">
        <h4>客户的共同选择</h4>
        <p>用户好评度95%以上，专业贴心的服务，为跨境卖家保驾护航</p>
      </template>
    </div>
    <div class="about-companies-speak-swiper center">
      <div v-swiper:mySwiper="swiperOption" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in list" :key="index" :data-index="index">
            <div class="about-companies-speak-content">
              <div class="head-img">
                <img v-if="NODE_PLA === 'ksy'" :src="require(`@/assets/images/user/user-${index + 1}.png`)" alt="" />
                <img v-if="NODE_PLA === 'kby'" :src="require(`@/assets/images/index/kby/user-${index + 1}.png`)" alt="" />
                <img v-if="NODE_PLA === 'wg'" :src="require(`@/assets/images/index/wg/user-${index + 1}.png`)" alt="" />
              </div>
              <h4 class="title">{{ item.company }}</h4>
              <div class="text-wrap flex">
                <p class="content">{{ item.comment }}</p>
                <span class="name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-button swiper-button-next"></div>
        <div class="swiper-button swiper-button-prev"></div>
      </div>
    </div>
  </div>
</template>
<script>
let vm = null;
export default {
  name: "AboutCompaniesSpeak",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      swiperOption: {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 0,
        centeredSlides: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      comments: [
        {
          name: "杨*",
          company: "嘉兴**科技有限公司",
          comment: "大平台大公司有保证，价格公道，服务人员热情周到，专业严谨耐心指导。",
        },
        {
          name: "黄*",
          company: "深圳市**国际跨境电商服务有限公司",
          comment:
            "咨询了几家税代公司，本来差点付款了，后来无意间看到跨税云价格比较公道，就下单了，没想到竟然还有专属客服，该有的服务也都有，后面也会继续选择跨税云。",
        },
        {
          name: "戴*欣",
          company: "深圳市**电子商务有限公司",
          comment:
            "我这边做服务商的，同时也是卖家，说实话，这个价格在行业内也已经是 超低价了，本来想着这么便宜可能就只是一个手续或者后续有其他费用， 就抱着试一试的心态把英国的转过来了，但不得不说，是真的香。",
        },
        {
          name: "夏*洋",
          company: "汕头市**电子商务有限公司",
          comment: "从刚接触就一直帮我解决了很多问题，价格也很实惠，售前售后服务都很好。",
        },
        {
          name: "周*",
          company: "深圳**电子有限公司",
          comment: "客服很有耐心，遇到的问题都能一一解答，价格也很实惠，已经推荐身边好几个朋友啦。",
        },
      ],
      commentsKby: [
        {
          name: "吴先生",
          company: "深圳市***电器有限公司",
          comment:
            "最开始是使用他们的商标查询，感觉挺准确的，后来下单商标注册，两三天就拿到备案验证码了，很让我意外，这个效率还挺高的。",
        },
        {
          name: "刘先生",
          company: "深圳市**电子科技有限公司",
          comment:
            "对接的业务经理很专业，会提醒一些注册事项，也会给建议，下单之后6个月就注册完了，很满意，希望你们的服务再接再厉。",
        },
        {
          name: "张女士",
          company: "江苏***饰品股份有限公司",
          comment: "挺好的，服务很耐心，从下单到注册都有收到提醒，这点不错，也介绍给了朋友，后面有需要也会选择跨标云。",
        },
        {
          name: "陈先生",
          company: "佛山市**欧卫浴有限公司",
          comment:
            "跟朋友一起去他们公司参观时，印象就不错，接待人员讲解得很专业，也解决了当时我们遇到的困境，现在市场上很多商标公司难以选择，但选大公司肯定没错，至今也非常感谢跨标云为我们大大避免了损失，已经介绍给我们圈子里不少老板了。",
        },
      ],
      commentsWg: [
        {
          name: "李女士",
          company: "深圳市***电器有限公司",
          comment: "最开始是申请他们的外观专利，感觉挺专业的，后来购买外观专利，没有隐形收费......",
        },
        {
          name: "周先生",
          company: "深圳市**电子科技有限公司",
          comment:
            "对接的业务经理很专业，会提醒一些事项，也会给建议，申请专利的流程很顺利，很满意，希望你们的服务再接再厉。",
        },
        {
          name: "张先生",
          company: "浙江***饰品股份有限公司",
          comment: "挺好的，服务很耐心，从下单到下证都有收到提醒，这点不错，也介绍给了朋友，后面有需......",
        },
      ],
    };
  },
  computed: {
    list() {
      if (this.NODE_PLA === "kby") {
        return this.commentsKby;
      } else if (this.NODE_PLA === "ksy") {
        return this.comments;
      } else if (this.NODE_PLA === "wg") {
        return this.commentsWg;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.about-companies-speak {
  width: 100%;
  height: 610px;
  background: url("@/assets/images/index/swiper-bg-01.png") no-repeat center/cover;
  padding-top: 80px;
  &-kby {
    background: url("@/assets/images/index/kby/swiper-bg-01.png") no-repeat center/cover;
  }
  &-wg {
    background: url("@/assets/images/index/wg/swiper-bg-01.png") no-repeat center/cover;
  }
  &-head {
    color: rgba(#fff, 0.9);
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    margin: 0 auto 10px;
    h4 {
      font-size: 28px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      line-height: 40px;
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    .text-wrap {
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .name {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 24px;
        align-self: flex-end;
        position: relative;
        &:before {
          position: absolute;
          content: "";
          top: 50%;
          transform: translateX(-50%);
          right: 18px;
          width: 80px;
          height: 1px;
          background: rgba(255, 255, 255, 0.6);
        }
      }
    }
    .title {
      font-size: 20px;
      font-weight: 500;
      color: #ffffff;
      line-height: 28px;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    .content {
      .line-clamp(2);
      font-size: 14px;
      color: #ffffff;
      line-height: 22px;
    }
  }
  &-swiper {
    // height: 322px;
    max-width: 1320px;
    margin: 0 auto;
    .head-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
/deep/ .swiper-container {
  width: 100%;
  padding: 40px 0;
  .swiper-button {
    width: 32px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    color: #fff;
    transform: translateY(-14%);
    &:after {
      font-size: 14px;
    }
  }
}
/deep/ .swiper-slide {
  overflow: hidden;
  padding: 32px;
  display: flex;
  transition: 300ms;
  width: 514px;
  height: 338px;
  transform: scale(0.76);
  background-image: url("@/assets/images/index/swiper-bg-02.png");
  background-position: right 30px top 30px;
  background-repeat: no-repeat;
  background-size: auto 33px;
  border-radius: 4px;
  position: relative;
  background-color: rgba(#fff, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 25px 0px 20px -5px rgba(0, 0, 0, 0.25), -25px 4px 20px 0px rgba(0, 0, 0, 0.25);
}
/deep/ .swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
  .content {
    .line-clamp(3);
  }
}
</style>
