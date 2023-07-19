<template>
  <div
    ref="container"
    class="relationship wrapper"
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
      <template #action="record">
        <span
          class="look"
          @click="handleLook(record)"
        >查看明细</span>
      </template>
    </a-table>
    <DetailModel
      ref="detail"
      v-model="detailVisible"
      :current-obj="currentObj"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import { invitationRelation } from '@/api/usermanage'
import DetailModel from './components/DetailModal'
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
  components: {
    TableFilter,
    DetailModel
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
      detailVisible: false,
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
          label: '邀请人',
          itemType: 'input',
          key: 'account',
          placeholder: '请输邀请人/邀请码'
        },
        {
          label: '用户来源',
          itemType: 'select',
          key: 'source',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '运营邀请',
              value: '1'
            },
            {
              label: '渠道邀请',
              value: '2'
            },
            {
              label: '用户邀请',
              value: '3'
            }
          ]
        }
        // {
        //   label: '是否绑定店铺',
        //   itemType: 'select',
        //   key: 'binding',
        //   itemData: [
        //     {
        //       label: '全部',
        //       value: ''
        //     },
        //     {
        //       label: '是',
        //       value: 0
        //     },
        //     {
        //       label: '否',
        //       value: 1
        //     }
        //   ]
        // },
      ]
    },
    columns() {
      return [
        {
          title: '邀请人',
          dataIndex: 'invitation'
        },
        {
          title: '邀请码',
          dataIndex: 'invitationCode'
        },
        {
          title: '邀请人数',
          dataIndex: 'registerCount',
          sorter: (a, b) => a.registerCount - b.registerCount
        },
        {
          title: '套餐转化',
          dataIndex: 'setMealAmount',
          sorter: (a, b) => a.setMealAmount - b.setMealAmount
        },
        {
          title: '用户来源',
          dataIndex: 'source'
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
        this.getStartOrEndTime(),
        this.params
      )
      try {
        const { data } = await invitationRelation(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    onChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
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
    onSelectChange(selected) {
      this.selectedRowKeys = selected
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
    handleLook(record) {
      this.detailVisible = true
      this.currentObj = record
      setTimeout(() => {
        this.$refs.detail.getList()
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.relationship {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .filters {
    padding-bottom: 12px;
  }
  .look {
    color: @primary-color;
    cursor: pointer;
  }
}
</style>
