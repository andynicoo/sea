<template>
  <div class="wrapper">
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
          <a-button
            type="primary"
            class="g-mr15"
            @click="handleSearch"
          >查询</a-button>
          <!-- <a-button class="g-mr15" @click="reset">重置</a-button> -->
          <a-button
            v-permission:advertising="['add']"
            type="primary"
            @click="handleAction('add')"
          >新增</a-button>
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
          v-permission:advertising="['edit']"
          class="action-button"
          @click="handleAction('edit', record)"
        >编辑</span>
        <span
          class="action-button g-ml15"
          @click="handleDelete(record)"
        >删除</span>
      </template>
    </a-table>
    <AdPositionModal
      v-model="visible"
      :data="currentObj"
      :action-type="actionType"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import AdPositionModal from './components/AdPositionModal'
import { debounce, setTableHeight } from '@/utils'
import { adList, adDelete } from '@/api/website'
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
const type = 1
export default {
  components: {
    TableFilter,
    AdPositionModal
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
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '广告位名称',
          itemType: 'input',
          key: 'name'
        },
        {
          label: '广告key',
          itemType: 'input',
          key: 'advertisingKey'
        }
      ]
    },
    columns() {
      return [
        {
          title: '广告位名称',
          dataIndex: 'name'
        },
        {
          title: '广告key',
          dataIndex: 'advertisingKey'
        },
        // {
        //   title: '描述',
        //   dataIndex: 'advertisingDescribe'
        // },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => <span>{text ? '已启用' : '未启用'}</span>
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
      setTableHeight(this, 61)
    },
    async getList() {
      const params = Object.assign(
        { type },
        this.paginationParams,
        this.formModel,
        this.params
      )
      try {
        const { data } = await adList(params)
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
    handleAction(type, record) {
      this.currentObj = record
      this.actionType = type
      this.visible = true
    },
    async handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '你确定删除吗?',
        onOk: async () => {
          try {
            await adDelete({ type, ids: [record.id] })
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
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
  .add {
    padding-bottom: 12px;
  }
}
</style>
