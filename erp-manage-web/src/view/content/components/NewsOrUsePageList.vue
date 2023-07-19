<template>
  <div ref="container" class="wrapper">
    <div ref="filters" class="filters">
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @reset="reset"
        @submit="handleSearch"
      >
        <template #button>
          <div class="button-group">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button type="primary" @click="handleEdit('add')">新增</a-button>
            <a-button type="primary" @click="visible=true">管理分类</a-button>
          </div>
        </template>
      </TableFilter>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      row-key="contentId"
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
        <span class="action-button" @click="handleEdit('edit',record)">编辑</span>
        <a-button type="link" class="action-button" @click="handleDelete(record)">删除</a-button>
      </template>
    </a-table>
    <!-- 分类管理 -->
    <ClassifyManageModal
      v-model="visible"
      :data="classifyList"
      :module="module"
      @ok="getClassifyList"
    />
    <!-- 内容弹窗 -->
    <ContentInfoModel
      v-model="contentVisible"
      :data="currentObj"
      :module="module"
      :title="title"
      :action-type="actionType"
      :classify-select-list="classifySelectList"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import ClassifyManageModal from './ClassifyManageModal'
import ContentInfoModel from './ContentInfoModel'
import { directionList, getClassifyList, contentDelete } from '@/api/contentManage'
import { debounce, setTableHeight } from '@/utils'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // memberAccount: ''
}
const MODULE = {
  1: '说明',
  2: '动态'
}
export default {
  name: 'PageList',
  components: {
    TableFilter,
    ClassifyManageModal,
    ContentInfoModel
  },
  props: {
    module: {
      type: Number,
      default: 1 // 1使用说明 2产品动态
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
      contentVisible: false,
      data: [],
      actionType: '',
      formModel: {},
      title: '',
      currentObj: {},
      classifyList: [],
      classifySelectList: []
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '标题',
          itemType: 'input',
          key: 'title',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '分类',
          itemType: 'select',
          key: 'classifyId',
          itemData: this.classifySelectList
        }
      ]
    },
    columns() {
      return [
        {
          title: '分类',
          dataIndex: 'classifyName'
        },
        {
          title: '标题',
          dataIndex: 'title'
          // scopedSlots: { customRender: 'content' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
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
    this.getClassifyList()
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
    async getClassifyList() {
      try {
        const { data = [] } = await getClassifyList({ module: this.module })
        this.classifyList = data && data.map(item => ({ edit: false, ...item }))
        this.classifySelectList = data && data.map(item => ({
          label: item.name,
          value: item.classifyId
        }))
      } catch (error) {
        console.error(error)
      }
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
        this.params,
        { module: this.module }
      )
      try {
        const { data } = await directionList(params)
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
      this.title = `${this.actionType === 'edit' ? '编辑' : '新增'}${MODULE[this.module]}`
      this.contentVisible = true
    },
    handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk: async() => {
          try {
            await contentDelete(record.contentId)
            this.$message.success('删除成功')
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
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
  .button-group{
    button:not(:last-child){
      margin-right: 12px;
    }
  }
}
</style>
