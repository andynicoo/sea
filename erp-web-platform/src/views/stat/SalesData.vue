<template>
  <div class="me-pa-2" style="min-width: 1100px">
    <a-breadcrumb class="me-mb-3 me-mt-2" separator="/">
      <a-breadcrumb-item>
        运营数据
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">销售数据</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout>
      <!-- 搜索块 -->
      <div class="me-tile-filter">
        <TileFilter :colItem="colItem" :formModel="searchParams" />
        <a-button
          class="me-handle-btn"
          type="primary"
          @click="(e) => handleSearch()"
          :loading="submitIng"
          >查询</a-button
        >
      </div>
      <div class="me-data-card">
        <h2 class="me-card-title">
          <b class="me-f5" @click="getNewData"
            >刷新<a-icon :class="{ 'me-loading': isLoading }" type="redo"/></b
          >数据统计
          <!-- <span>近7天数据统计</span> -->
        </h2>
        <ul class="me-data-board">
          <li>
            付款总额
            <b>{{ salesData.paymentTotal }}</b>
          </li>
          <li>
            付款订单数量
            <b>{{ salesData.paymentOrderTotal }}</b>
          </li>
          <li>
            退款金额
            <b>{{ salesData.refundAmountTotal }}</b>
          </li>
          <li>
            退款订单
            <b>{{ salesData.refundOrderTotal }}</b>
          </li>
        </ul>
        <a-table
          :columns="columns"
          :data-source="salesData.salesDataResultDTOS"
          class="me-mt-4 me-stat-table"
          :pagination="false"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template slot="generateDate" slot-scope="text, record">
            <span>{{ moment(record.generateDate).format('YYYY-MM-DD') }} </span>
          </template>
        </a-table>
      </div>
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    title: '日期',
    dataIndex: 'generateDate',
    key: 'generateDate',
    scopedSlots: { customRender: 'generateDate' }
  },
  {
    title: '付款总额',
    dataIndex: 'paymentTotal',
    key: 'paymentTotal'
  },
  {
    title: '付款订单数量',
    dataIndex: 'paymentOrderTotal',
    key: 'paymentOrderTotal',
    ellipsis: true
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmountTotal',
    key: 'refundAmountTotal',
    ellipsis: true
  },
  {
    title: '退款订单',
    dataIndex: 'refundOrderTotal',
    key: 'refundOrderTotal',
    ellipsis: true
  }
]

import Stat from '@/api/stat'
import dataBrandMixins from '@/mixins/dataBrandMxins'
import TileFilter from '@/components/tableFilter/Tile'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {
    TileFilter
  },
  mixins: [dataBrandMixins],
  watch: {
    'searchParams.site': {
      handler() {
        this.siteChange()
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize
    }),
    colItem({ siteStoreList, storeList, platformList }) {
      return [
        {
          itemType: 'tile',
          label: '平台',
          key: 'platform',
          itemProp: {
            style: 'width:190px'
          },
          itemData: platformList
        },
        {
          itemType: 'tileCheck',
          label: '站点',
          key: 'site',
          itemProp: {
            style: 'width:190px'
          },
          itemData: siteStoreList
        },
        {
          itemType: 'tileCheck',
          label: '店铺',
          key: 'store',
          itemProp: {
            style: 'width:190px'
          },
          itemData: storeList
        },
        {
          itemType: 'tileDate',
          label: '时间',
          key: 'createDate',
          key2: 'createDateType',
          itemProp: {
            style: 'width:190px',
            disabled: 'isafter' // 禁用今天以后的日期
          },
          itemData: [
            {
              value: 3,
              label: '近7天'
            },
            {
              value: 4,
              label: '近30天'
            },
            {
              value: 9,
              label: '自定义日期'
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      moment,
      columns,
      siteStoreList: [],
      storeList: [],
      salesData: { salesDataResultDTOS: [] },
      isLoading: false
    }
  },
  mounted() {
    this.siteChange()

    // 等待searchParams.storeIds处理（去除‘all’）
    setTimeout(() => {
      this.getSalesData()
    }, 100)
  },
  methods: {
    //刷新数据
    getNewData() {
      this.isLoading = true
      Stat.getNewSalesData({})
        .then((res) => {
          console.log(res)
          this.getSalesData()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    //搜索
    async handleSearch(val) {
      let { createDate } = this.$data.searchParams
      if (!createDate.length || (createDate.length && createDate[0] === '')) {
        this.$message.error('请选择自定义时间！')
        return false
      }
      if (!val) {
        //确定查询
        console.log(this.searchParams)
        this.submitIng = true
        // 获取店铺商品销量排行
        await this.getSalesData()

        this.submitIng = false
      }
    },
    async getSalesData() {
      // this.$data.searchParams.storeIds = this.$data.searchParams.store
      let params = this.searchParams
      await Stat.getSalesData(params).then((res) => {
        this.$data.salesData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/stat.scss';
</style>
