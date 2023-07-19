// 图片鼠标悬浮放大
<template>
  <div class="w-img-wrap" :style="calcStyle">
    <img :src="src || defaultImg" v-img :onerror="defaultImg" />
    <div class="outer-img">
      <img :src="src || defaultImg" v-img :onerror="defaultImg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WImg',
  props: {
    size: {
      type: [Number, String],
      default: 80
    },
    src: {
      type: String,
      default: require('@/assets/images/loading-img.png')
    }
  },
  computed: {
    calcStyle() {
      const style = {}
      style.width = this.size + 'px'
      style.height = this.size + 'px'
      return style
    }
  },

  data() {
    return {
      defaultImg: require('@/assets/images/loading-img.png')
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.w-img-wrap {
  position: relative;
  & > img {
    width: 100%;
    height: 100%;
  }
  &:hover .outer-img {
    width: 300px;
    height: 300px;
    padding: 5px;
    right: -305px;
    bottom: -290px;

    img {
      width: 290px !important;
      height: 290px !important;
      border-radius: 3px;
    }
  }
  .outer-img {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 0;
    height: 0;
    background: #fff;
    border-radius: 3px;
    z-index: 9999;
    box-shadow: 0 0 5px rgba(#ccc, 0.5);
    transition: 0.3s;
    img {
      height: 0 !important;
      width: 0 !important;
    }
  }
}
</style>
