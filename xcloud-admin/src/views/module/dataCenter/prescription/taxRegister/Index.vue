<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('xcloudplat_workOrder_taxRegister_export')" type="danger" @click="downLoadFile()">
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #headerCell="{ title, column }">
      <template v-if="column.dataIndex === 'overTimeNoRegisterTax'">
        <span>{{ title }}</span>
        <a-tooltip placement="top">
          <template #title>
            <div style="font-size: 12px">点击数字可展示超时未下号明细</div>
          </template>
          <ExclamationCircleFilled style="color: #f0b955; margin-left: 6px" />
        </a-tooltip>
      </template>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'registerTax30Ratio'"> {{ record.registerTax30Ratio || 0 }} % </template>
      <template v-if="column.dataIndex === 'registerTax60Ratio'"> {{ record.registerTax60Ratio || 0 }} % </template>
      <template v-if="column.dataIndex === 'registerTax90Ratio'"> {{ record.registerTax90Ratio || 0 }} % </template>
      <template v-if="column.dataIndex === 'overTimeNoRegisterTax'">
        <a-button type="link" size="small" @click="details(record)"> {{ record.overTimeNoRegisterTax }} </a-button>
      </template>
    </template>
    <template #summary>
      <a-table-summary-cell :index="0">汇总</a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.submitGroupName || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax30 || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax60 || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax90 || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax30Ratio || 0 }} % </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax60Ratio || 0 }} % </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.registerTax90Ratio || 0 }} % </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.timeRegisterTax || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.overTimeRegisterTax || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.timeNoRegisterTax || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.overTimeNoRegisterTax || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> </a-table-summary-cell>
    </template>
  </DataTable>
  <DetailsModal ref="detailsModal" :record="data.record" :params="data.params" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage, vatTaxRegisterStatistic, vatTaxExport } from '@/api/dataCenter/taxRegister';
import DetailsModal from './components/DetailsModal.vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
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
  if (data.params.subMatTime && data.params.subMatTime.length === 2) {
    data.params.subMatTime = [
      data.params.subMatTime[0].split(' ')[0] + ' 00:00:00',
      data.params.subMatTime[1].split(' ')[0] + ' 23:59:59',
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
  vatTaxRegisterStatistic(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//超时效未下号明细
const detailsModal: Ref = ref(null);
const details = (record: any) => {
  data.record = record;
  detailsModal.value.showModal = true;
};

//导出
const downLoadFile = () => {
  vatTaxExport(data.params).then((res: any) => {
    downloadFile(res, 'vat税号注册统计.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
