<template>
  <div class="echartline" v-loading="loading">
    <h3>变化趋势</h3>
    <!-- {{trendList}} -->
    <div ref="dom" class="charts"></div>
    <!-- {{option}} -->
  </div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from '@/components/charts/theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  data () {
    return {
      loading: false,
      dom: null,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: '5%',
          data: this.titArr,
          selected: this.getSelectedArr(),
          icon: 'circle'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    }
  },
  props: {
    titArr: {
      type: Array,
      default: () => ([])
    },
    // 数据
    trendList: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    titArr(newVal) {
      this.option.legend.data = newVal
      this.option.legend.selected = this.getSelectedArr()
    }
  },
  mounted () {
    this.initDom()
  },
  methods: {
    initDom () {
      this.formatData()
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option, true)

      this.dom.on('legendselectchanged', (params) => {
        let arr = Object.values(params.selected)
        let isSelectAtLeastOne = arr.some(item => item)
        if(!isSelectAtLeastOne) {
          this.$message.closeAll()
          this.$message.warning('需至少选择1项指标')
          this.dom.dispatchAction({
            type: 'legendSelect',
            name: params.name
          })
        }
      })
      on(window, 'resize', this.resize)
    },
    resize () {
      this.dom.resize()
    },
    // 根据后端返回数据格式，调成echarts需要的格式
    formatData () {
      let xDatas = []
      this.trendList[0].trendInfo.map(item => {
        xDatas.push(item.xDate)
      })
      let yDatas = []
      this.trendList.map((item, index) => {
        yDatas.push({
          name: this.titArr[index],
          type: 'line',
          // stack: 'Total',
          data: this.getXdata(item)
        })
      })
      this.option.xAxis.data = xDatas
      this.option.series = yDatas
    },
    getXdata (item) {
      let temp = []
      item.trendInfo.map(it => {
        temp.push(it.ydata)
      })
      return temp
    },
    getSelectedArr () {
      let arr = {}
      this.titArr.map((item, index) => {
        if (index !== 0) {
          arr[item] = false
        } else {
          arr[item] = true
        }
      })
      return arr
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style lang="scss" scoped>
.charts {
  height: 400px;
}
</style>
