<template>
  <EchartView
    title="部门销售排行"
    tips="点击部门柱状图，可查询下级部门排名"
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
        <a-select-option value="amount">销售额(已到账)/退款额</a-select-option>
        <a-select-option value="sales">商品销量/商品退款量</a-select-option>
      </a-select>
    </template>
    <template #returnSlot>
      <a-button type="primary" ghost class="return-btn" v-if="data.level > 1" @click="returnBack()">返回</a-button>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="部门销售排行"
    columnTitle="部门"
    :params="params"
    :methodName="getOrderDepartmentRank"
    :otherParams="{
      aggregationRankField: data.type,
      departmentLevel: data.level,
      parentDepartmentId: data.nodeInfo[data.level - 1].groupByTypeId,
    }"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getOrderDepartmentRank } from '@/api/dataCenter/revenueAnalysis';
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
  nodeInfo: {
    0: {
      groupByTypeId: '',
    },
  },
});
const list = ref<Array<any>>([]);

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//点击节点
const clickNode = (index: number) => {
  data.nodeInfo[data.level] = list.value[index];
  getList(data.nodeInfo[data.level].groupByTypeId, data.nodeInfo[data.level].level + 1);
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
  getOrderDepartmentRank(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      aggregationRankField: data.type,
      departmentLevel: level,
      parentDepartmentId: parentId,
    })
  ).then((res: any) => {
    if ((res.records || []).length > 0 || level === 1) {
      list.value = res.records || [];
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
      name: data.type === 'amount' ? '销售额(已到账)' : '商品销量',
      type: 'bar',
      data: [],
      barWidth: 25,
    },
    {
      name: data.type === 'amount' ? '退款额' : '商品退款量',
      type: 'bar',
      data: [],
      barWidth: 25,
    },
  ];
  for (const li of list.value) {
    xData.push(li.groupByTypeName);
    yData[0].data.push(data.type === 'amount' ? li.amount : li.sales);
    yData[1].data.push(data.type === 'amount' ? li.refundMoney : li.refundSales);
  }
  setEchartOption(xData, yData, data.type === 'amount' ? '￥ {value}' : '{value}');
};

//设置图表参数
const setEchartOption = (xData: Array<string>, yData: Array<any>, formatter: string) => {
  data.echartOption = {
    color: ['#EF7B6F', '#2076F2'],
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
