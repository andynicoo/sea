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
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      row-key="id"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #sumReturnAmount="text,record">
        <span
          v-if="record.sumReturnAmount"
          style="color: #f7622f;cursor: pointer;"
          @click="returnDetail(record)"
        >
          {{ record.sumReturnAmount }}
        </span>
        <span v-else>-</span>
      </template>

      <template #returnTime="text,record">
        <span v-if="record.returnList && record.returnList.length > 0">
          {{ record.returnList[0].returnTime }}
        </span>
        <span v-else>-</span>
      </template>

      <template #action="text,record">
        <span
          v-if="
            record.orderStatusEnum === 'paid' &&
              record.payChannel === 'mideaPay' &&
              Number(record.payAmount || 0) -
              Number(record.sumReturnAmount || 0) >
              0
          "
          class="action-button"
          @click="addReturn(record)"
        >
          退款
        </span>
      </template>
    </a-table>
    <AddReturn
      v-model="addReturnVisible"
      :data="currentObj"
      @ok="getList"
    />
    <ReturnDetail
      v-model="returnDetailVisible"
      :data="currentObj"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import AddReturn from './components/AddReturn.vue'
import ReturnDetail from './components/ReturnDetail.vue'
import { getPageList } from '@/api/payManage'
import { debounce, setTableHeight } from '@/utils/index'
import moment from 'moment'

const initPagination = {
  current: 1,
  size: 10
}

export default {
  name: 'AccountsList',
  components: {
    TableFilter,
    AddReturn,
    ReturnDetail
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {},
      data: [],
      selectedRowKeys: [],
      paginationParams: {
        ...initPagination
      },
      params: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      addReturnVisible: false,
      returnDetailVisible: false,
      currentObj: {},
      selectAll: false,
      tableHeight: 400,
      optType: 1 // 操作类型： 1线上预付  2 线下预付
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '订单号',
          itemType: 'input',
          key: 'rechargeOrderNo'
        },
        {
          label: '手机号',
          itemType: 'input',
          key: 'account'
        },
        {
          label: '支付时间段',
          itemType: 'rangePicker',
          key: 'paySuccessTime',
          itemProp: {
            disabledDate(current) {
              return current && current > moment().endOf('day')
            }
          }
        },
        {
          label: '支付状态',
          itemType: 'select',
          key: 'orderStatus',
          itemData: [
            {
              label: '未支付',
              value: 'unPaid'
            },
            {
              label: '已支付',
              value: 'paid'
            }
          ]
        },
        {
          label: '支付方式',
          itemType: 'select',
          key: 'payWay',
          itemData: [
            {
              label: '微信',
              value: 'WECHATPAY'
            },
            {
              label: '支付宝',
              value: 'ALIPAY'
            }
          ]
        }
      ]
    },
    columns() {
      return [
        {
          title: '订单号',
          dataIndex: 'rechargeOrderNo',
          width: 200
        },
        {
          title: '手机号',
          dataIndex: 'account'
        },
        {
          title: '支付时间',
          dataIndex: 'paySuccessTime'
        },
        {
          title: '支付金额',
          dataIndex: 'payAmount'
        },
        {
          title: '状态',
          dataIndex: 'orderStatusDisplay'
        },
        {
          title: '支付方式',
          dataIndex: 'payWayDisplay'
        },
        {
          title: '支付渠道',
          dataIndex: 'payChannelDisplay'
        },
        {
          title: '已退金额',
          dataIndex: 'sumReturnAmount',
          scopedSlots: { customRender: 'sumReturnAmount' }
        },
        {
          title: '最近退款时间',
          dataIndex: 'returnTime',
          scopedSlots: { customRender: 'returnTime' }
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          scopedSlots: {
            customRender: 'action'
          }
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
    returnDetail(record) {
      this.returnDetailVisible = true
      this.currentObj = { ...record }
    },
    addReturn(record) {
      this.addReturnVisible = true
      this.currentObj = { ...record }
    },
    async setTableHeight() {
      setTableHeight(this)
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params, // 排序参数或者别的
        this.formModel // 过滤参数
      )

      if (
        this.formModel.paySuccessTime &&
        this.formModel.paySuccessTime.length > 0
      ) {
        params.paySuccessTimeStart = this.formModel.paySuccessTime[0]
        params.paySuccessTimeEnd = this.formModel.paySuccessTime[1]
      }

      try {
        const { data } = await getPageList(params)
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
    reset() {
      this.formModel = {}
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 10px;
  }
}
</style>
