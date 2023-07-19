<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #headerCell="{ title, column }">
      <template v-if="column.dataIndex === 'cureentNodeName'">
        <span>{{ title }}</span>
        <a-tooltip placement="top">
          <template #title>
            <div style="font-size: 12px">单击业务节点查看时效明细</div>
          </template>
          <ExclamationCircleFilled style="color: #f0b955; margin-left: 6px" />
        </a-tooltip>
      </template>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'cureentNodeName'">
        <a-button
          v-if="record.cureentNodeName && record.workNo && record.cureentNodeName !== '--'"
          type="link"
          @click="details(record)"
          >{{ record.cureentNodeName || '-' }}</a-button
        >
      </template>
      <template v-if="column.dataIndex === 'nodesCalculation'">
        <span> {{ nodesCalculationFilter(record) }} </span>
      </template>
      <template v-if="column.dataIndex === 'handlerUserName'">
        <!--  处理人 逗号，转换行 -->
        <div v-for="(li, index) of (record.handlerUserName || '').split(',')" :key="index">
          {{ li }}
        </div>
      </template>
    </template>
  </DataTable>
  <DetailsModal ref="detailsModal" :record="data.record" :params="data.params" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage } from '@/api/dataCenter/businessProcess';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import DetailsModal from './components/DetailsModal.vue';
import dayjs from 'dayjs';
import { formatSecond } from '@/utils/utils';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.orderCreateTime && data.params.orderCreateTime.length === 2) {
    data.params.orderCreateTime = [
      data.params.orderCreateTime[0].split(' ')[0] + ' 00:00:00',
      data.params.orderCreateTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.workCreateTime && data.params.workCreateTime.length === 2) {
    data.params.workCreateTime = [
      data.params.workCreateTime[0].split(' ')[0] + ' 00:00:00',
      data.params.workCreateTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//时效明细
const detailsModal: Ref = ref(null);
const details = (record: any) => {
  data.record = record;
  detailsModal.value.showModal = true;
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
  if (record.flagTime === false) {
    dayDiff = '-';
  }
  return dayDiff;
};
</script>

<style scoped lang="less"></style>
