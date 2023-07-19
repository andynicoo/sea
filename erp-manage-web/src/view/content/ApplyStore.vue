<template>
  <div ref="container" class="wrapper">
    <div ref="filters" class="filters">
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
    >
      <template #site="text">
        <span>{{ SITE[text] }}</span>
      </template>
      <template #status="text">
        <span>{{ STATUS[text] }}</span>
      </template>
      <template #action="text,record">
        <span class="action-button" @click="handleEdit('edit',record)">修改</span>
      </template>
    </a-table>
    <ShopEditModal
      v-model="visible"
      :data="currentObj"
      :title="title"
      :action-type="actionType"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import ShopEditModal from './components/ShopEditModal'
import { openShopKey } from '@/api/contentManage'
import { debounce, setTableHeight } from '@/utils'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // memberAccount: ''
}
const SITE = {
  1: '马来西亚',
  2: '台湾'
}
const STATUS = {
  1: '未联系',
  2: '已联系',
  3: '未办理',
  4: '已办理',
  5: '已取消'
}
export default {
  name: 'ApplyStore',
  components: {
    TableFilter,
    ShopEditModal
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
      data: [],
      actionType: '',
      formModel: {},
      title: '',
      currentObj: {},
      SITE,
      STATUS
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号',
          itemType: 'input',
          key: 'memberAccount',
          itemProp: {
            style: 'width:230px'
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
          title: '公司名称',
          dataIndex: 'companyName'
          // scopedSlots: { customRender: 'content' }
        },
        {
          title: '联系人',
          dataIndex: 'contacts'
        },
        {
          title: '联系人手机',
          dataIndex: 'contactsMode'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '首发站点',
          dataIndex: 'site',
          scopedSlots: { customRender: 'site' }
        },
        {
          title: '提交时间',
          dataIndex: 'createTime'
        },
        {
          title: '标记',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
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
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return time
      }
    },
    getStartOrEndTime() {
      const [bindingStartTime, bindingEndTime] =
        this.formModel.bindingTime || []
      const [registeredStartTime, registeredEndTime] =
        this.formModel.registeredTime || []
      return {
        registeredTime: undefined,
        bindingTime: undefined,
        registeredStartTime: this.formattime(registeredStartTime),
        registeredEndTime: this.formattime(registeredEndTime),
        bindingStartTime: this.formattime(bindingStartTime),
        bindingEndTime: this.formattime(bindingEndTime)
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await openShopKey(params)
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
    handleEdit(type, record) {
      this.actionType = type
      this.currentObj = record
      this.title = `编辑${record.memberAccount}`
      this.visible = true
    },
    viewContent(record) {
      this.currentObj = record
      this.visible = true
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
