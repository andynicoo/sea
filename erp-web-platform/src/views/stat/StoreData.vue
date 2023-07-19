<template>
  <div class="me-pa-2" style="min-width: 1100px">
    <a-breadcrumb class="me-mb-3 me-mt-2" separator="/">
      <a-breadcrumb-item>
        运营数据
      </a-breadcrumb-item>
      <a-breadcrumb-item class="me-f12">店铺数据</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout>
      <!-- {{ siteStoreList }}
      <hr />
      {{ storeList }}
      <hr /> -->
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
      <StoreStat
        ref="StoreStat"
        :searchParams="searchParams"
        @siteChange="siteChange"
      />

      <div class="me-data-card">
        <h2 class="me-card-title">
          销售额TOP10店铺及趋势
          <!-- <span>近7天数据统计</span> -->
        </h2>
        <div class="me-salesVolumeChart">
          <div id="salesVolumeChart"></div>
        </div>
      </div>
      <div class="me-data-card">
        <h2 class="me-card-title">
          销售额TOP10商品及趋势
          <!-- <span>近7天数据统计</span> -->
        </h2>
        <a-radio-group
          v-model="salesType"
          button-style="solid"
          @change="salesTypeChange"
          class="me-sales-type"
        >
          <a-radio-button value="sku">
            按SKU
          </a-radio-button>
          <a-radio-button value="spu">
            按SPU
          </a-radio-button>
        </a-radio-group>
        <a-table
          :columns="columns"
          :data-source="sourceData"
          class="me-mt-4 me-stat-table"
          :pagination="false"
        >
          <template slot="index" slot-scope="text, record, index">
            {{ index + 1 }}
          </template>
          <template slot="itemName" slot-scope="text, record, index">
            <div class="product-info">
              <div>
                <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
                  <template slot="content">
                    <img
                      v-lazy="record.mainImage"
                      style="width: 280px; height: 280px; border-radius: 2px"
                    />
                  </template>
                  <img
                    v-lazy="record.mainImage"
                    style="width: 80px; height: 80px; border-radius: 2px"
                  />
                </a-popover>
              </div>
              <div class="info-text">
                <a
                  class="name"
                  :href="record.shopeeUrl"
                  target="_blank"
                  :title="record.itemName"
                  >{{ record.itemName }}</a
                >
                <span v-if="salesType === 'sku'"
                  >规格：{{ record.variationName }}</span
                >
              </div>
            </div>
          </template>
          <span slot="countryCode" slot-scope="">
            <!-- {{ text }} -->
            Shopee
          </span>
        </a-table>
      </div>
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
    scopedSlots: { customRender: 'index' },
    width: 80,
    align: 'center'
  },
  {
    title: '产品名称',
    dataIndex: 'itemName',
    key: 'itemName',
    scopedSlots: { customRender: 'itemName' },
    width: 400
  },
  {
    title: '平台',
    dataIndex: 'countryCode',
    key: 'countryCode',
    scopedSlots: { customRender: 'countryCode' },
    ellipsis: true
  },
  {
    title: '店铺',
    dataIndex: 'storeName',
    key: 'storeName',
    ellipsis: true
  },
  {
    title: '销售额(元)',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    ellipsis: true
  },
  {
    title: '销量',
    dataIndex: 'quantityPurchased',
    key: 'quantityPurchased',
    ellipsis: true
  }
]

import Stat from '@/api/stat'
import echarts from '@/util/echarts'
import TileFilter from '@/components/tableFilter/Tile'
import StoreStat from './components/StoreStat.vue'
import { mapState } from 'vuex'
import dataBrandMxins from '@/mixins/dataBrandMxins'
export default {
  components: {
    TileFilter,
    StoreStat
  },
  mixins: [dataBrandMxins],
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
      siteStoreList: [], // 已授权的店铺层级站点(CNSC&&普通)
      storeList: [], // 店铺
      salesType: 'sku',
      originData: {}
    }
  },
  mounted() {
    this.siteChange()

    setTimeout(() => {
      // 获取店铺商品销量排行
      this.getProductRanking()
      // 获取店铺及趋势
      this.getStoreRanking()

      this.$refs.StoreStat.getStoreStatData()
    }, 100)
  },
  methods: {
    //sku,spu数据切换
    salesTypeChange(e) {
      console.log(this.salesType)
      this.$data.salesType === 'sku'
        ? (this.$data.sourceData = this.$data.originData.sku)
        : (this.$data.sourceData = this.$data.originData.spu)
    },
    //店铺柱状图
    initChart(data) {
      var chartDom = document.getElementById('salesVolumeChart')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        tooltip: {},
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#606166'
            }
          },
          type: 'category',
          data: ['店铺名字比较长的店店铺名字比较长的店'],
          axisLabel: {
            with: 50,
            interval: 0, //横轴信息全部显示
            // rotate:-15,//-15度角倾斜显示,
            fontSize: 12,
            //关键是这句
            formatter: function(value) {
              return value.length > 10 ? value.substring(0, 10) + '...' : value
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            //网格线
            lineStyle: {
              type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
              color: '#E9E9E9'
            },
            show: true //隐藏或显示
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          top: '50',
          containLabel: true
        },
        series: [
          {
            data: [0],
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
              color: '#a8a8b3'
            },
            itemStyle: {
              normal: {
                color: '#FFA666'
              }
            }
          }
        ]
      }
      option.xAxis.data = data.x
      option.series[0].data = data.y
      option && myChart.setOption(option)
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
        // 获取店铺商品销量排行
        await this.getProductRanking()
        await this.$refs.StoreStat.getStoreStatData()
        await this.getStoreRanking()

        this.submitIng = false
      }
    },
    getProductRanking() {
      Stat.getProductRanking(this.$data.searchParams).then((res) => {
        this.$data.originData = res.data
        this.$data.salesType === 'sku'
          ? (this.$data.sourceData = this.$data.originData.sku)
          : (this.$data.sourceData = this.$data.originData.spu)
      })
    },
    async getStoreRanking() {
      let { data } = await Stat.getStoreRanking(this.$data.searchParams)
      console.log(data)
      var chartData = { x: [], y: [] }
      if (data.length) {
        //
        data.map((ele) => {
          chartData.x.push(ele.storeName)
          chartData.y.push(ele.totalAmount)
        })
      }
      this.initChart(chartData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/stat.scss';
.product-info {
  display: grid;
  grid-template-columns: 80px 1fr;

  .info-text {
    padding: 0 10px;
    max-width: 320px;

    .name {
      overflow: hidden;
      color: #000000a6;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 3; //显示的行
      &:hover {
        color: $linkColor;
      }
    }
  }
}
</style>
