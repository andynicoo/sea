<template>
  <div class="tips-tag flex flex-c-c" :style="tipsStyle">{{ msg }}</div>
</template>
<script>
export default {
  name: 'TipsTag',
  props: {
    msg: String,
    tipsStyle: Object
  }
}
</script>
<style lang="less" scoped>
.tips-tag {
  display: inline-flex;
  position: relative;
  font-size: 14px;
  color: #FFFFFF;
  height: 24px;
  padding: 0 8px;
  margin-left: 10px;
  background: #E94E49;
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: inherit;
    top: 48%;
    left: -8px;
    transform: rotate(45deg) translateY(-50%);
  }
}
</style>
