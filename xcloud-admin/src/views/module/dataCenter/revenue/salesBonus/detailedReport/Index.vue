<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button class="bg-yellow" type="primary" @click="downLoadFile()"> 导出 </a-button>
      </a-space>
    </template>
  </SearchForm>

  <DataBox ref="dataBox" :params="data.params" />

  <DataTable ref="dataTable" :columns="columns" :methodName="getSalesCommissionsList" :otherHeight="110"> </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, nextTick } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { downloadFile } from '@/utils/utils';
import { getSalesCommissionsList, salesCommissionsExport } from '@/api/dataCenter/salesBonus';
import DataBox from './components/DataBox.vue';

const dataBox: Ref = ref(null);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  dataObj: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  nextTick(() => {
    getList();
    dataBox.value.getList();
  });
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//导出
const downLoadFile = () => {
  salesCommissionsExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
