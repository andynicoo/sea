<template>
  <div class="zxt">
    <div class="top">
      <span
        class="mr20"
      >店铺：<span :title="storeName">{{
        storeName | stringSlice(10)
      }}</span></span>
      年销售额：{{
        annualSales !== '-'
          ? (annualSales / 10000).toFixed(2) + 'W'
          : annualSales
      }}
      销售币：
      <span v-if="currency == '-'">{{ currency }}</span>
      <a-popover
        v-else
        title=""
      >
        <template slot="content">
          <p>{{ currency }}</p>
        </template>
        <a-icon
          type="pay-circle"
          width="40"
          height="40"
        />
      </a-popover>
      <a-select
        v-model="year"
        style="width: 100px"
        class="fr"
        @change="handleChange"
      >
        <a-select-option
          v-for="(item, index) in selectYear"
          :key="item + index"
          :value="item"
        >
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
    <div style="width:650px; height:320px; padding:10px;">
      <div
        id="echart11"
        class="echarts_dom"
      />
    </div>
  </div>
</template>

<script>
import { getAnnualStoreSales } from '@/api/usermanage'
import * as echarts from 'echarts'
// import { merge, cloneDeep } from 'lodash'
import moment from 'moment'
export default {
  filters: {
    stringSlice: function(value, length) {
      value === undefined || value === null ? (value = '') : ''
      value.length > length ? (value = value.slice(0, length) + '...') : value
      return value
    }
  },
  props: {
    stordid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      year: 0,
      selectYear: [],
      // listx: [],
      // listy: [],
      options: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
            var htmlStr = ''
            for (var i = 0; i < params.length; i++) {
              var param = params[i]
              var xName = param.name // x轴的名称
              var seriesName = param.seriesName // 图例名称
              var value = param.value // y轴值
              var color = param.color // 图例颜色

              if (i === 0) {
                htmlStr += xName + '<br/>' // x轴的名称
              }
              htmlStr += '<div>'

              // 具体显示的数据【字段名称：seriesName，值：value】
              // 这里判断一下name，如果是我们需要特殊处理的，就处理

              // 正常显示的数据，走默认
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>'
              if (!value) {
                value = '0'
              }
              htmlStr += seriesName + '：' + value

              htmlStr += '</div>'
            }
            return htmlStr
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['0%', '20%'],
          // 添加单位$
          axisLabel: {
            formatter: '￥{value} '
          }
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            stack: 'Total',
            data: []
          },
          {
            name: '销售币',
            type: 'line',
            data: []
          }
        ]
      },
      storeName: '',
      annualSales: '',
      currency: ''
    }
  },
  mounted() {
    this.year = moment().format('YYYY')
    for (var i = 2015; i <= this.year; i++) {
      this.selectYear.push(i)
    }
    this.getStoreRecord()
  },
  methods: {
    init() {
      this.echarts = echarts.init(document.getElementById(`echart11`))
      this.echarts.setOption(this.$data.options)
    },
    handleResize() {
      if (this.echarts) {
        this.echarts.resize()
      }
    },
    async getStoreRecord() {
      const params = {
        year: this.year,
        storeId: this.stordid
      }
      let { data } = await getAnnualStoreSales(params)
      if (data.storeInfoSalesList === null) {
        data.storeInfoSalesList = [{ yearMonth: this.year, sales: 0 }]
      }
      if (data.annualSales === null) {
        data.annualSales = '-'
      }
      if (data.currency === null) {
        data.currency = '-'
      }
      this.annualSales = data.annualSales
      this.currency = data.currency
      console.log(data.annualSales)
      this.storeName = data?.storeName
      this.$data.options.xAxis.data = []
      this.$data.options.series[0].data = []
      this.calcArray(data?.storeInfoSalesList)
      this.init()
    },
    handleChange(value) {
      console.log(`selected ${value}`)
      this.getStoreRecord()
    },
    calcArray(arr) {
      console.log(arr)
      arr.map((item) => {
        this.$data.options.xAxis.data.push(item.yearMonth)
        this.$data.options.series[0].data.push(item.sales ? item.sales : 0)
        this.$data.options.series[1].data.push(item.currency)
      })
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style lang="less" scoped>
.fr {
  float: right;
}
.echarts_dom {
  width: 100%;
  height: 100%;
}
.mr20 {
  margin-right: 20px;
}
</style>
