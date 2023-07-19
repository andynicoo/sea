<template>
  <SearchForm ref="form" :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('xcloudplat_finance_salesDelivery_expot')" type="danger" @click="exportFill">
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage"> </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage, listExport } from '@/api/finance/salesDelivery';
import { useButton, downloadFile } from '@/utils/utils';
import { message } from 'ant-design-vue';
import DateBody from 'ant-design-vue/es/vc-picker/panels/DatePanel/DateBody';

const form: any = ref(null);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
function submitParams(formData: any) {
  if (!formData.serviceCompletedTime) {
    message.info('服务完成时间必填');
    return false;
  }
  const keys = Object.keys(formData);
  keys.forEach(key => {
    if (key === 'serviceCompletedTime') {
      const start = formData[key][0].split(' ')[0];
      const end = formData[key][1].split(' ')[0];
      formData[key] = [`${start} 00:00:00`, `${end} 23:59:59`];
    }
    if (typeof formData[key] === 'object' && formData[key]?.params) {
      formData[key] = formData[key].params;
    }
    if (
      typeof formData[key] === 'string' &&
      !['companyNameZh', 'serviceCompletedTime', 'companyNameEn'].includes(key)
    ) {
      formData[key] = formData[key] ? [formData[key]] : [];
    }
  });
  data.params = formData;
  getList();
}

//获取列表
function getList(resetCurrent = true) {
  dataTable.value.getList(data.params, resetCurrent);
}

//导出
function exportFill() {
  listExport(data.params).then((res: any) => {
    const dateTime = form.value.data.formModal.serviceCompletedTime;
    const start: string = dateTime[0].split(' ')[0].replaceAll('-', '.');
    const end: string = dateTime[1].split(' ')[0].replaceAll('-', '.');
    downloadFile(res, `${start}-${end}销售交付明细.xlsx`);
  });
}
</script>
