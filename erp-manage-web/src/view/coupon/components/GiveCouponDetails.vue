<template>
  <a-table
    rowKey="maAccount"
    :pagination="{
      current: pageResult.current,
      total: pageResult.total,
      pageSize: pageResult.size
    }"
    @change="onPageChange"
    :columns="columns"
    :data-source="pageResult.records"
  >
    <template slot="giveStatus" slot-scope="text">
      <template v-if="text === 1"> 系统发送 </template>
      <template v-if="text === 2"> 发送失败 </template>
      <template v-if="text === 3"> 系统补发 </template>
    </template>
  </a-table>
</template>

<script>
import { mgCouponDetailList, mgCouponDetail } from '@/api/coupon'

const columns = [
  {
    dataIndex: 'maAccount',
    key: 'maAccount',
    title: '手机号'
  },
  {
    dataIndex: 'giveStatus',
    key: 'giveStatus',
    title: '状态',
    scopedSlots: { customRender: 'giveStatus' }
  },
  {
    dataIndex: 'operationTime',
    key: 'operationTime',
    title: '操作时间'
  },
  {
    dataIndex: 'remark',
    key: 'remark',
    title: '备注'
  }
]
export default {
  props: {
    giveId: {
      type: String,
      default: undefined
    },
    couponId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      form: {},
      pageParams: {
        current: 1,
        size: 10
      },
      pageResult: {
        current: 0,
        total: 0,
        size: 0,
        records: []
      },
      pageDetails: {},
      columns
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      const subData = {
        mgCouponGiveId: this.$props.giveId,
        mgCouponId: this.$props.couponId
      }
      const data = {
        ...this.form,
        ...this.pageParams,
        ...subData
      }
      mgCouponDetailList(data).then((res) => {
        this.pageResult = res.data
      })

      mgCouponDetail(subData).then((res) => {
        this.pageDetails = res.data
      })
    },
    reLoadData() {
      this.pageParams.current = 1
      this.$nextTick(this.loadData)
    },
    // 重置搜索
    resetLoadData() {
      this.form = {}
      this.reLoadData()
    },
    // 分页
    onPageChange({ current, size }) {
      this.pageParams.current = current
      this.pageParams.size = size
      this.$nextTick(this.loadData)
    }
  }
}
</script>

<style>
</style>
