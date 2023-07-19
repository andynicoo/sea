<template>
  <div class="container-wrapper">
    <div class="echarts-title">
      <p class="p-title">{{ showData.title }}</p>
      <p class="count-num">
        <span>{{ showData.sum }}</span>
      </p>
    </div>
    <div class="echarts-wrapper">
      <Echarts
        v-if="list.length"
        :id="showData.chartsId"
        :options="options"
      />
      <a-empty v-else />
    </div>
    <!-- <div class="attach-info">
      <span class="label">今日</span>
      <span>{{ data.thisdayBindShopNum | formatMoney }}</span>
    </div> -->
  </div>
</template>

<script>
import Echarts from '@/components/echarts'
import { minOptions } from '../options'
import { merge, cloneDeep } from 'lodash'
export default {
  components: {
    Echarts
  },
  props: {
    showData: {
      typeof: Object
    }
  },
  data() {
    return {
      data: {},
      list: [],
      options: {}
    }
  },

  watch: {
    showData: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    init(data) {
      const options = cloneDeep(minOptions)
      const obj = {
        // grid: {
        //   bottom: 45
        // },
        xAxis: {
          data: data.map((item) => item.showTime)
        },
        // dataZoom: [
        //   // 滑动条
        //   {
        //     xAxisIndex: 0, // 这里是从X轴的0刻度开始
        //     show: true, // 是否显示滑动条，不影响使用
        //     type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        //     startValue: 0, // 从头开始。
        //     endValue: 50 // 一次性展示6个。
        //   }
        // ],
        series: [
          {
            data: data.map((item) => item.number),
            areaStyle: {
              color: '#ff6e1c'
            },
            lineStyle: {
              color: '#ff6e1c'
            }
          }
        ]
      }
      return merge(options, obj)
    },
    async getList() {
      // console.log(this.showData.data)
      let chartData = cloneDeep(this.showData.data)
      let chartData7 = chartData ? chartData.splice(-30) : []
      try {
        this.list =
          this.showData.data && this.showData.data.length > 1 ? chartData7 : []
        this.options = this.init(this.list)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 2px;
  box-shadow: -10px 10px 20px 0px rgba(30, 30, 30, 0.06);
  padding: 20px 24px;
  padding-bottom: 10px;
  .echarts-title {
    height: 75px;
  }
  .p-title {
    font-weight: bold;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
  .count-num {
    font-size: 32px;
    font-family: HelveticaNeue;
    color: rgba(0, 0, 0, 0.85);
    line-height: 38px;
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .money-unit {
      font-size: 14px;
    }
  }
  .echarts-wrapper {
    height: calc(100% - 75px - 27px);
    width: 100%;
  }
  .attach-info {
    border-top: 1px solid #e8e8e8;
    padding-top: 5px;
    color: rgba(0, 0, 0, 0.85);
    .label {
      margin-right: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
