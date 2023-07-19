<template>
  <div class="overflow-y">
    <template v-if="logisticsMessage">
      <template v-if="logisticsMessage.length">
        <a-timeline>
          <a-timeline-item
            v-for="(item, index) in logisticsMessage"
            :key="index"
          >
            <p>
              {{ item.description }}
            </p>
            <p>
              {{ item.translation }}
            </p>
            <p>{{ item.ctime }}</p>
          </a-timeline-item>
        </a-timeline>
      </template>

      <template v-else>
        <div class="empty-data"></div>
      </template>
    </template>
    <template v-else>
      <p class="text-center me-pa-5">
        {{ $t('common.loading') }}
      </p>
    </template>
  </div>
</template>

<script>
import Order from '@/api/order'
export default {
  props: {
    current: Object
  },
  data() {
    return {
      logisticsMessage: null,
      loading: false
    }
  },
  async mounted() {
    /* this.$props.current.ordersn */
    this.$data.loading = true
    const res = await Order.getOrderShopeeLogisticsMessage({
      ordersn: this.$props.current.ordersn
    })
    this.$data.loading = false
    this.$data.logisticsMessage = res.data
  }
}
</script>

<style lang="scss">
.order-logistics-message {
  .desc {
    padding-left: 20px;
  }
}
</style>
