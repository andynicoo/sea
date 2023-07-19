<template>
  <div ref="container" class="wrapper">
    <div ref="filters" class="filters">
      <a-button type="primary" @click="handleEdit('add')">新增</a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => record.qaId"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #action="text,record">
        <div class="action">
          <span class="edit" @click="handleEdit('edit',record)">编辑</span>
          <a-button type="link" @click="handleDelete(record)">删除</a-button>
        </div>
      </template>
    </a-table>
    <ContentModal
      v-model="visible"
      :current-obj.sync="currentObj"
      :action-type="actionType"
      @ok="handleSearch"
    />
  </div>
</template>

<script>
import { getContentList, deleteContent } from '@/api/contentManage'
import ContentModal from './components/ContentModal'
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
  name: 'ContentList',
  components: {
    ContentModal
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
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
      data: [],
      visible: false,
      actionType: '',
      currentObj: {}
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'headLine' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          // sorter: true,
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
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
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await getContentList(params)
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
      this.visible = true
    },
    handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk: async() => {
          try {
            await deleteContent({ qaId: record.qaId })
            this.$message.success('删除成功')
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    handleAdd() {
      this.actionType = 'add'
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
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .action {
    .edit {
      cursor: pointer;
      color: @primary-color;
      &:not(:last-child){
        margin-right: 5px;
      }
    }
  }
}
</style>
