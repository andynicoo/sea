<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #headerCell="{ title, column }">
      <template v-if="column.dataIndex === 'completedCount'">
        <TitleTips :title="title" tips="统计时间内完成的工单数量" />
      </template>
      <template v-if="column.dataIndex === 'advanceCompletedCount'">
        <TitleTips :title="title" tips="统计时间内，在预警之前完成的工单数量" />
      </template>
      <template v-if="column.dataIndex === 'punctualCompletedCount'">
        <TitleTips :title="title" tips="统计时间内，在交付时效内的完成的工单数量" />
      </template>
      <template v-if="column.dataIndex === 'delayCompletedCount'">
        <TitleTips :title="title" tips="统计时间内，在交付时效外完成的工单数量" />
      </template>
      <template v-if="column.dataIndex === 'prescription'">
        <TitleTips :title="title" tips="统计时间内，累计完成时间/累计完成量" />
      </template>
      <template v-if="column.dataIndex === 'avgPrescription'">
        <TitleTips :title="title" tips="统计时间内，所有服务商完成的平均时效" />
      </template>
      <template v-if="column.dataIndex === 'orderNum'">
        <TitleTips :title="title" tips="统计时间内，提交给服务商的工单数量" />
      </template>
      <template v-if="column.dataIndex === 'stabilizeScore'">
        <TitleTips :title="title" tips="统计时间内，按时完成量/接单量 * 100" />
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage } from '@/api/dataCenter/supplierQuality';
import TitleTips from '@/components/page/TitleTips.vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.productCateIds) {
    data.params.productCateIds = data.params.productCateIds.params;
  }
  if (data.params.productFunctionCodes) {
    data.params.productFunctionCodes = data.params.productFunctionCodes.params;
  }
  if (data.params.statisticalDate && data.params.statisticalDate.length === 2) {
    data.params.statisticalDate = [
      data.params.statisticalDate[0].split(' ')[0] + ' 00:00:00',
      data.params.statisticalDate[1].split(' ')[0] + ' 23:59:59',
    ];
  }

  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};
</script>

<style scoped lang="less"></style>
