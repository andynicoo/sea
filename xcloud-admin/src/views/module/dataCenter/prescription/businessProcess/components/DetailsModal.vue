<template>
  <a-modal title="时效明细" width="1000px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <a-table size="small" :pagination="false" :dataSource="dataSource" :columns="columns">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'status'">
            <span v-if="record.status === 1">处理中</span>
            <span v-else-if="record.status === 2">已完成</span>
          </template>
          <template v-if="column.dataIndex === 'nodesCalculation'">
            <span> {{ nodesCalculationFilter(record) }} </span>
          </template>
        </template>
      </a-table>

      <div class="progress-wrap">
        <a-steps
          progress-dot
          size="small"
          :current="nodes.findIndex((v:any) => v.cureentNode === record.cureentNodeName)"
        >
          <a-step v-for="(li, index) of nodes" :key="index" :title="li.cureentNode" :description="li.endTime" />
        </a-steps>
      </div>
    </div>

    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getDetailsInfo } from '@/api/dataCenter/businessProcess';
import dayjs from 'dayjs';
import { formatSecond } from '@/utils/utils';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
  params: {
    default: {},
  },
});

const showModal = ref(false);
const dataSource: any = ref([]);
const nodes: any = ref([]);
const columns = ref<TableColumnsType>([
  {
    title: '阶段',
    dataIndex: 'nodeName',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 140,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 140,
  },
  {
    title: '结节点时效',
    dataIndex: 'nodesCalculation',
    width: 160,
  },
]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      dataSource.value = [];
      nodes.value = [];
      getDetails();
    });
  }
});

//获取详情
const getDetails = () => {
  getDetailsInfo({
    workNo: props.record.workNo,
  }).then((res: any) => {
    dataSource.value = res.list || [];
    nodes.value = res.nodes || [];
  });
};

//时效过滤  (结束时间(endTime) - 开始时间(startTime) )
const nodesCalculationFilter = (record: any) => {
  let dayDiff = '';
  if (record.endTime && record.startTime) {
    try {
      let s = dayjs(record.endTime).diff(dayjs(record.startTime), 's', true);
      s = s > 0 ? s : 0;
      const d = formatSecond(s);
      if (d.days) {
        dayDiff += d.days + ' 天 ';
      }
      if (d.hours) {
        dayDiff += d.hours + ' 时 ';
      }
      if (d.minutes) {
        dayDiff += d.minutes + ' 分 ';
      }
      dayDiff += d.seconds + ' 秒 ';
    } catch (error) {
      console.error('计算时间错误');
    }
  }
  return dayDiff;
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
  .progress-wrap {
    max-width: 900px;
    overflow-x: auto;
    margin-top: 20px;
    padding: 30px 0;
  }
}
</style>
