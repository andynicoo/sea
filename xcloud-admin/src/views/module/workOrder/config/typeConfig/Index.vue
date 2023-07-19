<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button type="danger" @click="details({})"> 新增 </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'overTimeNoRegisterTax'">
        <a-button type="link" size="small" @click="details(record)"> {{ record.overTimeNoRegisterTax }} </a-button>
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
import { getListPage } from '@/api/dataCenter/taxRegister';
import DetailsModal from './components/DetailsModal.vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//超时效未下号明细
const detailsModal: Ref = ref(null);
const details = (record: any) => {
  data.record = record;
  detailsModal.value.showModal = true;
};
</script>

<style scoped lang="less"></style>
