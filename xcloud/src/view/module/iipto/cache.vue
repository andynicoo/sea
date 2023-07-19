<template>
  <div>
    <Button @click="refreshCountry">刷新国家配置信息缓存</Button>
    <Button @click="refreshProduct">刷新产品信息缓存</Button>
    <Button @click="refreshCategroy">刷新类目信息缓存</Button>
  </div>
</template>
<script>
import * as API from '@/api/cache';
export default {
  methods: {
    refreshCountry() {
      API.countryApi().then(res => { })
    },
    refreshProduct() {
      API.productApi().then(res => { })
    },
    refreshCategroy() {
      API.updateTrademarkCategoryCacheApi().then(res => { })
    }
  },
}
</script>
