<template>
  <div class="wrapper">
    <EchartView
      title="TOP 客户2022 VS 2023  累计成交额对比"
      tips="默认根据2023年累计（已到账）倒序排列"
      :echartOption="data.echartOption"
      :onClick="true"
      @clickNode="clickNode"
      :listLength="list.length"
    >
      <template #list>
        <div class="list-wrapper">
          <div class="list-item" v-for="(item, index) in list" :key="item.id" @click="companyDetail(item)">
            {{ index + 1 }}、{{ item.companyName }}
          </div>
        </div>
      </template>
    </EchartView>
    <div class="pagination">
      <a-pagination
        size="small"
        v-model:current="data.page"
        :total="data.total"
        show-size-changer
        show-quick-jumper
        @change="pageChange"
      />
    </div>
    <DetailView ref="detailView" :checkCompany="data.checkCompany" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref, onMounted } from 'vue';
import EchartView from '../EchartView.vue';
import { getCompanyStatistics } from '@/api/dataCenter/customerRevenue';
import { message } from 'ant-design-vue';
import DetailView from '../DetailView.vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  page: 1,
  limit: 10,
  echartOption: {},
  total: 0,
  checkCompany: {},
  clickIndex: 0,
});
const list = ref<Array<any>>([]);
const detailView: Ref = ref(null);

const emit = defineEmits(['getCompanyInfo']);

onMounted(() => {
  getList();
});

const companyDetail = (company: any) => {
  data.checkCompany = company;
  detailView.value.showDrawer = true;
};
//点击节点
const clickNode = (index: any) => {
  emit('getCompanyInfo', list.value[index]);
};

const pageChange = (page: any, limit: any) => {
  data.page = page;
  data.limit = limit;
  getList();
};

//获取数据
const getList = (resetCurrent = false) => {
  data.page = resetCurrent ? 1 : data.page;
  getCompanyStatistics(
    Object.assign({}, props.params, {
      page: data.page,
      limit: data.limit,
    })
  ).then((res: any) => {
    if ((res.records || []).length > 0) {
      list.value = res.records || [];
      data.total = +res.total;
      setData();
    } else {
      message.warn('没有数据');
    }
  });
};

const labelOption = (name: string) => ({
  show: true,
  position: 'left',
  distance: '8',
  verticalAlign: 'middle',
  rotate: 0,
  formatter: name,
});

//设置数据
const setData = () => {
  const seriesData: Array<any> = [
    {
      name: '2023年累计（已到账）',
      type: 'bar',
      label: labelOption('2023'),
      yAxisIndex: 0,
      barWidth: '30%',
      data: [],
      itemStyle: {
        normal: {
          show: true,
          color: '#ef7b6f',
        },
      },
    },
    {
      show: false,
      name: '2023年累计（已到账）',
      type: 'bar',
      yAxisIndex: 0,
      barWidth: '30%',
    },
    {
      show: false,
      type: 'bar',
      yAxisIndex: 1,
      barWidth: '30%',
    },
    {
      name: '2022年累计（已到账）',
      type: 'bar',
      label: labelOption('2022'),
      yAxisIndex: 1,
      barWidth: '30%',
      data: [],
      itemStyle: {
        normal: {
          show: true,
          color: '#70a7f6',
        },
      },
    },
    {
      show: false,
      type: 'bar',
      yAxisIndex: 2,
      barWidth: '30%',
    },
    {
      name: '2022年同期（已到账）',
      type: 'bar',
      yAxisIndex: 2,
      barWidth: '30%',
      data: [],
      itemStyle: {
        normal: {
          show: true,
          color: '#facd91',
        },
      },
    },
  ];

  seriesData[0].data = list.value.map(item => +item.currentYearTotal);
  seriesData[3].data = list.value.map(item => +item.lastYearTotal);
  seriesData[5].data = list.value.map(item => +item.lastYearSamePeriodTotal);

  const yAxisData = list.value.map(item => item.companyName);

  setEchartOption(seriesData, yAxisData);
};

//设置图表参数
const setEchartOption = (seriesData: Array<any>, yAxisData: Array<any>) => {
  let hiddenYAxisData = yAxisData.map(() => '');
  data.echartOption = {
    color: ['#EF7B6F', '#facd91', '#70a7f6', '#70a7f6'],
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      top: 20,
    },

    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: [
      {
        show: false,
        type: 'category',
        data: hiddenYAxisData,
        inverse: true,
      },
      {
        show: false,
        type: 'category',
        data: hiddenYAxisData,
        inverse: true,
      },
      {
        show: false,
        type: 'category',
        data: yAxisData,
        inverse: true,
      },
    ],
    series: seriesData,
  };
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less">
.wrapper {
  height: calc(100vh - 200px);
  background-color: #fff;
  .list-wrapper {
    padding-top: 60px;
    padding-left: 10px;
    width: 180px;
    .list-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 55px;
      cursor: pointer;
    }
  }
  .pagination {
    margin-top: -20px;
    padding: 10px 20px;
    background-color: #fff;
    text-align: center;
    position: relative;
    z-index: 1;
  }
}
</style>
