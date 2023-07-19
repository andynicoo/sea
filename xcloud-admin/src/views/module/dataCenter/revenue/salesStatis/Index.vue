<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('xcloudplat_dataCenter_salesStatis_export')" type="danger" @click="downLoadFile()">
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="salePage">
    <template #summary>
      <a-table-summary-cell>合计</a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.totalSale || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.totalPayOrders || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.payUsers || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.totalThings || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.totalRefund || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.totalRefundNum || 0 }} </a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { salePage, saleTotalStatistic, saleExport } from '@/api/dataCenter/salesStatis';
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
  if (data.params.statisticalTimeList && data.params.statisticalTimeList.length === 2) {
    data.params.statisticalTimeList = [
      data.params.statisticalTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.statisticalTimeList[1].split(' ')[0] + ' 23:59:59',
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
  saleTotalStatistic(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//导出
const downLoadFile = () => {
  saleExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
