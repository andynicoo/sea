<template>
  <div
    ref="container"
    class="wrapper"
  >
    <div
      ref="filters"
      class="filters"
    >
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @submit="handleSearch"
        @reset="reset"
      />
    </div>
    <div
      ref="export"
      class="export"
    >
      <a-button
        v-permission:user_all="['export']"
        size="small"
        type="primary"
        @click="exportRecordFile"
      >
        导出数据
      </a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #buzType="text,record">
        <span v-if="record.buzType == 0">充值</span>
        <span v-if="record.buzType == 1">代发货</span>
        <span v-if="record.buzType == 2">任务</span>
        <span v-if="record.buzType == 3">赠送</span>
        <span v-if="record.buzType == 4">提现</span>
        <span v-if="record.buzType == 5">预付提现</span>
        <span v-if="record.buzType == 6">活动运营</span>
        <span v-if="record.buzType == 7">系统对账</span>
        <span v-if="record.buzType == 8">系统退款</span>
        <span v-if="record.buzType == 9">货代退货</span>
        <span v-if="record.buzType == 10">订单-乐聊套餐</span>
        <span v-if="record.buzType == 11">订单-马六甲套餐</span>
        <span v-if="record.buzType == 12">退仓出货</span>
        <span v-if="record.buzType == 13">自动仓储扣费</span>
        <span v-if="record.buzType == 14">充值退款</span>
      </template>
      <template #status="text,record">
        <span
          :style="{ color: record.chargeStatus === -1 ? 'red' : 'green' }"
          class="buz-red"
        >
          {{ text }}
        </span>
      </template>
      <template #buzAmount="text,record">
        <span
          :style="{ color: record.chargeStatus === -1 ? 'red' : 'green' }"
          class="buz-red"
        >
          {{ text | formatbuzAmount(record) }}
        </span>
      </template>
    </a-table>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import { getCashRecord, exportFinanceRecord } from '@/api/cashmange'
import { download, debounce, setTableHeight } from '@/utils'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  account: '',
  registeredStartTime: undefined,
  sorting: '',
  bindingTime: undefined
}
export default {
  components: {
    TableFilter
  },
  filters: {
    formatbuzAmount(val, record) {
      if (record.chargeStatus === -1) {
        return `-${val}`
      }
      return val
    }
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      tableHeight: 400,
      params: {},
      paginationParams: {
        ...initPagination
      },
      visible: false,
      detailVisible: false,
      data: [],
      formModel: {},
      title: '',
      currentObj: {}
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号',
          itemType: 'input',
          key: 'params',
          placeholder: '请输入账号',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '状态',
          itemType: 'select',
          key: 'chargeStatus',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '入账',
              value: 1
            },
            {
              label: '出账',
              value: -1
            }
          ]
        },
        {
          label: '业务类型',
          itemType: 'select',
          key: 'buzType',
          itemData: [
            {
              label: '充值',
              value: 0
            },
            {
              label: '代发货',
              value: 1
            },
            {
              label: '任务',
              value: 2
            },
            {
              label: '赠送',
              value: 3
            },
            {
              label: '提现',
              value: 4
            },
            {
              label: '预付提现',
              value: 5
            },
            {
              label: '活动运营',
              value: 6
            },
            {
              label: '系统对账',
              value: 7
            },
            {
              label: '系统退款',
              value: 8
            },
            {
              label: '货代退货',
              value: 9
            },
            {
              label: '乐聊套餐',
              value: 10
            },
            {
              label: '马六甲套餐',
              value: 11
            },
            {
              label: '退仓出货',
              value: 12
            },
            {
              label: '自动仓储扣费',
              value: 13
            },
            {
              label: '充值退款',
              value: 14
            }
          ]
        },
        {
          label: '交易时间段',
          itemType: 'rangePicker',
          key: 'transactionTime',
          itemProp: {
            disabledDate(current) {
              return current && current > moment().endOf('day')
            }
          }
        }
      ]
    },
    columns() {
      return [
        {
          title: '卖家账号',
          dataIndex: 'memberAccount'
        },
        {
          title: '会员ID',
          dataIndex: 'memberInfoNo'
        },
        {
          title: '交易旺币',
          dataIndex: 'buzAmount',
          scopedSlots: { customRender: 'buzAmount' }
        },
        {
          title: '剩余旺币',
          dataIndex: 'memberCurrentBal'
        },
        {
          title: '类型',
          dataIndex: 'buzType',
          scopedSlots: { customRender: 'buzType' }
        },
        {
          title: '状态',
          dataIndex: 'chargeStatusDisplay',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '交易时间',
          dataIndex: 'recordTime'
        },
        {
          title: '关联单号（针对充值）',
          dataIndex: 'buzNo',
          width: '300px'
        },
        {
          title: '备注',
          dataIndex: 'buzDsp'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    async exportRecordFile() {
      const params = Object.assign(
        {},
        {
          ...this.formModel,
          ...this.getStartOrEndTime()
        }
      )
      if (!params.endTime || !params.startTime) {
        this.$message.error('请选择交易时间段')
        return false
      }
      try {
        params.size = 100000
        const result = await exportFinanceRecord(params)
        download(result, '导出旺币记录')
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    async setTableHeight(e) {
      setTableHeight(this)
    },
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return time
      }
    },
    getStartOrEndTime() {
      const [startTime, endTime] = this.formModel.transactionTime || []
      return {
        transactionTime: undefined,
        startTime: this.formattime(startTime),
        endTime: this.formattime(endTime)
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params,
        this.getStartOrEndTime() // 时间的一些参数
      )
      try {
        const { data } = await getCashRecord(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    onChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      this.paginationParams = { current, size }
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      this.getList()
    },
    onSelectChange(selected) {
      this.selectedRowKeys = selected
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleLook(record) {
      this.detailVisible = true
      this.currentObj = record
      setTimeout(() => {
        this.$refs.detail.getList()
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
}
.export {
  display: flex;
  padding-top: 22px;
  padding-bottom: 16px;
}
</style>
