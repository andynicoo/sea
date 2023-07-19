<template>
  <div :id="uuid" class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(source, index) in sources"
        :key="index"
        style="width:75px"
      >
        <a-popover :title="null">
          <template slot="content">
            <img
              :style="{ width: '250px', height: '250px' }"
              v-lazy="source"
              :src="source"
            />
          </template>
          <img
            :style="{ width: size.width, height: size.height }"
            v-lazy="source"
            :src="source"
          />
        </a-popover>
      </div>
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper, { Navigation } from 'swiper'
import 'swiper/swiper-bundle.css'

Swiper.use([Navigation])

import { v4 as uuidv4 } from 'uuid'
export default {
  props: {
    sources: {
      type: Array,
      default: () => []
    },
    size: {
      type: Object,
      default: () => ({ width: '70px', height: '70px' })
    }
  },
  data() {
    return {
      uuid: uuidv4()
    }
  },
  mounted() {
    const { uuid } = this.$data
    new Swiper(`[id='${uuid}']`, {
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      slidesPerView: 4
    })
  }
}
</script>

<style lang="scss">
.swiper-button-prev,
.swiper-button-next {
  transform: scale(0.6);
}
</style>
