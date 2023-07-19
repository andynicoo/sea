<template>
  <a-carousel v-if="list.length">
    <div
      class="card hand"
      v-for="(item, index) in list"
      :key="index"
      v-sensorsDire = "{
        type: 'BannerClick',
        event: 'click',
        getParams: () => ({
          B_banner_id: item.adId,
          page_name: '税务资讯'
        }),
      }"
    >
      <a :href="item.url" target="_blank" v-if="item.url">
        <img :src="item.picPath" :alt="item.name" />
        <h3>{{ item.name }}</h3>
        <div class="sw-mask"></div>
      </a>
      <template v-else>
        <img :src="item.picPath" :alt="item.name" />
        <h3>{{ item.name }}</h3>
        <div class="sw-mask"></div>
      </template>
    </div>
  </a-carousel>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.card {
  position: relative;
  height: 156px;
  width: 278px;
  border-radius: 4px;
  overflow: hidden;
  display: block !important;
  z-index: 1;
  h3 {
    position: absolute;
    bottom: 5px;
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    left: 20px;
    z-index: 1;
  }
  img{
    height: 100%;
  }
  .sw-mask {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 72px;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
    opacity: 0.2;
    z-index: 0;
  }
}
</style>
