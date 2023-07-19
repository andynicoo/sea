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
      >
        <template #button>
          <div class="btn-box">
            <a-button
              type="primary"
              @click="handleSearch"
            >查询</a-button>
            <a-button
              type="primary"
              @click="handleAction('add')"
            >
              新增
            </a-button>
          </div>
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
      <template #forwarder="record">
        <p style="margin: 0;">{{ record.forwarderName }}</p>
        <p style="margin: 0;">{{ record.telephone }}</p>
      </template>
      <template #contacts="record">
        <p style="margin: 0;">{{ record.contacts }}</p>
        <p style="margin: 0;">{{ record.contactTelephone }}</p>
      </template>
      <template #settleStyle="text">
        <span v-if="text == 0">平台收款</span>
        <span v-if="text == 1">api对接</span>
        <span v-if="text == 2">预付收款</span>
      </template>
      <template #status="text">
        <span v-if="text == 0">冻结</span>
        <span v-if="text == 1">正常</span>
      </template>
      <template #isInternalTest="text">
        <span v-if="text">是</span>
        <span v-else>否</span>
      </template>
      <template #isAutoDeduct="text">
        <span v-if="text == 0">手动确认</span>
        <span v-if="text == 1">自动扣费</span>
      </template>

      <template #withdrawalFee="record">
        <span>{{ record.settlementRate }} %</span>
        <span v-if="record.withdrawalFee">
          + {{ record.withdrawalFee }} 元/笔
        </span>
      </template>

      <!-- <template #agreementUrl="text">
        <div class="img-box">
          <img
            v-show="text"
            v-lazy:ant-table-body="text"
            alt=""
            @click="$previewImg(text)"
          />
        </div>
      </template> -->

      <template #action="record">
        <p style="margin: 8px 0;">
          <span
            class="action edit"
            @click="handleAction('edit', record)"
          >
            编辑
          </span>
        </p>
        <p
          v-if="record.agreementUrl"
          style="margin: 8px 0;"
        >
          <span
            class="action edit"
            @click="$previewImg(record.agreementUrl)"
          >
            合同
          </span>
        </p>
      </template>
    </a-table>
    <!-- 货代商编辑新增 -->
    <ForwarderModal
      v-model="editVisible"
      :current-obj.sync="currentObj"
      :action-type.sync="actionType"
      @ok="getList"
    />
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import ForwarderModal from './components/ForwarderModal'
import { debounce, setTableHeight } from '@/utils'
import { getForwarderList } from '@/api/usermanage'
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
    ForwarderModal
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
      formModel: {
        isInternalTest: 0
      },
      title: '',
      currentObj: {},
      actionType: 'edit' // 操作类型
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '账号/货代商',
          itemType: 'input',
          key: 'params',
          placeholder: '请输入账号/货代商',
          itemProp: {
            style: 'width:230px'
          }
        },
        {
          label: '推荐码',
          itemType: 'input',
          key: 'no',
          placeholder: '请输入推荐码'
        },
        {
          label: '是否内测',
          itemType: 'select',
          key: 'isInternalTest',
          itemData: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        {
          label: '创建时间段',
          itemType: 'rangePicker',
          key: 'startTimeArr',
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
          title: '货代推荐码',
          dataIndex: 'no'
        },
        {
          title: '货代商名称/账号',
          key: 'forwarder',
          scopedSlots: { customRender: 'forwarder' },
          width: '200px'
        },
        {
          title: '姓名/联系方式',
          key: 'contacts',
          scopedSlots: { customRender: 'contacts' }
        },
        {
          title: '结算方式',
          dataIndex: 'settleStyle',
          scopedSlots: { customRender: 'settleStyle' }
        },
        {
          title: '账号状态',
          dataIndex: 'accountStatus',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '是否内测',
          dataIndex: 'isInternalTest',
          scopedSlots: { customRender: 'isInternalTest' }
        },
        {
          title: '出库扣费',
          dataIndex: 'isAutoDeduct',
          scopedSlots: { customRender: 'isAutoDeduct' }
        },
        {
          title: '提现手续费',
          key: 'withdrawalFee',
          scopedSlots: { customRender: 'withdrawalFee' }
        },
        {
          title: 'OMS地址',
          dataIndex: 'accessLink'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: '130px'
        },

        // {
        //   title: '合同',
        //   dataIndex: 'agreementUrl',
        //   scopedSlots: { customRender: 'agreementUrl' }
        // },
        // {
        //   title: '结算手续费',
        //   dataIndex: 'settlementRate'
        // },
        // {
        //   title: '最大预付金额',
        //   dataIndex: 'maxPrePayMoney'
        // },
        // {
        //   title: '提现单笔手续费(元)',
        //   dataIndex: 'withdrawalFee'
        // },
        // {
        //   title: '备注',
        //   dataIndex: 'remark',
        //   ellipsis: true
        // },

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
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.formModel,
        this.params
      )
      if (this.formModel.startTimeArr) {
        params.startTime = this.formModel.startTimeArr[0]
        params.endTime = this.formModel.startTimeArr[1]
        console.log(this.formModel.startTimeArr)
      }
      try {
        const { data } = await getForwarderList(params)
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
    handleAction(type, obj = {}) {
      this.actionType = type
      if (obj['isInternalTest']) {
        obj['isInternalTest'] = 1
      } else {
        obj['isInternalTest'] = 0
      }
      this.currentObj = obj

      this.editVisible = true
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

  .img-box {
    width: 80px;
    height: 80px;
    padding: 5px 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .btn-box {
    & > button:not(:last-child) {
      margin-right: 5px;
    }
  }

  .edit {
    color: @primary-color;
    cursor: pointer;
  }
}
</style>
