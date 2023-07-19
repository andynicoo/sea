<template>
  <a-space direction="vertical" style="width: 100%" :size="16">
    <a-card size="small" :bordered="false">
      <a-form-model :model="form" layout="inline">
        <a-form-model-item label="名称" prop="couponName">
          <a-input v-model="form.couponName" placeholder="优惠券名称" />
        </a-form-model-item>
        <a-form-model-item label="用户" prop="maAccount">
          <a-input v-model="form.maAccount" placeholder="用户手机号" />
        </a-form-model-item>
        <a-form-model-item label="类型" prop="couponType">
          <a-select
            allowClear
            v-model="form.couponType"
            style="width: 180px"
            placeholder="请选择"
          >
            <a-select-option :value="1"> 会员体验券 </a-select-option>
            <a-select-option :value="2"> 旺币券 </a-select-option>
            <a-select-option :value="3"> 满减券 </a-select-option>
            <a-select-option :value="4"> 折扣券 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="giveStatus">
          <a-select
            allowClear
            v-model="form.giveStatus"
            style="width: 180px"
            placeholder="请选择"
          >
            <a-select-option :value="1"> 成功 </a-select-option>
            <a-select-option :value="2"> 失败 </a-select-option>
            <a-select-option :value="3"> 补发 </a-select-option>
            <a-select-option :value="4"> 回收 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="发送时间" prop="sendTime">
          <a-range-picker allowClear v-model="form.sendTime" showTime />
        </a-form-model-item>
        <a-form-model-item label="使用时间" prop="usedTime">
          <a-range-picker allowClear v-model="form.usedTime" showTime />
        </a-form-model-item>
        <a-form-model-item label="发放方式" prop="giveMode">
          <a-select
            allowClear
            v-model="form.giveMode"
            style="width: 180px"
            placeholder="请选择"
          >
            <a-select-option :value="1"> 赠送 </a-select-option>
            <a-select-option :value="2"> 兑换 </a-select-option>
            <a-select-option :value="3"> 领取 </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-space>
            <a-button type="primary" @click="reLoadData">查询</a-button>
            <a-button @click="resetLoadData">重置</a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card size="small" :bordered="false">
      <a-space direction="vertical" style="width: 100%" :size="16">
        <a-row type="flex">
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click="onGrant(selectedRowKeys)">
                批量补发
              </a-button>
              <a-button type="primary" @click="onBack(selectedRowKeys)">
                批量回收
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="12" style="text-align: right">
            <a-button type="primary" @click="onExportHistory">
              导出发放记录
            </a-button>
          </a-col>
        </a-row>

        <a-table
          class="custom-table-style"
          rowKey="mgCouponGiveRecordId"
          :columns="columns"
          :data-source="pageResult.records"
          :pagination="{
            current: pageResult.current,
            total: pageResult.total,
            pageSize: pageResult.size
          }"
          @change="onPageChange"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps
          }"
        >
          <template slot="content" slot-scope="text, record">
            <template v-if="record.couponType === 1">
              {{ getMeals(record.fieid1).name }} 免 {{ record.fieid2 }}
            </template>
            <template v-if="record.couponType === 2">
              送 {{ record.fieid1 }} 元
            </template>
            <template v-if="record.couponType === 3">
              满 {{ record.fieid1 }} 减 {{ record.fieid2 }}
            </template>
            <template v-if="record.couponType === 4">
              满 {{ record.fieid1 }} 元 {{ Number(record.fieid2) * 10 }}折
            </template>
          </template>
          <template slot="couponType" slot-scope="text">
            <template v-if="text === 1"> 会员体验券 </template>
            <template v-if="text === 2"> 旺币券 </template>
            <template v-if="text === 3"> 满减券 </template>
            <template v-if="text === 4"> 折扣券 </template>
          </template>
          <template slot="giveStatus" slot-scope="text">
            <template v-if="text === 1"> 成功 </template>
            <template v-if="text === 2"> 失败 </template>
            <template v-if="text === 3"> 补发 </template>
            <template v-if="text === 4"> 已回收 </template>
          </template>
          <template slot="giveMode" slot-scope="text">
            <template v-if="text === 1"> 赠送 </template>
            <template v-if="text === 2"> 兑换 </template>
            <template v-if="text === 3"> 领取 </template>
          </template>
          <template slot="actions" slot-scope="text, record">
            <template v-if="record.giveStatus === 2">
              <span
                class="action-button"
                @click="onGrant([record.mgCouponGiveRecordId])"
              >
                补发
              </span>
            </template>
            <template v-else-if="record.giveStatus === 1">
              <span
                class="action-button"
                @click="onBack([record.mgCouponGiveRecordId])"
              >
                回收
              </span>
            </template>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-space>
</template>

<script>
import {
  mgCouponGiveRecordPage,
  mgCouponGiveRecordGrant,
  mgCouponGiveRecordExportGiveCouponRecord,
  mgCouponGiveRecordRecovery
} from '@/api/coupon'
import { getMarketSelect } from '@/api/usermanage'
import moment from 'moment'
import { download } from '@/utils'

const fmt = 'YYYY-MM-DD HH:mm:ss'

const columns = [
  { title: '用户手机号', key: 'maAccount', dataIndex: 'maAccount' },
  { title: '优惠券名称', key: 'couponName', dataIndex: 'couponName' },
  {
    title: '内容',
    key: 'content',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '类型',
    key: 'couponType',
    dataIndex: 'couponType',
    scopedSlots: { customRender: 'couponType' }
  },
  { title: '发送时间', key: 'operationTime', dataIndex: 'operationTime' },
  {
    title: '状态',
    key: 'giveStatus',
    dataIndex: 'giveStatus',
    scopedSlots: { customRender: 'giveStatus' }
  },
  {
    title: '发放方式',
    key: 'giveMode',
    dataIndex: 'giveMode',
    scopedSlots: { customRender: 'giveMode' }
  },
  { title: '备注', key: 'remark', dataIndex: 'remark' },
  { title: '补发/收回时间', key: 'reissueTime', dataIndex: 'reissueTime' },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    scopedSlots: { customRender: 'actions' }
  }
]
export default {
  data() {
    return {
      form: {},
      pageParams: {
        current: 1,
        size: 10
      },
      pageResult: {
        current: 0,
        size: 0,
        total: 0,
        records: []
      },
      columns,
      meals: [],
      selectedRowKeys: [],
      selectedRow: []
    }
  },
  mounted() {
    this.loadData()

    getMarketSelect().then((res) => {
      this.meals = res.data
    })
  },
  methods: {
    onSelectChange(keys, row) {
      this.selectedRowKeys = keys
      this.selectedRow = row
    },
    getCheckboxProps({ giveStatus }) {
      return { props: { disabled: giveStatus === 3 || giveStatus === 4 } }
    },
    // 加载数据
    loadData() {
      const { sendTime, usedTime, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(sendTime)) {
        const [startTime, endTime] = sendTime
        data.sendStartTime = moment(startTime).format(fmt)
        data.sendEndTime = moment(endTime).format(fmt)
      }
      if (Array.isArray(usedTime)) {
        const [startTime, endTime] = usedTime
        data.useStartTime = moment(startTime).format(fmt)
        data.useEndTime = moment(endTime).format(fmt)
      }
      mgCouponGiveRecordPage(data)
        .then((res) => {
          this.pageResult = res.data
        })
        .finally(() => {
          this.selectedRowKeys = []
        })
    },
    // 从第一页加载
    reLoadData() {
      this.pageParams.current = 1
      this.$nextTick(this.loadData)
    },
    // 重置搜索
    resetLoadData() {
      this.form = {}
      this.reLoadData()
    },
    // 分页改变
    onPageChange({ current, size }) {
      this.pageParams.current = current
      this.pageParams.size = size
      this.$nextTick(this.loadData)
    },
    getMeals(type) {
      const meal = this.meals.find(({ id }) => id === type)
      return meal || {}
    },
    /** 补发 */
    onGrant(ids) {
      if (!ids.length) return this.$message.error('请勾选发送记录')
      this.$confirm({
        title: '提示',
        content: '确定要补发吗',
        onOk: () => {
          mgCouponGiveRecordGrant({
            mgCouponGiveRecordIds: ids
          }).then((res) => {
            if (res.data) this.$message.success('补发成功')
            else this.$message.error('补发失败')
            this.loadData()
          })
        }
      })
    },
    /** 回收 */
    onBack(ids) {
      if (!ids.length) return this.$message.error('请勾选发送记录')
      this.$confirm({
        title: '提示',
        content: '确定要回收吗',
        onOk: () => {
          mgCouponGiveRecordRecovery({
            mgCouponGiveRecordIds: ids
          }).then(() => {
            this.$message.success('回收成功')
          })
        }
      })
    },
    /** 导出发放记录 */
    onExportHistory() {
      const { sendTime, usedTime, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(sendTime)) {
        const [startTime, endTime] = sendTime
        data.sendStartTime = moment(startTime).format(fmt)
        data.sendEndTime = moment(endTime).format(fmt)
      }
      if (Array.isArray(usedTime)) {
        const [startTime, endTime] = usedTime
        data.useStartTime = moment(startTime).format(fmt)
        data.useEndTime = moment(endTime).format(fmt)
      }
      mgCouponGiveRecordExportGiveCouponRecord(data).then((res) => {
        download(res, '发放记录')
        this.$message.success('导出发放记录成功')
      })
    }
  }
}
</script>

<style lang="less">
.custom-table-style {
  .ant-table-selection-column {
    .ant-checkbox-wrapper-disabled {
      display: none;
    }
  }
}
</style>
