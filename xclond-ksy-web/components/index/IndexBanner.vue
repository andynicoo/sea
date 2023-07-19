<template>
  <div class="index-banner" v-if="list.length" :style="{'height':`${height}px`}">
    <div
      v-swiper:mySwiper="swiperOption"
      v-if="list && list.length > 1"
      class="index-banner-swiper"
    >
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="item in list"
          :key="item.adId"
          v-sensorsDire="{
            type: 'BannerClick',
            event: 'click',
            getParams: () => ({
              B_banner_id: item.adId,
              page_name: $store.state.pageInfo.pageName,
            }),
          }"
        >
          <a :href="item.url" target="_blank" v-if="item.url">
            <div class="index-banner-bg" :style="{'background-image': `url(${item.picPath})`, 'min-height':`${height}px`}"></div>
            <!-- <img class="ksy-b" :src="item.picPath" :alt="item.name" /> -->
          </a>
          <div class="index-banner-bg" :style="{'background-image': `url(${item.picPath})`, 'min-height':`${height}px`}"></div>
          <!-- <img class="ksy-b" :src="item.picPath" :alt="item.name" v-else /> -->
        </div>
      </div>
      <!-- 分页器start -->
      <div class="index-banner-swiper-pagination"></div>
      <!-- 分页器end -->
    </div>
    <div v-else>
      <div
        v-for="item in list"
        :key="item.adId"
        v-sensorsDire="{
          type: 'BannerClick',
          event: 'click',
          getParams: () => ({
            B_banner_id: item.adId,
            page_name: $store.state.pageInfo.pageName,
          }),
        }">
          <a :href="item.url" target="_blank" v-if="item.url">
            <div class="index-banner-bg" :style="{'background-image': `url(${item.picPath})`, 'min-height':`${height}px`}"></div>
          </a>
          <div class="index-banner-bg" :style="{'background-image': `url(${item.picPath})`, 'min-height':`${height}px`}"></div>
      </div>
    </div>
    <!-- 静态数据展示start -->
    <!-- <div class="index-banner-numbers" v-if="showData">
      <div class="ksy-w1320 flex flex-c-c center">
        <dl v-for="(n, index) in staticNumbers" :key="index">
          <dt>{{ n.value }}</dt>
          <dd>{{ n.label }}</dd>
        </dl>
      </div>
    </div> -->
    <!-- 静态数据展示end -->
  </div>
</template>
<script>
export default {
  name: "IndexBanner",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      staticNumbers: [
        {
          value: "20W",
          label: "跨境卖家",
        },
        {
          value: "25W",
          label: "已入驻税号",
        },
        {
          value: "90%",
          label: "提升申报效率",
        },
        {
          value: "1000+",
          label: "事务所&律所",
        },
      ],
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    height: {
      type: Number,
      default() {
        return 540;
      },
    },
    showData:{
      type:Boolean,
      default:true
    }
  },
  computed: {
    swiperOption() {
      return {
        loop: true,
        autoplay: {
          delay: 4000,
        },
        speed: 1000,
        centeredSlides: false,
        spaceBetween: 0,
        pagination: {
          el: ".index-banner-swiper-pagination",
          clickable: true,
        },
      };
    },
  },
};
</script>
<style lang="less" scoped>
.index-banner {
  position: relative;
  width: 100%;
  // height: 540px;
  overflow: hidden;
  >div:first-child {
    height: 100%;
    >div:first-child {
      height: 100%;
    }
  }
  &-bg {
    min-height: 540px;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: center;
  }
  img {
    display: block;
    height: 100%;
    width: auto;
  }
  &-swiper {
    height: 100%;
    position: relative;
    &-pagination {
      position: absolute;
      width: 100%;
      bottom: 90px !important;
      text-align: center;
      z-index: 1;
      /deep/ .swiper-pagination-bullet {
        width: 30px;
        height: 4px;
        background: rgba(0, 0, 0, 0.16);
        border-radius: 39px 39px 39px 39px;
        opacity: 1;
        margin: 0 6px !important;
      }
      /deep/ .swiper-pagination-bullet-active {
        background: @primaryColor;
      }
    }
  }
  &-numbers {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 70px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(12px);
    & > div {
      height: 100%;
    }
    dl {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 14px;
      color: @textColor;
      line-height: 22px;
      margin: 0;
      dt {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        // margin-bottom: 6px;
      }
      dd {
        margin-bottom: 0;
      }
    }
  }
}
</style>
