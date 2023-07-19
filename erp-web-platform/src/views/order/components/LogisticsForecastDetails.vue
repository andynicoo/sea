<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="ordersn"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="fmStatus" slot-scope="text, record">
        {{ stateTransition(record.fmStatus) }}
      </template>
      <template slot="fmCollectStatus" slot-scope="text, record">
        {{ record.fmCollectStatus ? $t('common.yes') : $t('common.no') }}
        <!--是否揽收 0: 否， 1：是 -->
      </template>
      <template slot="fmShoppeeStatus" slot-scope="text, record">
        {{ record.fmShoppeeStatus ? $t('common.yes') : $t('common.no') }}
        <!--Shopee转运仓收货 0: 否， 1：是 -->
      </template>

      <template slot="handler" slot-scope="text, record">
        <a-button v-if="record.fmStatus == 1 && !record.fmCollectStatus" type="link" @click="unbundling(record)">
          {{ $t('order.untie') }}
        </a-button>
        <a-button v-if="record.fmStatus == 0 && !record.fmCollectStatus" type="link" @click="reBind">
          {{ $t('order.reBind') }}
        </a-button>
      </template>
    </a-table>
    <div class="ant-modal-footer">
      <a-button @click="forecastCancel()"
        >{{ $t('common.close') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import Order from '@/api/order'
export default {
  props: {
    forecastCancel: {
      type: Function,
      default: null
    },
    getOrderList: {
      type: Function,
      default: null
    },
    reBind: {
      type: Function,
      default: null
    },
    currOderId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      columns: [
        {
          title: this.$t('order.trackingNumber'),
          dataIndex: 'fmNo',
          key: 'fmNo',
        },
        {
          title: this.$t('order.logisticsProviders'),
          dataIndex: 'fmLogisticName',
          key: 'fmLogisticName'
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'fmStatus',
          key: 'fmStatus',
          scopedSlots: { customRender: 'fmStatus' }
        },
        {
          title: this.$t('order.submitTime'),
          dataIndex: 'fmCreateTime',
          key: 'fmCreateTime'
        },
        {
          title: this.$t('order.ynTakeGoods'),
          dataIndex: 'fmCollectStatus',
          key: 'fmCollectStatus',
          scopedSlots: { customRender: 'fmCollectStatus' }
        },
        {
          title: 'Shopee' + this.$t('order.warehouseReceipt'),
          dataIndex: 'fmShoppeeStatus',
          key: 'fmShoppeeStatus',
          scopedSlots: { customRender: 'fmShoppeeStatus' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      dataSource:[],
      tableLoading:false
    }
  },
  mounted() {
    this.getTableData()
  },

  methods: {
    //获取绑定数据
    async getTableData() {
      console.log(999)
      this.$data.dataSource = []
      this.$data.tableLoading = true
      let res = await Order.orderFmInfo({ ordersn: this.$props.currOderId })
      this.$data.tableLoading = false
      if (res.code === 0) {
        this.$data.dataSource.push(res.data) 
      } else {
        this.$Message({ type: 'error', content: `${message}` })
      }
    },
    //状态转换
    stateTransition(fmStatus) {
      let text
      if (fmStatus == 1) {
        text = this.$t('order.bindSuccess')
      } else if (fmStatus == 0) {
        text = this.$t('order.bindFailed')
      } else if (fmStatus == 3) {
        text = this.$t('order.unbindSuccess')
      } else if (fmStatus == 4) {
        text = this.$t('order.unbindFailed')
      } else {
        text = this.$t('order.processing')
      }
      return text
    },
    //解绑
    unbundling(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('order.areYouUntie'),
        onOk: async () => {
          let res = await Order.orderFmCancel({ ordersn: row.ordersn })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            this.forecastCancel()
            this.getOrderList()
          } else {
            this.$Message({ type: 'error', content: `${message}` })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-modal-footer {
  padding-bottom: 0;
}
.me-forecast-tips {
  padding-bottom: 10px;
}
</style>
