<template>
  <div class="active-slider">
    <div class="active-slider-head" :style="bgStyle"></div>
    <div class="active-slider-content">
      <template v-if="addSlide.length">
        <div
          v-for="(slide, index) in addSlide"
          class="active-slider-item"
          :class="{ 'active-slider-item-hot': index === 0 }"
          :key="`slide_${index}`"
          @click="goAnchor(slide.id)"
        >
          <div class="active-slider-item-text">{{ slide.title }}</div>
          <div class="active-slider-item-go"></div>
        </div>
      </template>
      <div class="active-slider-item">
        <div class="active-slider-item-icon"></div>
        <div class="active-slider-item-text">联系我们</div>
        <div class="active-slider-item-go"></div>
        <div class="active-slider-item-hide">
          <img src="../images/icon-code.png" alt="" />
          <div>有任何问题<br />请联系客服</div>
        </div>
      </div>
      <div class="active-slider-item" @click="goAnchor('page')">
        <div class="active-slider-item-iconUp"></div>
        <div class="active-slider-item-text">返回顶部</div>
        <div class="active-slider-item-go"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'activeSlider',
  data() {
    return {};
  },
  props: {
    bg: String,
    addSlide: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    bgStyle() {
      return {
        background: `url("${this.bg}") no-repeat center/100% 100%`,
      };
    },
  },
  methods: {
    goAnchor(id) {
      this.$emit('goAnchor', id);
    },
  },
};
</script>
<style lang="less" scoped>
/** 侧边栏重写 **/
.active-slider {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-head {
    width: 152px;
    height: 86px;
    background: url('../images/left-head-bg.svg') no-repeat center/100% 100%;
  }
  &-item {
    width: 136px;
    height: 35px;
    line-height: 30px;
    text-align: center;
    background: linear-gradient(180deg, #fc7244 0%, #e7421a 100%);
    border: 2px solid #ffe794;
    margin-bottom: 10px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
    color: #ffffff;
    &:not(:first-child):before {
      content: '';
      position: absolute;
      bottom: calc(100% + 2px);
      left: 50%;
      transform: translate(-50%, 0) skewX(45deg);
      width: 120px;
      height: 11px;
      background: #d41313;
    }
    &-text {
      display: inline-block;
      vertical-align: middle;
    }
    &-hot {
      &:after {
        content: '';
        position: absolute;
        width: 29px;
        height: 23px;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: url('../images/icon-hot.png') no-repeat center/100% auto;
      }
    }
    &-iconUp {
      width: 13px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
      background: url('../images/icon-up.png') no-repeat center/100% 100%;
    }
    &-go {
      display: none;
      position: absolute;
      right: 0;
      top: 50%;
      width: 26px;
      height: 26px;
      background: url('../images/icon-go.png') no-repeat center/100% 100%;
      transform: translate(50%, -50%);
    }
    &-hide {
      display: none;
      position: absolute;
      width: 133px;
      height: 143px;
      top: 50%;
      padding: 10px 16px 10px 27px;
      transform: translateY(-50%);
      left: calc(100% + 10px);
      background: url('../images/icon-bg.png') no-repeat left center/100% auto;
      font-size: 12px;
      color: #666666;
      line-height: 14px;
      > img {
        display: block;
        width: 90px;
        margin-bottom: 3px;
      }
    }
    &:hover {
      .active-slider-item-go,
      .active-slider-item-hide {
        display: block;
      }
    }
  }
}
.new {
  .active-slider-item {
    background: linear-gradient(180deg, #5079f3 0%, #2a2dd2 100%);
    border-color: #fff;
    &:not(:first-child):before {
      background: #171ca4;
    }
  }
  .active-slider-item-go {
    background: url(../images/new/GO.png) no-repeat left center/100% auto;
  }
  .active-slider-item-iconUp {
    background: url(../images/new/up.png) no-repeat left center/100% auto;
  }
  .active-slider-item-hide {
    background: url(../images/new/Union.png) no-repeat left center/100% auto;
  }
}
</style>
