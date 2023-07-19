<template>
  <EchartView
    title="类目销售分布"
    tips="点击类目详情，可查看下级类目排行数据"
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
        <a-select-option value="amount">销售额(已到账)</a-select-option>
        <a-select-option value="refundMoney">退款额</a-select-option>
        <a-select-option value="sales">商品销量</a-select-option>
        <a-select-option value="refundSales">商品退款量</a-select-option>
      </a-select>
    </template>
    <template #returnSlot>
      <a-button type="primary" ghost class="return-btn" v-if="data.level > 1" @click="returnBack()">返回</a-button>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="类目销售分布"
    columnTitle="类目"
    :params="params"
    :methodName="getProductCategoryRank"
    :otherParams="{
      aggregationRankField: data.type,
      parentProductCategoryId: data.parentId,
    }"
  />
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import EchartView from '../EchartView.vue';
import { getProductCategoryRank } from '@/api/dataCenter/revenueAnalysis';
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
  parentId: '',
});
const list = ref<Array<any>>([]);

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//点击节点
const clickNode = (index: number) => {
  if (data.level === 1) {
    getList(list.value[index].groupByTypeId, 2);
  }
};

//改变类型
const changeType = () => {
  getList();
};

//返回
const returnBack = () => {
  getList();
};

//获取数据
const getList = (parentId = '', level = 1) => {
  getProductCategoryRank(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      aggregationRankField: data.type,
      parentProductCategoryId: parentId,
    })
  ).then((res: any) => {
    if ((res.records || []).length > 0 || level === 1) {
      list.value = res.records || [];
      data.level = level;
      data.parentId = parentId;
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
        value: v[data.type],
      };
    }),
    data.type === 'amount' || data.type === 'refundMoney'
  );
};

//设置图表参数
const setEchartOption = (seriesData: Array<any>, isMoney: boolean) => {
  data.echartOption = {
    color: ['#EF7B6F', '#2076F2', '#FBA628', '#4FAAFF'],
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
        radius: ['50%', '70%'], // ['40%', '70%'],50%'
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

<style scoped lang="less">
.return-btn {
  position: absolute;
  top: 12px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
</style>
