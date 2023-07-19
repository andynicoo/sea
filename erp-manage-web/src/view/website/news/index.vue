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
          <a-button type="primary" class="g-mr15" @click="handleSearch">查询</a-button>
          <a-button
            v-permission:news_manager="['add']"
            type="primary"
            class="g-mr15"
            @click="handleAction('add')"
          >发布动态</a-button>
          <!-- <a-button type="primary" class="g-mr15" @click="handleClick">分类管理</a-button> -->
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
          v-permission:news_manager="['edit']"
          class="action-button"
          @click="handleAction('edit', record)"
        >编辑</span>
        <span class="action-button g-ml15" @click="handleDelete([record.id])">删除</span>
      </template>
    </a-table>
    <ClassManager v-model="visible" :main-type="2" @ok="getClassifySelect" />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import ClassManager from '../components/ClassManager'
import { debounce, setTableHeight } from '@/utils'
import { newsOrCashList, classifySelect, newsOrCashDelete } from '@/api/website'
import { mainType } from './mainType'
const initPagination = {
  current: 1,
  size: 10
}
export default {
  components: {
    TableFilter,
    ClassManager
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
      classifySelect: [],
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem({ classifySelect }) {
      return [
        {
          label: '标题',
          itemType: 'input',
          key: 'title'
        },
        {
          label: '动态分类',
          itemType: 'select',
          key: 'type',
          itemData: classifySelect
        }
      ]
    },
    columns() {
      return [
        {
          title: '封面',
          dataIndex: 'imgs',
          customRender: (text, record) => {
            return <img src={text} height={60} onClick={() => this.$previewImg(text)}/>
          }
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '动态分类',
          dataIndex: 'typeName'
        },
        {
          title: '启用状态',
          dataIndex: 'status',
          customRender: (text, record) => {
            return <span>{text ? '已启用' : '未启用'}</span>
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  created() {
    this.getList()
    this.getClassifySelect()
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
        { mainType },
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await newsOrCashList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async getClassifySelect() {
      try {
        const { data = [] } = await classifySelect({ mainType })
        this.classifySelect = data && data.map(item => ({ label: item.typeName, value: item.id }))
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
      this.formModel = { }
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
          this.newsDelete(ids)
        }
      })
    },
    async newsDelete(ids) {
      const params = {
        ids,
        mainType
      }
      try {
        await newsOrCashDelete(params)
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
  .add{
    padding-bottom: 12px;
  }
 }
</style>
