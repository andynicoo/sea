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
    >
      <template #content="text,record">
        <span
          v-if="text"
          class="action-button"
          @click="viewContent(record)"
        >查看内容</span>
      </template>
      <template #action="text,record">
        <span
          :disabled="record.statusCode"
          class="action-button"
          @click="!record.statusCode && handleClick(record)"
        >采纳</span>
      </template>
    </a-table>
    <FeedbackContentModal
      v-model="visible"
      :current-obj="currentObj"
    />
    <FeedbackAdoptModal
      v-model="adoptVisible"
      :current-obj="currentObj"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import FeedbackContentModal from './components/FeedbackContentModal'
import FeedbackAdoptModal from './components/FeedbackAdoptModal'
import { getFeedback } from '@/api/contentManage'
import { debounce, setTableHeight } from '@/utils'
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
  name: 'Feedback',
  components: {
    TableFilter,
    FeedbackContentModal,
    FeedbackAdoptModal
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
      adoptVisible: false,
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
          key: 'maAccount',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '状态',
          itemType: 'select',
          key: 'statusCode',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未采纳',
              value: 0
            },
            {
              label: '已采纳',
              value: 1
            }
          ]
        },
        {
          label: '时间',
          itemType: 'rangePicker',
          key: 'time'
        }
      ]
    },
    columns() {
      return [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '卖家账号',
          dataIndex: 'maAccount'
        },
        {
          title: '赠送旺币数',
          dataIndex: 'giveAmount'
        },
        {
          title: '状态',
          dataIndex: 'statusCodeName'
        },
        {
          title: '时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: 100,
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
      let formData = {}
      if (this.formModel.time) {
        formData.startTime = this.formModel.time[0]
        formData.endTime = this.formModel.time[1]
      }
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params,
        formData
      )
      try {
        const { data } = await getFeedback(params)
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
    handleClick(record) {
      this.currentObj = record
      this.adoptVisible = true
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
