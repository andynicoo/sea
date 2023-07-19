<template>
  <div
    ref="container"
    class="all-user wrapper"
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
      <template #settleStyle="text">
        <span>{{ SETTLE_STYLE[text] || '' }}</span>
      </template>
      <template #maxPrePayMoney="text">
        <span>{{ text || 0 }}</span>
      </template>
      <template #stayPerPayTotalMoney="text">
        <span>{{ text || 0 }}</span>
      </template>
      <template #status="text">
        <div>{{ STATUS[text] || '' }}</div>
      </template>
      <template #action="record">
        <span
          v-if="record.settleStyle === 2"
          class="action-button g-mr10"
          @click="handleEdit(record, 1)"
        >线上预付</span>
        <span
          v-if="record.settleStyle === 2"
          class="action-button g-mr10"
          @click="handleEdit(record, 2)"
        >线下预付</span>
        <span
          class="action-button"
          :disabled="!record.agreementUrl"
          @click="record.agreementUrl && $previewImg(record.agreementUrl)"
        >查看合同</span>
      </template>
    </a-table>
    <CashModal
      v-model="visible"
      :opt-type="optType"
      :data="currentObj"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import CashModal from './components/CashModal'
import { getForwarderList } from '@/api/accountManage'
import { debounce, setTableHeight } from '@/utils/index'
const initPagination = {
  current: 1,
  size: 10
}
const STATUS = {
  1: '正常',
  0: '冻结'
}
const SETTLE_STYLE = {
  0: '平台收款',
  1: '线上收款',
  2: '预付收款'
}
const initFormModel = {
  maAccount: '',
  status: '',
  source: '',
  registeredStartTime: undefined,
  bindingStartTime: undefined
}
export default {
  name: 'AccountsList',
  components: {
    TableFilter,
    CashModal
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {
        ...initFormModel
      },
      STATUS,
      SETTLE_STYLE,
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
      visible: false,
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
          label: '贷代商/联系方式',
          itemType: 'input',
          key: 'params'
        }
      ]
    },
    columns() {
      return [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '货代商名称',
          dataIndex: 'forwarderName'
        },
        {
          title: '姓名/联系方式',
          dataIndex: 'contacts',
          customRender: (text, record) => {
            return (
              <span>{`${text || '--'}/${record.contactTelephone ||
                '--'}`}</span>
            )
          }
        },
        {
          title: '结算方式',
          dataIndex: 'settleStyle',
          scopedSlots: { customRender: 'settleStyle' }
        },
        {
          title: '状态',
          dataIndex: 'accountStatus',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '旺币余额',
          dataIndex: 'accBalance'
        },
        {
          title: '预付最大额度',
          dataIndex: 'maxPrePayMoney',
          scopedSlots: { customRender: 'maxPrePayMoney' }
        },
        {
          title: '待预付总额',
          dataIndex: 'stayPerPayTotalMoney',
          scopedSlots: { customRender: 'stayPerPayTotalMoney' }
        },
        {
          title: '操作',
          key: 'action',
          width: 260,
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
      try {
        const { data } = await getForwarderList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    handleEdit(record, optType) {
      this.optType = optType
      this.visible = true
      this.currentObj = { ...record }
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
      this.formModel = { ...initFormModel }
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
