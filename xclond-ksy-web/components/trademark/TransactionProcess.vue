<template>
  <div class="process">
    <h2>商标转让交易流程</h2>
    <p>标准化流程，专业可靠、品质有保障</p>
    <div class="content ksy-w1320 flex">
      <div class="item bg1">
        <img src="~/assets/images/processnext.png" class="next" />
        <h2>挑选心仪商标</h2>
      </div>

      <div class="item bg2">
        <img src="~/assets/images/processnext.png" class="next" />
        <h2>下单并付款</h2>
      </div>

      <div class="item bg3">
        <img src="~/assets/images/processnext.png" class="next" />
        <h2>电商备案</h2>
      </div>

      <div class="item bg4">
        <img src="~/assets/images/processnext.png" class="next" />
        <h2>提交转让材料</h2>
      </div>

      <div class="item bg5">
        <h2>转让成功</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.process {
  height: 544px;
  background: #ffffff;
  padding-top: 80px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
    margin: 0 !important;
  }
  p {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 40px;
    text-align: center;
  }
  .content {
    margin: 0 auto;

    .item {
      height: 281px;
      position: relative;
      width: 100%;
      .next {
        position: absolute;
        right: -17px;
        top: 42%;
      }
      h2 {
        font-size: 14px;
        color: @textColor;
        padding-top: 178px;
      }
    }
    .bg1 {
      background: url("@/assets/images/process1.png") no-repeat;
    }
    .bg2 {
      background: url("@/assets/images/process2.png") no-repeat;
    }
    .bg3 {
      background: url("@/assets/images/process3.png") no-repeat;
    }
    .bg4 {
      background: url("@/assets/images/process4.png") no-repeat;
    }
    .bg5 {
      background: url("@/assets/images/process5.png") no-repeat;
    }
  }
}
</style>
