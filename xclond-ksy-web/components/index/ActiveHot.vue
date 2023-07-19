<template>
  <a-row :gutter="36" class="tab-list" v-if="list.length">
    <a-col :span="8" v-for="(item) in list" :key="item.adId">
      <div
        class="tab-list-item"
        v-sensorsDire = "{
        type: 'BannerClick',
        event: 'click',
        getParams: () => ({
          B_banner_id: item.adId,
          page_name: '首页'
        }),
      }"
      >
        <a
          :href="item.url"
          target="_blank"
          v-if="item.url"
        >
          <img v-lazy="item.picPath" :alt="item.picPath">
        </a>
        <img v-lazy="item.picPath" :alt="item.picPath" v-else>
      </div>
    </a-col>
  </a-row>
</template>
<script>
export default {
  name: 'ActiveHot',
  data() {
    return {
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tab-list {
  &-item {
    overflow: hidden;
  }
  img {
    width: 100%;
    height: auto;
  }
}
</style>
