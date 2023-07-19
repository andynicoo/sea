<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_customerConversion_export')"
          type="danger"
          @click="downLoadFile()"
        >
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'mobile'">
        <span v-hidden>{{ record.mobile }}</span>
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage, listExport } from '@/api/dataCenter/customerConversion';
import { useButton, downloadFile } from '@/utils/utils';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.sourceSmallList) {
    data.params.sourceSmallList = data.params.sourceSmallList.params;
  }
  if (data.params.cluesCreateTime && data.params.cluesCreateTime.length === 2) {
    data.params.cluesCreateTime = [
      data.params.cluesCreateTime[0].split(' ')[0] + ' 00:00:00',
      data.params.cluesCreateTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.cluesChangeTime && data.params.cluesChangeTime.length === 2) {
    data.params.cluesChangeTime = [
      data.params.cluesChangeTime[0].split(' ')[0] + ' 00:00:00',
      data.params.cluesChangeTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.custUserOrderTime && data.params.custUserOrderTime.length === 2) {
    data.params.custUserOrderTime = [
      data.params.custUserOrderTime[0].split(' ')[0] + ' 00:00:00',
      data.params.custUserOrderTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//导出
const downLoadFile = () => {
  listExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
