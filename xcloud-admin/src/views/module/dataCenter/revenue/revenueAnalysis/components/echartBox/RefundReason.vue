<template>
  <EchartView
    title="退款原因分析"
    tips="默认展示全部退款类型下退款额占比"
    :echartOption="data.echartOption"
    @openMore="openMore"
  >
    <template #selectSlot>
      <a-select
        placeholder="请选择"
        v-model:value="data.refundApplyType"
        style="width: 160px; margin-right: 10px"
        @change="getList"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="">全部退款类型</a-select-option>
        <a-select-option value="ONLY_REFUND">仅退款</a-select-option>
        <a-select-option value="REFUND_CANCEL_SERVICE">退款并取消服务</a-select-option>
      </a-select>
      <a-select
        placeholder="请选择"
        v-model:value="data.type"
        style="width: 160px"
        @change="getList"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="refundMoney">退款额</a-select-option>
        <a-select-option value="refundSales">商品退款量</a-select-option>
      </a-select>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="退款原因分析"
    :columns="data.columns"
    :params="params"
    :methodName="getRefundReasonRank"
    :otherParams="{
      aggregationRankField: data.type,
      refundApplyType: data.refundApplyType,
    }"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getRefundReasonRank } from '@/api/dataCenter/revenueAnalysis';
import MoreView from '../MoreView.vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  type: 'refundMoney',
  refundApplyType: '',
  echartOption: {},
  columns: [
    {
      title: '退款原因',
      dataIndex: 'groupByTypeName',
      width: 200,
    },
    {
      title: '退款额（¥）',
      dataIndex: 'refundMoney',
      width: 120,
    },
    {
      title: '商品退款量',
      dataIndex: 'refundSales',
      width: 120,
    },
  ],
});
const list = ref<Array<any>>([]);

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//获取数据
const getList = () => {
  getRefundReasonRank(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      aggregationRankField: data.type,
      refundApplyType: data.refundApplyType,
    })
  ).then((res: any) => {
    list.value = res.records || [];
    setData();
  });
};

//设置数据
const setData = () => {
  setEchartOption(
    list.value.map(v => {
      return {
        name: v.groupByTypeName,
        value: v[data.type],
      };
    }),
    data.type === 'refundMoney'
  );
};

//设置图表参数
const setEchartOption = (seriesData: Array<any>, isMoney: boolean) => {
  data.echartOption = {
    color: ['#2076F2', '#FC8073', '#70A7F6', '#FFAE50', '#1890FF'],
    tooltip: {
      trigger: 'item',
      formatter: isMoney ? '{b} : ￥{c} ({d}%)' : '{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'middle',
      align: 'left',
      formatter: (name: string) => {
        if (name && name.length > 8) {
          return name.substring(0, 8) + '...';
        } else {
          return name;
        }
      },
    },
    series: [
      {
        type: 'pie',
        radius: '70%', // ['40%', '70%'],50%'
        data: seriesData,
        label: {
          formatter: isMoney ? '{b} \n {tips|￥{c} ({d}%)}' : '{tips|{b} \n {c} ({d}%)}',
          // alignTo: 'labelLine',
          rich: {
            tips: {
              fontSize: 10,
              color: '#999',
            },
          },
        },
      },
    ],
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less"></style>
