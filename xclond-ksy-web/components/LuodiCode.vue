<template>
  <div class="luodicode">
    <img src="~assets/images/luodicode.png" />
    <p :class="color === 'blue' ? 'p1' : 'p2'">扫码免费使用</p>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "blue",
    },
  },
};
</script>

<style lang="less" scoped>
.luodicode {
  text-align: center;
  img {
    width: 164px;
  }
  p {
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    text-align: center;
  }
  .p1 {
    color: #3370ff;
  }
  .p2 {
    color: #ffffff;
  }
}
</style>
