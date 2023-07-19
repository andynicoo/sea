<template>
  <div class="me-pa-2" style="min-width: 1100px">
    <a-breadcrumb class="me-mb-3 me-mt-2" separator="/">
      <a-breadcrumb-item>
        运营数据
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">财务数据</a-breadcrumb-item>
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
          数据统计
          <!-- <span>近7天数据统计</span> -->
        </h2>
        <ul class="me-data-board">
          <li>
            销售利润
            <b>{{ finaData.profit }}</b>
          </li>
          <li>
            销售利润率
            <b
              >{{
                finaData.profitRate
                  ? (finaData.profitRate * 100).toFixed(2)
                  : '0'
              }}%</b
            >
          </li>
          <li>
            成本
            <b>{{ finaData.cost }}</b>
          </li>
          <li>
            销售成本率
            <b
              >{{
                finaData.costRate ? (finaData.costRate * 100).toFixed(2) : '0'
              }}%</b
            >
          </li>
        </ul>
        <a-table
          :columns="columns"
          :data-source="sourceData"
          class="me-mt-4 me-stat-table"
          :pagination="false"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template slot="profitRate" slot-scope="text, record">
            <span>{{ (record.profitRate * 100).toFixed(2) }}% </span>
          </template>
          <template slot="costRate" slot-scope="text, record">
            <span>{{ (record.costRate * 100).toFixed(2) }}% </span>
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
    title: '销售利润',
    dataIndex: 'profit',
    key: 'profit'
  },
  {
    title: '销售利润率',
    dataIndex: 'profitRate',
    key: 'profitRate',
    scopedSlots: { customRender: 'profitRate' },
    ellipsis: true
  },
  {
    title: '成本',
    dataIndex: 'cost',
    key: 'cost',
    ellipsis: true
  },
  {
    title: '销售成本率',
    dataIndex: 'costRate',
    key: 'costRate',
    scopedSlots: { customRender: 'costRate' },
    ellipsis: true
  }
]
import Stat from '@/api/stat'
import TileFilter from '@/components/tableFilter/Tile'
import { mapState } from 'vuex'
import dataBrandMixins from '@/mixins/dataBrandMxins'
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
      sourceData: [],
      columns,
      siteStoreList: [],
      storeList: [],
      finaData: {},
      isLoading: false
    }
  },
  mounted() {
    this.siteChange()

    setTimeout(() => {
      this.getData()
      this.getTableData()
    }, 100)
  },
  methods: {
    //刷新数据
    getNewData() {
      this.isLoading = true
      // 等待searchParams.storeIds处理（去除‘all’）
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
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
        this.submitIng = true
        await this.getData()
        await this.getTableData()

        this.submitIng = false
      }
    },
    async getData() {
      // this.$data.searchParams.storeIds = this.$data.searchParams.store
      let params = this.searchParams
      await Stat.getStatisticsFinance(params).then((res) => {
        this.$data.finaData = res.data
      })
    },
    async getTableData() {
      // this.$data.searchParams.storeIds = this.$data.searchParams.store
      let params = this.searchParams
      await Stat.getStatisticsFinanceByDate(params).then((res) => {
        this.$data.sourceData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/stat.scss';
</style>
