<template>
  <div class="usercarousel">
    <a-carousel arrows autoplay v-if="imgList.length">
      <div
        slot="prevArrow"
        class="custom-slick-arrow"
        style="left: 10px; zIndex: 1"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div v-for="item in imgList" :key="item.id">
        <a :href="item.link" target="_bank">
          <img
            :src="item.imgs"
            :title="item.advertisingDescribe"
            :alt="item.advertisingDescribe"
          />
        </a>
      </div>
    </a-carousel>
  </div>
</template>

<script>
import { getAdByKey } from '@/api/common.js'
export default {
  props: {
    adKey: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.getadList()
  },
  data() {
    return {
      imgList: []
    }
  },
  methods: {
    getadList() {
      getAdByKey({
        key: this.adKey
      }).then((res) => {
        this.imgList = res.data || []
      })
    }
  }
}
</script>
<style lang="scss">
.usercarousel {
  .slick-slide {
    text-align: center;
    overflow: hidden;
  }
  .slick-arrow.custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    opacity: 0.3;
  }
  .custom-slick-arrow:before {
    display: none;
  }
  .custom-slick-arrow:hover {
    opacity: 0.5;
  }
  .slick-slide h3 {
    color: #fff;
  }
  img {
    width: 100%;
    max-height: 250px;
  }
}
</style>
