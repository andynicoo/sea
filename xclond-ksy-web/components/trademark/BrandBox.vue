<template>
  <div class="box ksy-pr">
    <img :src="`/images/get${item.index}.png`" alt="客户经理" />
    <h2>
      {{ item.title }}
    </h2>
    <p>
      {{ item.desc }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: Object,
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 282px;
  height: 142px;
  background: #ffffff;
  box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
    0px 4px 6px -3px rgba(0, 0, 0, 0.02);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  text-align: center;
  padding-top: 55px;
  img {
    width: 110px;
    position: absolute;
    top: -52px;
    left: 85px;
  }
  h2 {
    margin-bottom: 0px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: @textColor;
  }
}
</style>
