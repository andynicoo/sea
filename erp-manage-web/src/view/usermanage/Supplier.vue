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
        <template #button>
          <div class="btn-box">
            <a-button
              type="primary"
              @click="handleSearch"
            >查询</a-button>
            <a-button
              type="primary"
              @click="handleAction('add')"
            >
              新增
            </a-button>
          </div>
        </template>
      </TableFilter>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => record.id"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #agreementUrl="text">
        <div class="img-box">
          <img
            v-show="text"
            v-lazy:ant-table-body="text"
            alt=""
            @click="$previewImg(text)"
          >
        </div>
      </template>
      <template #status="text">
        <span>{{ STATUS[text] }}</span>
      </template>
      <template #settleStyle="text">
        <span>{{ SETTLE_STYLE[text] }}</span>
      </template>
      <template #action="record">
        <span
          class="action edit"
          @click="handleAction('edit', record)"
        >
          编辑</span>
      </template>
    </a-table>
    <!-- 货代商编辑新增 -->
    <SuppliperModal
      v-model="editVisible"
      :current-obj.sync="currentObj"
      :action-type.sync="actionType"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import SuppliperModal from './components/SuppliperModal'
import { debounce, setTableHeight } from '@/utils'
import { getErpSupplier } from '@/api/usermanage'

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
const SETTLE_STYLE = {
  0: '平台收款',
  1: '线下收款',
  2: '预付收款',
  3: '线上审核收款'
}
const STATUS = {
  1: '正常',
  0: '冻结'
}
export default {
  components: {
    TableFilter,
    SuppliperModal
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
      editVisible: false,
      data: [],
      formModel: {},
      title: '',
      currentObj: {},
      STATUS,
      SETTLE_STYLE,
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号/供应商',
          itemType: 'input',
          key: 'params',
          placeholder: '请输入账号/供应商',
          itemProp: {
            style: 'width:230px'
          }
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
          title: '供应商名称',
          dataIndex: 'forwarderName'
        },
        {
          title: '姓名/联系方式',
          dataIndex: 'contacts'
        },
        {
          title: '合同',
          dataIndex: 'agreementUrl',
          scopedSlots: { customRender: 'agreementUrl' }
        },
        {
          title: '结算方式',
          dataIndex: 'settleStyle',
          scopedSlots: { customRender: 'settleStyle' }
        },
        {
          title: '结算手续费',
          dataIndex: 'settlementRate'
        },
        {
          title: '最大预付金额(元)',
          dataIndex: 'maxPrePayMoney'
        },
        {
          title: '提现单笔手续费(元)',
          dataIndex: 'withdrawalFee'
        },
        {
          title: '账号状态',
          dataIndex: 'accountStatus',
          scopedSlots: { customRender: 'status' }
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
      params.keyword = params.params
      try {
        const { data } = await getErpSupplier(params)
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
    handleAction(type, obj = {}) {
      this.actionType = type
      if (obj['isInternalTest']) {
        obj['isInternalTest'] = 1
      } else {
        obj['isInternalTest'] = 0
      }
      this.currentObj = obj

      this.editVisible = true
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

  .img-box {
    width: 80px;
    height: 80px;
    padding: 5px 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .btn-box {
    & > button:not(:last-child) {
      margin-right: 5px;
    }
  }

  .edit {
    color: @primary-color;
    cursor: pointer;
  }
}
</style>
