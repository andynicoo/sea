<template>
  <SearchForm :rule="rule" @submitParams="submitParams" :searchOpen="true" />
  <DataBox ref="dataBox" :resData="data.resData" />
  <a-row :gutter="20">
    <a-col :span="24">
      <EchartView
        ref="transactionTrend"
        title="成交趋势图"
        tips="默认展示连续七天，渠道订单量/成交金额趋势"
        :echartOption="data.echartOption"
      />
    </a-col>
    <a-col :span="24">
      <EchartView
        ref="channelRevenue"
        title="渠道营收图"
        tips="默认展示连续7天，渠道成交数量/渠道应收金额/渠道实收金额"
        :echartOption="data.echartOption"
      />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, nextTick } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import { rule } from './config';
import { getOrderSalesStatistics } from '@/api/dataCenter/channelAnalysis';
import DataBox from './components/DataBox.vue';
import EchartView from './components/EchartView.vue';

const data: any = reactive({
  params: {},
  resData: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.statisTime && data.params.statisTime.length === 2) {
    data.params.statisTime = [
      data.params.statisTime[0].split(' ')[0] + ' 00:00:00',
      data.params.statisTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.channelCompanyList) {
    data.params.channelCompanyList = data.params.channelCompanyList.params;
  }
  nextTick(() => {
    getData();
  });
};

//获取数据

const getData = () => {
  getOrderSalesStatistics(data.params).then((res: any) => {
    data.resData = res || {};
    setTransactionTrend(res.channelOrderCountList);
    setChannelRevenue(res.channelOrderAmountList);
  });
};

//设置成交趋势图
const transactionTrend: Ref = ref(null);
const setTransactionTrend = (list: Array<any>) => {
  const xData: Array<string> = [];
  const yData: Array<any> = [
    {
      name: '订单量',
      type: 'bar',
      data: [],
      barWidth: 25,
      yAxisIndex: 0,
    },
    {
      name: '成交金额',
      type: 'line',
      data: [],
      smooth: true,
      yAxisIndex: 1,
    },
  ];
  for (const li of list) {
    xData.push(li.xdate);
    yData[0].data.push(li.orderCount);
    yData[1].data.push(li.orderPaidMoney);
  }
  transactionTrend.value.setEchart(xData, yData);
};

//设置渠道营收图
const channelRevenue: Ref = ref(null);
const setChannelRevenue = (list: Array<any>) => {
  const xData: Array<string> = [];
  const yData: Array<any> = [
    {
      name: '应收金额',
      type: 'bar',
      data: [],
      barWidth: 25,
      yAxisIndex: 0,
    },
    {
      name: '实收金额',
      type: 'bar',
      data: [],
      barWidth: 25,
      yAxisIndex: 0,
    },
  ];
  for (const li of list) {
    xData.push(li.xdate);
    yData[0].data.push(li.orderPaymentMoney);
    yData[1].data.push(li.orderPaidMoney);
  }
  channelRevenue.value.setEchart(xData, yData, 7, true);
};
</script>

<style scoped lang="less"></style>
