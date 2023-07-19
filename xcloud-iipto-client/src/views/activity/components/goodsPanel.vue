<template>
  <div class="goods-panel box-bg">
    <div class="box-bg-head">
      <div class="box-bg-head-title">{{ title }}</div>
    </div>
    <div class="box-bg-content">
      <slot></slot>
    </div>
    <div class="box-bg-footer"></div>
  </div>
</template>
<script>
export default {
  name: 'goodsPanel',
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="less" scoped>
@import '../font/font.less';
.box-bg {
  &:not(:last-child) {
    margin-bottom: 112px;
  }
  &-head {
    height: 65px;
    width: 100%;
    position: relative;
    background: url('../images/box-bg-1.png') no-repeat 0 center/1000px 100%;
    &-title {
      position: absolute;
      width: 460px;
      height: 74px;
      line-height: 74px;
      text-align: center;
      font-family: 'boxTitle';
      font-size: 42px;
      color: #fff;
      letter-spacing: 3px;
      text-shadow: 0px 4px 3px #db1b01;
      left: 50%;
      bottom: 34px;
      transform: translateX(-50%);
      background: url('../images/box-bg-title.png') no-repeat center/100% auto;
    }
  }
  &-content {
    padding: 0 20px;
    background: url('../images/box-bg-2.png') repeat-y 0 center/1001px auto;
  }
  &-footer {
    height: 30px;
    background: url('../images/box-bg-3.png') no-repeat 0 bottom/1000px 100%;
  }
}
.new {
  .box-bg-head-title {
    background: url(../images/new/bg-title.png) no-repeat left center / 100% auto;
    text-shadow: 0px 4px 3px #00319b;
  }
  .box-bg-head {
    background: url(../images/new/1.png) no-repeat 0 center / 1000px 100%;
  }
  .box-bg-content {
    padding: 0 20px;
    background: url(../images/new/2.png) repeat-y 0 center / 1000px auto;
  }
  .box-bg-footer {
    height: 30px;
    background: url(../images/new/3.png) no-repeat 0 bottom / 1000px 100%;
  }
}
</style>
