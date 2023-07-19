<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_businessOpportunity_export')"
          type="danger"
          @click="downLoadFile()"
        >
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #summary>
      <a-table-summary-cell :index="0" :col-span="2">合计</a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.addOpportunityCount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.changeRatio || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.exceptAmount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.exceptOpportunityCount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.winningAmountByExceptDate || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.winningAmountByWinningDate || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.winningOpportunityCountByExceptDate || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.winningOpportunityCountByWinningDate || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.avgChangeTime || 0 }} </a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage, totalStatistic, listExport } from '@/api/dataCenter/businessOpportunity';
import { useButton, downloadFile } from '@/utils/utils';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  totalObj: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.rageTime && data.params.rageTime.length === 2) {
    data.params.rageTime = [
      data.params.rageTime[0].split(' ')[0] + ' 00:00:00',
      data.params.rageTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  getList();
  getTotal();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//获取统计
const getTotal = () => {
  totalStatistic(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//导出
const downLoadFile = () => {
  listExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
