<template>
  <div class="tittleStyle" :id="value">
    <div class="subTitle"><b></b>{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String },
  },
};
</script>

<style lang="less" scoped>
.tittleStyle {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  height: 55px;
  // background: rgba(24, 144, 255, 0.19);
  line-height: 55px;
  // padding-left: 32px;
  border-radius: 4px 4px 0px 0px;
}
// .subTitle {
//   b {
//     display: inline-block;
//     width: 2px;
//     height: 15px;
//     background: #3a7fff;
//     margin-right: 10px;
//     position: relative;
//     top: 2px;
//   }
// }
</style>
