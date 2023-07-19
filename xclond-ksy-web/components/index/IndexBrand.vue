<template>
  <div class="index-brand">
    <div class="main-box">
      <div class="main-box-head" v-if="NODE_PLA === 'kby'">
        <div class="main-box-head-title">{{ mainHead.title }}</div>
        <div class="main-box-head-text">{{ mainHead.text }}</div>
      </div>
      <div class="main-box-head" v-if="NODE_PLA === 'kqy'">
        <div class="main-box-head-title">{{ mainHeadKqy.title }}</div>
        <div class="main-box-head-text">{{ mainHeadKqy.text }}</div>
      </div>
    </div>
    <div class="ksy-w1320 center index-brand-content">
      <div class="item" v-for="item in list" :key="item.yqLinkId">
        <a :href="item.link" target="_blank" v-if="item.link">
          <img :src="item.picUrl" alt="合作伙伴" />
        </a>
        <img :src="item.picUrl" alt="合作伙伴" v-else />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "IndexBrand",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      mainHead: {
        title: "合作伙伴",
        text: "更专业的商标服务流程,更优质的商标服务体验",
      },
      mainHeadKqy: {
        title: "合作伙伴",
        text: "众多客户的省心之选",
      },
    };
  },
};
</script>
<style lang="less" scoped>
.index-brand {
  padding: 76px 0;
  &-content {
    display: grid;
    justify-content: space-between;
    grid-column-gap: 20px;
    grid-row-gap: 16px;
    grid-template-columns: repeat(5, 1fr);
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
