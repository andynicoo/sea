<template>
  <div>
    <!-- 首公里面包屑 -->
    <a-breadcrumb
      class="me-pl-2 me-pt-2"
      separator=">"
      v-show="$route.query.source"
    >
      <a-breadcrumb-item>
        <router-link :to="$route.query.source" class="me-link-h">{{
          $route.query.source == '/order/page'
            ? '全部订单'
            : $route.query.source == '/order/page-ready'
            ? '代发货'
            : '未录单'
        }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">发货预报</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- 首公里 -->
    <FirstKilometerForecast />
  </div>
</template>

<script>
import FirstKilometerForecast from './FirstKilometerForecast'
export default {
  components: {
    FirstKilometerForecast
  }
}
</script>
