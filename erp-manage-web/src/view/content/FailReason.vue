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
      <template #action="text,record">
        <span
          class="action-button"
          @click="handleEdit(record)"
        >编辑</span>
      </template>
    </a-table>
    <FailModel
      v-model="visible"
      :data="currentObj"
      @ok="getList"
    />
  </div>
</template>

<script>
import FailModel from './components/FailModal'
import TableFilter from '@/components/tableFilter'
import { failureList } from '@/api/contentManage'
import { debounce, setTableHeight } from '@/utils'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {}
export default {
  name: 'FailReason',
  components: {
    FailModel,
    TableFilter
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
      currentObj: {}
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '失败源码',
          itemType: 'input',
          key: 'errorReasonsn'
        },
        {
          label: '翻译',
          itemType: 'input',
          key: 'errorReasonsCn'
        },
        {
          label: '翻译是否为空',
          itemType: 'select',
          key: 'errorReasonsCnIsNull',
          itemData: [
            {
              label: '是',
              value: 0
            },
            {
              label: '否',
              value: 1
            }
          ]
        }
      ]
    },
    columns() {
      return [
        {
          title: '失败源码',
          dataIndex: 'errorReasons'
        },
        {
          title: '翻译',
          dataIndex: 'errorReasonsCn'
          // scopedSlots: { customRender: 'content' }
        },
        {
          title: '添加时间',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
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
        const { data } = await failureList(params)
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
    handleEdit(record) {
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
