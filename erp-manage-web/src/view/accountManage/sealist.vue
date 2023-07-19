<template>
  <div ref="container" class="all-user wrapper">
    <div ref="export" class="export">
      <a-button type="primary" @click="addServiceProvider">添加服务商</a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #serviceProviderStatus="text">
        <div>{{ STATUS[text] || '' }}</div>
      </template>
      <template #action="record">
        <span class="action-button g-mr10" @click="editServiceProvider(record)">编辑</span>
        <!-- <span class="action" @click="viewWarehouse(record)">仓库信息</span> -->
        <span class="action-button" @click="record.contractUrl&&$previewImg(record.contractUrl)">查看合同</span>
      </template>
    </a-table>
    <!-- 海外仓服务商编辑新增 -->
    <ProviderModal
      v-model="editVisible"
      :current-obj.sync="currentObj"
      :action-type.sync="actionType"
      @ok="getList"
    />
    <!-- 查看仓库 -->
    <WarehouseModal
      v-model="viewWarehouseVisible"
      :current-obj.sync="currentObj"
    />
  </div>
</template>

<script>
import { getSeaOverseasList } from '@/api/accountManage'
import { debounce, setTableHeight } from '@/utils/index'
import ProviderModal from './components/ProviderModal'
import WarehouseModal from './components/WarehouseModal'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  // maAccount: '',
  // inviter: ''
}
const STATUS = {
  1: '启用',
  0: '停用'
}
export default {
  name: 'AccountsSeaList',
  components: {
    // TableFilter,
    ProviderModal,
    WarehouseModal
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {
        ...initFormModel
      },
      data: [],
      selectedRowKeys: [],
      paginationParams: {
        ...initPagination
      },
      params: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      STATUS,
      selectAll: false,
      tableHeight: 400,
      currentObj: {},
      viewWarehouseVisible: false,
      editVisible: false,
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    // colItem() {
    //   return []
    // },
    columns() {
      return [
        {
          title: '服务商名称/简称',
          dataIndex: 'serviceProviderName'
        },
        {
          title: '服务商介绍',
          dataIndex: 'serviceProviderIntroduction'
        },
        {
          title: '联系人',
          dataIndex: 'serviceProviderContacts'
        },
        {
          title: '联系电话',
          dataIndex: 'serviceProviderPhone'
        },
        {
          title: '状态',
          dataIndex: 'serviceProviderStatus',
          scopedSlots: { customRender: 'serviceProviderStatus' }
        },
        {
          title: '合作到期日',
          dataIndex: 'contractExpireTime'
        },
        {
          title: '添加时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 260,
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
    addServiceProvider() {
      this.actionType = 'add'
      this.currentObj = {}
      this.editVisible = true
    },
    editServiceProvider(li) {
      this.actionType = 'edit'
      this.currentObj = li
      this.editVisible = true
    },
    viewWarehouse(li) {
      this.currentObj = li
      this.viewWarehouseVisible = true
    },
    async setTableHeight() {
      setTableHeight(this)
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params, // 排序参数或者别的
        this.formModel // 过滤参数
      )
      try {
        const { data } = await getSeaOverseasList(params)
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
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 10px;
  }
  .export {
    display: flex;
    padding-bottom: 16px;
  }
  .btn-box {
    & > button:not(:last-child) {
      margin-right: 5px;
    }
  }
  .action {
    margin-right: 10px;
  }
}
</style>
