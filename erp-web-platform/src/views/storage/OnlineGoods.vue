<template>
  <div class="me-pa-2">
    <div class="me-card me-pa-4">
      <a-tabs type="card">
        <a-tab-pane key="3" tab="在线商品匹配">
          <OnlineSku />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import OnlineSku from './components/onlineGoods/OnlineSku.vue'

export default {
  components: {
    OnlineSku
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
