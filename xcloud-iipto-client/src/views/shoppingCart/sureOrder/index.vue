<template>
  <div class="mainContent" :style="{ 'margin-bottom': marginBottom ? marginBottom : '0' }">
    <div class="breadcrumb">
      <span v-if="pageFrom === 'pro'">
        <a href="/productservice" class="atext"> 产品服务 </a><img src="@/assets/images/common/toright.svg" class=""
      /></span>
      <span v-else
        ><a href="/" class="atext"> 首页 </a><img src="@/assets/images/common/torighthover.svg" class=""
      /></span>
      <span
        ><a href="javascript:history.go(-1)" class="atext"> 购买详情</a
        ><img src="@/assets/images/common/torighthover.svg" class=""
      /></span>
      <span class="cur">确认订单</span>
    </div>
    <SureOrder @height-change="calculateMarginBottom" />
  </div>
</template>

<script>
import '@/assets/style/common.less';
import SureOrder from './../../../../xcloud-client-components-web/sureOrder';
export default {
  data() {
    return {
      pageFrom: this.$route.query.pageFrom || 'index',
      marginBottom: null,
    };
  },
  components: {
    SureOrder,
  },
  created() {},
  methods: {
    calculateMarginBottom(e) {
      const mb = window.innerHeight - (e + 220);
      this.marginBottom = mb > 0 ? mb + 'px' : 0;
    },
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 1200px;
  vertical-align: top;
  background-color: #f7f8fa;
}
.breadcrumb {
  height: 30px;
  line-height: 30px;
  color: #00000090;
  margin-bottom: 10px;
  font-size: 16px;
  .cur {
    color: #00a3ff;
  }
}
</style>
