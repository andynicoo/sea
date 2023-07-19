<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'source'">
        <span v-if="record.source === 0">PC网页端</span>
        <span v-else-if="record.source === 1">H5端</span>
        <span v-else-if="record.source === 2">微信小程序</span>
        <span v-else-if="record.source === 5">后台录入</span>
        <span v-else-if="record.source === 6">销售易</span>
        <span v-else></span>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <span v-if="record.status === 0" style="color: red">禁用</span>
        <span v-else-if="record.status === 1" style="color: green">启用</span>
        <span v-else-if="record.status === 3">锁定</span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="text" @click="edit(record)">编辑</a-button>
      </template>
    </template>
  </DataTable>
  <EditModal ref="editModal" :record="data.record" @submit="getList(false)" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getListPage } from '@/api/customerManage/accountInfo';
import EditModal from './components/EditModal.vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.createTimeQuery && data.params.createTimeQuery.length === 2) {
    data.params.createTimeQuery = [
      data.params.createTimeQuery[0].split(' ')[0] + ' 00:00:00',
      data.params.createTimeQuery[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//编辑
const editModal: Ref = ref(null);
const edit = (record: any) => {
  data.record = record;
  editModal.value.visible = true;
};
</script>

<style scoped lang="less"></style>
