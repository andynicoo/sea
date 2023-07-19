<template>
  <div class="me-pa-2" style="min-width:1100px;">
    <Carouse adKey="order_banner" />
    <a-page-header
      class="me-page-header"
      :title="title"
      v-show="$route.path.indexOf('/oms/') !== 0"
    ></a-page-header>
    <a-layout class="me-page-layout me-unpackaged-order-filter">
      <OrderTitle
        @on-search="handleSearch"
        @on-reset="resetSearch"
        :type="0"
        :getSelected="getSelected"
        :getOrderList="getOrderList"
      >
      </OrderTitle>
      <div class="order-page">
        <!-- 订单列表 -->
        <OrderList :searchParams="asyncParams" ref="Order"></OrderList>

        <!-- <v-dialog v-model="asyncOrdersVisible" max-width="900"> -->
        <a-modal
          :title="$t('order.syncOrder')"
          width="900px"
          :visible="asyncOrdersVisible"
          :footer="false"
          @cancel="
            asyncOrdersVisible = false
            asyncOrdersIds = []
          "
        >
          <AsyncGoods
            :title="$t('order.syncOrder')"
            @close="asyncOrdersVisible = false"
            :type="1"
            :storeIds="asyncOrdersIds"
            ref="asyncGoods"
          />
        </a-modal>
      </div>
    </a-layout>
  </div>
</template>

<script>
import OrderList from './components/OrderListNew'
import OrderTitle from './components/OrderTitle'
import AsyncGoods from '@/views/goods/components/AsyncGoods'
import bus from '@/bus'
import Order from '@/api/order'
import { mapState } from 'vuex'
import Carouse from '@/components/Carouse'

export default {
  components: {
    OrderList,
    OrderTitle,
    AsyncGoods,
    Carouse
  },
  data() {
    return {
      asyncParams: {
        type: 0
      },
      asyncOrdersVisible: false,
      asyncOrdersIds: [],
      showModal: false,
      Index: 0,
      ordersId: '',
      content: [],
      getSelected: '',
      getOrderList: '',
      ordersnsArr: []
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  created() {
    if (this.$route.path == '/oms/order/page-unpackaged') {
      //未代打包页面
      this.$set(this.asyncParams, 'statusList', [
        'READY_TO_SHIP',
        'RETRY_SHIP',
        'SHIPPED'
      ])
    }
  },
  mounted() {
    this.$data.getSelected = this.$refs.Order.getSelected
    this.$data.getOrderList = this.$refs.Order.getOrderList
  },

  methods: {
    ok() {
      const ordersn = ''
      Order.getOrderSendType({ ordersn: ordersn }).then((res) => {})
    },
    handleSearch(params) {
      this.asyncParams = { ...params, type: 0 }
      this.$nextTick(() => {
        this.$refs.Order.checkedChangeFlag = params.storeType
          ? params.storeType
          : 0
        this.$refs.Order.listTimeSel = params.timeMode == 2 ? 2 : 1
        this.$refs.Order.resetPagintion()
        this.$refs.Order.getOrderList()
      })
    },
    resetSearch(params) {
      this.$data.asyncParams = { ...params, type: 0 }

      this.$nextTick(() => {
        this.$refs.Order.checkedChangeFlag = 0
        this.$refs.Order.listTimeSel = 1
        this.$refs.Order.getOrderList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-container {
  padding: 16px;

  & > div {
    padding: 0 16px;
    padding-bottom: 16px;
    background-color: #fff;
    border-radius: 1px;
  }
}
</style>
<style>
.me-unpackaged-order-filter .me-page-search .ant-form-item label {
  min-width: 85px;
}
</style>
