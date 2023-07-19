<template>
  <a-modal
    :visible="value"
    @cancel="$emit('input', false)"
    @ok="ok"
    dialogClass="logistics-modal"
    :afterClose="afterClose"
  >
    <div class="title">
      {{ $t('order.logisticsInfo') }}:{{ data.trackingNo }}
    </div>
    <div class="list">
      <div
        class="list-item"
        v-for="(item, index) in logisticsList"
        :key="index"
      >
        <div class="list-item-title">{{ item.ctime }}</div>
        <div class="list-item-subtitle">{{ item.description }}</div>
        <div class="list-item-subtitle">{{ item.translation }}</div>
      </div>
      <a-spin v-if="loading" class="spin" />
    </div>
  </a-modal>
</template>

<script>
import Order from '@/api/order'
export default {
  name: 'OrderLogisticsModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.getOrderShopeeLogisticsMessage()
      }
    }
  },
  data() {
    return {
      logisticsList: [],
      loading: false
    }
  },
  methods: {
    async getOrderShopeeLogisticsMessage() {
      this.loading = true
      try {
        const { data } = await Order.getOrderShopeeLogisticsMessage({
          ordersn: this.data.ordersn,
          packageNumber: this.data.packageNumber
        })
        this.logisticsList = data ?? []
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    afterClose() {
      this.$emit('update:data', {})
      this.logisticsList = []
    },
    ok() {}
  }
}
</script>

<style lang="less" scoped>
.logistics-modal {
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .list {
    height: 300px;
    overflow: auto;
    position: relative;
  }
  .list-item-title {
    font-size: 14px;
  }
  .list-item-subtitle {
    font-size: 12px;
    padding-left: 12px;
    color: rgba(0, 0, 0, 0.38);
  }
  .spin {
    position: absolute;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
