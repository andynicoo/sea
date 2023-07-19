<template>
  <div class="order-search-form">
    <!-- 筛选过滤 -->
    <div class="filter-container" :class="{ 'me-mini': miniFlag }">
      <span class="me-openClose me-status-link" @click="miniFlag = !miniFlag"
        ><b v-if="miniFlag">展开<a-icon type="down"/></b
        ><b v-else>收起<a-icon type="up"/></b
      ></span>
      <TableFilter
        :col-item="colItem"
        :form-model="searchParams"
        @submit="handleSearch"
        @reset="onResetSearch"
      >
        <template #tags>
          <a-select
            v-model="searchParams.colorCodeData"
            placeholder="请选择"
            mode="multiple"
            style="width: 190px"
            option-label-prop="label"
            allowClear
          >
            <a-select-option
              :value="item.colorCode"
              :label="item.tagsContent"
              v-for="item in colorTagsItem"
              :key="item.colorCode"
            >
              <span
                :style="{ backgroundColor: `#${item.colorCode}` }"
                class="color-tabs-block"
              />
              {{ item.tagsContent }}
            </a-select-option>
          </a-select>
        </template>
      </TableFilter>
    </div>
    <!-- 订单状态类型 -->
    <a-tabs
      v-if="$route.path != '/oms/order/page-unpackaged'"
      type="card"
      background-color="accent-4 antiquewhite"
      center-active
      show-arrows
      v-model="vtabIndex"
      @change="changeStatus"
    >
      <a-tab-pane
        v-for="(item, index) in orderStatusTypeOpts"
        :key="index"
        :tab="item.type + (item.count ? '(' + item.count + ')' : '')"
      >
      </a-tab-pane>
    </a-tabs>
    <!-- 全局操作 -->
    <div class="tabs-wrap me-mb-4">
      <a-dropdown
        class="me-sync-orders"
        :class="{
          'me-unpackaged-sync': $route.path == '/oms/order/page-unpackaged'
        }"
      >
        <a-button type="primary" class="me-mr-2">
          {{ $t('order.synOnlineOrders') }}
          <a-icon type="redo" />
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item @click="syncShop(false)"> 同步最近30天 </a-menu-item>
          <a-menu-item @click="syncShop(true)"> 自定义时间 </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-dropdown>
        <a-button
          type="primary"
          class="me-mr-2"
          :loading="$store.getters.batchPrintLoad"
        >
          批量操作
          <a-icon type="caret-down" class="me-pr-top1" />
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item @click="batchAction(3)">
            {{ $t('order.batchApplicationWaybillNumber') }}
          </a-menu-item>
          <a-menu-item @click="batchAction(7)"> 批量发货预报 </a-menu-item>
          <a-menu-item @click="batchAction(8)"> 批量代打包 </a-menu-item>
          <a-menu-item @click="batchAction(2)">
            {{ $t('order.batchPrintFaceSheet') }}
          </a-menu-item>
          <a-menu-item @click="batchAction(9)"> 批量打印拣货单 </a-menu-item>
        </a-menu>
      </a-dropdown>
      <!-- <a-dropdown>
        <a-button class="me-mr-2" type="primary">{{
          $t('order.updateOrder')
        }}</a-button>
        <a-menu slot="overlay">
          <a-menu-item @click="asyncOrder(true)">
            {{ $t('order.updateAllOrder') }}
          </a-menu-item>
          <a-menu-item @click="asyncOrder(false)">
            {{ $t('order.updateSelOrder') }}
          </a-menu-item>
        </a-menu>
      </a-dropdown> -->
      <!-- <a-button class="me-mr-2" @click="batchAction(3)" type="primary">
        {{ $t('order.batchApplicationWaybillNumber') }}
      </a-button> -->
      <!-- <a-button class="me-mr-2" @click="batchAction(7)" type="primary">
        批量发货预报
      </a-button> -->
      <!-- <a-button class="me-mr-2" @click="batchAction(8)" type="primary">
        批量代打包
      </a-button> -->
      <!-- <a-button
        v-auth="'order.page.overseas-warehouse'"
        class="me-mr-2"
        @click="batchAction(5)"
        type="primary"
        v-show="deliverGoods"
      >
        批量海外仓发货
      </a-button> -->
      <!-- <a-button
        class="me-mr-2"
        @click="goFirstKilom"
        type="primary"
        v-show="deliverGoods"
      >
        发货预报
      </a-button> -->
      <!-- <a-button
        class="me-mr-2"
        @click="batchAction(2)"
        type="primary"
        :loading="$store.getters.batchPrintLoad"
      >
        {{ $t('order.batchPrintFaceSheet') }}
      </a-button> -->
      <!-- <a-button class="me-mr-2" @click="batchAction(9)" type="primary">
        打印拣货单
      </a-button> -->
      <a-dropdown>
        <a-button type="primary" class="me-mr-2">
          <div>导出 <a-icon type="caret-down" class="me-pr-top1" /></div>
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item @click="batchAction(6)"> 按选择订单导出 </a-menu-item>
          <a-menu-item @click="exprotTimeVisible = true">
            按创建订单时间导出
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <slot name="before"></slot>
      <div
        style="display: inline-block;"
        v-if="
          orderStatusTypeOpts.length &&
            ['全部', '待发货', '重新发货'].includes(
              orderStatusTypeOpts[vtabIndex].type
            )
        "
      >
        <a-checkbox
          @change="(e) => noStayPackagedChange(e, 'nonDelayed')"
          v-model="nonDelayed"
        >
          即将延迟发货
        </a-checkbox>
        <a-checkbox
          @change="(e) => noStayPackagedChange(e, 'delayed')"
          v-model="delayed"
        >
          已延迟发货
        </a-checkbox>
        <a-checkbox
          @change="(e) => noStayPackagedChange(e, 'noStayPackaged')"
          v-model="noStayPackaged"
        >
          只看未代打包订单
        </a-checkbox>
      </div>
    </div>
    <!-- 同步在线订单 -->
    <SyncStoreInfo
      ref="syncOrderAssembly"
      v-if="syncModalVisible"
      :diyTime="diyTime"
      @handleStore="syncOrder"
      @cancelSync="syncModalVisible = false"
      @syncComplete="syncComplete"
    ></SyncStoreInfo>

    <!-- 打印拣货单 -->
    <!-- <a-modal
      title="打印拣货单"
      :visible="printSheetSettingVisible"
      @ok="printSheetSettingOk"
      @cancel="printSheetSettingVisible = false"
      destroyOnClose
      :confirmLoading="asyncOrderConfirmLoading"
      okText="打印"
    >
      <a-radio-group v-model="printSheetType">
        <a-radio :value="2">
          打印拣货单
        </a-radio>
      </a-radio-group>
      <a-checkbox v-model="translateChinese" v-if="printSheetType == 2">
        物品清单翻译为中文
      </a-checkbox>
    </a-modal> -->
    <!-- 按时间导出订单 -->
    <a-modal
      title="按订单创建时间导出"
      :visible="exprotTimeVisible"
      @ok="exprotOk"
      @cancel="exprotTimeVisible = false"
      destroyOnClose
      :confirmLoading="exprotLoading"
    >
      <div>
        <h2 class="me-mb-3">温馨提示：最多导出最近90天的订单数据</h2>
        订单创建时间:<a-range-picker
          :disabled-date="disabledDate"
          class="me-ml-1"
          @change="
            (a, b) => {
              exprotTimeVal = b
            }
          "
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import Order from '@/api/order'
import bus from '@/bus'
import moment from 'moment'
import SyncStoreInfo from '@/components/syncStoreInfo'
import TableFilter from '@/components/tableFilter'
import { mapState } from 'vuex'
import { downloadFile } from '@/util/index'
export default {
  name: 'OrderFilter',
  components: {
    SyncStoreInfo,
    TableFilter
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    getSelected: {
      // type:Function
    },
    getOrderList: {
      // type:Function
    }
  },
  data() {
    return {
      searchParams: {
        storeId: [],
        colorCodeData: [],
        storeType: void 0,
        isTrackingNo: void 0,
        sortMode: 'ascField',
        timeMode: 1
      },
      itemSync: [
        { title: this.$t('order.synStoreOrders'), click: this.syncShop }
        // { title: '同步选中订单', click: this.batchAction, type: 4 }
      ],
      orderStatusTypeOpts: [], //订单类型列表
      syncModalVisible: false,
      colorTagsItem: [],
      colorSelected: [],
      vtabIndex: 0,
      asyncOrderConfirmLoading: false,
      printSheetSettingVisible: false,
      printSheetType: 2,
      translateChinese: true,
      sTime: '', //同步订单开始时间
      eTime: '', //同步订单结束时间
      diyTime: false, //自定义同步时间
      selectSyncTime: false,
      syncTimeVal: [],
      noStayPackaged: false, //未代打包
      nonDelayed: false, //即将延时
      delayed: false, //已延时
      exprotTimeVisible: false,
      exprotTimeVal: [],
      exprotLoading: false,
      orderStatusList: [], //未代打包页面下拉选择订单状态
      miniFlag: true
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName,
      storeListSize: (state) => state.auth.storeListSize
    }),
    deliverGoods() {
      //发货按钮开关
      return [0, 2, 3, 4].includes(this.vtabIndex)
    },
    colItem({ storeListSize }) {
      return [
        {
          itemType: 'input',
          label: this.$t('order.orderId'),
          key: 'ordersn',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'input',
          label: this.$t('order.bugerName'),
          key: 'buyerUsername',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          label: this.$t('common.tag'),
          key: 'colorCodeData',
          slotName: 'tags'
        },
        {
          itemType: 'input',
          label: this.$t('order.logisticsNo'),
          key: 'trackingNo',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'cascader',
          label: this.$t('order.shop'),
          key: 'storeId',
          itemProp: {
            options: storeListSize
          }
        },
        {
          itemType: 'select',
          label: this.$t('order.shopType'),
          key: 'storeType',
          itemProp: {
            style: 'width:190px'
          },
          itemData: [
            {
              value: 1,
              label: this.$t('order.mainland')
            },
            {
              value: 2,
              label: this.$t('order.crossBorder')
            }
          ]
        },
        {
          itemType: 'select',
          label: '运单状态',
          key: 'isTrackingNo',
          itemProp: {
            style: 'width:190px'
          },
          itemData: [
            {
              value: 1,
              label: '已申请'
            },
            {
              value: 0,
              label: '未申请'
            }
          ]
        },
        this.$route.path == '/oms/order/page-unpackaged'
          ? {
              itemType: 'select',
              label: '订单状态',
              key: 'statusList',
              itemProp: {
                style: 'width:190px',
                mode: 'multiple',
                maxTagCount: 1,
                maxTagTextLength: 4
              },
              itemData: this.orderStatusList
            }
          : '',
        {
          itemType: 'inputGroup',
          label: '排序方式',
          key: 'sortMode',
          itemProp: {
            style: 'width:70px'
          },
          itemData: [
            {
              value: 'ascField',
              label: '正序'
            },
            {
              value: 'descField',
              label: '倒序'
            }
          ],
          key2: 'sortType',
          itemType2: 'select',
          itemProp2: {
            style: 'width:120px'
          },
          itemData2: [
            {
              value: 'totalAmount',
              label: '订单总价'
            },
            {
              value: 'orderCreateTime',
              label: '创建时间'
            },
            {
              value: 'payTime',
              label: '支付时间'
            },
            {
              value: 'shipByDate',
              label: '截止发货时间'
            },
            {
              value: 'orderUpdateTime',
              label: '更新时间'
            }
          ]
        },
        {
          itemType: 'inputGroup',
          label: '时间筛选',
          key: 'timeMode',
          itemProp: {
            style: 'width:110px'
          },
          itemData: [
            {
              value: 1,
              label: '创建时间'
            },
            {
              value: 2,
              label: '支付时间'
            },
            {
              value: 3,
              label: '截至发货时间'
            },
            {
              value: 4,
              label: '更新时间'
            }
          ],
          key2: 'orderTime',
          itemType2: 'rengePicker',
          itemProp2: {
            style: 'width:190px'
          }
        }
      ]
    }
  },
  created() {
    if (this.$route.path == '/oms/order/page-unpackaged') {
      this.$data.noStayPackaged = true
      this.$data.delayed = false
      this.$data.nonDelayed = false
      localStorage.noStayPackaged = 1
      localStorage.delayed = ''
      localStorage.nonDelayed = ''
    } else {
      this.$data.noStayPackaged = false
      this.$data.delayed = false
      this.$data.nonDelayed = false
      localStorage.noStayPackaged = ''
      localStorage.delayed = ''
      localStorage.nonDelayed = ''
    }
    // }
    this.$data.sTime = moment(
      new Date(new Date().getTime() - 29 * 24 * 3600 * 1000)
    ).format('YYYY-MM-DD')
    this.$data.eTime = moment(new Date()).format('YYYY-MM-DD')
    // if (this.$route.path == '/order/page-ready') {
    //   this.searchParams.status = 'READY_TO_SHIP'
    // }
    if (this.$route.query.as) {
      this.$data.vtabIndex = this.orderStatusTypeOpts.length - 1
    }
  },
  async mounted() {
    Order.getOrderColorTags().then(({ data }) => {
      data = data.map((e) => {
        if (!e.tagsContent) e.tagsContent = this.$t('common.noDescription')

        return e
      })
      this.$data.colorTagsItem = data
    })
    // this.getStoreList()
    await this.getOrderStatusType()
    if (this.$route.path == '/oms/order/page-unpackaged') {
      //未代打包页面
      this.$set(this.searchParams, 'statusList', [
        'READY_TO_SHIP',
        'RETRY_SHIP',
        'SHIPPED'
      ])
    }
    if (this.$route.query.as) {
      //售后面包屑跳回默认选中售后或取消
      if (this.$route.path == '/order/page' && this.$route.query.ca) {
        let tabIndexCancel = this.orderStatusTypeOpts.length - 3
        this.changeStatus(tabIndexCancel)
        this.$data.vtabIndex = tabIndexCancel
      } else {
        let tabIndex = this.orderStatusTypeOpts.length - 1
        this.$data.vtabIndex = tabIndex
        this.changeStatus(tabIndex)
      }
    }
    // 重新获取订单状态
    bus.$on('reload-page', this.observer)

    bus.$on('order-color-tags-change', this.onTagsChange)

    //改变店铺查询的值
    bus.$on('storeType-change', this.onStoreTypeChange)
    //查询
    bus.$on('handle-search', this.handleSearch)

    //打印面单设置
    bus.$on('print-sheet-setting', this.printSheetSetting)
  },

  methods: {
    //选择时间段导出
    exprotOk() {
      let { exprotTimeVal } = this.$data
      if (!exprotTimeVal[0]) {
        this.$message.warning('请选择时间')
        return
      }
      this.$data.exprotLoading = true
      Order.orderExportExcel({
        start: exprotTimeVal[0] + ' 00:00:00',
        end: exprotTimeVal[1] + ' 23:59:59'
      })
        .then((res) => {
          downloadFile(res, '订单列表')
          this.$data.exprotTimeVal = []
          this.$data.exprotLoading = false
          this.$data.exprotTimeVisible = false
        })
        .catch((err) => {
          this.$data.exprotTimeVal = []
          this.$data.exprotLoading = false
          this.$data.exprotTimeVisible = false
        })
    },
    noStayPackagedChange(e, attribute) {
      if (e.target.checked) {
        localStorage[attribute] = 1
      } else {
        localStorage[attribute] = ''
      }
      this.handleSearch()
    },
    disabledDate(current) {
      // Can not select days before today and today
      return (
        (current && current > moment().endOf('day')) ||
        current < moment().subtract(90, 'day')
      )
    },
    onRangePickerChange(date, dateString) {
      this.$data.syncTimeVal = dateString
      console.log(date, dateString)
    },
    //跳转首公里预报
    goFirstKilom() {
      this.$router.push({
        path: '/order/first-Kilometer-Forecast',
        query: { source: this.$route.path }
      })
    },
    //打印面单设置
    async printSheetSetting() {
      this.$data.printSheetSettingVisible = true
      let { data } = await Order.getOrderPrintCfg()
      this.$data.printSheetType = data.printSheet ? 1 : 2
      if (data.printSheet == null) this.$data.printSheetType = 0
      this.$data.translateChinese = data.translateChinese
    },
    //保存打印面单设置
    async printSheetSettingOk() {
      let { printSheetType, translateChinese } = this.$data
      if (printSheetType != 0) {
        let params = {
          printSheet: printSheetType == 1 ? true : false,
          printDetailSheet: printSheetType == 2 ? true : false,
          translateChinese
        }
        this.$data.asyncOrderConfirmLoading = true
        await Order.saveGoodsPrintCfg(params)
        this.$data.asyncOrderConfirmLoading = false
        this.$data.printSheetSettingVisible = false
        this.$message.success('打印面单设置成功')
      } else {
        this.$message.warning('请选择打印类型')
      }
    },
    //改变店铺查询的值
    onStoreTypeChange(val) {
      this.$data.searchParams.storeType = val ? val : void 0
    },

    onAsyncOk() {
      if (this.$data.selectSyncTime) {
        if (!this.$data.syncTimeVal[0]) {
          this.$message.warning('请选择时间')
          return
        }
      }
      this.$data.asyncOrderConfirmLoading = true
      this.$refs['async-order'].submit(
        this.$data.selectSyncTime,
        this.$data.syncTimeVal
      )
    },
    changeLoad(val) {
      this.$data.asyncOrderConfirmLoading = val
    },
    observer() {
      this.getOrderStatusType()
    },
    onResetSearch() {
      this.$data.searchParams = {
        // ordersn: null,
        // buyerUsername: null,
        storeId: [],
        // trackingNo: null,
        colorCodeData: [],
        storeType: void 0,
        status: this.orderStatusTypeOpts[this.vtabIndex].requestParam,
        sortMode: 'ascField',
        // sortType: null,
        timeMode: 1
      }
      this.$emit('on-reset', this.$data.searchParams)
    },
    /**
     * 标签改变事件
     */
    onTagsChange({ colorCode, tagsContent }) {
      this.$data.colorTagsItem = this.$data.colorTagsItem.map((ele) => {
        if (ele.colorCode === colorCode)
          ele.tagsContent = tagsContent || this.$t('common.noDescription')

        return ele
      })
    },
    //获取订单类型
    getOrderStatusType() {
      return new Promise((resovle) => {
        const params = {
          ...this.$data.searchParams,
          type: this.$props.type,
          colorCodeData: this.$data.searchParams.colorCodeData.join(),
          ...this.getTime()
        }
        if (
          !params.status ||
          ['RETRY_SHIP', 'READY_TO_SHIP'].includes(params.status)
        ) {
          params.noStayPackaged = localStorage
            ? localStorage.noStayPackaged
            : null
          params.delayed = localStorage ? localStorage.delayed : null
          params.nonDelayed = localStorage ? localStorage.nonDelayed : null
        }
        let statusRequestParam = [
          'READY_TO_SHIP',
          'PROCESSED',
          'RETRY_SHIP',
          'TO_RETURN'
        ]
        let statusItem = []
        Order.getOrderStatusType(params).then(({ data }) => {
          this.orderStatusList = data.map((item) => {
            return { value: item.requestParam, label: item.type }
          })
          if (this.$route.path === '/order/page-ready') {
            if (this.type == 0) {
              statusItem.push({
                count: data.reduce((prev, curr) => {
                  return (
                    (statusRequestParam.includes(curr.requestParam)
                      ? curr.count
                      : 0) + prev
                  )
                }, 0),
                requestParam: '',
                type: this.$t('common.all')
              })
            }
            statusItem.push(
              ...data.filter((item) =>
                statusRequestParam.includes(item.requestParam)
              )
            )
            this.orderStatusTypeOpts = statusItem
          } else {
            if (this.type == 0) {
              data.splice(0, 0, {
                count: data.reduce((prev, curr) => {
                  return curr.count + prev
                }, 0),
                requestParam: '',
                type: this.$t('common.all')
              })
            }
            this.orderStatusTypeOpts = data
          }
          resovle(true)
        })
      })
    },

    // 同步店铺弹窗开启
    syncShop(flag) {
      this.diyTime = flag
      this.$data.selectSyncTime = false
      this.syncModalVisible = !this.syncModalVisible
    },
    //同步订单方法
    async syncOrder(storeIds, selectedRows, config) {
      let params = {
        storeIds: storeIds,
        updateTimeFrom: config.flag ? config.time[0] : this.$data.sTime,
        updateTimeTo: config.flag ? config.time[1] : this.$data.eTime,
        synType: 0
      }
      this.$refs.syncOrderAssembly.startSync()
      await Order.syncOrderAll(params)
    },
    //同步完成
    syncComplete() {
      this.$message.success('同步完成')
      this.syncShop()
      this.getOrderList()
    },

    //切换状态
    changeStatus(key) {
      bus.$emit('vtab-index', key)
      this.searchParams.status = this.orderStatusTypeOpts[key].requestParam
      this.handleSearch()
    },

    //menuu操作
    menuAction(callback, type) {
      callback(type)
    },

    // 更新订单
    async asyncOrder(isAll) {
      if (isAll) {
        await Order.asyncShopeeOrderSync({ ordersn: [] })
      } else {
        console.log(this.getSelected())
        const ids = this.getSelected().map(({ ordersn }) => ordersn)
        if (ids.length === 0) {
          this.errorAlert(this.$t('order.selectOrder'))
          return
        }
        await Order.asyncShopeeOrderSync({ ordersn: ids })
      }
      this.getOrderList()

      this.$Message({
        type: 'success',
        content: this.$t('order.syncSuccess')
      })
    },

    //批量操作
    batchAction(key) {
      if (key == 2) this.$store.commit('SET_BATCH_PRINT_LOAD', true)
      bus.$emit('batch-action', key)
    },
    //时间和店铺id处理
    getTime() {
      let { timeMode, orderTime, storeId } = this.searchParams
      let timeVal = ''
      let timeTMS = []
      if (orderTime && orderTime.length) {
        timeTMS.push(orderTime[0] + ' 00:00:00')
        timeTMS.push(orderTime[1] + ' 23:59:59')
      }
      if (timeMode == 1) {
        let [startTime, endTime] = timeTMS
        timeVal = { startTime, endTime }
      } else if (timeMode == 2) {
        let [payStartTime, payEndTime] = timeTMS
        timeVal = { payStartTime, payEndTime }
      } else if (timeMode == 3) {
        let [shipByStartTime, shipByEndTime] = timeTMS
        timeVal = { shipByStartTime, shipByEndTime }
      } else if (timeMode == 4) {
        let [orderUpdateStartTime, orderUpdateEndTime] = timeTMS
        timeVal = { orderUpdateStartTime, orderUpdateEndTime }
      }
      return {
        ...timeVal,
        orderTime: null,
        storeId: storeId.length ? storeId[1] : null
      }
    },
    //搜索操作
    handleSearch() {
      const params = {
        ...this.searchParams,
        colorCodeData: this.searchParams.colorCodeData.join(),
        ...this.getTime()
      }
      if (params.sortType) {
        //排序方式
        params[params.sortMode] = params.sortType
      }

      this.$emit('on-search', params)
    }
  },
  beforeDestroy() {
    bus.$off('reload-page', this.observer)
    bus.$off('order-color-tags-change')
    //改变店铺查询的值
    bus.$off('storeType-change', this.onStoreTypeChange)
    //查询
    bus.$off('handle-search', this.handleSearch)
    //打印面单设置
    bus.$off('print-sheet-setting', this.printSheetSetting)
  }
}
</script>

<style lang="scss" scoped>
.order-title {
  height: 56px;
  line-height: 56px;
  font-size: 20px;
  font-weight: 500;
  padding: 0 16px;
  margin: 0 -16px;
  border-bottom: 1px solid #f5f5f5;
}
.filter-container {
  margin-bottom: 20px;
  position: relative;
}
.filter {
  padding: 24px;
  padding-bottom: 14px;
  background-color: #f6f6f6;
  margin-top: 16px;
  margin-bottom: 20px;
}
.color-tabs-block {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  border-radius: 2px;
}
.tabs-wrap {
  margin-bottom: 0;
}
.me-mr-10 {
  margin-right: 50px;
}
.me-pr-top1 {
  top: 2px;
  position: relative;
}
.me-mini {
  height: 110px;
  overflow: hidden;
  .me-page-search {
    padding-top: 15px;
  }
}
.me-openClose {
  cursor: pointer;
  position: absolute;
  top: 25px;
  right: 15px;
}
.me-sync-orders {
  float: right;
  position: relative;
  top: -53px;
  margin: 0 !important;
  background: none;
  color: #4c86ff;
  border: none;
  padding: 0;
  box-shadow: none;
  & > span + .anticon {
    margin-left: 3px;
    position: relative;
    top: 1px;
  }
}
.me-unpackaged-sync {
  top: 0;
}
</style>
