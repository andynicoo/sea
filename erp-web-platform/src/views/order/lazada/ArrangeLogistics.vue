<template>
  <div>
    <a-modal
      title="选择发货供应商"
      :visible="shippingSupplierVisible"
      width="685px"
      destroyOnClose
      @ok="supplierOk()"
      @cancel="$emit('cancelFalse')"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
    >
      <div class="me-reason" v-for="item in storeIds" :key="item.orderId">
        {{ item.orderId }}：<a-select v-model="item.value" style="width: 220px">
          <a-select-option
            :value="item.name"
            v-for="item in item.supplierList"
            :key="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
    <a-modal
      title="已经为您创建包裹(收据和picklist只能在创建包裹后才能打印)"
      :visible="receiptVisible"
      width="800px"
      destroyOnClose
      @cancel="$emit('cancelFalse')"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button
          key="back"
          @click="receiptBack"
          type="primary"
          v-if="!invoiceNumber"
        >
          修改物流提供商
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="confirmLoading"
          @click="receiptOk"
        >
          确认
        </a-button>
      </template>
      <p>
        总包裹数:{{ selectedOrder.length }}; 总商品数：{{
          packSum(selectedOrder)
        }}
      </p>
      <a-table :columns="columns" :data-source="selectedOrder" rowKey="orderId">
        <template slot="quantity" slot-scope="text, record">{{
          packSum([record])
        }}</template>
        <template slot="provider" slot-scope="text, record">{{
          record.provider
            ? record.provider
            : storeIds.filter((item) => item.orderId == record.orderId)[0].value
        }}</template>
        <template slot="warehouseCode" slot-scope="text, record">{{
          record.warehouseCode
        }}</template>
        <template slot="receipt" slot-scope="text, record">
          <a-input placeholder="收据编号" v-model="record.receiptNo" />
        </template>
        <template slot="trackingCode" slot-scope="text, record">
          {{ record.trackingCode }}
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'orderId',
    key: 'orderId',
    title: '订单号码',
    scopedSlots: { customRender: 'orderId' }
  },
  {
    title: '商品数量',
    dataIndex: 'quantity',
    key: 'quantity',
    scopedSlots: { customRender: 'quantity' }
  },
  {
    title: '供应商',
    dataIndex: 'provider',
    key: 'provider',
    scopedSlots: { customRender: 'provider' }
  },
  {
    title: '收据编号',
    key: 'receipt',
    dataIndex: 'receipt',
    scopedSlots: { customRender: 'receipt' }
  },
  {
    title: '跟踪单号',
    key: 'trackingCode',
    scopedSlots: { customRender: 'trackingCode' }
  },
  {
    title: '仓库',
    key: 'warehouseCode',
    scopedSlots: { customRender: 'warehouseCode' }
  }
]
import { add, floatSub } from '@/util'
import LazadaOrder from '@/api/lazadaOrder'
import orderMixins from './orderMixins'
import Cookies from 'js-cookie'
export default {
  mixins: [orderMixins],
  props: {
    selectedOrder: {
      type: Array
    },
    type: {
      type: String
    },
    invoiceNumber: {
      type: Boolean
    }
  },
  data() {
    return {
      columns,
      storeIds: [],
      shippingSupplierVisible: true,
      receiptVisible: false,
      confirmLoading: false,
      toPackVal: ''
    }
  },
  async created() {
    if (this.invoiceNumber) {
      this.$data.shippingSupplierVisible = false
      this.$data.receiptVisible = true
    }
    this.storeIds = []
    this.selectedOrder.forEach((order) => {
      this.$set(order, 'receiptNo', order.items[0]?.invoiceNumber)
      this.$set(order, 'trackingCode', order.items[0]?.trackingCode)
      this.$set(order, 'provider', order.items[0]?.shipmentProvider)

      if (order.check || order.indeterminate) {
        // if (!this.storeIds.filter((item) => order.storeId == item.id).length) {
        this.storeIds.push({
          orderId: order.orderId,
          id: order.storeId,
          name: order.storeName,
          value: '',
          supplierList: ''
        })
        // }
      }
    })
    if (!this.invoiceNumber) {
      this.storeIds.forEach(async (item) => {
        let { data } = await LazadaOrder.shipmentProviders({
          storeId: item.id
        })
        item.supplierList = data
        if (data.length) {
          item.value = data[0].name
        }
      })
    }
  },
  mounted() {},
  methods: {
    packSum(selectedOrder) {
      console.log(selectedOrder)
      let sum = 0
      selectedOrder.forEach((order) => {
        let itemLen = 0
        order.packList.forEach((pack) => {
          pack.items.forEach((item) => {
            if (item.check) {
              itemLen += 1
            }
          })
        })
        sum = add(sum, itemLen)
        // let itemLen = 0
        // item.items.forEach((item2) => {
        //   if (item2.check) {
        //     itemLen += 1
        //   }
        // })
        // sum = add(sum, itemLen)
      })
      return sum
    },
    //修改物流提供商
    receiptBack() {
      this.$data.shippingSupplierVisible = true
      this.$data.receiptVisible = false
    },
    //收据确定
    async receiptOk() {
      let items = []
      let docs = []
      let flag = false
      this.selectedOrder.forEach((order) => {
        order.packList.forEach((pack) => {
          if (pack.check) {
            pack.items.forEach((item) => {
              if (!order.receiptNo || !order.receiptNo.replace(/\s+/g, '')) {
                flag = true
              }
              items.push({
                itemId: item.orderItemId,
                storeId: order.storeId,
                invoiceNumber: order.receiptNo
              })
              docs.push({
                ati: Cookies.get('_ati'),
                userIp: localStorage.userIp,
                itemId: item.orderItemId,
                storeId: order.storeId,
                docType: this.type
              })
            })
          } else {
            pack.items.forEach((item) => {
              if (item.check) {
                if (!order.receiptNo || !order.receiptNo.replace(/\s+/g, '')) {
                  flag = true
                }
                items.push({
                  itemId: item.orderItemId,
                  storeId: order.storeId,
                  invoiceNumber: order.receiptNo
                })
                docs.push({
                  ati: Cookies.get('_ati'),
                  userIp: localStorage.userIp,
                  itemId: item.orderItemId,
                  storeId: order.storeId,
                  docType: this.type
                })
              }
            })
          }
        })
      })
      if (flag) return this.$message.warning('请填写收据编号!')
      this.confirmLoading = true
      await LazadaOrder.invoiceNumber(items)
      let { data } = await LazadaOrder.orderDocument(docs)
      this.printFace(data)
      this.confirmLoading = false
      this.$emit('loadData')
      this.$emit('cancelFalse')
    },
    //物流提供商确定
    async supplierOk() {
      let items = []
      console.log(this.selectedOrder)
      this.selectedOrder.forEach((order) => {
        order.items.forEach((item) => {
          let provider = this.storeIds.filter((ele) => ele.id == order.storeId)
          if (item.check) {
            items.push({
              itemId: item.orderItemId,
              storeId: order.storeId,
              shippingProvider: provider[0].value
            })
          }
        })
      })
      this.confirmLoading = true
      let { data } = await LazadaOrder.lazadaOrderToPack(items)
      this.toPackVal = data
      this.selectedOrder.forEach((order) => {
        this.toPackVal.forEach((item) => {
          if (item.itemId == order.items[0].orderItemId) {
            order.trackingCode = item.trackingCode
          }
        })
      })

      this.confirmLoading = false
      this.$data.shippingSupplierVisible = false
      this.$data.receiptVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.me-reason {
  margin-bottom: 10px;
}
</style>
