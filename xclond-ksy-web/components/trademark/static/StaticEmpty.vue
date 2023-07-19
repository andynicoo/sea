<template>
  <div class="static-empty flex flex-c-c">
    <img :src="noImg" alt="" />
    暂无数据
  </div>
</template>
<script>
export default {
  props: {
    // 1 律师 2 持有人
    type: {
      type: String,
      default: "pie",
    },
  },
  computed: {
    noImg() {
      return require(`@/assets/images/trademark/v230401/noData/${this.type}.png`);
    },
  },
};
</script>
<style lang="less" scoped>
.static-empty {
  flex-direction: column;
  img {
    width: 74px;
    margin-bottom: 8px;
  }
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  line-height: 22px;
}
</style>
