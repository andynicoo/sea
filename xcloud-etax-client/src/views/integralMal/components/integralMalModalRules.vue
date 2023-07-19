<template>
  <Modal class="wrap" v-model="view" :footer-hide="true" @on-cancel="handleClose">
    <div class="wrap-head" slot="header">{{ rules.title }}</div>
    <div class="wrap-close" slot="close"></div>
    <div class="wrap-body" v-html="rules.content"></div>
  </Modal>
</template>
<script>
export default {
  name: 'IntegralMalModalRules',
  inject: ['dialogWidth'],
  props: {
    rules: {
      type: Object,
      default: ()=> {}
    }
  },
  data() {
    return {
      view: false
    }
  },
  methods: {
    show() {
      this.view = true
    },
    handleClose() {
      this.view = false
    }
  }
}
</script>
<style lang="less" scoped>
@import "../common.less";
.wrap {
  &-head {
    height: 58px;
    line-height: 58px;
    padding-left: 24px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    background: url("../images/bg-dialog-2.png") no-repeat center/cover;
  }
  &-close {
    width: 16px;
    height: 16px;
    background: url("../images/icon-close.png") no-repeat center/cover;
  }
  &-body {
    padding: 24px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0,0,0,0.6);
    line-height: 20px;
    &-item:not(:last-child) {
      margin-bottom: 16px;
    }
    h4 {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0,0,0,0.9);
      line-height: 22px;
      margin-bottom: 8px;
    }
  }
}
</style>
