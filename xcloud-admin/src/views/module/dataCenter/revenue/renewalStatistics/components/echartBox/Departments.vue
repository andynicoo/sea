<template>
  <EchartView
    title="部门统计"
    tips="按部门统计服务截止时间T天内续费情况；点击柱状图可查询下级部门"
    :echartOption="data.echartOption"
    @openMore="openMore"
    :onClick="true"
    @clickNode="clickNode"
  >
    <template #selectSlot>
      <a-select
        placeholder="请选择"
        v-model:value="data.type"
        style="width: 210px"
        @change="changeType"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option v-for="(item, index) in statisticsTypeList" :value="item.value" :key="index">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </template>
    <template #returnSlot>
      <a-button type="primary" ghost class="return-btn" v-if="data.level > 1" @click="returnBack()">返回</a-button>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="部门统计"
    columnTitle="部门"
    :response="data.response"
    :columns="data.columns"
    :params="params"
    :methodName="getDepartmentStatistics"
    :otherParams="{
      departmentLevel: data.level,
      parentDepartmentId: data.nodeInfo[data.level - 1].groupByTypeId,
    }"
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
import { statisticsTypeList } from './common';
import EchartView from '../EchartView.vue';
import { getDepartmentStatistics } from '@/api/dataCenter/renewalStatistics';
import MoreView from '../MoreView.vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  type: 'amount',
  echartOption: {},
  level: 1,
  columns: [],
  response: {},
  nodeInfo: {
    0: {
      groupByTypeId: '',
    },
  },
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
      { title: '部门', dataIndex: 'groupByTypeName' },
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
      { title: '部门', dataIndex: 'groupByTypeName' },
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
      { title: '部门', dataIndex: 'groupByTypeName' },
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

//点击节点
const clickNode = (index: number) => {
  if (data.level < 5) {
    data.nodeInfo[data.level] = list.value[index];
    getList(data.nodeInfo[data.level].groupByTypeId, data.nodeInfo[data.level].departmentLevel + 1);
  }
};

//改变类型
const changeType = () => {
  getList(data.nodeInfo[data.level - 1].groupByTypeId, data.level);
};

//返回
const returnBack = () => {
  getList(data.nodeInfo[data.level - 2].groupByTypeId, data.level - 1);
};

//获取数据
const getList = (parentId = '', level = 1) => {
  getDepartmentStatistics(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      departmentLevel: level,
      parentDepartmentId: parentId,
    })
  ).then((res: any) => {
    data.response = res;
    if ((res.renewalStatisticsRankVOList.records || []).length > 0 || level === 1) {
      list.value = res.renewalStatisticsRankVOList.records || [];
      data.level = level;
      setData();
    } else {
      message.warn('没有数据');
    }
  });
};

//设置数据
const setData = () => {
  const xData: Array<string> = [];
  const yData: Array<any> = [
    {
      name: cateMap[data.type].should,
      type: 'bar',
      data: [],
      barWidth: 25,
    },
    {
      name: cateMap[data.type].wait,
      type: 'bar',
      data: [],
      barWidth: 25,
    },
    {
      name: cateMap[data.type].renewal,
      type: 'bar',
      data: [],
      barWidth: 25,
    },
    {
      name: cateMap[data.type].broken,
      type: 'bar',
      data: [],
      barWidth: 25,
    },
  ];
  for (const item of list.value) {
    xData.push(item.groupByTypeName);
    switch (data.type) {
      case 'amount':
        yData[0].data.push(item.shouldRenewalAmount);
        yData[1].data.push(item.waitRenewalAmount);
        yData[2].data.push(item.renewalAmount);
        yData[3].data.push(item.brokenRenewalAmount);
        break;
      case 'order':
        yData[0].data.push(item.shouldRenewalWorkOrder);
        yData[1].data.push(item.waitRenewalWorkOrder);
        yData[2].data.push(item.renewalWorkOrder);
        yData[3].data.push(item.brokenRenewalWorkOrder);
        break;
      case 'customer':
        yData[0].data.push(item.shouldRenewalCustUser);
        yData[1].data.push(item.waitRenewalCustUser);
        yData[2].data.push(item.renewalCustUser);
        yData[3].data.push(item.brokenRenewalCustUser);
        break;
      default:
        break;
    }
  }
  setEchartOption(xData, yData, data.type === 'amount' ? '￥ {value}' : '{value}');
};

//设置图表参数
const setEchartOption = (xData: Array<string>, yData: Array<any>, formatter: string) => {
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
      axisLabel: {
        interval: 0,
        width: 100,
        overflow: 'truncate',
      },
      data: xData,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: formatter,
      },
    },
    series: yData,
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less">
.return-btn {
  position: absolute;
  top: 12px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
</style>
