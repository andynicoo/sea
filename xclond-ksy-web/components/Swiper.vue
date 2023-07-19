<template>
  <div class="usercarousel">
    <a-carousel arrows v-if="list.length" dotsClass="dotsClass" style="overflow: hidden;">
      <div slot="prevArrow" class="custom-slick-arrow" style="left: 0; zindex: 1">
        <AliIcon type="jiantou-zuo_bai1" size="30" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 0;">
        <AliIcon type="jiantou-you_bai1" size="30" />
      </div>
      <div v-for="item in list" :key="item.id" v-sensorsDire="{
        type: 'BannerClick',
        event: 'click',
        getParams: () => ({
          B_banner_id: item.adId,
          page_name: '税务资讯'
        }),
      }">
        <a :href="item.url" target="_bank" v-if="item.url">
          <h3>
            {{ item.name }}
          </h3>
          <img :src="item.picPath" :title="item.name" :alt="item.name" />
          <div class="sw-mask"></div>
        </a>
        <template v-else>
          <h3>
            {{ item.name }}
          </h3>
          <img :src="item.picPath" :title="item.name" :alt="item.name" />
          <div class="sw-mask"></div>
        </template>
      </div>
    </a-carousel>
  </div>
</template>

<script>
// import { getAdByKey } from '@/api/common.js'
export default {
  props: {
    adKey: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {
  },
  data() {
    return {};
  },
  methods: {
  },
};
</script>
<style lang="less" scoped>
.usercarousel {
  position: relative;
  z-index: 1;

  .sw-mask {
    position: absolute;
    width: 100%;
    height: 120px;
    bottom: 0;
    left: 0;
    z-index: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
    opacity: 0.2;
  }

  div {
    display: block !important;
  }

  &:hover {
    .slick-arrow.custom-slick-arrow {
      display: flex !important;
    }
  }

  /deep/ .slick-slide {
    text-align: center;
    overflow: hidden;
  }

  /deep/ .dotsClass {
    text-align: right;
    padding: 0 28px 0 0;
    bottom: 20px;
    height: 12px;

    li {
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      opacity: 0.4;
      border-radius: 50%;
      margin: 0 0 0 8px;

      &.slick-active {
        background: #FFFFFF;
        opacity: 1;
      }

      button {
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }
    }
  }

  .slick-arrow.custom-slick-arrow {
    width: 32px;
    height: 52px;
    display: none !important;
    align-items: center;
    justify-content: center;
    background: rgba(@textColor, .4);
    z-index: 99 !important;
    transform: translateY(-20px);
  }

  .custom-slick-arrow:before {
    display: none;
  }

  .slick-slide h3 {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    bottom: 10px;
    // left: 20px;
    z-index: 1;
    margin-left: 20px;
  }

  img {
    width: auto;
    height: 368px;
  }
}</style>
