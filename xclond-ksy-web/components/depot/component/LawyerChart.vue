<template>
  <div class="lawyer-chart">
    <div class="title">审查律师分配分析</div>
    <div class="loading" v-if="loading">
      <a-spin size="large" />
    </div>
    <div ref="lawyerChart" class="chart"></div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {};
  },
  props: {
    distributionList: {
      type: Object,
      default: {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    distributionList(val) {
      let xdate = val.trademarkAttorneyAnalysisVOS.map((item) => {
        return item.month;
      });
      let data1 = val.trademarkAttorneyAnalysisVOS.map((item) => {
        return item.number;
      });
      let data2 = val.notAttorneyTrademarkAttorneyAnalysisVOS.map((item) => {
        return item.number;
      });
      let option = {
        color: ["#3370FF", "#87DDFE"],
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          top: "0",
          right: "3%",
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "3%",
          bottom: 65,
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            realtime: true,
            start: 0,
            end: 50,
            xAxisIndex: [0, 70],
            height: 25,
            bottom: 10
          },
        ],
        xAxis: [
          {
            type: "category",
            data: xdate,
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "rgba(73,80,87,0.9)",
              fontSize: 12,
              padding: [8, 0, 0, 0],
            },            
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "个",
            nameTextStyle: {
              color: "rgba(73,80,87,0.9)",
              fontSize: 12,
              padding: [0, 0, 6, -50],
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(73,80,87,0.9)",
              },
              padding: 10,
            },
          },
        ],
        series: [
          {
            name: "美标申请量",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            barWidth: 20,
            label: {
              normal: {
                show: true,
                position: "top",
                formatter: function (data) {
                  return "{a0|" + data.value + "}";
                },
                rich: {
                  a0: {
                    color: "#3370FF",
                    fontSize: 12,
                    fontFamily: "DIN",
                  },
                },
              },
            },
            data: data1,
          },
          {
            name: "未分配审查律师美标申请量",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barWidth: 20,
            label: {
              normal: {
                show: true,
                position: "top",
                formatter: function (data) {
                  return "{a1|" + data.value + "}";
                },
                rich: {
                  a1: {
                    color: "#87DDFE",
                    fontSize: 12,
                    fontFamily: "DIN",
                  },
                },
              },
            },
            data: data2,
          },
        ],
      };
      this.chart = this.$echarts.init(this.$refs.lawyerChart);
      this.chart.setOption(option, true);
      this.chart.off().on("click", params => {
        let start = moment(params.name).startOf("month").format('YYYY-MM-DD')
        let end = moment(params.name).endOf("month").format('YYYY-MM-DD')
        let noRemarkFlowsList = []
        if(params.seriesIndex === 1){
          noRemarkFlowsList = ['ASSIGNED TO EXAMINER']
        }
        this.$emit('change', {
          applyDateStr: `${start},${end}`,
          noRemarkFlowsList
        })
      })
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.lawyer-chart {
  padding: 16px;
  position: relative;
  .loading {
    z-index: 999;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 140px;
  }
  .title {
    font-size: 18px;
    color: #303132;
    line-height: 30px;
    margin-bottom: 16px;
  }
  .chart{
    height: 260px
  }
}
</style>
