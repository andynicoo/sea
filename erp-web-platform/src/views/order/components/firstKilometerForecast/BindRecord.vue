<template>
  <div>
    <!-- 搜索块 -->
    <TableFilter
      :colItem="colItem"
      :formModel="searchParams"
      @selectSearch="selectSearch"
      @selectBlur="selectBlur"
      @submit="reLoadData"
      @reset="resetSearch"
    />
    <div class="me-mt-4 me-mb-2 me-tip12">
      注意：此页面仅显示过去90天的绑定记录
    </div>

    <!-- 绑定记录列表 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="{record => record.index}"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
    >
      <template slot="fmType" slot-scope="text, record">
        {{
          record.fmType == 1
            ? '快递寄送（不包括：货拉拉类卖家，自送仓库）'
            : '非快递寄送（包括：免费/付费揽收，集货点）'
        }}
      </template>
      <template slot="bindStatus" slot-scope="text, record">
        {{ record.bindStatus == 1 ? '成功' : '失败' }}
      </template>
    </a-table>
  </div>
</template>

<script>
import Order from '@/api/order'
import tableMixins from '@/mixins/tableMixins'
import fmMixins from './mixins'
import TableFilter from '@/components/tableFilter'
export default {
  mixins: [tableMixins, fmMixins],
  components: {
    TableFilter
  },
  props: {},
  data() {
    return {
      searchParams: {
        //绑定记录搜索参数
        ordersn: null,
        logisticName: null,
        trackingNumber: null
        // fmType: null
      },
      shippingMethodList: [
        //寄送方式
        { label: '非快递寄送（包括：免费/付费揽收，集货点）', value: 2 },
        { label: '快递寄送（不包括：货拉拉类卖家，自送仓库）', value: 1 }
      ],
      logisticsListSource: [], //物流商列表数据源
      logisticsList: [], //物流商列表
      columns: [
        //绑定记录标题
        {
          title: '批次号/快递单号',
          dataIndex: 'trackingNumber',
          key: 'trackingNumber'
        },
        {
          title: '订单号',
          dataIndex: 'ordersn',
          key: 'ordersn'
        },
        {
          title: '物流商',
          dataIndex: 'logisticName',
          key: 'logisticName'
        },
        {
          title: '首公里运输方式',
          dataIndex: 'fmType',
          key: 'fmType',
          scopedSlots: { customRender: 'fmType' }
        },
        {
          title: '状态',
          dataIndex: 'bindStatus',
          key: 'bindStatus',
          scopedSlots: { customRender: 'bindStatus' }
        },
        {
          title: '更新时间',
          dataIndex: 'createTime',
          key: 'createTime'
        }
      ]
    }
  },
  computed: {
    colItem({ shippingMethodList }) {
      //绑定记录搜索配置
      return [
        {
          itemType: 'input',
          label: '订单编号',
          key: 'ordersn',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'input',
          label: '物流商',
          key: 'logisticName',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'input',
          label: '批次号/快递单号',
          key: 'trackingNumber',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'select',
          label: '首公里运输方式',
          key: 'fmType',
          itemProp: {
            style: 'width:190px',
            dropdownMatchSelectWidth: false
          },
          itemData: shippingMethodList
        }
      ]
    }
  },
  created() {
    if (this.$route.query.sn) {
      this.$data.searchParams.ordersn = this.$route.query.sn
    }
  },

  methods: {
    //获取绑定记录列表
    getTableData() {
      let {
        //绑定记录搜索参数
        ordersn,
        logisticName,
        trackingNumber,
        fmType
      } = this.$data.searchParams
      return Order.listShopeeFirstMileBindLog({
        ...this.$data.paginationData,
        ordersn: ordersn ? ordersn : null,
        logisticName: logisticName ? logisticName : null,
        trackingNumber: trackingNumber ? trackingNumber : null,
        fmType: fmType ? fmType : null
      })
    },
    //重置搜索
    resetSearch() {
      this.$data.searchParams = {
        //绑定记录搜索参数
        ordersn: null,
        logisticName: null,
        trackingNumber: null
        // fmType: null
      }
      this.$data.paginationData = {
        size: '10',
        current: 1,
        total: 0
      }
      this.reLoadData()
    }
  }
}
</script>
<style lang="scss" scoped>
.me-tip12 {
  font-size: 12px;
  color: #999;
}
@media screen and (max-width: 1600px) {
  .me-page-search {
    ::v-deep {
      .ant-form-item label {
        min-width: 115px;
      }
    }
  }
}
</style>
