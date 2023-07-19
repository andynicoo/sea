<template>
  <div>
    <a-space direction="vertical" style="width: 100%" :size="20">
      <a-row :gutter="16">
        <a-col :span="4"> 总发放：{{ pageDetails.all }}张</a-col>
        <a-col :span="4"> 已使用：{{ pageDetails.used }}张</a-col>
        <a-col :span="4"> 未使用：{{ pageDetails.unused }}张</a-col>
        <a-col :span="4"> 已过期：{{ pageDetails.expired }}张</a-col>
        <a-col :span="4"> 已回收：{{ pageDetails.recovery }}张</a-col>
      </a-row>

      <a-form-model layout="inline" :model="form">
        <a-form-model-item label="手机号" prop="maAccount">
          <a-input v-model="form.maAccount" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="useStatus">
          <a-select allowClear v-model="form.useStatus" style="width: 200px">
            <a-select-option value="UNUSED">未使用</a-select-option>
            <a-select-option value="USED">已使用</a-select-option>
            <a-select-option value="EXPIRED">已过期</a-select-option>
            <a-select-option value="RECOVERY">已回收</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-space>
            <a-button type="primary" @click="reLoadData">查询</a-button>
            <!-- <a-button type="primary">导出筛选数据</a-button> -->
          </a-space>
        </a-form-model-item>
      </a-form-model>

      <a-table
        rowKey="mgCouponGiveRecordId"
        :pagination="{
          current: pageResult.current,
          total: pageResult.total,
          pageSize: pageResult.size
        }"
        @change="onPageChange"
        :columns="columns"
        :data-source="pageResult.records"
      >
        <template slot="useStatus" slot-scope="text">
          <template v-if="text === 'UNUSED'">未使用</template>
          <template v-if="text === 'USED'">已使用</template>
          <template v-if="text === 'EXPIRED'">已过期</template>
          <template v-if="text === 'RECOVERY'">已回收</template>
        </template>
      </a-table>
    </a-space>
  </div>
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
    dataIndex: 'useStatus',
    key: 'useStatus',
    title: '状态',
    scopedSlots: { customRender: 'useStatus' }
  },
  {
    dataIndex: 'operationTime',
    key: 'operationTime',
    title: '发放时间'
  },
  {
    dataIndex: 'useTime',
    key: 'useTime',
    title: '使用时间'
  },
  {
    dataIndex: 'expiredTime',
    key: 'expiredTime',
    title: '过期时间'
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
