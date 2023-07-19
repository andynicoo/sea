<template>
  <div>
    <template v-if="dataSource.length">
      <div class="me-coupon-list">
        <Coupon
          v-for="item in dataSource"
          :coupon="item"
          :type="type"
          :key="item.mgCouponGiveRecordId"
          @reload="reLoadData"
        />
      </div>
      <div class="me-fr">
        <a-pagination
          :current="paginationData.current"
          :total="paginationData.total"
          @change="onChange"
        />
      </div>
    </template>
    <template v-else>
      <a-empty />
    </template>
  </div>
</template>

<script>
import Member from '@/api/member'
import Coupon from './Coupon'
import tableMixins from '@/mixins/tableMixins'
export default {
  components: {
    Coupon
  },
  mixins: [tableMixins],
  props: {
    type: String
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const data = { size, current }
      switch (this.$props.type) {
        case 'unused':
          return Member.getMemberCouponUnusedPage(data)
        case 'used':
          return Member.getMemberCouponUsedPage(data)
        case 'expired':
          return Member.getMemberCouponExpiredPage(data)
        default:
          break
      }
    },
    onChange(current, pageSize) {
      this.changePage({
        pageSize,
        current
      })
    }
  }
}
</script>

<style lang="less" scoped>
.me-coupon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 392px);
}
</style>
