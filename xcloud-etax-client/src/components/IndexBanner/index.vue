<template>
  <div v-if="bannerList.length > 0">
    <a-carousel :after-change="onChange" v-if="bannerList.length > 1">
      <div v-for="item in bannerList" :key="item.adId">
        <a target="_blank" :href="item.url" v-if="item.url">
          <!-- <img :src="item.picPath" :alt="item.name" /> -->
          <div
            class="index-banner-bg"
            :style="{ 'background-image': `url(${item.picPath})`, 'min-height': `${height}px` }"
          ></div>
        </a>
        <div
          class="index-banner-bg"
          :style="{ 'background-image': `url(${item.picPath})`, 'min-height': `${height}px` }"
        ></div>
        <!-- <img :src="item.picPath" :alt="item.name" v-else /> -->
      </div>
    </a-carousel>
    <template v-if="bannerList.length === 1">
      <a target="_blank" :href="bannerList[0].url" v-if="bannerList[0].url">
        <img :src="bannerList[0].picPath" :alt="bannerList[0].name" style="width:100%" />
      </a>
      <img :src="bannerList[0].picPath" :alt="bannerList[0].name" v-else style="width:100%" />
    </template>
  </div>
</template>
<script>
import { getAdByCode } from '@/api/account';
export default {
  name: 'IndexBanner',
  data() {
    return {
      bannerList: [],
    };
  },
  props: {
    adKey: {
      type: String,
      default: 'HomePage_top_banner',
    },
    height: {
      type: Number,
      default() {
        return 540;
      },
    },
  },
  computed: {},
  mounted() {
    this.getAdList();
  },
  methods: {
    async getAdList() {
      let params = {
        adKey: this.adKey,
      };
      let { code, data } = await getAdByCode(params);
      if (code === 0) {
        this.bannerList = data;
      }
    },
    onChange(a, b, c) {
      console.log(a, b, c);
    },
  },
};
</script>
<style lang="less" scoped>
.ant-carousel /deep/.slick-slide {
  text-align: center;
  // height: 230px;
  // line-height: 230px;
  overflow: hidden;
}

.ant-carousel /deep/.slick-slide h3 {
  color: #fff;
}
.ant-carousel /deep/.slick-slide img {
  width: 100%;
}

.ant-carousel /deep/.index-banner-bg {
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 50%;
}
</style>
