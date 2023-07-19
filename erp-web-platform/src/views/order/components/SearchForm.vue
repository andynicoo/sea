<template>
  <div class="order-search-form">
    <a-row class="me-pt-2 me-pl-2">
      <a-form class="me-search-form" layout="inline">
        <StoreSelect v-model="searchParams.storeId" />

        <a-form-item :label="$t('order.orderId')">
          <a-input v-model="searchParams.ordersn" style="width: 190px" />
        </a-form-item>
        <a-form-item :label="$t('order.bugerName')">
          <a-input
            v-model="searchParams.buyerUsername"
            style="width: 190px"
            allowClear
          ></a-input>
        </a-form-item>
        <a-form-item :label="$t('common.tag')">
          <a-select
            v-model="searchParams.colorCodeData"
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
        </a-form-item>
        <a-form-item :label="$t('order.logisticsNo')">
          <a-input v-model="searchParams.trackingNo" allowClear></a-input>
        </a-form-item>
      </a-form>
    </a-row>

    <a-row class="me-pa-2">
      <a-form class="me-search-form" layout="inline">
        <a-form-item :label="$t('order.orderCreateTime')">
          <a-range-picker
            :placeholder="[$t('order.startTime'), $t('order.endTime')]"
            format="YYYY-MM-DD"
            v-model="dataArr1"
            style="width: 190px"
            valueFormat="YYYY-MM-DD"
            @change="handleChangeOrderDateRange"
            allowClear
          />
        </a-form-item>
        <a-form-item :label="$t('order.payTime')">
          <a-range-picker
            :placeholder="[$t('order.startTime'), $t('order.endTime')]"
            format="YYYY-MM-DD"
            v-model="dataArr2"
            valueFormat="YYYY-MM-DD"
            style="width: 190px;"
            @change="handleChangeOrderPayDateRange"
            allowClear
          />
        </a-form-item>
        <a-form-item>
          <a-button class="me-mr-2" type="primary" @click="handleSearch()">
            {{ $t('common.search') }}
          </a-button>
          <a-button @click="onResetSearch">{{ $t('common.reset') }} </a-button>
        </a-form-item>
      </a-form>
    </a-row>
    <div class="tabs-wrap me-pl-2">
      <a-button type="primary" class="mr-2" @click="syncShop">
        <div>{{ $t('order.synOnlineOrders') }}</div>
      </a-button>

      <a-dropdown>
        <a-button class="me-ma-2" type="primary">{{
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
      </a-dropdown>
      <!-- <a-button class="me-mr-2" @click="goFirstKilom" type="primary">
        发货预报
      </a-button> -->
      <a-button @click="batchAction(3)" type="primary">
        {{ $t('order.batchApplicationWaybillNumber') }}
      </a-button>
      <a-button class="me-ml-2" @click="batchAction(7)" type="primary">
        批量发货预报
      </a-button>
      <a-button class="me-ml-2" @click="batchAction(8)" type="primary">
        批量代打包
      </a-button>
      <a-button class="me-ml-2" @click="batchAction(2)">
        {{ $t('order.batchPrintFaceSheet') }}
      </a-button>

      <slot name="before"></slot>
    </div>
    <!-- 订单状态类型 -->
    <a-tabs
      v-if="
        $route.path !== '/order/page-packing' &&
          $route.path !== '/order/page-packaged' &&
          $route.path !== '/oms/order/page-packing'
      "
      background-color="accent-4 antiquewhite"
      center-active
      show-arrows
      v-model="vtabIndex"
      @change="changeStatus"
    >
      <a-tab-pane
        v-for="(item, index) in orderStatusTypeOpts"
        :key="index"
        :tab="item.type + item.count ? '(' + item.count + ')' : ''"
      >
      </a-tab-pane>
    </a-tabs>
    <!-- 同步店铺弹窗 -->
    <a-modal
      :title="$t('order.synStoreOrders')"
      :visible="syncModalVisible"
      @ok="onAsyncOk"
      @cancel="syncModalVisible = false"
      destroyOnClose
      :confirmLoading="asyncOrderConfirmLoading"
      width="70%"
    >
      <StoreTableModal
        ref="async-order"
        @changeLoad="changeLoad"
        @syncOrderSubmit="
          syncModalVisible = false
          asyncOrderConfirmLoading = false
        "
      />
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import Order from '@/api/order'
import bus from '@/bus'
import StoreSelect from '@/components/StoreSelect'
import StoreTableModal from '@/views/goods/components/StoreTableModal'

export default {
  components: {
    StoreTableModal,
    StoreSelect
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchParams: {
        ordersn: null,
        buyerUsername: null,
        storeId: null,
        trackingNo: null,
        startTime: null,
        endTime: null,
        payStartTime: null,
        payEndTime: null,
        colorCodeData: [],
        status: this.$route.query.status ? this.$route.query.status : ''
      },
      itemSync: [
        { title: this.$t('order.synStoreOrders'), click: this.syncShop }
        // { title: '同步选中订单', click: this.batchAction, type: 4 }
      ],
      storeList: [],
      orderStatusTypeOpts: [], //订单类型列表
      syncModalVisible: false,
      colorTagsItem: [],
      colorSelected: [],
      vtabIndex: 0,
      asyncOrderConfirmLoading: false,
      dataArr1: [],
      dataArr2: []
    }
  },
  created() {
    if (this.$route.path == '/order/page-ready') {
      this.$data.vtabIndex = 2
    } else if (this.$route.path == '/order/page-retry') {
      this.$data.vtabIndex = 3
    }
  },
  mounted() {
    this.getStoreList()
    // 重新获取订单状态
    bus.$on('reload-page', this.observer)

    bus.$on('order-color-tags-change', this.onTagsChange)

    Order.getOrderColorTags().then(({ data }) => {
      data = data.map((e) => {
        if (!e.tagsContent) e.tagsContent = this.$t('common.noDescription')

        return e
      })
      this.$data.colorTagsItem = data
    })
  },

  methods: {
    //跳转首公里预报
    // goFirstKilom() {
    //   this.$router.push({
    //     path: '/order/first-kilometer-forecast-interior',
    //     query: { source: this.$route.path }
    //   })
    // },
    onAsyncOk() {
      this.$data.asyncOrderConfirmLoading = true
      this.$refs['async-order'].syncOrderSubmit()
    },
    changeLoad(val) {
      this.$data.asyncOrderConfirmLoading = val
    },
    observer() {
      this.getOrderStatusType()
    },
    onResetSearch() {
      this.$data.searchParams = {
        ordersn: null,
        buyerUsername: null,
        storeId: null,
        trackingNo: null,
        startTime: null,
        endTime: null,
        payStartTime: null,
        payEndTime: null,
        colorCodeData: [],
        status: this.$route.query.status ? this.$route.query.status : ''
      }
      this.dataArr1 = []
      this.dataArr2 = []
      // this.$refs.date1.reset()
      // this.$refs.date2.reset()

      this.$emit('on-reset')
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
      const params = {
        ...this.$data.searchParams,
        type: this.$props.type,
        colorCodeData: this.$data.searchParams.colorCodeData.join()
      }
      Order.getOrderStatusType(params).then(({ data }) => {
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
      })
    },

    //  订单创建时间范围
    handleChangeOrderDateRange(date) {
      this.searchParams.startTime = date[0] + ' 00:00:00'
      this.searchParams.endTime = date[1] + ' 23:59:59'
    },

    // 订单支付时间范围
    handleChangeOrderPayDateRange(date) {
      this.searchParams.payStartTime = date[0] + ' 00:00:00'
      this.searchParams.payEndTime = date[1] + ' 23:59:59'
    },

    // 获取店铺列表
    getStoreList() {
      Store.getAllStore().then(({ data }) => {
        this.storeList = data
      })
    },
    // 同步店铺弹窗开启
    syncShop() {
      this.syncModalVisible = !this.syncModalVisible
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

    // 同步订单
    async asyncOrder(isAll) {
      if (isAll) {
        await Order.asyncShopeeOrderSync({ ordersn: [] })
      } else {
        const ids = this.$parent.$refs.Order.getSelected().map(
          ({ ordersn }) => ordersn
        )
        if (ids.length === 0) {
          this.errorAlert(this.$t('order.selectOrder'))
          return
        }
        await Order.asyncShopeeOrderSync({ ordersn: ids })
      }
      this.$parent.$refs.Order.getOrderList()

      this.$Message({
        type: 'success',
        content: this.$t('order.syncSuccess')
      })
    },

    //批量操作
    batchAction(key) {
      bus.$emit('batch-action', key)
    },

    //搜索操作
    handleSearch() {
      const params = {
        ...this.searchParams,
        colorCodeData: this.searchParams.colorCodeData.join()
      }
      this.$emit('on-search', params)
    }
  },
  beforeDestroy() {
    bus.$off('reload-page', this.observer)
    bus.$off('order-color-tags-change')
  }
}
</script>

<style lang="scss" scoped>
.color-tabs-block {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  border-radius: 2px;
}
</style>

<style lang="scss">
.order-search-form {
  background: #fff;
  height: auto;
}
</style>
