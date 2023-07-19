import * as echarts from 'echarts'

export const minOptions = {
  grid: {
    left: 10,
    right: 15,
    top: '10%',
    bottom: 10
    // containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter(val) {
      let str = ''
      val.forEach((item) => {
        str = `${item.marker}${item.name} ${item.value}<br>`
      })
      return str
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    show: false
  },
  yAxis: {
    type: 'value',
    show: false
  },
  series: [
    {
      type: 'line',
      showSymbol: false,
      areaStyle: {}
    }
  ]
}
export const maxOptions = {
  tooltip: {
    show: true,
    trigger: 'axis',
    formatter(val) {
      let str = ''
      val.forEach((item) => {
        str = `${item.marker}${item.name} ${item.value}% <br>`
      })
      return str
    }
  },
  grid: {
    left: 0,
    right: 15,
    top: '10%',
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#a3a7ad'
      }
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#a3a7ad'
      }
    },
    splitLine: {
      show: false
    }
  },
  series: [
    {
      type: 'line',
      showSymbol: false,
      itemStyle: {
        color: 'rgb(255, 114, 13)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 114, 13)'
          },
          {
            offset: 1,
            color: 'rgb(255, 255, 255)'
          }
        ])
      }
    }
  ]
}
