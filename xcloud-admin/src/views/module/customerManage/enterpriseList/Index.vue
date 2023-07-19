<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #topSlot>
      <Statistics />
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="selectCompanyNameList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'shopSalePlatformNameTest'">
        <span style="color: #1890ff">{{ record.shopSalePlatformNameTest }}</span>
      </template>
      <template v-if="column.dataIndex === 'mainSaleCountry'">
        <span style="color: #1890ff">{{ record.mainSaleCountry }}</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <FileSearchOutlined style="color: #1890ff; margin-left: 10px" @click="detail(record)" />
        </a-space>
      </template>
    </template>
  </DataTable>
  <EnterpriseDetailModal ref="enterpriseDetailModal" :record="data.record" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import Statistics from './components/Statistics.vue';
import EnterpriseDetailModal from './components/EnterpriseDetailModal.vue';
import { selectCompanyNameList } from '@/api/customerManage/enterpriseList';
import { FileSearchOutlined } from '@ant-design/icons-vue';

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

//详情
const enterpriseDetailModal: Ref = ref(null);
const detail = (record: any) => {
  data.record = record;
  enterpriseDetailModal.value.visible = true;
};
</script>

<style scoped lang="less"></style>
