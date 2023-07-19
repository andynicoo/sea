<template>
  <EchartView
    title="国家销售分布"
    tips="默认展示所选项下排名前5的国家占比"
    :echartOption="data.echartOption"
    @openMore="openMore"
  >
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
    title="国家销售分布"
    columnTitle="国家"
    :params="params"
    :methodName="getCountryRank"
    :otherParams="{
      aggregationRankField: data.type,
    }"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getCountryRank } from '@/api/dataCenter/revenueAnalysis';
import MoreView from '../MoreView.vue';

const props = defineProps({
  params: {
    default: {},
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
  getCountryRank(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      aggregationRankField: data.type,
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
    data.type === 'amount' || data.type === 'refundMoney'
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
