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
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import { getStatisList } from '@/api/forwarder'
import { debounce, setTableHeight } from '@/utils'
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
          label: '货代商',
          itemType: 'input',
          key: 'forwarderName',
          placeholder: '请输入货代商',
          itemProp: {
            style: 'width:230px'
          }
        }
      ]
    },
    columns() {
      return [
        {
          title: '货代商名称',
          dataIndex: 'forwarderName'
        },
        {
          title: '旺币余额(元)',
          dataIndex: 'wangbiBalance',
          sorter: true
        },
        {
          title: '代打包总数(个)',
          dataIndex: 'packageCount',
          sorter: true
        },
        {
          title: '出库总数量(个)',
          dataIndex: 'outStockCount',
          sorter: true
        },
        {
          title: '出库总金额(元)',
          dataIndex: 'outStockAmount',
          sorter: true
        },
        {
          title: '推荐人出库金额(元)',
          dataIndex: 'inviteOutStockAmount',
          sorter: true
        },
        {
          title: '非推荐人出库金额(元)',
          dataIndex: 'uninviteOutStockAmount',
          sorter: true
        },
        {
          title: '邀请人数(人)',
          dataIndex: 'inviterCount',
          sorter: true
        },
        {
          title: '累计推荐充值金额(元)',
          dataIndex: 'inviteAmount',
          sorter: true
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
    async setTableHeight(e) {
      setTableHeight(this)
    },

    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await getStatisList(params)
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
</style>
