<template>
  <div
    ref="container"
    class="shop-list wrapper"
  >
    <div
      ref="filters"
      class="filters"
    >
      <TableFilter
        :col-item="colItem"
        :form-model="formModel"
        :after-close="afterClose"
        @submit="handleSearch"
        @reset="reset"
      />
    </div>
    <div
      ref="export"
      class="export"
    >
      <a-button
        v-permission:user_shop="['export']"
        type="primary"
        @click="exportShop"
      >导出数据</a-button>
    </div>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record, index) => index"
      :scroll="{ x: 1200, y: 500 }"
      @change="onChange"
    >
      <template #tags="text">
        <div
          v-if="text && text.length"
          class="seller-tags"
        >
          <a-tag
            v-for="item in text"
            :key="item"
            style="margin: 3px"
          >{{
            item
          }}</a-tag>
        </div>
      </template>
      <template #status="text">
        <span>{{ STATUS[text] || '' }}</span>
      </template>
      <template #storeType="text">
        <span>{{ STORE_TYPE[text] || '' }}</span>
      </template>
      <template #authorizedStatus="text">
        <span>{{ authorizedStatus[text] || '' }}</span>
      </template>
      <template #currency="text">
        <div>
          <a-popover
            v-if="text"
            title=""
          >
            <template slot="content">
              <p>{{ text }}</p>
            </template>
            <a-icon
              type="pay-circle"
              width="40"
              height="40"
            />
          </a-popover>
        </div>
      </template>
      <template #storeSales="text">
        <div>￥{{ text ? text : 0 }}</div>
      </template>
      <template #action="record">
        <a-button
          type="link"
          class="xxx"
          @click="viewRecord(record)"
        >
          销售额记录
        </a-button>
        <span
          v-permission:user_shop="['edit']"
          class="edit"
          @click="handleEdit(record)"
        >编辑</span>
      </template>
    </a-table>
    <a-modal
      title="店铺销售额统计"
      :visible="recoVisible"
      :destroy-on-close="true"
      :footer="null"
      :width="700"
      @cancel="handleCancel"
    >
      <div>
        <StoreRecord :stordid="curStoreId" />
      </div>
    </a-modal>
    <a-modal
      v-model="visible"
      title="店铺编辑"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleSava"
    >
      <a-row>
        <a-col
          v-for="(item, index) in shopList"
          :key="item.key"
          :span="item.span || 24"
          class="shop-item"
        >
          <div class="label">{{ item.label }}</div>
          <div class="wrapper">
            <span v-if="!item.render">{{ item.value || '' }}</span>
            <render-expand
              v-else
              :row="item"
              :index="index"
              :render="item.render"
            />
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import renderExpand from './components/render'
import { exportShop, editShop, getShopList } from '@/api/usermanage'
import { debounce, download, setTableHeight } from '@/utils/index'
import StoreRecord from '@/components/StoreRecord/index'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const STATUS = {
  0: '冻结',
  1: '正常'
}
const STORE_TYPE = {
  // 0: '其他',
  1: '本土',
  2: '跨境'
}
const initFormModel = {
  account: '',
  status: '',
  registeredStartTime: undefined,
  bindingStartTime: undefined
}
const authorizedStatus = {
  0: '已解绑',
  1: '正常'
}
export default {
  components: {
    TableFilter,
    renderExpand,
    StoreRecord
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {
        ...initFormModel
      },
      STATUS,
      STORE_TYPE,
      authorizedStatus,
      data: [],
      selectedRowKeys: [],
      paginationParams: {
        ...initPagination
      },
      tableHeight: 'auto',
      params: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}店铺`
      },
      visible: false,
      shopTags: [],
      tagsList: [
        {
          label: '海外仓',
          value: '海外仓',
          key: '0'
        },
        {
          label: '本地卖家',
          value: '本地卖家',
          key: '1'
        },
        {
          label: '跨境卖家',
          value: '跨境卖家',
          key: '2'
        },
        {
          label: '虚拟仓',
          value: '虚拟仓',
          key: '3'
        }
      ],
      sorter: {},
      currentObj: {},
      recoVisible: false,
      curStoreId: ''
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '店铺名称',
          key: 'storeName',
          itemType: 'input'
        },
        // {
        //   label: '用户编号',
        //   itemType: 'input',
        //   key: 'no'
        // },
        {
          label: '卖家账号',
          key: 'maAccount',
          placeholder: '请输入卖家账号/编号',
          itemType: 'input'
        },
        {
          label: '店铺类型',
          key: 'storeType',
          itemType: 'select',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '本土',
              value: '1'
            },
            {
              label: '跨境',
              value: '2'
            }
          ]
        },
        {
          label: '站点',
          key: 'countryCode',
          itemType: 'select',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '台湾',
              value: 'TW'
            },
            {
              label: '新加坡',
              value: 'SG'
            },
            {
              label: '泰国',
              value: 'TH'
            },
            {
              label: '印度尼西亚',
              value: 'ID'
            },
            {
              label: '菲律宾',
              value: 'PH'
            },
            {
              label: '越南',
              value: 'VN'
            },
            {
              label: '巴西',
              value: 'BR'
            },
            {
              label: '马来西亚',
              value: 'MY'
            },
            {
              label: '墨西哥',
              value: 'MEX'
            }
          ]
        },
        {
          label: '销售额区间',
          itemType: 'rangePickerMonth',
          key: 'yearMonth',
          itemProp: {},
          key2: 'salesRange',
          itemProp2: {},
          itemData2: [
            {
              label: '1万以下',
              value: '1'
            },
            {
              label: '1万-5万',
              value: '2'
            },
            {
              label: '5万-10万',
              value: '3'
            },
            {
              label: '10万以上',
              value: '4'
            }
          ]
        },

        {
          label: '绑定状态',
          itemType: 'select',
          key: 'authorizedStatus',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '已解绑',
              value: '0'
            },
            {
              label: '正常',
              value: '1'
            }
          ]
        },
        // {
        //   label: '注册时间段',
        //   itemType: 'rangePicker',
        //   key: 'registeredStartTime',
        //   itemProp: {
        //     disabledDate(val) {
        //       if (!val) {
        //         return false
        //       }
        //       return val.valueOf() > Date.now()
        //     }
        //   }
        // },
        {
          label: '绑定店铺时间段',
          itemType: 'rangePicker',
          key: 'bindingStartTime',
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
          title: '店铺名称',
          dataIndex: 'storeName',
          width: 150
        },
        {
          title: '用户编号',
          dataIndex: 'no',
          width: 150
        },
        {
          title: '卖家账号',
          dataIndex: 'maAccount',
          width: 150
        },
        {
          title: '店铺类型',
          dataIndex: 'storeType',
          scopedSlots: {
            customRender: 'storeType'
          },
          width: 150
        },
        {
          title: '站点',
          dataIndex: 'countryCode',
          width: 150
        },
        {
          title: '销售币',
          dataIndex: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: 150
        },
        {
          title: '本月销售额',
          dataIndex: 'storeSales',
          sorter: (a, b) => a.storeSales - b.storeSales,
          scopedSlots: { customRender: 'storeSales' },
          width: 150
        },
        // {
        //   title: '店铺标签',
        //   dataIndex: 'labels',
        //   width: 160,
        //   scopedSlots: { customRender: 'tags' }
        // },
        {
          title: '绑定店铺时间',
          dataIndex: 'bindingTime',
          width: 200
        },
        {
          title: '店铺绑定状态',
          dataIndex: 'authorizedStatus',
          width: 160,
          scopedSlots: {
            customRender: 'authorizedStatus'
          }
        },
        // {
        //   title: '用户手机号',
        //   dataIndex: 'maAccount'
        // },
        // {
        //   title: '店铺数',
        //   dataIndex: 'storecount'
        // },
        // {
        //   title: '订单量',
        //   dataIndex: 'ordercount',
        //   sorter: true
        // },
        // {
        //   title: '商品数',
        //   dataIndex: 'productcount',
        //   sorter: true
        // },
        // {
        //   title: '销售额',
        //   dataIndex: 'turnover',
        //   sorter: true
        // },
        // {
        //   title: '注册时间',
        //   dataIndex: 'registeredTime'
        // },
        // {
        //   title: '最后登录时间',
        //   dataIndex: 'lastLoginTime'
        // },
        // {
        //   title: '绑定ERP状态',
        //   dataIndex: 'status',
        //   scopedSlots: { customRender: 'status' }
        // }
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    },
    shopList({ currentObj }) {
      return [
        {
          label: '用户手机号',
          span: 24,
          key: 'maAccount',
          value: currentObj.maAccount
        },
        {
          label: '用户编号',
          span: 24,
          key: 'no',
          value: currentObj.no
        },
        {
          label: '绑定店铺数',
          span: 24,
          key: 'shopCount',
          value: currentObj.storecount
        },
        {
          label: '绑定店铺时间',
          span: 24,
          key: 'shopTime',
          value: currentObj.bindingTime
        },
        {
          label: '店铺标签',
          span: 24,
          key: 'label',
          render: (h, { row: item }) => this.renderItem(item)
        }
        // {
        //   label: '绑定ERP状态',
        //   key: 'status',
        //   value: STATUS[currentObj.status]
        // }
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
    async setTableHeight() {
      setTableHeight(this)
    },
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return time
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams,
        this.params,
        this.formModel,
        this.getStartOrEndTime(),
        this.salesRange()
      )
      try {
        const { data } = await getShopList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    // 销售额
    salesRange() {
      let sales = {}
      if (this.formModel.salesRange === '1') {
        sales.endSales = 10000
      } else if (this.formModel.salesRange === '2') {
        sales.beginSales = 10000
        sales.endSales = 50000
      } else if (this.formModel.salesRange === '3') {
        sales.beginSales = 50000
        sales.endSales = 100000
      } else if (this.formModel.salesRange === '4') {
        sales.beginSales = 100000
      }
      return sales
    },
    onSelectChange(selected) {
      this.selectedRowKeys = selected
    },
    handleEdit(record) {
      const obj = Object.create(null)
      Object.entries(record).forEach(([key, value]) => {
        obj[key] = value ?? undefined
      })
      this.currentObj = { ...obj }
      this.visible = true
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
    // 修改保存时
    async handleSava() {
      try {
        await editShop(this.currentObj)
        this.visible = false
        this.$message.success('修改成功')
        this.getList()
      } catch (error) {
        console.error(error)
      }
    },
    afterClose() {
      this.currentObj = {}
    },
    renderItem(item) {
      return (
        <a-select
          v-model={this.currentObj.labels}
          size="small"
          mode="tags"
          maxTagCount={3}
          on-change={(e) => this.handleChange(e, item)}
          placeholder="请选择标签">
          {this.tagsList.map((item) => (
            <a-select-option key={item.value}>{item.label}</a-select-option>
          ))}
        </a-select>
      )
    },
    handleChange(e, item) {
      // this.currentObj.labels = e.length > 3 ? e.slice(1, e.length) : e
      console.log(e, item)
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
    },
    // 解构时间字段
    getStartOrEndTime() {
      const [registeredStartTime, registeredEndTime] =
        this.formModel.registeredStartTime || []
      const [bindingStartTime, bindingEndTime] =
        this.formModel.bindingStartTime || []
      return {
        registeredStartTime: this.formattime(registeredStartTime),
        registeredEndTime: this.formattime(registeredEndTime),
        bindingStartTime: this.formattime(bindingStartTime),
        bindingEndTime: this.formattime(bindingEndTime),
        yearMonth: this.formModel.yearMonth
          ? moment(this.formModel.yearMonth).format('YYYY-MM')
          : ''
      }
    },
    async exportShop() {
      const params = Object.assign(
        {},
        this.formModel,
        this.getStartOrEndTime(),
        this.salesRange()
      )
      try {
        const result = await exportShop(params)
        download(result, '店铺列表')
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    viewRecord(record) {
      this.recoVisible = true
      this.curStoreId = record.storeId
    },
    handleCancel() {
      this.recoVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.shop-list {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .export {
    display: flex;
    padding-top: 22px;
    padding-bottom: 12px;
  }
  .edit {
    cursor: pointer;
    color: @primary-color;
  }
}
.shop-item {
  display: flex;
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  .label {
    margin-right: 10px;
    &::after {
      content: ':';
      height: 100%;
    }
  }
  .wrapper {
    flex: 1;
    ::v-deep .ant-select {
      width: 320px;
    }
  }
}
button.xxx {
  padding: 0px;
}
</style>
