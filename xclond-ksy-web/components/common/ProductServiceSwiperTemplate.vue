<template>
  <div class="product-service-swiper-item">
    <div class="product-service-swiper-left">
      <h4>{{ productInfo.name }}</h4>
      <p v-show="false">{{ productInfo.info }}</p>
    </div>
    <ProductServiceSwiper v-on="$listeners" v-bind="$attrs" :list="productInfo.items" />
  </div>
</template>
<script>
export default {
  name: 'ProductServiceSwiperTemplate',
  props: {
    items: Object
  },
  computed: {
    productInfo() {
      if(this.items) {
        return this.items
      }else {
        return {}
      }
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        slidesPerColumn: 2,
        spaceBetween: 0,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.product-service {
  &-swiper {
    &-item {
      display: flex;
      height: 376px;
      margin-bottom: 24px;
      border: 1px solid #DCDCDC;
      justify-content: space-between;
    }
    &-left {
      width: 282px;
      border-right: 1px solid #DCDCDC;
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: contain;
      padding: 40px 32px;
      color: @textColor6;
      font-size: 14px;
      line-height: 22px;
      background: url("@/assets/images/productAbout/yxfw_bg.svg") no-repeat center/cover;
      h4 {
        color: rgba(@textColor, .9);
        font-weight: 600;
        line-height: 32px;
        font-size: 24px;
        margin-bottom: 14px;
      }
    }
    &-right {
      width: calc(100% - 282px);
      .swiper-slide {
        height: calc(100% / 2);
        &-wrap {
          width: calc(100% + 1px);
          height: calc(100% + 1px);
          margin-left: -1px;
          margin-top: -1px;
          border: 1px solid #DCDCDC;
          font-size: 14px;
          color: @textColor6;
          line-height: 22px;
          padding: 24px 24px 24px 28px;
          cursor: pointer;
          &:hover {
            box-shadow: 0px 3px 16px -2px rgba(16,68,166,0.1200), 0px 6px 12px 1px rgba(0,0,0,0.0500), 0px 4px 6px -3px rgba(0,0,0,0.0200);
          }
        }
        &:nth-child(even) {
          .swiper-slide-wrap {
            border-bottom: 0;
          }
        }
      }
      .swiper-head {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        justify-content: space-between;
        h5 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
          color: rgba(@textColor, .9);
        }
        &-icon {
          width: 56px;
          height: 56px;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          border: 1px solid #D8D8D8;
          img {
            max-width: 56px;
            max-height: 56px;
          }
        }
      }
      .swiper-wrapper {
        flex-wrap: wrap;
        flex-direction: column;
      }
      .swiper-button {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        &:after {
          display: none;
        }
      }
    }
  }
}
</style>
