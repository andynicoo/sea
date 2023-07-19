<template>
  <!-- 订单状态类型 -->
  <div class="tabs-wrap">
    <a-tabs type="card" @change="changeStatus">
      <a-tab-pane
        v-for="(item, index) in getOrderType"
        :key="index"
        :tab="item.explain + '(' + item.count + ')'"
      >
      </a-tab-pane>
    </a-tabs>

    <div class="export">
      <slot name="export" />
    </div>
  </div>
</template>

<script>
export default {
  // name: 'TabStatus'
  props: {
    orderStatusTypeOpts: {
      type: Array
    },
    power: {
      type: Number,
      default: 1
    }
  },

  computed: {
    getOrderType() {
      if (this.$route.path === '/order/recorded') {
        const onlyType = [0, 2, 5, 6, 7, 8, 10]
        return this.orderStatusTypeOpts.filter((item) => {
          if (onlyType.includes(item.packageStatus)) {
            return item
          }
        })
      } else {
        return this.orderStatusTypeOpts
      }
    }
  },
  data() {
    return {
      vtabIndex: 0
    }
  },

  mounted() {},
  methods: {
    changeStatus(index) {
      let item = this.getOrderType[index]
      this.$emit('changeStatus', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-wrap {
  background: #fff;
  padding: 0 10px;
  position: relative;
  .export {
    position: absolute;
    right: 20px;
    top: 0;
    line-height: 40px;
  }
}
</style>
