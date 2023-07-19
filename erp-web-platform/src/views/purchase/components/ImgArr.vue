<template>
  <div class="w-img-wrap">
      <template v-if="src.length>1">
          <img v-for="(item,index) in src" :key="index" v-lazy="item" v-img :onerror="defaultImg" />
      </template>
  </div>
</template>

<script>
export default {
  name: 'ImgArr',
  props: {
    src: {
      type: Array,
      default:[]
    //   default: [require('@/assets/images/loading-img.png')]
    }
  },
  computed: {
    calcStyle() {
      return this.src
    },

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
    width: 45px;
    height: 45px;
  }
}
</style>
