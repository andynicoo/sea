<template>
  <div
    class="tipcard"
    :class="{ lv1: curAdvise.riskScore === 1, lv2: curAdvise.riskScore === 2, lv3: curAdvise.riskScore === 3 }"
  >
    <div class="tit">
      <span>{{ curAdvise.categorySort }} {{ curAdvise.categoryName }}</span>
      <span class="ksy-fr" v-if="curAdvise.riskScore === 1">低风险</span>
      <span class="ksy-fr" v-if="curAdvise.riskScore === 2">中风险</span>
      <span class="ksy-fr" v-if="curAdvise.riskScore === 3">高风险</span>
    </div>
    <p class="tip" v-if="curAdvise.riskScore === 1">恭喜您，该商标名在此分类下是低风险哦，可以积极注册。</p>
    <p class="tip" v-if="curAdvise.riskScore === 2">专家核名更准确，建议申请人工复核。</p>
    <p class="tip" v-if="curAdvise.riskScore === 3">坚持使用可能面临风险，建议咨询商标专家获取深度解决方案。</p>
    <ArtiNameBtn :level="curAdvise.riskScore" class="btn" />
    <p class="btmtip">
      不确定商品属于哪个分类？
      <nuxt-link :to="'/classificationquery'">
        <span>智能分类查询</span>
      </nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    curAdvise: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
.tipcard {
  width: 327px;
  height: 340px;
  padding: 16px;
  .tip {
    font-size: 14px;
    font-weight: 400;
    color: #303132;
    margin-top: 17px;
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
    margin-top: 95px;
    span {
      color: #3370ff;
      cursor: pointer;
    }
  }
}
.lv1 {
  .bg-image-png("lv1");
  .tit {
    font-size: 14px;
    font-weight: 400;
    color: #00a870;
    line-height: 22px;
    border-bottom: 2px solid #00a870;
    padding-bottom: 12px;
  }
}
.lv2 {
  .bg-image-png("lv2");
  .tit {
    font-size: 14px;
    font-weight: 400;
    color: #ffac0a;
    line-height: 22px;
    border-bottom: 2px solid #ffac0a;
    padding-bottom: 12px;
  }
}
.lv3 {
  .bg-image-png("lv3");
  .tit {
    font-size: 14px;
    font-weight: 400;
    color: #e34d59;
    line-height: 22px;
    border-bottom: 2px solid #e34d59;
    padding-bottom: 12px;
  }
}
</style>
