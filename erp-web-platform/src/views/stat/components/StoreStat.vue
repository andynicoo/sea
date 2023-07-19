<template>
  <div class="me-data-card">
    <h2 class="me-card-title">
      <b class="me-f5" @click="getNewData"
        >刷新<a-icon :class="{ 'me-loading': isLoading }" type="redo"/></b
      >数据统计
      <!-- <span>近7天数据统计</span> -->
    </h2>
    <ul class="me-data-board">
      <li>
        客户数
        <b>
          {{ storeStat.customerCount }}
        </b>
      </li>
      <li>
        商品浏览量
        <b>
          {{ storeStat.productViewCount }}
        </b>
      </li>
      <li>
        未付款订单
        <b>{{ storeStat.unPayOrderCount }}</b>
      </li>
      <li>
        待发货订单
        <b>{{ storeStat.readyToShipOrderCount }}</b>
      </li>
      <li>
        订单总额
        <b>{{ storeStat.orderTotalAmount }}</b>
      </li>
      <li>
        客单价
        <b>{{
          storeStat.customerCount !== 0
            ? (storeStat.orderTotalAmount / storeStat.customerCount).toFixed(2)
            : '-'
        }}</b>
      </li>
    </ul>
  </div>
</template>

<script>
import Stat from '@/api/stat'
export default {
  props: {
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      storeStat: {
        customerCount: 0
      },
      isLoading: false
    }
  },
  mounted() {
    this.$emit('siteChange')
    // 获取店铺统计数据
    // this.getStoreStatData()
  },
  methods: {
    //刷新数据
    getNewData() {
      this.isLoading = true
      Stat.getNewStoreStat()
        .then((res) => {
          console.log(res)
          this.getStoreStatData()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    async getStoreStatData() {
      let params = this.searchParams
      await Stat.getStoreStat(params).then((res) => {
        this.$data.storeStat = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/stat.scss';
</style>
