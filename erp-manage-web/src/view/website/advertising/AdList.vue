<template>
  <div class="wrapper">
    <div ref="filters" class="filters">
      <TableFilter
        ref="tableFilter"
        :col-item="colItem"
        :form-model="formModel"
        @submit="handleSearch"
        @reset="reset"
      >
        <template #button>
          <a-button type="primary" class="g-mr15" @click="handleSearch"
            >查询</a-button
          >
          <!-- <a-button class="g-mr15" @click="reset">重置</a-button> -->
          <a-button
            v-permission:advertising="['add']"
            type="primary"
            @click="handleAction('add')"
            >新增</a-button
          >
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
          <img v-show="text" v-lazy:ant-table-body="text" alt="" />
        </div>
      </template>
      <template slot="status" slot-scope="text, record">
        <span
          >
          {{ getAdStatus(record.startTime, record.endTime) }}
        </span>
      </template>
      <template slot="updateTime" slot-scope="text, record">
        {{ record.startTime }}
        <div>{{ record.endTime }}</div>
      </template>
      <template #settleStyle="text">
        <span>{{ SETTLE_STYLE[text] }}</span>
      </template>
      <template #action="record">
        <span
          v-permission:advertising="['edit']"
          class="action-button"
          @click="handleAction('edit', record)"
          >编辑</span
        >
        <span class="action-button g-ml15" @click="handleDelete(record)"
          >删除</span
        >
      </template>
    </a-table>
    <AdModal
      v-model="visible"
      :action-type="actionType"
      :data="currentObj"
      :advertising-select="advertisingSelect"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import AdModal from './components/AdModal'
import { debounce, setTableHeight } from '@/utils'
import {
  advertisingList,
  advertisingSelect,
  advertisingDelete
} from '@/api/website'
import adKeySelect from './select'
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
const type = 2
export default {
  name: 'AdList',
  components: {
    TableFilter,
    AdModal
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
      advertisingSelect: [],
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '广告名称',
          itemType: 'input',
          key: 'name'
        },
        {
          label: '广告key',
          itemType: 'select',
          key: 'advertisingKey',
          itemData: adKeySelect
        }
      ]
    },
    columns() {
      return [
        {
          title: '广告图',
          dataIndex: 'imgs',
          customRender: (text) => (
            <img
              src={text}
              width="140"
              onClick={() => this.$previewImg(text)}
            />
          )
        },
        {
          title: '广告名称',
          dataIndex: 'name'
        },
        {
          title: '广告位',
          dataIndex: 'advertisingId',
          customRender: (text) => {
            const obj = this.advertisingSelect.find(
              (item) => item.value === text
            )
            return <span>{obj && obj.label}</span>
          }
        },
        {
          title: '广告key',
          dataIndex: 'advertisingKey',
          customRender: (text) => {
            const obj = adKeySelect.find((item) => item.value === text)
            return <span>{obj && `${obj.label}(${text})`}</span>
          }
        },
        {
          title: '跳转链接',
          dataIndex: 'link'
        },
        {
          title: '启用状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '生效时间',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' }
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
    this.getAdvertisingSelect()
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
        const { data } = await advertisingList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async getAdvertisingSelect() {
      try {
        const { data = [] } = await advertisingSelect({ type })
        this.advertisingSelect =
          data && data.map((item) => ({ label: item.name, value: item.id }))
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
      this.visible = true
      this.currentObj = record
      this.actionType = type
    },
    handleDelete(record) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: async () => {
          try {
            await advertisingDelete({ ids: [record.id] })
            this.$message.success('删除成功')
            this.getList()
          } catch (error) {
            console.error(error)
          }
        }
      })
    },
    getAdStatus(sTime, eTime) {
      // 未启用，已启用，已失效
      let timeNow = moment().format('YYYY-MM-DD HH:mm')
      timeNow = timeNow + ':00'
      const format = 'YYYY-MM-DD HH:mm'
      console.log(timeNow, moment(sTime).isBefore(eTime))
      if (moment(timeNow).isBefore(sTime)) {
        return '未启用'
      } else if (moment(eTime).isBefore(timeNow)) {
        return '已失效'
      } else {
        return '已启用'
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
</style>
