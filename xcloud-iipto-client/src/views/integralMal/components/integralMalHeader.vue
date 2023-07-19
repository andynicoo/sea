<template>
  <div class="integral-mal-header" :class="{ wghd : PROCESS_ENV.NODE_PLA==='wg'}">
    总积分<b>{{ info.integral }}</b>
    <div class="bar">
      <span @click="handleModalShow('details')">积分明细</span>
      <span @click="handleModalShow('rules')">积分规则</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IntegralMalHeader',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handleModalShow(type) {
      this.$emit('modalShow', type);
    },
  },
};
</script>
<style scoped lang="less">
.wghd {
  background: url("../images/bgwg.png") no-repeat center/auto 100% !important;
}
.integral-mal-header {
  height: 90px;
  display: flex;
  align-items: center;
  padding-left: 24px;
  padding-top: 14px;
  font-size: 14px;
  color: #ffffff;
  line-height: 22px;
  margin-bottom: 20px;
  background: url('../images/bg.svg') no-repeat center/auto 100%;
  &:after {
    content: '';
    width: 442px;
    height: 90px;
    position: absolute;
    background: url('../images/chahua.svg') no-repeat center/100% auto;
    top: 0;
    right: 40px;
  }
  b {
    font-size: 40px;
    font-weight: 600;
    margin: 0 32px 18px 8px;
  }
  .bar {
    display: flex;
    span {
      display: block;
      cursor: pointer;
      width: 88px;
      height: 22px;
      line-height: 22px;
      -webkit-background-clip: text;
      text-align: center;
      background: rgba(#fff, 0.1);
      border-radius: 14px;
      margin-right: 12px;
    }
  }
}
</style>
