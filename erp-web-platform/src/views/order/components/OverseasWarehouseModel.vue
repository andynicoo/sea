<template>
  <a-modal
    :title="$t('order.seaDeliver')"
    :visible="showModal"
    width="1400px"
    @cancel="showModal = false"
  >
    <a-table
      :row-key="(record, index) => index"
      :data-source="list"
      :columns="columns"
      :pagination="false"
      :loading="tableLoading"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
    >
      <template slot="ordersn" slot-scope="text, record">
        <p>{{ record.ordersn }}</p>
        <p>{{ record.storeAlias }}</p>
      </template>

      <template slot="shippingCarrier" slot-scope="text, record">
        <div
          class="shippingCarrier-list"
          v-for="(item, index) in record.items"
          :key="index"
        >
          <div class="img">
            <img :src="item.mainImage" class="mainImage" />
          </div>
          <div class="cont">
            <p class="text-name">{{ item.itemName }}</p>
            <p class="text-tip">
              <a-row>
                <a-col span="10">
                  <span
                    >{{ $t('order.localSkuText') }}：{{
                      item.variationSku
                    }}</span
                  >
                </a-col>
                <a-col span="7">
                  <span
                    >{{ $t('order.priceText') }}：{{
                      item.variationDiscountedPrice
                    }}</span
                  >
                </a-col>
                <a-col span="7">
                  <span
                    >{{ $t('order.numberText') }}：{{
                      item.variationQuantityPurchased
                    }}</span
                  >
                </a-col>
              </a-row>
            </p>
            <p class="text-tip">
              <span>{{ $t('order.seaSkuText') }}： </span>
              <span
                v-if="item.warehouseIds.indexOf(record.warehouseId) !== -1"
                >{{ $t('order.pairEd') }}</span
              >
              <span v-else style="color:red;">{{ $t('order.pairTips') }}</span>
            </p>
          </div>
        </div>
      </template>

      <template slot="trackingNo" slot-scope="text, record">
        <p>{{ record.shippingCarrier }}</p>
        <p v-if="record.trackingNo">{{ record.trackingNo }}</p>
        <p
          v-else
          style="color:red;cursor: pointer;"
          @click="getOrderSendType(record.ordersn)"
        >
          {{ $t('order.applicationWaybillNumber') }}
        </p>
      </template>

      <template slot="seaSystems" slot-scope="text, record">
        <a-select
          v-model="record.warehouseId"
          @change="changeWarehouse($event, record)"
          placeholder="请选择仓库"
          style="width: 160px;margin-right:10px"
        >
          <a-select-option
            v-for="(li, index) of record.warehouseList"
            :key="index"
            :value="li.value"
          >
            {{ li.text }}
          </a-select-option>
        </a-select>
        <!-- <a-select
          v-model="record.shippingId"
          @change="changeShipping($event, record)"
          placeholder="请选择运输方式"
          style="width: 160px"
        >
          <a-select-option
            v-for="(li, index) of record.shippingType"
            :key="index"
            :value="li.transportCode"
          >
            {{ li.transportName }}
          </a-select-option>
        </a-select> -->
      </template>
    </a-table>

    <template slot="footer">
      <span style="float:left">
        {{ $t('order.commonText') }}
        <span class="color-tip">{{ list.length }}</span>
        {{ $t('order.footerTip') }}
        <span class="color-tip">{{ selectedRows.length }}</span>
        {{ $t('order.shopeeOrder') }}
      </span>
      <a-button key="back" @click="showModal = false">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button
        key="submit"
        @click="submit"
        type="primary"
        :loading="confirmLoading"
      >
        {{ $t('common.ok') }}
      </a-button>
    </template>

    <ChangePackStateModal
      :showModal="showStateModal"
      :content="content"
      :order-sn="orderSn"
      @close="showStateModal = false"
      @submitWaybillNum="getList()"
      :modal-title="$t('order.Shipment')"
    ></ChangePackStateModal>
  </a-modal>
</template>

<script>
import ChangePackStateModal from './ChangePackStateModal'
import Order from '@/api/order'
import Package from '@/api/package'
export default {
  name: 'OverseasWarehouseModel',
  components: {
    ChangePackStateModal
  },
  props: {
    ordersnsArr: {
      default: []
    }
  },
  data() {
    return {
      showModal: false,
      confirmLoading: false,
      tableLoading: false,
      list: [],
      selectedRows: [],
      selectedRowKeys: [],
      showStateModal: false,
      content: [],
      orderSn: '',
      columns: [
        {
          title: this.$t('order.orderNum'),
          dataIndex: 'ordersn',
          scopedSlots: { customRender: 'ordersn' },
          width: '160px'
        },
        {
          title: this.$t('order.orderProduct'),
          dataIndex: 'shippingCarrier',
          scopedSlots: { customRender: 'shippingCarrier' }
        },
        {
          title: this.$t('order.logisticsInfo'),
          dataIndex: 'trackingNo',
          scopedSlots: { customRender: 'trackingNo' },
          width: '160px'
        },
        {
          title: this.$t('order.deliverOpt'),
          dataIndex: 'seaSystems',
          scopedSlots: { customRender: 'seaSystems' },
          width: '400px'
        }
      ]
    }
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.$nextTick(function() {
          this.getList()
        })
      } else {
        this.list = []
        this.selectedRows = []
        this.selectedRowKeys = []
      }
    }
  },
  computed: {},
  methods: {
    //提交
    submit() {
      if (this.selectedRows.length === 0) {
        this.errorAlert(this.$t('order.selectOrder'))
        return false
      }
      const ordersArr = []
      for (let ele of this.selectedRows) {
        let order = {
          ordersn: ele.ordersn,
          outboundWarehouse: ele.outboundWarehouse
        }

        for (let item of ele.items) {
          if (item.warehouseIds.indexOf(ele.warehouseId) === -1) {
            this.errorAlert(this.$t('order.pairTips'))
            return false
          }
        }
        if (!ele.trackingNo) {
          this.errorAlert(this.$t('order.applyTrackingNoTip'))
          return false
        }
        if (!ele.warehouseId) {
          this.errorAlert(this.$t('order.selectWarehouse'))
          return false
        }
        // if (!ele.shippingId) {
        //   this.errorAlert(this.$t('order.selectShipping'))
        //   return false
        // }
        ordersArr.push(order)
      }

      this.confirmLoading = true
      Order.deliverGoods({
        ordersns: ordersArr
      }).then((res) => {
        if (res.code === 0) {
          this.confirmLoading = false
          this.showModal = false
          this.successAlert(this.$t('order.optSuccess'))
          this.$emit('submitDeliver')
        }
      })
    },
    //提交
    submitOld() {
      if (this.selectedRows.length === 0) {
        this.errorAlert(this.$t('order.selectOrder'))
        return false
      }
      const ordersArr = []
      for (let ele of this.selectedRows) {
        let order = {
          ordersn: ele.ordersn,
          trackingNo: ele.trackingNo,
          seaStoreId: ele.warehouseId,
          seaSystemId: ele.seaSystemId,
          transportCode: ele.shippingId,
          transportName: ele.shippingName,
          items: []
        }
        for (let item of ele.items) {
          if (item.warehouseIds.indexOf(ele.warehouseId) === -1) {
            this.errorAlert(this.$t('order.pairTips'))
            return false
          }
          order.items.push({
            variationSku: item.variationSku,
            variationQuantityPurchased: item.variationQuantityPurchased
          })
        }
        if (!ele.trackingNo) {
          this.errorAlert(this.$t('order.applyTrackingNoTip'))
          return false
        }
        if (!ele.warehouseId) {
          this.errorAlert(this.$t('order.selectWarehouse'))
          return false
        }
        // if (!ele.shippingId) {
        //   this.errorAlert(this.$t('order.selectShipping'))
        //   return false
        // }
        ordersArr.push(order)
      }

      this.confirmLoading = true
      Order.deliverGoods({
        orders: ordersArr
      }).then((res) => {
        if (res.code === 0) {
          // if(res?.data.failOrders?.length > 0){
          //   //this.errorAlert(this.$t('order.selectShipping'));
          // }else{
          //   this.successAlert(this.$t('order.optSuccess'));
          // }
          this.confirmLoading = false
          this.showModal = false
          this.successAlert(this.$t('order.optSuccess'))
          this.$emit('submitDeliver')
        }
      })
    },
    //获取列表数据
    getList() {
      this.tableLoading = true
      Order.deliverGoodsList({
        ordersns: this.ordersnsArr || []
      }).then((res) => {
        this.setListData(res?.data || [])
      })
    },
    //设置列表数据
    setListData(list) {
      if (list?.length > 0) {
        list.forEach((ele) => {
          //--------------订单
          let idsArr = [] //订单海外仓id集合
          ele.warehouseList = [] //订单仓库选择列表
          ele.shippingType = [] //订单选择方式列表
          if (ele.items?.length > 0) {
            ele.items?.forEach((item) => {
              //-----------------商品
              item.warehouseIds = [] //商品支持海外仓库id集合
              if (item.seaSystems?.length > 0) {
                item?.seaSystems.forEach((sea) => {
                  //-----------------服务商
                  let name = sea.serviceProviderName //服务商名称

                  if (sea.overSeasStores?.length > 0) {
                    sea.overSeasStores.forEach((warehouse) => {
                      //-----------------仓库
                      if (
                        item.warehouseIds.indexOf(warehouse.seaStoreId) === -1
                      ) {
                        item.warehouseIds.push(warehouse.seaStoreId)
                      }
                      if (idsArr.indexOf(warehouse.seaStoreId) === -1) {
                        idsArr.push(warehouse.seaStoreId)
                        ele.warehouseList.push({
                          outboundWarehouse: warehouse.outboundWarehouse,
                          value: warehouse.seaStoreId,
                          text: name + '-' + warehouse.storeName,
                          seaSystemId: warehouse.seaSystemId, //服务商id
                          transports: warehouse.transports || [], //运输方式
                          seaSku: sea.sku //+++++++++++
                        })
                      }
                      if (
                        ele.shippingType.length === 0 &&
                        warehouse.transports?.length > 0
                      ) {
                        ele.shippingType = warehouse.transports
                      }
                    })
                  }
                })
              }
            })
          }
          ele.outboundWarehouse =
            ele.warehouseList[0]?.outboundWarehouse || null
          ele.warehouseId = ele.warehouseList[0]?.value || null
          ele.seaSystemId = ele.warehouseList[0]?.seaSystemId || null
          ele.seaSku = ele.warehouseList[0]?.seaSku || null

          ele.shippingId = null
          ele.shippingName = null
        })
      }
      // console.log(list);
      this.list = list
      this.tableLoading = false
    },
    //改变仓库
    changeWarehouse(value, record) {
      let obj = record.warehouseList.find((v) => {
        return v.value === value
      })
      record.seaSystemId = obj.seaSystemId
      record.seaSku = obj.seaSku

      record.shippingType = obj.transports
      record.shippingId = null
      record.shippingName = null
    },
    //改变仓库
    changeShipping(value, record) {
      let obj = record.shippingType.find((v) => {
        return v.transportCode === value
      })
      record.shippingName = obj.transportName
    },
    // 表格多选选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      this.selectedRows = selectedRows
    },
    //获取出货类型
    getOrderSendType(id) {
      this.orderSn = id
      let that = this
      Package.getPickupType({ ordersn: id }).then((res) => {
        const temp = []
        if (res.data.dropoff) {
          temp.push({
            img: require('@/assets/images/order/shipment.png'),
            title: this.$t('order.shipmentTitle'),
            content: this.$t('order.shipmentContent'),
            color: '#f65cbb',
            key: 'dropoff'
          })
        }
        if (res.data.pickup) {
          temp.push({
            img: require('@/assets/images/order/ship.png'),
            title: this.$t('order.shipTitle'),
            content: this.$t('order.shipContent'),
            color: '#409eff',
            key: 'pickup'
          })
        }
        that.content = temp
        that.showStateModal = true
      })
    }
  }
}
</script>

<style scoped lang="less">
.shippingCarrier-list {
  display: flex;
  padding: 8px 0;
  .img {
    width: 80px;
    img {
      width: 100%;
    }
  }
  .cont {
    flex: 1;
    margin-left: 10px;
    .text-name {
      font-size: 16px;
    }
    .text-tip {
      font-size: 14px;
      color: #999;
    }
  }
}
.color-tip {
  color: #d94c25;
  font-size: 16px;
  padding: 0 5px;
}
</style>
