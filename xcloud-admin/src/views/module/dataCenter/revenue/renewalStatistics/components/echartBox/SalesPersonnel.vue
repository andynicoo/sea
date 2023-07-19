<template>
  <EchartView
    title="销售人员统计"
    tips="按销售人员统计服务截止时间T天内续费情况"
    :echartOption="data.echartOption"
    @openMore="openMore"
  >
    <template #selectSlot>
      <a-select
        placeholder="请选择"
        v-model:value="data.type"
        style="width: 210px"
        @change="changeType"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="amount">金额统计</a-select-option>
        <a-select-option value="order">工单统计</a-select-option>
        <a-select-option value="customer">客户统计</a-select-option>
      </a-select>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="人员统计"
    columnTitle="销售人员"
    :response="data.response"
    :columns="data.columns"
    :params="params"
    :methodName="getSalesPersonnelStatistics"
    :otherParams="{}"
  >
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <!-- 金额统计 -->
      <template v-if="data.type === 'amount'">
        <a-table-summary-cell> {{ data.response.shouldRenewalAmountTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.waitRenewalAmountTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.renewalAmountTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.brokenRenewalAmountTotal || 0 }} </a-table-summary-cell>
      </template>
      <!-- 工单统计 -->
      <template v-if="data.type === 'order'">
        <a-table-summary-cell> {{ data.response.shouldRenewalWorkOrderTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.waitRenewalWorkOrderTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.renewalWorkOrderTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.brokenRenewalWorkOrderTotal || 0 }} </a-table-summary-cell>
      </template>
      <!-- 客户统计 -->
      <template v-if="data.type === 'customer'">
        <a-table-summary-cell> {{ data.response.shouldRenewalCustUserTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.waitRenewalCustUserTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.renewalCustUserTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ data.response.brokenRenewalCustUserTotal || 0 }} </a-table-summary-cell>
      </template>
    </template>
  </MoreView>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getSalesPersonnelStatistics } from '@/api/dataCenter/renewalStatistics';
import MoreView from '../MoreView.vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  type: 'amount',
  columns: [],
  response: {},
  echartOption: {},
});
const list = ref<Array<any>>([]);

// 不同类型
const cateMap: any = {
  amount: {
    should: '应续金额',
    wait: '待续金额',
    renewal: '已续金额',
    broken: '断约金额',
    columns: [
      { title: '销售人员', dataIndex: 'groupByTypeName' },
      { title: '应续金额', dataIndex: 'shouldRenewalAmount' },
      { title: '待续金额', dataIndex: 'waitRenewalAmount' },
      { title: '已续金额', dataIndex: 'renewalAmount' },
      { title: '断约金额', dataIndex: 'brokenRenewalAmount' },
    ],
  },
  order: {
    should: '应续工单数',
    wait: '待续工单数',
    renewal: '已续工单数',
    broken: '断约工单数',
    columns: [
      { title: '销售人员', dataIndex: 'groupByTypeName' },
      { title: '应续工单数', dataIndex: 'shouldRenewalWorkOrder' },
      { title: '待续工单数', dataIndex: 'waitRenewalWorkOrder' },
      { title: '已续工单数', dataIndex: 'renewalWorkOrder' },
      { title: '断约工单数', dataIndex: 'brokenRenewalWorkOrder' },
    ],
  },
  customer: {
    should: '应续客户数',
    wait: '待续客户数',
    renewal: '已续客户数',
    broken: '断约客户数',
    columns: [
      { title: '销售人员', dataIndex: 'groupByTypeName' },
      { title: '应续客户数', dataIndex: 'shouldRenewalCustUser' },
      { title: '待续客户数', dataIndex: 'waitRenewalCustUser' },
      { title: '已续客户数', dataIndex: 'renewalCustUser' },
      { title: '断约客户数', dataIndex: 'brokenRenewalCustUser' },
    ],
  },
};

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  data.columns = cateMap[data.type].columns;
  moreView.value.showDrawer = true;
};

//改变类型
const changeType = () => {
  getList();
};

//获取数据
const getList = () => {
  getSalesPersonnelStatistics(
    Object.assign({}, props.params, {
      limit: 10,
      page: 1,
    })
  ).then((res: any) => {
    data.response = res;
    list.value = res.renewalStatisticsRankVOList.records || [];
    // list.value.reverse();
    setData();
  });
};

//设置数据
const setData = () => {
  const yAxisData: Array<string> = [];
  const seriesData: Array<any> = [
    {
      name: cateMap[data.type].should,
      type: 'bar',
      data: [],
      barWidth: 5,
    },
    {
      name: cateMap[data.type].wait,
      type: 'bar',
      data: [],
      barWidth: 5,
    },
    {
      name: cateMap[data.type].renewal,
      type: 'bar',
      data: [],
      barWidth: 5,
    },
    {
      name: cateMap[data.type].broken,
      type: 'bar',
      data: [],
      barWidth: 5,
    },
  ];
  for (const item of list.value) {
    yAxisData.push(item.groupByTypeName);
    switch (data.type) {
      case 'amount':
        seriesData[0].data.push(item.shouldRenewalAmount);
        seriesData[1].data.push(item.waitRenewalAmount);
        seriesData[2].data.push(item.renewalAmount);
        seriesData[3].data.push(item.brokenRenewalAmount);
        break;
      case 'order':
        seriesData[0].data.push(item.shouldRenewalWorkOrder);
        seriesData[1].data.push(item.waitRenewalWorkOrder);
        seriesData[2].data.push(item.renewalWorkOrder);
        seriesData[3].data.push(item.brokenRenewalWorkOrder);
        break;
      case 'customer':
        seriesData[0].data.push(item.shouldRenewalCustUser);
        seriesData[1].data.push(item.waitRenewalCustUser);
        seriesData[2].data.push(item.renewalCustUser);
        seriesData[3].data.push(item.brokenRenewalCustUser);
        break;
      default:
        break;
    }
  }
  setEchartOption(yAxisData, seriesData, data.type === 'amount' ? '￥ {value}' : '{value}');
};

//设置图表参数
const setEchartOption = (yAxisData: Array<string>, seriesData: Array<number>, formatter: string) => {
  data.echartOption = {
    color: ['#2076F2', '#FC8073', '#70A7F6', '#FFAE50', '#1890FF'],
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
      bottom: 20,
      left: 20,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: formatter,
      },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: yAxisData,
      axisLabel: {
        margin: 20,
      },
    },
    series: seriesData,
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less"></style>
