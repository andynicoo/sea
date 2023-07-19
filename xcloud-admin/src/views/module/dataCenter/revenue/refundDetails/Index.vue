<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('xcloudplat_dataCenter_refundDetails_export')" type="danger" @click="downLoadFile()">
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="selectRefundDetailReport">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'customerPhone'">
        <span v-hidden>{{ record.customerPhone }}</span>
      </template>
    </template>
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <a-table-summary-cell :col-span="12"></a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.serviceAmount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.paidAmount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.refundAmount || 0 }} </a-table-summary-cell>
      <a-table-summary-cell :col-span="4"></a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton } from '@/utils/utils';
import { downloadFile } from '@/utils/utils';
import { selectRefundDetailReport, selectRefundDetailTotal, refundDetailExport } from '@/api/dataCenter/refundDetails';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  totalObj: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;

  if (data.params.applyTimeList && data.params.applyTimeList.length === 2) {
    data.params.applyTimeList = [
      data.params.applyTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.applyTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.refundTimeList && data.params.refundTimeList.length === 2) {
    data.params.refundTimeList = [
      data.params.refundTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.refundTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.departmentIdList) {
    data.params.departmentIdList = data.params.departmentIdList.params;
  }
  if (data.params.productTypeIdList) {
    data.params.productTypeIdList = data.params.productTypeIdList.params;
  }

  if (data.params.productCategoryIds) {
    data.params.productCategoryIds = data.params.productCategoryIds.params;
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
  selectRefundDetailTotal(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//导出
const downLoadFile = () => {
  refundDetailExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
