<template>
  <div class="me-pa-2">
    <a-page-header
      class="me-page-header"
      :title="title"
      v-show="$route.path.indexOf('/oms/') !== 0"
    ></a-page-header>
    <SearchForm @on-search="handleSearch" @on-reset="resetSearch" :type="0">
      <template slot="before"> </template>
    </SearchForm>
    <!-- 订单列表 -->
    <OrderList :searchParams="asyncParams" ref="Order"></OrderList>

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
</template>

<script>
import OrderList from './components/OrderList'
import SearchForm from './components/SearchForm'
import AsyncGoods from '@/views/goods/components/AsyncGoods'
import bus from '@/bus'
import Order from '@/api/order'
import { mapState } from 'vuex'
export default {
  components: {
    OrderList,
    SearchForm,
    AsyncGoods
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
      content: []
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  mounted() {
    bus.$on('on-async-store-choose', (ids) => {
      this.$data.asyncOrdersIds = ids
      this.$data.asyncOrdersVisible = true
      this.$nextTick(() => {
        this.$refs.asyncGoods.async()
      })
    })
    //to-do
    // this.ordersId = '#12312312123'
    // this.content = [
    //   {
    //     img: require('@/assets/images/order/shipment.png'),
    //     title: this.$t('order.shipmentTitle'),
    //     content: this.$t('order.shipmentContent'),
    //     color: '#f65cbb'
    //   },
    //   {
    //     img: require('@/assets/images/order/ship.png'),
    //     title: this.$t('order.shipTitle'),
    //     content: this.$t('order.shipContent'),
    //     color: '#409eff'
    //   }
    // ]
  },
  beforeDestroy() {
    bus.$off('on-async-store-choose')
  },
  methods: {
    ok() {
      const ordersn = ''
      Order.getOrderSendType({ ordersn: ordersn }).then((res) => {})
    },
    handleSearch(params) {
      this.asyncParams = { ...params, type: 0 }
      this.$nextTick(() => {
        this.$refs.Order.getOrderList()
      })
    },
    resetSearch() {
      this.$data.asyncParams = { type: 0 }
      this.$nextTick(() => {
        this.$refs.Order.getOrderList()
      })
    }
  }
}
</script>
