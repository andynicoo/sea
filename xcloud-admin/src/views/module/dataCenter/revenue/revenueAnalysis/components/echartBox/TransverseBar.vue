<template>
  <EchartView :title="title" :tips="tips" :echartOption="data.echartOption" @openMore="openMore">
    <template #selectSlot>
      <a-select
        placeholder="请选择"
        v-model:value="data.type"
        style="width: 210px"
        @change="getList"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="amount">销售额(已到账)</a-select-option>
        <a-select-option value="refundMoney">退款额</a-select-option>
        <a-select-option value="sales">商品销量</a-select-option>
        <a-select-option value="refundSales">商品退款量</a-select-option>
      </a-select>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    :title="title"
    :columnTitle="columnTitle"
    :params="params"
    :methodName="methodName"
    :otherParams="{
      aggregationRankField: data.type,
    }"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import MoreView from '../MoreView.vue';

const props = defineProps({
  title: {
    default: '',
  },
  tips: {
    default: '',
  },
  columnTitle: {
    default: '-',
  },
  params: {
    default: {},
  },
  methodName: {
    default: null,
    type: Function,
  },
});

const data: any = reactive({
  type: 'amount',
  echartOption: {},
});
const list = ref<Array<any>>([]);

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//获取数据
const getList = () => {
  props
    .methodName(
      Object.assign({}, props.params, {
        limit: 10,
        page: 1,
        aggregationRankField: data.type,
      })
    )
    .then((res: any) => {
      list.value = res.records || [];
      list.value.reverse();
      setData();
    });
};

//设置数据
const setData = () => {
  setEchartOption(
    list.value.map(v => (props.title === '服务商销售排行' ? v.supplierName : v.groupByTypeName)),
    list.value.map(v => v[data.type]),
    data.type === 'amount' || data.type === 'refundMoney'
  );
};

//设置图表参数
const setEchartOption = (yAxisData: Array<string>, seriesData: Array<number>, isMoney: boolean) => {
  data.echartOption = {
    color: ['#2076F2'],
    tooltip: {
      formatter: isMoney ? '{b} : ￥{c} ' : '{b} : {c} ',
    },
    legend: {
      left: 10,
      padding: 20,
    },
    grid: {
      containLabel: true,
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: isMoney ? '￥ {value}' : '{value}',
      },
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        width: 80,
        overflow: 'truncate',
      },
      data: yAxisData,
    },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        data: seriesData,
      },
    ],
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less"></style>
