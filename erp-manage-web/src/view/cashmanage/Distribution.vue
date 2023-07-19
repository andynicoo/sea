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
      <a-button
        size="small"
        type="primary"
        @click="addCash()"
      >
        新增旺币分配
      </a-button>
      <a-button
        size="small"
        type="primary"
        style="margin-left:10px"
        @click="importDisRecord()"
      >
        导入
      </a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ y: tableHeight }"
      @change="onChange"
    >
      <template #sellerInfo="text,record">
        <p>手机号：{{ record.maAccount }}</p>
        <p>会员ID：{{ record.memberId }}</p>
      </template>

      <template #finType="text,record">
        <span v-if="record.finType == 0">充值</span>
        <span v-if="record.finType == 1">代发货</span>
        <span v-if="record.finType == 2">任务</span>
        <span v-if="record.finType == 3">赠送</span>
        <span v-if="record.finType == 4">提现</span>
        <span v-if="record.finType == 5">预付提现</span>
        <span v-if="record.finType == 6">活动运营</span>
        <span v-if="record.finType == 7">系统对账</span>
        <span v-if="record.finType == 8">系统退款</span>
      </template>

      <template #finStatus="text,record">
        <span
          v-if="record.finStatus == 1"
          style="color:red"
        >入账</span>
        <span
          v-if="record.finStatus == 2"
          style="color:green"
        >出账</span>
      </template>

      <template #finAmount="text,record">
        <span
          :style="{ color: record.finStatus == 1 ? 'red' : 'green' }"
          class="buz-red"
        >
          {{ (record.finStatus == 1 ? '+' : '-') + text }}
        </span>
      </template>

      <template #attAddress="text,record">
        <span
          v-if="record.attAddress"
          class="action-button"
          @click="record.attAddress && $previewImg(record.attAddress)"
        >
          查看
        </span>
      </template>
    </a-table>

    <div
      id="importDisRecord_id"
      style="position: fixed; top: -2000px;opacity: 0;"
    >
      <!-- <input type="file" accept=".xlsx,.xls" @change="changeFile" /> -->
    </div>

    <!-- 新增旺币分配 -->
    <DistributionModal
      v-model="distributionVisible"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import { getFinanceRecord, importDisRecord } from '@/api/cashmange'
import DistributionModal from './components/DistributionModal'
import { download, debounce, setTableHeight } from '@/utils'

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
    DistributionModal
  },
  filters: {
    formatbuzAmount(val, record) {
      if (record.chargeStatus === -1) {
        return `-${val}`
      }
      return val
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
      distributionVisible: false, // 新增分配旺币弹窗显示
      data: [],
      formModel: {}
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '卖家账号',
          itemType: 'input',
          key: 'maAccount',
          placeholder: '请输入卖家账号',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '业务类型',
          itemType: 'select',
          key: 'finType',
          itemData: [
            // {
            //   label: '充值',
            //   value: 0
            // },
            // {
            //   label: '代发货',
            //   value: 1
            // },
            // {
            //   label: '任务',
            //   value: 2
            // },
            // {
            //   label: '赠送',
            //   value: 3
            // },
            // {
            //   label: '提现',
            //   value: 4
            // },
            // {
            //   label: '预付提现',
            //   value: 5
            // },
            {
              label: '活动运营',
              value: 6
            },
            {
              label: '系统对账',
              value: 7
            },
            {
              label: '系统退款',
              value: 8
            }
          ]
        },
        {
          label: '状态',
          itemType: 'select',
          key: 'finStatus',
          itemData: [
            {
              label: '出账',
              value: 2
            },
            {
              label: '入账',
              value: 1
            }
          ]
        },
        {
          label: '操作时间段',
          itemType: 'rangePicker',
          key: 'optTime',
          itemProp: {
            disabledDate(current) {
              return current && current > moment().endOf('day')
            }
          }
        }
      ]
    },
    columns() {
      return [
        {
          title: '分配订单号',
          dataIndex: 'finNo'
        },
        {
          title: '卖家信息',
          dataIndex: 'sellerInfo',
          scopedSlots: { customRender: 'sellerInfo' }
        },
        {
          title: '业务类型',
          dataIndex: 'finType',
          scopedSlots: { customRender: 'finType' }
        },
        {
          title: '状态',
          dataIndex: 'finStatus',
          scopedSlots: { customRender: 'finStatus' }
        },
        {
          title: '金额',
          dataIndex: 'finAmount',
          scopedSlots: { customRender: 'finAmount' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '附件',
          dataIndex: 'attAddress',
          scopedSlots: { customRender: 'attAddress' }
        },
        {
          title: '交易时间',
          dataIndex: 'tradeTime'
        },
        {
          title: '操作人',
          dataIndex: 'createBy'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime'
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
    async changeFile() {
      const formData = new FormData()
      const files = document.querySelector(
        '#importDisRecord_id input[type=file]'
      ).files
      formData.append('file', files[0])
      try {
        const result = await importDisRecord(formData)
        if (result.byteLength === 0) {
          this.$message.success('导入成功')
        } else {
          this.$message.error('错误记录已导出')
          download(result, '错误记录')
        }
      } catch (error) {
        console.error(error)
      }
    },
    importDisRecord() {
      document.getElementById('importDisRecord_id').innerHTML =
        '<input type="file" accept=".xlsx,.xls" @change="changeFile" />'
      document
        .querySelector('#importDisRecord_id input[type=file]')
        .addEventListener('change', this.changeFile)
      document.querySelector('#importDisRecord_id input[type=file]').click()
    },
    addCash() {
      this.distributionVisible = true
    },
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
      this.formModel.optTime || []
      const [startTime, endTime] = this.formModel.optTime || []
      return {
        optTime: undefined,
        startTime: this.formattime(startTime),
        endTime: this.formattime(endTime)
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params,
        this.getStartOrEndTime() // 时间的一些参数
      )
      try {
        const { data } = await getFinanceRecord(params)
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
