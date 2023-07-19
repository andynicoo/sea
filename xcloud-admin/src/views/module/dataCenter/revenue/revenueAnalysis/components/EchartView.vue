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
      <span class="more-btn">
        <a-button type="primary" @click="openMore()">
          <AppstoreOutlined />
          <span>更多</span>
        </a-button>
      </span>
      <span class="select-wrap">
        <slot name="selectSlot"></slot>
      </span>
    </div>
    <div class="cell-main">
      <slot name="returnSlot"></slot>
      <div ref="myChartRef" class="charts" style="height: 100%">图表</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, onMounted, onUnmounted } from 'vue';
import { ExclamationCircleFilled, AppstoreOutlined } from '@ant-design/icons-vue';
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
});

const emit = defineEmits(['openMore', 'clickNode']);
const myChartRef: Ref = ref(null);
let myChart: any = null;

watch(props, newVal => {
  if (props.echartOption) {
    setEchart();
  }
});

onMounted(() => {
  myChart = echarts.init(myChartRef.value);
  if (props.onClick) {
    myChart.on('click', function (params: any) {
      emit('clickNode', params.dataIndex);
    });
  }
  window.onresize = () => {
    myChart.resize();
  };
});

onUnmounted(() => {
  window.onresize = null;
});

//更多
const openMore = () => {
  emit('openMore');
};

//设置图表
const setEchart = () => {
  myChart.setOption(props.echartOption);
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
    height: 355px;
    position: relative;
  }
}
</style>
