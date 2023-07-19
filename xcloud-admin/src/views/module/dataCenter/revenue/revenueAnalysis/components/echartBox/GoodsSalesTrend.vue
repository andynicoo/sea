<template>
  <EchartView
    title="商品营收趋势"
    tips="默认展示连续7天，销售额/销售数量/退款额/退款数量趋势"
    :echartOption="data.echartOption"
    :columns="data.moreTableColumns"
    @openMore="openMore"
  >
  </EchartView>
  <MoreView
    ref="moreView"
    title="商品营收趋势"
    :columns="data.columns"
    :params="params"
    :methodName="getOrderSalesTrend"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getOrderSalesAllTrend, getOrderSalesTrend } from '@/api/dataCenter/revenueAnalysis';
import MoreView from '../MoreView.vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  echartOption: {},
  columns: [
    {
      title: '日期',
      dataIndex: 'groupByTypeId',
      width: 140,
    },
    {
      title: '销售额(已到账)',
      dataIndex: 'amount',
      width: 140,
    },
    {
      title: '商品销量',
      dataIndex: 'sales',
      width: 110,
    },
    {
      title: '退款额',
      dataIndex: 'refundMoney',
      width: 110,
    },
    {
      title: '商品退款量',
      dataIndex: 'refundSales',
      width: 110,
    },
    {
      title: '销售额(已付款)',
      dataIndex: 'productMoney',
      width: 140,
    },
  ],
});

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//获取数据
const getList = () => {
  getOrderSalesAllTrend(Object.assign({}, props.params)).then((res: any) => {
    const xData: Array<string> = [];
    const yData: Array<any> = [
      {
        name: '销售额(已到账)',
        type: 'bar',
        data: [],
        barWidth: 25,
        yAxisIndex: 0,
      },
      {
        name: '销售额(已付款)',
        type: 'bar',
        data: [],
        barWidth: 25,
        yAxisIndex: 0,
      },
      {
        name: '退款额',
        type: 'bar',
        data: [],
        barWidth: 25,
        yAxisIndex: 0,
      },
      {
        name: '商品销量',
        type: 'line',
        data: [],
        smooth: true,
        yAxisIndex: 1,
      },
      {
        name: '商品退款量',
        type: 'line',
        data: [],
        smooth: true,
        yAxisIndex: 1,
      },
    ];
    for (const li of res || []) {
      xData.push(li.groupByTypeId);
      yData[0].data.push(li.amount);
      yData[1].data.push(li.productMoney);
      yData[2].data.push(li.refundMoney);
      yData[3].data.push(li.sales);
      yData[4].data.push(li.refundSales);
    }
    setEchartOption(xData, yData, 7);
  });
};

//设置图表参数
const setEchartOption = (xData: Array<string>, yData: Array<any>, showNum: number) => {
  data.echartOption = {
    color: ['#EF7B6F', '#70A7F6', '#2076F2', '#FBA628', '#4FAAFF'],
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
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less"></style>
