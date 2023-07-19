<template>
  <div class="me-pa-2" style="min-width:1100px;">
    <a-page-header class="me-page-header" :title="title"></a-page-header>

    <a-layout class="me-page-layout">
      <div class="me-card-fff">
        <TableFilter
          :col-item="colItem"
          :form-model="searchParams"
          @submit="handleSearch"
          @reset="resetSearch"
        ></TableFilter>
        <a-tabs
          class="me-mt-4"
          v-if="lazadaStatusCount"
          v-model="activeKey"
          type="card"
          @change="statusCallback"
        >
          <a-tab-pane :key="item.id" v-for="item in tabsList">
            <template slot="tab">
              {{ item.label
              }}<span v-if="orderSum(item.id) > 0"
                >({{ orderSum(item.id) }})</span
              >
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- 订单列表 -->
      <OrderList
        :activeKey="activeKey"
        ref="Order"
        :searchParams="searchParams"
        @getCount="getCount"
      ></OrderList>
    </a-layout>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
import OrderList from './OrderList'
import LazadaOrder from '@/api/lazadaOrder'
import { mapState } from 'vuex'

export default {
  components: {
    TableFilter,
    OrderList
  },
  data() {
    return {
      searchParams: {
        orderNumber: void 0,
        firstName: void 0,
        countryCode: void 0,
        storeId: void 0
      },
      activeKey: 0,
      tabsList: [
        { label: '全部订单', id: 0 },
        { label: '未付款', id: 'unpaid' },
        { label: '打包', id: 'pending,repacked' },
        { label: '发货', id: 'packed,ready_to_ship' },
        { label: '在途', id: 'shipped' },
        { label: '妥投', id: 'delivered' },
        { label: '取消', id: 'canceled' },
        { label: '退款/退货', id: 'returned' },
        { label: '妥投失败', id: 'shipped_back_success,shipped_back' }
        // { label: '丢失/损毁', id: 9 }
      ],
      lazadaStatusCount: ''
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName,
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    }),
    //订单列表搜索项
    colItem({ lazadaStoreListSize }) {
      return [
        {
          itemType: 'input',
          label: this.$t('order.orderId'),
          key: 'orderNumber',
          itemProp: {
            style: 'width:190px'
          }
        },
        {
          itemType: 'input',
          label: this.$t('order.bugerName'),
          key: 'firstName',
          itemProp: {
            style: 'width:190px'
          }
        },
        // {
        //   itemType: 'select',
        //   label: this.$t('order.site'),
        //   key: 'countryCode',
        //   itemProp: {
        //     style: 'width:190px'
        //   },
        //   itemData: lazadaStoreListSize
        // },
        {
          itemType: 'cascader',
          label: this.$t('order.shop'),
          key: 'storeId',
          itemProp: {
            options: lazadaStoreListSize,
            onSelect: true
          }
        },
        {
          itemType: 'rengePicker',
          label: this.$t('order.orderCreateTime'),
          key: 'orderCreateTime',
          itemProp: {
            style: 'width:190px'
          }
        }
      ]
    }
  },
  created() {
    // this.getCount()
  },
  beforeDestroy() {},
  methods: {
    //获取各状态订单数
    async getCount(params) {
      let { data } = await LazadaOrder.statusCount(params)
      this.lazadaStatusCount = data
    },
    orderSum(id) {
      let sum = 0
      if (id == 0) {
        return this.lazadaStatusCount.reduce(
          (accumulator, currentValue) => accumulator + currentValue.count,
          0
        )
      } else {
        id.split(',').forEach((ele) => {
          let currStatus = this.lazadaStatusCount.filter(
            (item) => ele == item.statuses
          )

          if (currStatus.length) {
            sum += currStatus[0].count
          }
        })
        return sum
      }
    },
    //切换状态
    statusCallback(key) {
      this.activeKey = key
      this.handleSearch()
    },
    handleSearch(params) {
      // this.asyncParams = { ...params, type: 0 }
      this.$nextTick(() => {
        // this.$refs.Order.checkedChangeFlag = params.storeType
        //   ? params.storeType
        //   : 0
        // this.$refs.Order.resetPagintion()
        this.$refs.Order.reLoadData()
      })
    },
    resetSearch() {
      this.searchParams = {
        orderNumber: void 0,
        firstName: void 0,
        countryCode: void 0,
        storeId: void 0
      }
      this.$nextTick(() => {
        this.$refs.Order.reLoadData()
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
.me-page-layout {
  background: none;
  padding: 0;
}
.me-card-fff {
  background: #fff;
  padding: 20px;
}
.me-pb0 {
  padding-bottom: 0px;
}
</style>
