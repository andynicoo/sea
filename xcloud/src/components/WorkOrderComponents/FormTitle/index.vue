<template>
  <div class="titleStyle">
    <div class="talkbubble">{{ value }}</div>
    <div class="triangle"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String }
  }
};
</script>

<style lang="scss" scoped>
.titleStyle {
  display: inline-flex;
  font-size: 14px;
  .talkbubble {
    height: 30px;
    background-color: #EAEAEA;
    padding: 0 15px;
    line-height: 30px;
  }
  .triangle {
    width: 15px;
    border: 15px solid transparent;
    border-left: 10px solid #EAEAEA;
  }
}
</style>
