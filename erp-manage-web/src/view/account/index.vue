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
      >
        <template #orderStatus>
          <div class="button-group">
            <a-button
              v-for="item in btnList"
              :key="item.value"
              :type="orderStatus === item.value ? 'primary' : ''"
              @click="handleClick(item)"
            >{{ item.label }}</a-button>
          </div>
        </template>
      </TableFilter>
    </div>
    <div
      ref="export"
      class="export"
    >
      <a-button
        size="small"
        type="primary"
        @click="exportData()"
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
      <template #forwarderInfo="text,record">
        <p style="margin:0">{{ record.forwarderName }}</p>
        <p>{{ record.telephone }}</p>
      </template>

      <template #isOnline="text,record">
        <p
          v-if="record.handlerType == 0"
          style="margin:0"
        >手动提现</p>
        <p
          v-else
          style="margin:0"
        >预付提现</p>

        <p v-if="record.isOnline">(线上支付)</p>
        <p v-else>(线下支付)</p>
      </template>

      <template #payChannel="text,record">
        <p v-if="record.payChannel === 'aliPay'">阿里支付</p>
        <p v-else-if="record.payChannel === 'xsPay'">新生支付</p>
        <p v-else-if="record.payChannel === 'mideaPay'">美的支付</p>
      </template>

      <template #receiveInfo="text,record">
        <p>{{ record.receivePayee }}</p>
        <p>{{ record.receiveBank }}</p>
        <p>{{ record.receiveBankCard }}</p>
      </template>

      <template #invoiceUrl="text">
        <img
          v-if="text"
          style="max-width:100%"
          :src="text"
          alt=""
          height="70px"
          @click="$previewImg(text)"
        >
      </template>
      <template #voucherUrl="text">
        <img
          v-if="text"
          style="max-width:100%"
          :src="text"
          alt=""
          height="70px"
          @click="$previewImg(text)"
        >
      </template>
      <template #action="text,record">
        <span
          v-if="orderStatus === 0"
          class="action-button"
          @click="handleAction('visible', record)"
        >汇款</span>
        <a-button
          v-if="orderStatus === 0"
          type="link"
          @click="handleAction('refuseVisible', record)"
        >拒绝</a-button>
        <!-- v-if="record.handlerType != 0 && record.isOnline" -->
        <a-button
          v-if="record.handlerType != 0 && record.isOnline"
          type="link"
          @click="exportRecord(record)"
        >导出</a-button>
        <!-- <span
          v-if="orderStatus === 1 || orderStatus === 2"
          class="action-button"
          @click="handleAction('detailVisible', record)"
          >详情</span
        > -->
        <span
          v-if="orderStatus === 3"
          class="action-button"
          @click="synchronization(record.id)"
        >同步</span>
      </template>
    </a-table>
    <!-- 汇款确认 -->
    <ApproveModal
      v-model="visible"
      :data="currentObj"
      @ok="getList"
    />
    <!-- 拒绝 -->
    <RefuseModal
      v-model="refuseVisible"
      :data="currentObj"
      @ok="getList"
    />
    <!-- 详情 -->
    <DetailModel
      v-model="detailVisible"
      :data="currentObj"
      :order-status="orderStatus"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import ApproveModal from './components/ApproveModal'
import RefuseModal from './components/RefuseModal'
import DetailModel from './components/DetailModel'
import {
  getAccountList,
  getAccountListAPi,
  exportData,
  exportRecord
} from '@/api/account'
import { download, debounce, setTableHeight } from '@/utils'
import moment from 'moment'
import colmnsObj from './colmuns'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // memberAccount: ''
}
export default {
  name: 'TakeAccount',
  components: {
    TableFilter,
    ApproveModal,
    RefuseModal,
    DetailModel
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
      refuseVisible: false,
      detailVisible: false,
      data: [],
      actionType: '',
      formModel: {},
      title: '',
      currentObj: {},
      activeKey: 0,
      tabs: [
        {
          key: 0,
          text: '申请中'
        },
        {
          key: 1,
          text: '已拒绝'
        },
        {
          key: 2,
          text: '已汇款'
        },
        {
          key: 3,
          text: '汇款中'
        }
      ],
      btnList: [
        {
          label: '申请中',
          value: 0
        },
        {
          label: '已拒绝',
          value: 1
        },
        {
          label: '已汇款',
          value: 2
        },
        {
          label: '汇款中',
          value: 3
        }
      ],
      orderStatus: 0
    }
  },
  computed: {
    colItem() {
      return [
        {
          slotName: 'orderStatus',
          key: 'orderStatus'
        },
        {
          label: '申请时间',
          itemType: 'rangePicker',
          key: 'applyTime',
          itemProp: {
            disabledDate(val) {
              return val && val > moment().endOf('day')
            }
          }
        }
      ]
    },
    columns() {
      return colmnsObj[this.orderStatus]
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
    async exportData() {
      const params = Object.assign(
        { orderStatus: this.orderStatus },
        this.paginationParams,
        this.formModel,
        this.params,
        this.getStartOrEndTime()
      )
      try {
        const result = await exportData(params)
        download(result, '提现审批数据')
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    async exportRecord(record) {
      console.log('导出数据行')
      try {
        const result = await exportRecord({
          id: record.id
        })
        download(result, '预付款提现审批')
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
      const [applyTimeStart, applyTimeEnd] = this.formModel.applyTime || []
      return {
        applyTime: undefined,
        applyTimeStart,
        applyTimeEnd
      }
    },
    async getList() {
      const params = Object.assign(
        { orderStatus: this.orderStatus },
        this.paginationParams,
        this.formModel,
        this.params,
        this.getStartOrEndTime()
      )
      try {
        const { data } = await getAccountList(params)
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
    handleClick(item) {
      this.resetParams()
      this.reset()
      this.orderStatus = item.value
      this.getList()
    },
    handleAction(key, record) {
      this[key] = true
      this.currentObj = record
    },
    async synchronization(id) {
      try {
        await getAccountListAPi({ id: id })
        this.$message.success('同步成功')
        this.getList()
      } catch (error) {
        console.error(error)
      }
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
  .button-group {
    & > button:not(:last-child) {
      margin-right: 10px;
    }
  }
}
.export {
  display: flex;
  padding-bottom: 16px;
}
</style>
