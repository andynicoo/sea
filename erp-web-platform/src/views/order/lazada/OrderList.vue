<template>
  <div class="me-mt-3">
    <a-dropdown>
      <a-button type="primary" class="me-mr-2 me-ml-4">
        <div>{{ $t('order.synOnlineOrders') }}</div>
      </a-button>
      <a-menu slot="overlay">
        <a-menu-item @click="syncShop(false)"> 同步最近30天 </a-menu-item>
        <a-menu-item @click="syncShop(true)"> 自定义时间 </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown
      v-if="['pending,repacked', 'packed,ready_to_ship'].includes(activeKey)"
      :disabled="this.checkLength == 0"
    >
      <a-button class="me-mr-2" type="primary" :loading="printLoading">{{
        activeKey == 'pending,repacked' ? '创建包裹并打印' : '打印'
      }}</a-button>
      <a-menu slot="overlay">
        <a-menu-item
          v-if="
            ['pending,repacked', 'packed,ready_to_ship'].includes(activeKey)
          "
          @click="orderDocument('invoice')"
        >
          打印收据
        </a-menu-item>
        <a-menu-item
          v-if="
            ['pending,repacked', 'packed,ready_to_ship'].includes(activeKey)
          "
          @click="orderDocument('shippingLabel')"
        >
          打印物流单号
        </a-menu-item>
        <a-menu-item
          v-if="
            ['packed,ready_to_ship'].includes(activeKey) && isPackedLength == 0
          "
          @click="orderDocument('carrierManifest')"
        >
          打印承运人
        </a-menu-item>
        <a-menu-item @click="orderDocument('erp')">
          打印拣货单
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-spin :spinning="spinning" class="me-card-fff">
      <ul class="me-orderList-flex me-orderList-bar me-mt-2">
        <li class="me-w40 me-pl-2">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="checkAllChange"
          ></a-checkbox>
        </li>
        <li class="me-w20b">
          商品信息
        </li>
        <li>
          零售价
        </li>
        <li>
          状态
        </li>
        <li
          v-if="
            [
              'unpaid',
              'canceled',
              'returned',
              'shipped_back_success,shipped_back'
            ].includes(activeKey) && activeKey != 0
          "
        >
          {{ activeKey == 'unpaid' ? '仓库' : '取消原因' }}
        </li>
        <li
          v-if="
            [
              'pending,repacked',
              'packed,ready_to_ship',
              'shipped',
              'delivered',
              'returned',
              9
            ].includes(activeKey) || activeKey == 0
          "
        >
          总价
        </li>
        <li
          v-if="
            ['pending,repacked', 'packed,ready_to_ship'].includes(activeKey) ||
              activeKey == 0
          "
        >
          送达分拣中心时效
        </li>
        <li v-if="['canceled'].includes(activeKey) && activeKey != 0">
          取消时间
        </li>
        <li>
          创建时间
        </li>
        <li
          v-if="
            [
              'pending,repacked',
              'packed,ready_to_ship',
              'shipped',
              'delivered',
              'returned',
              'shipped_back_success,shipped_back',
              9
            ].includes(activeKey)
          "
        >
          操作
        </li>
      </ul>
      <div v-if="dataSource.length > 0">
        <div
          class="me-orderList-info me-mt-3"
          v-for="order in dataSource"
          :key="order.orderId"
        >
          <!-- v-show="order.status == activeKey || activeKey == 0" -->

          <p class="me-orderList-info-head me-pl-2">
            <a-checkbox
              :indeterminate="order.indeterminate"
              :checked="order.check"
              @change="(e) => checkOrderChange(e, order)"
            ></a-checkbox>
            <a-button
              class="me-ml-3 me-mr-1"
              size="small"
              @click="syncCurrOrder(order)"
              >{{ $t('order.syncOrder') }} </a-button
            ><span class="me-cp"
              ><b>订单号:</b
              ><span @click="goOrderDetails(order)">{{
                order.orderNumber
              }}</span
              ><i
                style="color: rgba(0, 0, 0, 0.54)"
                v-copy="order.orderNumber"
                title="复制"
                class="iconfont iconjuxing1 hand copy-icon"
              ></i
            ></span>
            <span
              ><b class="me-line">类型：</b
              >{{ order.items[0] ? order.items[0].orderType : '-' }}</span
            >
            <span
              ><b class="me-line">买家昵称：</b
              >{{ order.customerFirstName }}</span
            >
            <span
              ><b class="me-line">店铺：</b>
              <div class="me-site-box me-mr-1">
                {{ getCountry(order.countryCode) }}
              </div>
              {{ order.storeName }}</span
            >
          </p>
          <div v-for="(pack, index) in order.packList" :key="index">
            <p
              class="me-orderList-info-head me-orderList-info-ship"
              v-if="
                ['packed,ready_to_ship', 'shipped', 'delivered'].includes(
                  activeKey
                )
              "
            >
              <a-checkbox
                :checked="pack.check"
                @change="(e) => checkItemChange(e, pack, order, 'packList')"
                class="me-mr-2"
              ></a-checkbox>
              <span><b>包裹跟踪单号:</b>{{ pack.items[0].trackingCode }}</span>
              <span
                ><b>运输方式：</b>{{ pack.items[0].shippingProviderType }}</span
              >
              <span v-if="['shipped', 'delivered'].includes(activeKey)"
                ><b>物流公司：</b>{{ pack.items[0].shipmentProvider }}</span
              >
            </p>
            <ul class="me-goods-flex">
              <li class="me-w20b40">
                <dl
                  class="me-goods-info"
                  v-for="item in pack.items"
                  :key="item.orderItemId"
                >
                  <dt>
                    <a-checkbox
                      :checked="item.check"
                      @change="(e) => checkItemChange(e, item, order)"
                      class="me-mr-2"
                      v-if="['pending,repacked'].includes(activeKey)"
                    ></a-checkbox>
                    <a-popover placement="right">
                      <template slot="content">
                        <img
                          style="width: 220px; height: 220px"
                          v-lazy="item.productMainImage"
                        />
                      </template>
                      <img
                        style="width: 64px; height: 64px"
                        v-lazy="item.productMainImage"
                      />
                    </a-popover>
                  </dt>
                  <dd>
                    <h3 class="me-em2">
                      <a-tooltip>
                        <template slot="title"> {{ item.name }} </template
                        >{{ item.name }}</a-tooltip
                      >
                    </h3>
                    <div class="me-em1">
                      <a-tooltip>
                        <template slot="title"> {{ item.sku }} </template>
                        <span>sellerSku: {{ item.sku }}</span>
                      </a-tooltip>
                    </div>
                  </dd>
                </dl>
              </li>
              <li class="me-flex-column">
                <div
                  class="me-flex-columu-sub"
                  v-for="item in pack.items"
                  :key="item.orderItemId"
                >
                  <p class="me-flex-li-sub">
                    {{ item.itemPrice }} {{ item.currency }}
                  </p>
                </div>
              </li>
              <li class="me-flex-column">
                <div
                  class="me-flex-columu-sub"
                  v-for="item in pack.items"
                  :key="item.orderItemId"
                >
                  <p class="me-flex-li-sub">
                    {{ statusMap(item.status) }}
                  </p>
                </div>
              </li>
              <!--
              v-if="
                [
                  'unpaid',
                  'packed,ready_to_ship',
                  'shipped',
                  'canceled',
                  'returned',
                  'shipped_back_success'
                ].includes(activeKey)
              " 
              <li
              v-if="
                ['pending,repacked', 'delivered', 9].includes(activeKey) ||
                  activeKey == 0
              "
            >
              <div class="me-flex-li-sub">
                {{ statusMap(order.items[0].status)
                }}{{ order.items[0].status }}
              </div>
            </li> -->
              <li
                class="me-flex-column"
                v-if="
                  [
                    'unpaid',
                    'canceled',
                    'returned',
                    'shipped_back_success,shipped_back'
                  ].includes(activeKey) && activeKey != 0
                "
              >
                <div
                  class="me-flex-columu-sub"
                  v-for="item in pack.items"
                  :key="item.orderItemId"
                >
                  <p class="me-flex-li-sub" v-if="activeKey == 'unpaid'">
                    {{ item.warehouseCode }}
                  </p>
                  <p
                    class="me-flex-li-sub"
                    v-else-if="item.cancelReturnInitiator"
                  >
                    {{ item.cancelReturnInitiator.split('-')[0] }} -
                    {{ item.reason }}
                  </p>
                </div>
              </li>
              <li
                v-if="
                  [
                    'pending,repacked',
                    'packed,ready_to_ship',
                    'shipped',
                    'delivered',
                    'returned',
                    9
                  ].includes(activeKey) || activeKey == 0
                "
              >
                <div class="me-flex-li-sub">
                  {{ grandTotal(pack) }} {{ pack.items[0].currency }}
                  <p>包含运费</p>
                </div>
              </li>
              <li
                v-if="
                  ['pending,repacked', 'packed,ready_to_ship'].includes(
                    activeKey
                  ) || activeKey == 0
                "
              >
                <div class="me-flex-li-sub">
                  <p>{{ pack.items[0].slaTimeStamp }}</p>
                  <p
                    v-if="
                      ['pending,repacked', 'packed,ready_to_ship'].includes(
                        activeKey
                      )
                    "
                    class="me-remaining"
                    :class="{ remainingRed: pack.remainingTime == '已超时' }"
                  >
                    {{ pack.remainingTime }}
                  </p>
                </div>
              </li>
              <li v-if="['canceled'].includes(activeKey) && activeKey != 0">
                <p class="me-flex-li-sub">{{ order.updatedAt }}</p>
              </li>
              <li>
                <p class="me-flex-li-sub">{{ order.createdAt }}</p>
              </li>
              <li
                v-if="
                  [
                    'pending,repacked',
                    'packed,ready_to_ship',
                    'shipped',
                    'delivered',
                    'returned',
                    'shipped_back_success,shipped_back'
                  ].includes(activeKey)
                "
              >
                <div class="me-flex-li-sub">
                  <p
                    v-if="
                      ['pending', 'repacked'].includes(pack.items[0].status)
                    "
                  >
                    <a-button
                      type="primary"
                      @click="orderDocument('shippingLabel', order)"
                      class="me-mt-1"
                      >打印物流单号</a-button
                    >
                  </p>
                  <p v-if="['packed'].includes(pack.items[0].status)">
                    <a-button
                      type="primary"
                      @click="deliverGoods(order, pack)"
                      class="me-mt-1"
                      >安排物流</a-button
                    >
                  </p>
                  <p v-if="['packed'].includes(pack.items[0].status)">
                    <a-button
                      type="primary"
                      @click="lazadaOrderRePack(order, pack)"
                      class="me-mt-1"
                      >重新打包</a-button
                    >
                  </p>
                  <p
                    v-if="
                      [
                        'shipped',
                        'delivered',
                        'returned',
                        'shipped_back_success',
                        'shipped_back',
                        'ready_to_ship'
                      ].includes(pack.items[0].status)
                    "
                  >
                    <a-button
                      type="primary"
                      @click="logisticsStatusView(order, pack)"
                      class="me-mt-1"
                      >物流状态</a-button
                    >
                  </p>
                  <p
                    class="me-mt-1"
                    v-if="
                      [
                        'pending',
                        'repacked',
                        'packed',
                        'ready_to_ship'
                      ].includes(pack.items[0].status)
                    "
                  >
                    <span class="me-cp" @click="cancelOrder(order, pack)">
                      取消订单
                    </span>
                  </p>
                  <p v-if="['canceled'].includes(pack.items[0].status)">
                    --
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="me-page-control">
          <a-pagination
            show-quick-jumper
            :total="paginationData.total"
            @change="orderListChangePage"
          />
        </div>
      </div>
      <NoData v-else></NoData>
    </a-spin>
    <LogisticsStatus
      v-if="logisticsStatusVisible"
      :selectedOrder="selectedOrder"
      :selectedRows="selectedRows"
      :logisticsStatusVisible="logisticsStatusVisible"
      @logisticsStatusClose="logisticsStatusClose"
    ></LogisticsStatus>
    <!-- 取消订单弹窗 -->
    <CancelOrder
      v-if="cancelOrderFlag"
      :selectedOrder="selectedOrder"
      :selectedRows="selectedRows"
      @loadData="loadData"
      @cancelFalse="cancelOrderFlag = false"
    ></CancelOrder>
    <!-- 打包 -->
    <ArrangeLogistics
      v-if="arrangeLogisticsFlag"
      :selectedOrder="selectedOrder"
      @loadData="loadData"
      :type="type"
      :invoiceNumber="invoiceNumber"
      @cancelFalse="arrangeLogisticsFlag = false"
    ></ArrangeLogistics>

    <!-- 同步在线订单 -->
    <SyncStoreInfo
      ref="syncOrderAssembly"
      v-if="syncModalVisible"
      :diyTime="diyTime"
      paltform="Lazada"
      modules="order"
      @handleStore="syncOrder"
      @cancelSync="syncModalVisible = false"
      @syncComplete="syncComplete"
    ></SyncStoreInfo>
    <!-- 打印拣货单  -->
    <PrintFaceList
      ref="PrintFaceList"
      :selectedOrderPrint="selectedOrderPrint"
      v-show="false"
    />
  </div>
</template>
<script>
import { add, floatSub } from '@/util'
import LazadaOrder from '@/api/lazadaOrder'
import { mapState } from 'vuex'
import tableMixins from '@/mixins/tableMixins'
import orderMixins from './orderMixins'
import LogisticsStatus from './LogisticsStatus'
import CancelOrder from './CancelOrder'
import ArrangeLogistics from './ArrangeLogistics'
import NoData from '@/components/NoData'
import moment from 'moment'
import SyncStoreInfo from '@/components/syncStoreInfo'
import PrintFaceList from './PrintFaceList'
import Cookies from 'js-cookie'

export default {
  mixins: [tableMixins, orderMixins],
  props: {
    activeKey: {
      type: [Number, String],
      default: 0
    },
    searchParams: {
      type: Object
    }
  },
  components: {
    LogisticsStatus,
    CancelOrder,
    ArrangeLogistics,
    NoData,
    SyncStoreInfo,
    PrintFaceList
  },
  data() {
    return {
      orderStatus: 9,
      logisticsStatusVisible: false,
      timeInter: '',
      timeInterAfterSale: '',
      cancelOrderFlag: false,
      selectedOrder: '', //当前选中的订单
      selectedOrderPrint: [],
      arrangeLogisticsFlag: false,
      spinning: false, //pageLoading
      syncModalVisible: false,
      type: '',
      sTime: '', //同步订单开始时间
      eTime: '', //同步订单结束时间
      diyTime: false, //自定义同步时间
      selectSyncTime: false,
      syncTimeVal: [],
      noStayPackaged: false,
      selectedRows: '',
      invoiceNumber: false,
      indeterminate: false,
      checkAll: false,
      printLoading: false
    }
  },
  computed: {
    ...mapState({
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    })
  },
  created() {
    this.$data.sTime = new Date(
      moment(new Date(new Date().getTime() - 29 * 24 * 3600 * 1000)).format(
        'YYYY-MM-DD'
      ) + ' 00:00:00'
    ).toISOString()
    this.$data.eTime = new Date(
      moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
    ).toISOString()
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timeInterAfterSale)
  },
  methods: {
    //获取国家
    getCountry(code) {
      let arr = this.lazadaStoreListSize.filter((item) => item.value == code)
      if (arr.length) {
        return arr[0].label
      } else {
        return code
      }
    },
    //总价
    grandTotal(pack) {
      let sum = 0
      let sums = 0
      pack.items.forEach((item) => {
        sum = floatSub(
          add(item.itemPrice, item.shippingAmount),
          item.voucherAmount
        )
        sums = add(sums, sum)
      })
      return sums
    },
    // 同步店铺弹窗开启
    syncShop(flag) {
      this.diyTime = flag
      this.$data.selectSyncTime = false
      this.syncModalVisible = !this.syncModalVisible
    },
    //同步订单方法
    async syncOrder(storeIds, selectedRows, config) {
      // console.log(config, this.$data.sTime, this.$data.eTime)

      let params = {
        storeIds: storeIds,
        update_after: config.flag
          ? new Date(config.time[0] + ' 00:00:00').toISOString()
          : this.$data.sTime,
        update_before: config.flag
          ? new Date(config.time[1] + ' 23:59:59').toISOString()
          : this.$data.eTime,
        synType: 0,
        ati: Cookies.get('_ati'),
        userIp: localStorage.userIp
      }
      this.$refs.syncOrderAssembly.startSync()
      await LazadaOrder.syncStoreIds(params)
    },
    //同步完成
    syncComplete() {
      this.$message.success('同步完成')
      this.syncShop()
      this.reLoadData()
    },
    //处理筛选条件时间和店铺
    getTime() {
      const [orderStartTime, orderEndTime] =
        this.searchParams.orderCreateTime ?? []
      return {
        orderStartTime: orderStartTime ? orderStartTime + ' 00:00:00' : '',
        orderEndTime: orderEndTime ? orderEndTime + ' 23:59:59' : '',
        orderCreateTime: undefined
      }
    },
    //获取订单列表
    getTableData() {
      ;(this.$data.indeterminate = false), (this.$data.checkAll = false)
      this.$data.spinning = true
      const { current, size } = this.paginationData
      let countryCode
      let storeId
      if (this.searchParams?.storeId?.length) {
        countryCode = this.searchParams.storeId[0]
        storeId = this.searchParams.storeId[1]
      }
      return LazadaOrder.getLazadaOrderList({
        current,
        size,
        statuses: this.activeKey ? this.activeKey : '',
        ...this.searchParams,
        ...this.getTime(),
        countryCode,
        storeId
        // ...this.paginationData
        // ...this.$data.paginationData
      })
    },
    //获取列表后
    getTableDataAfter() {
      this.$data.spinning = false
      let countryCode
      let storeId
      if (this.searchParams?.storeId?.length) {
        countryCode = this.searchParams.storeId[0]
        storeId = this.searchParams.storeId[1]
      }
      this.$emit('getCount', {
        ...this.searchParams,
        ...this.getTime(),
        countryCode,
        storeId
      })
      this.$data.dataSource.forEach((order) => {
        this.$set(order, 'check', false)
        this.$set(order, 'indeterminate', false)
        if (!order.items) order.items = []
        order.items.forEach((item) => {
          this.$set(item, 'check', false)
        })
        if (this.activeKey == 'packed,ready_to_ship') {
          let packs = []
          this.sortArr(order.items, 'packageId').forEach((item) => {
            packs.push({ check: false, items: item, remainingTime: '' })
          })
          this.$set(order, 'packList', packs)
        } else {
          this.$set(order, 'packList', [
            { check: false, items: order.items, remainingTime: '' }
          ])
        }
      })
      this.getCheckLength()
      if (
        ['pending,repacked', 'packed,ready_to_ship'].includes(this.activeKey)
      ) {
        clearInterval(this.timeInterAfterSale) //售后倒计时
        this.countDown()
        this.timeInterAfterSale = setInterval(() => this.countDown(), 1000)
      }
    },
    //查看物流
    logisticsStatusView(rows, order) {
      this.$data.selectedRows = rows
      this.$data.selectedOrder = order
      this.$data.logisticsStatusVisible = true
    },
    //关闭查看物流
    logisticsStatusClose() {
      this.$data.logisticsStatusVisible = false
    },

    // 同步订单 按订单同步
    async syncCurrOrder(item) {
      await LazadaOrder.syncLazadaOrderIds({
        orderIds: [item.orderId],
        ati: Cookies.get('_ati'),
        userIp: localStorage.userIp
      })
      this.$message.success(this.$t('order.syncSuccess'))
      this.loadData()
    },
    //将商品记为重新包装
    async lazadaOrderRePack(rows, order) {
      await LazadaOrder.lazadaOrderRePack({
        storeId: rows.storeId,
        packageId: order.items[0].packageId
      })
      this.$message.success('操作成功')
      this.loadData()
    },
    //打包
    async arrangeLogistics(row) {
      this.$data.selectedOrder = row
      this.arrangeLogisticsFlag = true
    },
    //发货
    async deliverGoods(rows, order) {
      console.log(order)
      let itemsId = []
      order.items.forEach((item) => {
        itemsId.push(item.orderItemId)
      })

      await LazadaOrder.lazadaOrderRts({
        storeId: rows.storeId,
        shipmentProvider: order.items[0].shipmentProvider,
        trackingNumber: order.items[0].trackingCode,
        orderItemIdsStr: itemsId.join()
      })
      this.$message.success('操作成功')
      this.loadData()
    },
    //取消订单
    cancelOrder(rows, order) {
      this.$data.selectedRows = rows
      this.$data.selectedOrder = order
      this.cancelOrderFlag = true
    },
    //打印发票清单、发货清单
    async orderDocument(type, row) {
      this.type = type
      // if (!row) {
      //   let checkLen = this.dataSource.filter(
      //     (order) => order.check || order.indeterminate
      //   )
      //   if (!checkLen.length)
      //     return this.$message.warning('请选择需要打印的订单')
      // }
      if (['invoice', 'shippingLabel', 'erp'].includes(type)) {
        if (row) {
          if (!row.check && !row.indeterminate) {
            // row.check = true
            // row.items.forEach((item) => {
            //   item.check = true
            // })
            this.checkOrderChange({ target: { checked: true } }, row)
          }
          this.$data.selectedOrder = [row]
        } else {
          this.$data.selectedOrder = this.dataSource.filter(
            (order) => order.check || order.indeterminate
          )
        }
        if (type == 'erp') {
          this.selectedOrderPrint = this.dataSource.filter(
            (order) => order.check || order.indeterminate
          )
          this.$refs.PrintFaceList.printFaceList()
        } else {
          this.invoiceNumber = false
          if (this.activeKey == 'packed,ready_to_ship') {
            this.$data.selectedOrder.forEach((item1) => {
              item1.items.forEach((item2) => {
                if (!item2.invoiceNumber) {
                  this.arrangeLogisticsFlag = true
                  this.invoiceNumber = true
                }
              })
            })
            if (!this.invoiceNumber) {
              let docs = []
              this.selectedOrder.forEach((order) => {
                order.packList.forEach((pack) => {
                  if (pack.check) {
                    pack.items.forEach((item) => {
                      docs.push({
                        itemId: item.orderItemId,
                        storeId: order.storeId,
                        docType: type,
                        ati: Cookies.get('_ati'),
                        userIp: localStorage.userIp
                      })
                    })
                  }
                })
              })
              this.printLoading = true
              let { data } = await LazadaOrder.orderDocument(docs)
              // console.log(decodeURIComponent(escape(window.atob(data[0].file))))
              this.printFace(data)
            }
          } else {
            this.arrangeLogisticsFlag = true
          }
        }
      } else {
        let docs = []
        this.$data.selectedOrder = this.dataSource.filter(
          (order) => order.check || order.indeterminate
        )
        this.$data.selectedOrder.forEach((order) => {
          order.items.forEach((item) => {
            if (item.check) {
              docs.push({
                itemId: item.orderItemId,
                storeId: order.storeId,
                docType: this.type,
                ati: Cookies.get('_ati'),
                userIp: localStorage.userIp
              })
            }
          })
        })
        let { data } = await LazadaOrder.orderDocument(docs)
        this.printFace(data)
        // let { data } = await LazadaOrder.lazadaOrderRePack({
        //   orderItemIdsStr: row.orderId,
        //   docType: this.type,
        //   storeId: row.storeId
        // })
        // this.$message.success('操作成功')
      }
    },
    //查看订单详情
    goOrderDetails(row) {
      let { href } = this.$router.resolve({
        path: './order-details',
        query: { orderNumber: row.orderNumber }
      })
      window.open(href, '_blank')
    },
    //分页改变
    orderListChangePage(page, pageSize) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current: page
      }
      this.loadData()
    }

    //重置
    // resetSearch() {
    //   this.$data.asyncParams = { type: 0 }
    //   this.$nextTick(() => {
    //     this.$refs.Order.getOrderList()
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
@import '@/theme/mixins.scss';
@mixin flexGrow {
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
  width: 10%;
  text-align: center;
}
.me-em2 {
  @include ellipsisMultiline(2);
  width: 90%;
}
.me-em1 {
  @include ellipsisMultiline(1);
  width: 90%;
}
.me-orderList-bar {
  background: #fafafa;
  border-radius: 4px 4px 0px 0px;
}
.me-orderList-flex {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  li {
    @include flexGrow;
  }
  .me-w20b {
    width: 20%;
  }
  .me-w40 {
    width: 40px;
    flex-grow: 0;
    text-align: left;
  }
}
.me-orderList-info {
  border: 1px solid #ebebeb;
  .me-orderList-info-head {
    height: 40px;
    line-height: 40px;
    background: #fafafa;
    // border-bottom: 1px solid #f0f0f0;
    > span {
      font-size: 12px;
      line-height: 12px;
      color: #303133;
      // border-left: 1px solid #dcdfe6;
      display: inline-block;
      padding-right: 17px;
      b {
        font-weight: normal;
        color: #909099;
      }
      .me-line {
        border-left: 1px solid #dcdfe6;
        padding-left: 10px;
      }
    }
  }
  .me-orderList-info-ship {
    height: 32px;
    line-height: 32px;
    background: none;
    padding-left: 40px;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    > span {
      border-left: none;
    }
  }
}

.me-site-box {
  display: inline-block;
  padding: 0 5px;
  height: 17px;
  line-height: 18px;
  background: #faece1;
  border-radius: 1px;
}
.me-goods-flex {
  display: flex;
  align-items: stretch;
  li {
    @include flexGrow;
    border-left: 1px solid #ebebeb;
    display: flex;
  }
  li:first-child {
    border-left: none;
  }
  .me-flex-li-sub {
    width: 100%;
    text-align: center;
  }
  .me-flex-column {
    flex-direction: column;
    border-left: none;
    .me-flex-columu-sub {
      @include flexGrow;
      border-bottom: 1px solid #ebebeb;
      width: 100%;
      display: flex;
    }
    > .me-flex-columu-sub:last-child {
      border-bottom: none;
    }
  }
  .me-w20b40 {
    width: calc(20% + 40px);
  }
}

.me-goods-info {
  padding: 10px 0 10px 40px;
  border-bottom: 1px solid #ebebeb;
  dt {
    float: left;
    margin-right: 5px;
  }
  dd {
    overflow: hidden;
    text-align: left;
  }
}
.me-goods-info:last-child {
  border-bottom: none;
}
.me-cp {
  cursor: pointer;
}
.me-page-control {
  margin-top: 20px;
  text-align: right;
}
.me-card-fff {
  margin-top: 15px;
  background: #fff;
  padding: 20px;
}
.me-remaining {
  color: #fff;
  background: #eead73;
  display: inline-block;
  padding: 0 6px;
  border-radius: 10px;
}
.remainingRed {
  background: #ff5748;
}
</style>
