<template>
  <div class="hottrade">
    <h2>热门商标 早买早用</h2>
    <div class="content ksy-w1320 ksy-pr">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="item in productList" :key="item.id">
          <div class="item">
            <!-- <div class="flag">
              <img :src="require(`@/assets/images/countryFlag/${item.countryCode}.svg`)" alt="" />
            </div> -->
            <img :src="item.pcProductImgUrl | imgUrlFilter" class="mainimg" alt="合作伙伴" />
            <h3>{{ item.productName }}</h3>
            <p>
              {{ item.productDescribe }}
            </p>
            <div class="bottom" @click="customerFunc">立即咨询</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="next swiper-button-prev" slot="button-next"><a-icon type="left" /></div>
      <div class="prev swiper-button-next" slot="button-prev"><a-icon type="right" /></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { customerFunc } from "@/utils/index";
export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 4,
        slidesPerColumn: 2,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      customerFunc
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    productList: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    imgUrlFilter: (value) => {
      if (!value) return "";
      let url = JSON.parse(value);
      return url[0].imgUrl;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.hottrade {
  height: 870px;
  // height: 1570px;

  padding: 60px 0px 0px 0px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
    margin: 0 !important;
    padding-bottom: 20px;
  }
  background: #ffffff;
  .content {
    margin: 0 auto;
    .item {
      position: relative;
      height: 303px;
      max-width: 275px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
      opacity: 1;
      // border: 2px solid #ffffff;
      margin: 0px 2px;
      .transition();
      border-radius: 4px;
      img {
        margin: 0 auto;
      }
      .mainimg {
        width: 100%;
        height: 128px;
      }
      .flag {
        height: 25px;
        padding-top: 8px;
        padding-right: 8px;
        img {
          width: 44px;
          height: 25px;
          box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
          border-radius: 2px 2px 2px 2px;
          opacity: 1;
          border: 2px solid #ffffff;
          float: right;
        }
      }
      h3 {
        font-size: 20px;
        color: @textColor;
        padding: 0px 20px;
        margin-top: 17px;
      }
      p {
        .line-clamp(2);
        font-size: 14px;
        color: @textColor6;
        padding: 0px 20px;
      }
      .bottom {
        width: 100%;
        bottom: -2px;
        height: 48px;
        background: #ffffff;
        box-shadow: 0px -3px 12px 0px rgba(16, 68, 166, 0.05);
        border-radius: 0px 0px 4px 4px;
        opacity: 1;
        position: absolute;
        line-height: 48px;
        text-align: center;
        font-weight: 600;
        color: @primaryColor;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
      }
    }
    .item:hover {
      height: 303px;
      box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
        0px 4px 6px -3px rgba(0, 0, 0, 0.02);
      opacity: 1;
      // border: 2px solid #ffffff;
      margin-top: -10px;
      .bottom {
        background: linear-gradient(270deg, #3173ff 0%, #02a2ff 100%);
        box-shadow: 0px -3px 12px 0px rgba(16, 68, 166, 0.05);
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        color: #ffffff;
        border-radius: 4px;
      }
    }
    .swiper-button-prev {
      left: -55px;
      top: 329px;
      width: 28px;
      height: 56px;
      background: #ffffff;
      box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
        0px 4px 6px -3px rgba(0, 0, 0, 0.02);
      border-radius: 2px 2px 2px 2px;
    }
    .swiper-button-prev:after {
      content: none;
    }
    .swiper-button-next {
      right: -55px;
      top: 329px;
      width: 28px;
      height: 56px;
      background: #ffffff;
      box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
        0px 4px 6px -3px rgba(0, 0, 0, 0.02);
      border-radius: 2px 2px 2px 2px;
    }
    .swiper-button-next:after {
      content: none;
    }
  }
}
.swiper {
  width: 100%;
  height: 750px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
  .swiper-slide {
    height: 305px;
    padding-top: 3px;
  }
}
.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 50px;
}
</style>
