<template>
  <SearchForm :rule="rule" @submitParams="submitParams" />
  <DataTable ref="dataTable" :columns="columns" :methodName="getCouponAll">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'getCouponPhone'">
        <span v-hidden>{{ record.getCouponPhone }}</span>
      </template>
    </template>
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <a-table-summary-cell :col-span="11"></a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.serviceAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.payableAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.discountsAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.actuallyAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell :col-span="4"></a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getCouponAll, getCouponTotal } from '@/api/dataCenter/couponReport';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  totalObj: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.orderDepartmentIdList) {
    data.params.orderDepartmentIdList = data.params.orderDepartmentIdList.params;
  }
  if (data.params.drawTimeList && data.params.drawTimeList.length === 2) {
    data.params.drawTimeList = [
      data.params.drawTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.drawTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.employTimeList && data.params.employTimeList.length === 2) {
    data.params.employTimeList = [
      data.params.employTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.employTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.overdueTimeList && data.params.overdueTimeList.length === 2) {
    data.params.overdueTimeList = [
      data.params.overdueTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.overdueTimeList[1].split(' ')[0] + ' 23:59:59',
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
  getCouponTotal(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};
</script>

<style scoped lang="less"></style>
