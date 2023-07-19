<template>
  <div class="product-service-swiper-right" v-swiper:mySwiper="swiperOption" ref="mySwiper">
    <div class="swiper-wrapper" v-if="list.length">
      <div class="swiper-slide"
        v-for="(i, idx) in list"
        :key="idx"
        @click="handleClick(i, $attrs.idx)"
      >
        <div class="swiper-slide-wrap">
          <div class="swiper-head">
            <h5>{{ i.platformName }}</h5>
            <div class="swiper-head-icon flex-c-c flex">
              <img v-lazy="i.picUrl" :alt="i.platformName">
            </div>
          </div>
          <div class="swiper-content">{{ i.info }}</div>
        </div>
      </div>
    </div>
    <template v-if="list.length>4">
      <AliIcon class="swiper-button swiper-button-next" type="dajiantou-you1" :size="48"></AliIcon>
      <AliIcon class="swiper-button swiper-button-prev" type="dajiantou-zuo1" :size="48"></AliIcon>
    </template>
  </div>
</template>
<script>
export default {
  name: 'ProductServiceSwiper',
  props: {
    list: {
      type: Array,
      default() {
        return []
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
  },
  methods: {
    handleClick(i, idx) {
      if(i?.parentInfo?.navTertiary?.aggregates?.[idx]?.name) {
        this.$emit('handleServiceBuy', Object.assign(i,{name: i.parentInfo.navTertiary.aggregates[idx].name}))
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
        &:after {
          display: none;
        }
      }
    }
  }
}
</style>
