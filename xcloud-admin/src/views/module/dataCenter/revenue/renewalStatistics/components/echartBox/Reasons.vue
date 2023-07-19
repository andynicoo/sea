<template>
  <EchartView
    title="不续费原因统计"
    tips="统计服务截止时间T天内不续费工单原因占比"
    :echartOption="data.echartOption"
    @openMore="openMore"
  ></EchartView>
  <MoreView
    ref="moreView"
    title="不续费原因统计"
    columnTitle="原因"
    :response="data.response"
    :columns="columns"
    :params="params"
    :methodName="getReasonStatistics"
    :otherParams="{}"
  >
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <a-table-summary-cell> {{ data.response.renewalWorkOrderTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.response.renewalAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.response.renewalCustUserTotal || 0 }} </a-table-summary-cell>
    </template>
  </MoreView>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getReasonStatistics } from '@/api/dataCenter/renewalStatistics';
import MoreView from '../MoreView.vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  echartOption: {},
  response: {},
});
const list = ref<Array<any>>([]);

// 不同类型
const columns: any = [
  { title: '原因', dataIndex: 'groupByTypeName' },
  { title: '工单数量', dataIndex: 'renewalWorkOrder' },
  { title: '工单金额', dataIndex: 'renewalAmount' },
  { title: '客户数', dataIndex: 'renewalCustUser' },
];

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//获取数据
const getList = () => {
  getReasonStatistics(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
    })
  ).then((res: any) => {
    data.response = res;
    if ((res.renewalStatisticsRankVOList.records || []).length > 0) {
      list.value = res.renewalStatisticsRankVOList.records || [];
      setData();
    } else {
      message.warn('没有数据');
    }
  });
};

//设置数据
const setData = () => {
  setEchartOption(
    list.value.map(v => {
      return {
        name: v.groupByTypeName,
        value: v.renewalWorkOrder,
      };
    })
  );
};

//设置图表参数
const setEchartOption = (seriesData: Array<any>) => {
  data.echartOption = {
    color: ['#2076F2', '#FC8073', '#70A7F6', '#FFAE50', '#1890FF'],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
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
        data: seriesData,
        label: {
          formatter: '{tips|{b} \n {c} ({d}%)}',
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
