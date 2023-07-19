<template>
  <div ref="container" class="wrapper">
    <div ref="filters" class="filters">
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        @submit="handleSearch"
        @reset="reset"
      >
        <template #button>
          <a-button
            type="primary"
            class="g-mr15"
            @click="handleSearch"
          >查询</a-button>
          <a-button
            v-permission:news_manager="['add']"
            type="primary"
            class="g-mr15"
            @click="handleAction('add')"
          >发布站内信息</a-button>
          <a-button
            type="primary"
            :disabled="!selectedRowKeys.length"
            @click="handleDelete(selectedRowKeys)"
          >批量删除</a-button>
        </template>
      </TableFilter>
    </div>
    <a-table
      :row-selection="{
        onChange: selectChange,
        selectedRowKeys: selectedRowKeys
      }"
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => record.id"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #agreementUrl="text">
        <div class="img-box">
          <img v-show="text" v-lazy:ant-table-body="text" alt="">
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
          v-if="record.status !== 4"
          v-permission="['edit']"
          class="action-button g-mr15"
          @click="handleAction('edit', record)"
        >编辑</span>
        <span
          v-else
          class="action-button g-mr15"
          @click="handleAction('edit', record)"
        >重新发布</span>
        <span
          v-permission="['delete']"
          class="action-button"
          @click="handleDelete([record.id])"
        >删除</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import { debounce, setTableHeight } from '@/utils'
import { erpMessageList, erpMessageDelete } from '@/api/contentManage'
const initPagination = {
  current: 1,
  size: 10
}
const STATUS = {
  1: '正在发布中',
  2: '队列中',
  3: '已结束',
  4: '关闭'
}
export default {
  components: {
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
      editVisible: false,
      data: [],
      formModel: {},
      title: '',
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '标题',
          itemType: 'input',
          ellipsis: true,
          key: 'title'
        },
        {
          label: '状态',
          itemType: 'select',
          key: 'publishStatus',
          itemData: Object.entries(STATUS).reduce((acc, [key, val]) => {
            return acc.concat({ label: val, value: +key })
          }, [])
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
          title: '发布时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime'
        },
        {
          title: '状态',
          dataIndex: 'publishStatus',
          customRender: (text) => {
            return <span class={`status status${text}`}>{STATUS[text]}</span>
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
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
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await erpMessageList(params)
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
      this.formModel = {}
    },
    handleAction(type, record) {
      if (type === 'edit') {
        this.$router.push({ path: `edit/${record.id}` })
      } else {
        this.$router.push({ path: 'edit' })
      }
    },
    handleClick() {
      this.visible = true
    },
    selectChange(keys) {
      this.selectedRowKeys = keys
    },
    handleDelete(ids) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: () => {
          this.deleteOk(ids)
        }
      })
    },
    async deleteOk(ids) {
      const params = {
        ids
      }
      try {
        await erpMessageDelete(params)
        this.$message.success('删除成功')
        this.selectedRowKeys = []
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
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
  .add {
    padding-bottom: 12px;
  }
}
.status{
  position: relative;
  padding-left: 5px;
  &::before{
    content:'';
    position: absolute;
    display: block;
    left: -5px;
    width: 6px;
    height: 6px;
    top: 7px;
    border-radius: 50%;
    background-color:@success-color;
  }
  &2::before{
    background-color: @warn-color;
  }
  &3::before{
    background-color: @danger-color;
  }
  &4::before{
    background-color: @disabled-color;
  }
}
</style>
