<template>
  <div class="tipcard zc">
    <p class="tip">检索结果不满意？来试试免费人工核名吧！</p>
    <div class="flex" style="align-items: flex-end">
      <ArtiNameBtn class="btn" />
      <a-button @click="toSearchName" class="borderbtn" style="margin-left: 16px; width: 97px; padding: 0"
        >AI智能取名</a-button
      >
    </div>
    <p class="btmtip">
      不确定商品属于哪个分类？
      <nuxt-link :to="'/classificationquery'" data-sensors-click id="trademarksearchresult_button004">
        <span>智能分类查询</span>
      </nuxt-link>
    </p>
  </div>
</template>
<script>
export default {
  methods: {
    toSearchName() {
      this.$router.push({
        path: "/trademarkname",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tipcard {
  width: 327px;
  height: 340px;
  padding: 20px 24px;
  .tip {
    font-size: 14px;
    font-weight: 400;
    color: #303132;
    margin-top: 40px;
  }
  .btn {
    margin-top: 55px;
  }
  .btmtip {
    background: rgba(255, 255, 255, 0.57);
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid #ffffff;
    padding-left: 15px;
    margin-top: 120px;
    span {
      color: #3370ff;
      cursor: pointer;
    }
  }
}
.zc {
  background: url("@/assets/images/zhengchang.png") no-repeat;
  background-size: 327px 340px;
}
</style>
