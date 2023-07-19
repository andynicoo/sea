<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('order.dfPurchaseOrder')">
    </a-page-header>
    <a-layout class="me-page-layout me-purchase-order-filter">
      <TableFilter
        :col-item="colItem"
        :form-model="searchParams"
        @submit="handleSearch"
        @reset="resetFields"
      />
      <div class="order-list-wrapB me-mt-3">
        <div class="list-header-box c909">
          <div class="list-header-purchasing list-header-content">
            <div class="list-purchasing-text">
              {{ $t('order.purchasingInfor') }}
            </div>
          </div>
          <div class="list-header-p list-header-content">
            {{ $t('order.purchaseAmount') }}(RMB)
          </div>
          <div class="list-header-buy-m list-header-content">
            {{ $t('order.forwarderInformation') }}/{{ $t('order.buyInfo') }}
          </div>
          <div class="list-header-p list-header-content">
            {{ $t('order.orderAssociatedStatus') }}
          </div>
          <div class="list-header-store list-header-content">
            {{ $t('order.productInfor') }}
          </div>
          <div class="list-header-p2 list-header-content">
            Shopee{{ $t('order.shopeeOrder') }}
          </div>
        </div>

        <a-spin :spinning="spinning">
          <div class="list-sectionB" v-if="orderList.length > 0">
            <div
              class="list me-mt-3"
              v-for="item in orderList"
              :key="item.orderno"
            >
              <div class="list-title-box">
                <span class="me-mr-2">
                  <a-tag
                    color="#FF4A4A"
                    v-if="item.purchaseStatus == 1 || item.purchaseStatus == 2"
                    >{{ orderStatus(item.purchaseStatus) }}</a-tag
                  >
                  <a-tag
                    color="#FF6B38"
                    v-else-if="
                      item.purchaseStatus == 3 || item.purchaseStatus == 6
                    "
                    >{{ orderStatus(item.purchaseStatus) }}</a-tag
                  >
                  <a-tag v-else>{{ orderStatus(item.purchaseStatus) }}</a-tag>
                </span>
                <span class="me-mr-2">
                  <span class="c909"
                    >{{ $t('order.purchaseOrderNumber') }}：</span
                  >{{ item.orderno }}
                </span>
                <span>
                  <span class="c909">店铺：</span>
                  <span>{{
                    item.storeType == 1
                      ? $t('toBeEdit.bentudian')
                      : $t('toBeEdit.kuajingdian')
                  }}</span>
                  {{ item.country }}/{{ item.storeName }}
                </span>
              </div>
              <div class="item-box">
                <div class="item-purchasing-box">
                  <table>
                    <tr>
                      <td class="c909 me-pb-1">
                        {{ $t('order.singlePlatform') }}：
                      </td>
                      <td class="me-pb-1">{{ item.purchasePlatform }}</td>
                    </tr>
                    <tr>
                      <td class="c909 me-pb-1">
                        {{ $t('order.orderTime') }}：
                      </td>
                      <td class="me-pb-1">{{ item.purchaseTime }}</td>
                    </tr>
                    <tr>
                      <td class="c909 me-pb-1">
                        {{ $t('order.orderAccount') }}：
                      </td>
                      <td class="me-pb-1">
                        <a-button
                          v-if="item.status != 4 && item.relationType != 1"
                          type="link"
                          :loading="item._refreshAccount_"
                          class="me-refreshAccount"
                          @click="onRefreshOrderStatus(item)"
                        >
                          {{ item.purchaseAccount }}
                          <template v-if="!item._refreshAccount_">
                            <a-icon v-if="item.syncFlag" type="redo" /><a-icon
                              v-else
                              type="loading"
                            />
                          </template>
                        </a-button>
                        <span v-else>{{ item.purchaseAccount }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="c909 me-pb-1">货源单号：</td>
                      <td class="me-pb-1">{{ item.purchaseOrderno }}</td>
                    </tr>
                    <tr>
                      <td class="c909 me-pb-1">{{ $t('order.sycnTime') }}：</td>
                      <td class="me-pb-1">{{ item.synTime }}</td>
                    </tr>
                  </table>
                </div>
                <div class="item-12-box">
                  ￥{{ item.purchasePrice ? item.purchasePrice : item.amount }}
                </div>
                <div class="item-18-box">
                  <table>
                    <tr>
                      <td valign="top" class="c909">
                        {{ $t('order.forwarderInformation') }}：
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" class="me-em2">
                        <a-tooltip
                          placement="topLeft"
                          :title="
                            item.contacts + item.phone + item.detailedAddress
                          "
                        >
                          {{ item.contacts }}
                          {{ item.phone }}
                          {{ item.detailedAddress }}
                        </a-tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" class="c909 me-pt-2">
                        {{ $t('order.buyInfo') }}：
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" class="me-em2">
                        <a-tooltip
                          placement="topLeft"
                          :title="
                            item.buyersName +
                              item.buyersPhone +
                              item.buyersAddress
                          "
                        >
                          {{ item.buyersName }}
                          {{ item.buyersPhone }}
                          {{ item.buyersAddress }}
                        </a-tooltip>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="item-12-box">
                  {{
                    item.status == 4
                      ? $t('order.OrderAssociatedCancel')
                      : $t('order.OrderAssociated')
                  }}
                </div>

                <div class="item-order-box item-order-goods">
                  <div
                    class="goods-item me-mb-2"
                    v-for="(goodsItem, k) in getTwo(item.productList)"
                    :key="k"
                  >
                    <div class="order-left">
                      <a-popover placement="right">
                        <template slot="content">
                          <img
                            style="width: 220px; height: 220px"
                            v-lazy="goodsItem.image"
                          />
                        </template>
                        <img
                          style="width: 40px; height: 40px"
                          v-lazy="goodsItem.image"
                        />
                      </a-popover>
                    </div>
                    <div class="order-right">
                      <div class="order-t-box">
                        <!-- <div class="mark-wrap">
                      <span class="mark-item" v-if="item.daysToShip > 2">
                        {{ $t('order.pre') }}
                      </span>
                    </div> -->
                        <b
                          class="me-go-goods me-em2 me-cp"
                          @click="goGoods(goodsItem.itemUrl)"
                          >{{ goodsItem.name }}</b
                        >
                      </div>
                    </div>
                  </div>
                  <span v-if="item.productList.length > 2"
                    >共，<b class="c4C8">{{ item.productList.length }}</b
                    >个产品，<b
                      class="c4C8 me-cp"
                      @click="goodsView(item.productList)"
                      >查看></b
                    ></span
                  >
                </div>
                <div class="item-12-box item-14-box">
                  <table>
                    <tr>
                      <td valign="top">
                        <p class="c909">{{ $t('order.orderNum') }}：</p>
                        {{ item.ordersn }}
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">
                        <p class="c909 me-pt-1">{{ $t('order.buyTime') }}：</p>
                        {{ item.orderCreateTime }}
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">
                        <p class="c909 me-pt-1">
                          {{ $t('order.orderStatus') }}：
                        </p>
                        <span class="cF76">{{
                          shopeeStatus(item.orderStatus)
                        }}</span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div
                v-if="item.purchaseStatus == 1 && item.status != 4"
                class="me-gopay"
              >
                <span class="cF76 me-cp" @click="goPay(item.purchasePlatform)"
                  >去付款</span
                >
              </div>
            </div>
            <div
              class="me-card me-text-right me-mt-4"
              v-if="pagination.total > 10"
            >
              <a-pagination
                show-size-changer
                :default-current="pagination.current"
                :page-size-options="['10', '20', '30', '40', '50', '100']"
                :total="pagination.total"
                @change="onChange"
                @showSizeChange="onShowSizeChange"
              />
            </div>
          </div>
          <NoData v-else></NoData>
        </a-spin>
      </div>
    </a-layout>
    <a-modal
      v-model="goodsViewVisible"
      title="已关联商品"
      cancelText="关闭"
      @ok="goodsViewVisible = false"
      wrapClassName="me-goods-pop"
    >
      <div class="item-order-goods">
        <div
          class="goods-item goods-item-border"
          v-for="(goodsItem, k) in productListPop"
          :key="k"
        >
          <div class="order-left">
            <a-popover placement="right">
              <template slot="content">
                <img
                  style="width: 220px; height: 220px"
                  v-lazy="goodsItem.image"
                />
              </template>
              <img style="width: 60px; height: 60px" v-lazy="goodsItem.image" />
            </a-popover>
          </div>
          <div class="order-right">
            <div class="order-t-box me-minh33">
              <b
                class="me-go-goods me-em2 me-f14 me-cp"
                @click="goGoods(goodsItem.itemUrl)"
                >{{ goodsItem.name }}</b
              >
            </div>
            <p class="c909 me-f12">
              {{ $t('common.goodsCode') }}：{{ goodsItem.itemSku }} 规格：{{
                goodsItem.sku
              }}
              {{ $t('common.unitPrice') }}：{{ goodsItem.price }}
              {{ $t('common.producNum') }}：{{ goodsItem.stock }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Product from '@/api/product'
import Order from '@/api/order'
import { mapState } from 'vuex'
import TableFilter from '@/components/tableFilter'
import NoData from '@/components/NoData'
export default {
  components: {
    TableFilter,
    NoData
  },
  data() {
    return {
      searchParams: {
        storeId: []
      },
      generalSourceList: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      orderList: [],
      status: [
        {
          value: 1,
          label: this.$t('order.bePaid')
        },
        {
          value: 2,
          label: this.$t('order.beDelivered')
        },
        {
          value: 3,
          label: this.$t('order.beReceived')
        },
        {
          value: 4,
          label: this.$t('order.successfulTrade')
        },
        {
          value: 5,
          label: this.$t('order.dealFailed')
        },
        {
          value: 6,
          label: this.$t('order.refundIn')
        },
        {
          value: 7,
          label: this.$t('order.closure')
        },
        {
          value: 10,
          label: this.$t('order.otherStatus')
        }
      ],
      shopee: [], //shopee订单状态列表
      goodsViewVisible: false,
      productListPop: [],
      timeInter: '',
      syncing: false, //是否正在同步

      spinning: false //pageLoading
    }
  },
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize
    }),
    colItem({ shopee, generalSourceList, status, storeListSize }) {
      //搜索配置
      return [
        {
          itemType: 'cascader',
          label: this.$t('order.shop'),
          key: 'storeId',
          itemProp: {
            options: storeListSize
          }
        },
        {
          itemType: 'input',
          label: 'Shopee订单号',
          key: 'ordersn',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'select',
          label: 'Shopee订单状态',
          key: 'status',
          itemProp: {
            style: 'width:190px'
          },
          itemData: shopee
        },
        {
          itemType: 'select',
          label: '采购平台',
          key: 'purchasePlatform',
          itemProp: {
            style: 'width:190px'
          },
          itemData: generalSourceList
        },
        {
          itemType: 'input',
          label: '采购单号',
          key: 'purchaseOrderno',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'select',
          label: '采购状态',
          key: 'purchaseStatus',
          itemProp: {
            style: 'width:190px'
          },
          itemData: status
        },
        {
          itemType: 'input',
          label: '物流单号',
          key: 'purchaseLogisticsno',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'rengePicker',
          label: '采购时间',
          key: 'purchaseTime',
          itemProp: {
            style: 'width:190px'
          }
        }
      ]
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInter)
    window.removeEventListener('message', this.erpMessageHandler)
  },
  async created() {
    let { data } = await Order.getOrderStatusType()
    this.$data.shopee = data.map((item) => {
      return { label: item.type, value: item.requestParam }
    })
    this.getOrderList()
    this.timeInter = setInterval(() => {
      this.getOrderList()
    }, 180000)
    //采集源
    Product.getGeneralSourceList().then(({ data }) => {
      this.$data.generalSourceList = data.map((item) => {
        return { label: item, value: item }
      })
    })
  },
  methods: {
    //去付款
    goPay(platform) {
      const purchasePlatformUrl = {
        拼多多: 'https://mobile.yangkeduo.com/orders.html',
        1688: 'https://trade.1688.com/order/buyer_order_list.htm'
      }
      this.openPage(purchasePlatformUrl[platform], '_blank')
    },
    //查看全部商品
    goodsView(list) {
      this.$data.goodsViewVisible = true
      this.$data.productListPop = list
    },
    //取2个商品
    getTwo(list) {
      return list.filter((ele, index) => index < 2)
    },
    //重置搜索
    resetFields() {
      this.$data.searchParams = {
        storeId: []
      }
      this.handleSearch()
    },
    //搜索
    handleSearch() {
      this.pagination.current = 1
      this.getOrderList()
    },
    //订单状态
    orderStatus(val) {
      if (!val) {
        return '--'
      }
      let status = this.$data.status.find((item) => item.value == val)
      return status?.label ?? '--'
    },
    //shopee状态
    shopeeStatus(val) {
      if (!val) {
        return '--'
      }
      if (val == 'PROCESSED') {
        return '待物流拿货'
      }
      let status = this.$data.shopee.find((item) => item.value == val)
      return status?.label ?? '--'
    },
    //时间和店铺id处理
    getTime() {
      let { purchaseTime, storeId } = this.searchParams
      let timeTMS = []
      if (purchaseTime) {
        timeTMS.push(purchaseTime[0] + ' 00:00:00')
        timeTMS.push(purchaseTime[1] + ' 23:59:59')
      }
      let [startTime, endTime] = timeTMS
      let timeVal = { startTime, endTime }
      return {
        ...timeVal,
        purchaseTime: null,
        storeId: storeId.length ? storeId[1] : null
      }
    },
    // 获取订单列表
    getOrderList() {
      let params = {
        ...this.pagination,
        ...this.searchParams,
        ...this.getTime()
      }
      this.$data.spinning = true
      Order.orderPurchaseGetPage(params).then(({ data }) => {
        if (data) {
          data.records.map((el) => {
            el.menuVisible = false
            el.check = false
            this.$set(el, 'syncFlag', true)
          }) //用于备注的菜单组件显示
          this.orderList = data.records
          this.pagination.total = data.total
        }
        this.$data.spinning = false
        this.handleBatchSyncOrderStatus()
      })
    },
    //切换页码
    onChange(page, pageSize) {
      this.pagination.current = page

      this.getOrderList()
    },
    //切换条数
    onShowSizeChange(current, size) {
      console.log(current, size)
      this.pagination.current = 1
      this.pagination.size = size
      this.getOrderList()
    },
    // 刷新订单状态
    onRefreshOrderStatus(order) {
      let { purchasePlatform, purchaseAccount, orderno } = order

      const domId = 'emalacca-chrome-extension-purchas-auth'
      const dom = document.getElementById(domId)

      if (!dom) return this.$message.error(this.$t('order.pluginsErrpr'))
      const ispddlogin = dom.getAttribute('ispddlogin')
      const is1688login = dom.getAttribute('is1688login')

      console.log(ispddlogin)
      console.log(is1688login)

      const loginConfirm = (url, text) => {
        this.$warning({
          title: this.$t('common.message'),
          content: text,
          closable: true,
          okText: this.$t('order.toLogin'),
          onOk: () => {
            this.openPage(url, '_blank')
          }
        })
      }

      const purchasePlatformObj = {
        拼多多: ispddlogin,
        1688: is1688login
      }

      const purchasePlatformUrl = {
        拼多多: 'https://mobile.yangkeduo.com/login.html',
        1688: 'https://login.1688.com/member/signin.htm'
      }

      if (purchasePlatformObj[purchasePlatform] === 'false') {
        loginConfirm(
          purchasePlatformUrl[purchasePlatform],
          this.$t('order.loginMessage', {
            purchasePlatform,
            purchaseAccount
          })
        )
        return
      }
      this.$store.commit('SET_ORDER_F5', true)
      this.handleBatchSyncOrderStatus(order)
    },
    //跳转shopee商品
    goGoods(url) {
      if (url) {
        this.openPage(url, '_blank')
      }
    },
    // 通过插件侧同步订单信息
    handleBatchSyncOrderStatus(order) {
      // 取出当前订单列表中的有订单号的
      if (this.$data.syncing) return this.$message.warning('正在同步中,请稍等!')
      let purchasList = []
      if (order) {
        purchasList.push({
          orderno: order.orderno,
          purchaseOrderno: order.purchaseOrderno,
          purchasePlatform: order.purchasePlatform,
          purchaseAccount: order.purchaseAccount,
          itemName: order.orderno //采购单商品名称
        })
      } else {
        this.orderList.map((el) => {
          let { synTime } = el || {}
          let condition = Date.parse(new Date()) - Date.parse(synTime) > 180000
          if (condition || synTime == null) {
            if (el.purchaseOrderno) {
              purchasList = purchasList.concat({
                orderno: el.orderno,
                purchaseOrderno: el.purchaseOrderno,
                purchasePlatform: el.purchasePlatform,
                purchaseAccount: el.purchaseAccount,
                itemName: el.orderno
              })
            }
          }
        })
      }
      if (purchasList.length > 0) {
        this.$data.syncing = true
        if (this.$store.getters.orderF5) {
          this.$notification.open({
            message: this.$t('common.message'),
            duration: 6,
            type: 'info',
            description: this.$t('order.beginSyncOrderInfo')
          })
        }
        this.$store.commit('SET_ORDER_F5', false)
        console.log(purchasList)
        window.postMessage(
          {
            action: 'batch-sync-purchas-order-detail',
            params: {
              purchasList: purchasList //这里必须是数组
            }
          },
          '*'
        )
        let self = this
        window.addEventListener('message', self.erpMessageHandler, false)
      }
    },
    // 监听来自插件侧的消息
    async erpMessageHandler(e) {
      if (
        e.data &&
        e.data.action == 'resolve-purchas-order-detail' &&
        e.data.code == 0
      ) {
        let { itemName, isFinish } = e.data.result
        let params = e.data.result
        Order.handleUpdateExpressInfo(params).then((res) => {
          if (res.code == 0) {
            this.$notification.open({
              message: this.$t('common.message'),
              type: 'success',
              description: `采购单【${itemName}】${this.$t(
                'order.syncSuccess'
              )}`
            })
          }

          if (isFinish) {
            this.$data.syncing = false
            this.getOrderList()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/scss/orderPurchase.scss';
</style>
<style>
.me-purchase-order-filter .me-page-search {
  padding-left: 0;
}
</style>
