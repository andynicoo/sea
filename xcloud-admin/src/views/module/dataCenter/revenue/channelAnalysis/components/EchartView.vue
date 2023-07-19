<template>
  <div class="cell-box-wrap">
    <div class="cell-title">
      <span>{{ title || '-' }}</span>
      <span class="tips-icon" v-if="tips">
        <a-tooltip placement="top">
          <template #title>
            <div style="font-size: 12px">{{ tips || '-' }}</div>
          </template>
          <ExclamationCircleFilled style="color: #f0b955" />
        </a-tooltip>
      </span>
      <span class="tips-num" v-if="statisticsNum != -1">（ 渠道成交数量：{{ statisticsNum || 0 }} ）</span>
    </div>
    <div class="cell-main">
      <slot name="returnSlot"></slot>
      <div ref="myChartRef" class="charts" style="height: 100%">图表</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import * as echarts from 'echarts';

defineProps({
  title: {
    default: '',
  },
  tips: {
    default: '',
  },
});

const myChartRef: Ref = ref(null);
let myChart: any = null;
const statisticsNum = ref(-1);

onMounted(() => {
  myChart = echarts.init(myChartRef.value);
  window.onresize = () => {
    myChart.resize();
  };
});

onUnmounted(() => {
  window.onresize = null;
});

//设置图表
const setEchart = (xData: Array<string>, yData: Array<any>, showNum = 7, showStatistics = false) => {
  if (showStatistics) {
    statisticsNum.value = xData.length || 0;
  }

  myChart.setOption({
    color: ['#70A7F6', '#EF7B6F', '#2076F2', '#FBA628', '#4FAAFF'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      left: 10,
      padding: 20,
    },
    grid: {
      containLabel: true,
      top: 60,
      right: 20,
      bottom: 50,
      left: 20,
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate',
      },
      // boundaryGap: false,
      data: xData,
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '￥ {value}',
        },
        // max: 100000,
        // splitNumber: 5,
      },
      {
        type: 'value',
      },
    ],
    dataZoom: [
      {
        show: true,
        startValue: xData.length > showNum ? xData.length - showNum : 0,
        end: 100,
      },
      // {
      //   type: 'inside',
      //   startValue: xData.length > showNum ? xData.length - showNum : 0,
      //   end: 100,
      // },
    ],
    series: yData,
  });
};

//暴露方法
defineExpose({ setEchart });
</script>

<style scoped lang="less">
.cell-box-wrap {
  background-color: #fff;
  margin-bottom: 15px;
  padding: 0 20px;
  border-radius: 2px 2px 0px 0px;
  .cell-title {
    height: 56px;
    line-height: 56px;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .tips-icon {
      margin-left: 12px;
      cursor: pointer;
    }
    .tips-num {
      margin-left: 20px;
    }
  }
  .cell-main {
    height: 355px;
    position: relative;
  }
}
</style>
