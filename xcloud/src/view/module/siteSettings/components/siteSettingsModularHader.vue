<!--  -->
<template>
  <div class="site-harder">
    <div class="left">
      <slot name="left"> </slot>
    </div>
    <div class="right">
      <slot name="right"> </slot>
      <!-- <el-button type="primary" @click="addService">新增服务</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SiteSettingsModularHader",
};
</script>
<style lang='scss' scoped>
.site-harder {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  height: 100%;
  padding-bottom: 15px;
  > .left {
    font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
    font-weight: 650;
    font-style: normal;
    font-size: 16px;
    height: 100%;
    align-self: center;
    display: flex;
    align-items: center;
  }
  > .right {
    place-self: stretch end;
  }
}
</style>