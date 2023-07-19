<template>
  <div class="me-pa-2">
    <!-- 首公里面包屑 -->
    <!-- <a-breadcrumb class="me-mb-1" separator=">" v-show="$route.query.source">
      <a-breadcrumb-item>
        <router-link :to="$route.query.source" class="me-link-h">{{
          $route.query.source == '/order/page' ? '全部订单' :  $route.query.source == '/order/page-ready'?'代发货':'未录单'
        }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">首公里预报</a-breadcrumb-item>
    </a-breadcrumb> -->

    <!-- 首公里tabs -->
    <div class="me-pr me-tabs-warp">
      <span class="me-status-error me-cp me-fr me-question" @click="goShopee"
        ><a-icon type="question-circle" class="me-mr-1" />使用说明</span
      >
      <a-tabs :activeKey="tabsModel" size="large" @change="tabsChange">
        <a-tab-pane key="1" tab="生成揽货批次号"></a-tab-pane>
        <a-tab-pane key="2" tab="绑定订单"></a-tab-pane>
        <a-tab-pane key="3" tab="绑定记录"></a-tab-pane>
      </a-tabs>
    </div>
    <a-layout class="me-page-layout">
      <CreateBatchNumber v-if="tabsModel == '1'" />
      <BindOrder v-else-if="tabsModel == '2'" />
      <BindRecord v-else />
    </a-layout>
  </div>
</template>

<script>
import CreateBatchNumber from './components/firstKilometerForecast/CreateBatchNumber'
import BindOrder from './components/firstKilometerForecast/BindOrder'
import BindRecord from './components/firstKilometerForecast/BindRecord'
export default {
  components: {
    CreateBatchNumber,
    BindOrder,
    BindRecord
  },
  data() {
    return {
      tabsModel: '2' //tabs选中值
    }
  },
  created() {
    if (this.$route.query.fmNo) this.$data.tabsModel = '3'
  },
  methods: {
    //切换tabs
    tabsChange(index) {
      this.$data.tabsModel = index
    },
    //跳转Shopee卖家学习中心
    goShopee() {
      this.openPage('https://shopee.cn/edu/article/4461', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.me-bgfff {
  background: #fff;
}
.me-pr {
  position: relative;
}
.me-f12 {
  font-size: 12px;
}
.me-page-layout {
  padding: 0 15px;
  min-height: 600px;
}
.me-link-h {
  color: #999 !important;
  font-size: 12px;
  &:hover {
    color: $linkColor !important;
  }
}
.me-question {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}
.me-tabs-warp {
  background: #fff;
  padding: 0 15px;
}
</style>
