<template>
  <EchartView
    title="国家统计"
    tips="统计服务截止时间T天内各国家续费情况占比"
    :echartOption="data.echartOption"
    @openMore="openMore"
  >
    <template #selectSlot>
      <a-select
        placeholder="请选择"
        v-model:value="data.type"
        style="width: 120px; margin-right: 20px"
        @change="changeType"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="amount">金额统计</a-select-option>
        <a-select-option value="order">工单统计</a-select-option>
        <a-select-option value="customer">客户统计</a-select-option>
      </a-select>
      <a-select
        placeholder="请选择"
        v-model:value="data.renewalType"
        @change="changeType"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
      >
        <a-select-option value="should">应续</a-select-option>
        <a-select-option value="wait">待续</a-select-option>
        <a-select-option value="renewal">已续</a-select-option>
        <a-select-option value="broken">断约</a-select-option>
      </a-select>
    </template>
    <template #returnSlot>
      <a-button type="primary" ghost class="return-btn" v-if="data.level > 1" @click="returnBack()">返回</a-button>
    </template>
  </EchartView>
  <MoreView
    ref="moreView"
    title="国家统计"
    columnTitle="国家"
    :response="data.response"
    :columns="data.columns"
    :params="params"
    :methodName="getCountryStatistics"
    :otherParams="{
      parentProductCategoryId: data.parentId,
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
import EchartView from '../EchartView.vue';
import { getCountryStatistics } from '@/api/dataCenter/renewalStatistics';
import MoreView from '../MoreView.vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  type: 'amount',
  renewalType: 'should',
  echartOption: {},
  level: 1,
  columns: [],
  response: {},
  parentId: '',
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
      { title: '商品分类', dataIndex: 'groupByTypeName' },
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
      { title: '商品分类', dataIndex: 'groupByTypeName' },
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
      { title: '商品分类', dataIndex: 'groupByTypeName' },
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
const getList = (parentId = '', level = 1) => {
  getCountryStatistics(
    Object.assign({}, props.params, {
      limit: 5,
      page: 1,
      parentProductCategoryId: parentId,
    })
  ).then((res: any) => {
    data.response = res;
    if ((res.renewalStatisticsRankVOList.records || []).length > 0 || level === 1) {
      list.value = res.renewalStatisticsRankVOList.records || [];
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
      const o: any = {
        name: v.groupByTypeName,
      };
      // 金额统计
      if (data.type === 'amount') {
        switch (data.renewalType) {
          case 'should': //应续
            o.value = v.shouldRenewalAmount;
            break;
          case 'wait': //待续
            o.value = v.waitRenewalAmount;
            break;
          case 'renewal': //已续
            o.value = v.renewalAmount;
            break;
          case 'broken': //断续
            o.value = v.brokenRenewalAmount;
            break;
        }
      }
      // 工单统计
      if (data.type === 'order') {
        switch (data.renewalType) {
          case 'should': //应续
            o.value = v.shouldRenewalWorkOrder;
            break;
          case 'wait': //待续
            o.value = v.waitRenewalWorkOrder;
            break;
          case 'renewal': //已续
            o.value = v.renewalWorkOrder;
            break;
          case 'broken': //断续
            o.value = v.brokenRenewalWorkOrder;
            break;
        }
      }
      if (data.type === 'customer') {
        switch (data.renewalType) {
          case 'should': //应续
            o.value = v.shouldRenewalCustUser;
            break;
          case 'wait': //待续
            o.value = v.waitRenewalCustUser;
            break;
          case 'renewal': //已续
            o.value = v.renewalCustUser;
            break;
          case 'broken': //断续
            o.value = v.brokenRenewalCustUser;
            break;
        }
      }
      return o;
    }),
    data.type === 'amount'
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
        data: seriesData,
        label: {
          formatter: isMoney ? '{b} \n {tips|￥{c} ({d}%)}' : '{tips|{b} \n {c} ({d}%)}',
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

//返回
const returnBack = () => {
  console.log('返回');
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
