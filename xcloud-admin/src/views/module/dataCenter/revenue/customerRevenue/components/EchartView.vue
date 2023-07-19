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
    </div>
    <div class="cell-main">
      <slot name="list" class="list-slot"></slot>
      <div ref="myChartRef" class="charts" :style="{ height: cellHeight.chartHeight }">图表</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, onMounted, onUnmounted } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import * as echarts from 'echarts';

const props = defineProps({
  title: {
    default: '',
  },
  tips: {
    default: '',
  },
  onClick: {
    default: false,
    type: Boolean,
  },
  echartOption: {
    default: {},
  },
  listLength: {
    type: Number,
    default: 10,
  },
});

const cellHeight = computed(() => {
  if (myChart) {
    setTimeout(() => {
      myChart.resize();
    });
  }
  return {
    mainHeight: 85 + 55 * props.listLength + 'px',
    chartHeight: 135 + 55 * props.listLength + 'px',
  };
});

const emit = defineEmits(['clickNode']);
const myChartRef: Ref = ref(null);
let myChart: any = null;

watch(props, newVal => {
  if (props.echartOption) {
    setEchart();
  }
});

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
const setEchart = () => {
  myChart.setOption(props.echartOption);
  if (props.onClick && myChart) {
    myChart.getZr().off('click');
    //给阴影区域添加小手
    myChart.getZr().on('mousemove', (param: { offsetX: any; offsetY: any }) => {
      var pointInPixel = [param.offsetX, param.offsetY];
      if (myChart.containPixel('grid', pointInPixel)) {
        myChart.getZr().setCursorStyle('pointer');
      } else {
        myChart.getZr().setCursorStyle('default');
      }
    });
    // 监听整个区域（含阴影）点击
    myChart.getZr().on('click', function (param: { offsetX: any; offsetY: any }) {
      var pointInPixel = [param.offsetX, param.offsetY];
      if (myChart.containPixel('grid', pointInPixel)) {
        // 获取点击位置的坐标系[x，y]
        const index = myChart.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[1];
        emit('clickNode', index);
      }
    });
  }
};
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
    .more-btn {
      float: right;
    }
    .select-wrap {
      float: right;
      margin-right: 24px;
    }
  }
  .cell-main {
    max-height: calc(100vh - 295px);
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    position: relative;
    // padding-left: 200px;
    display: flex;

    .charts {
      flex: 1;
    }
  }
}
</style>
