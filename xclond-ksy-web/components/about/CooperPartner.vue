<template>
  <div class="hzhb">
    <h2>合作伙伴</h2>
    <div class="content ksy-w1320">
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
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="less" scoped>
.hzhb {
  // max-width: 1920px;
  height: 552px;
  padding: 80px 0px 0px 0px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
    margin: 0 !important;
  }
  background: #f5f7fa;
  .content {
    display: grid;
    height: 280px;
    margin: 0 auto;
    margin-top: 40px;
    grid-column-gap: 20px;
    grid-row-gap: 16px;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 1fr);
    .item {
      background: #ffffff;
      align-items: center;
      display: flex;
      box-shadow: 0px 1px 12px 0px rgba(194, 212, 238, 0.3);
      border-radius: 2px 2px 2px 2px;
      margin: 0 auto;
      img {
        max-width: 224px;
        max-height: 132px;
      }
    }
  }
}
</style>
