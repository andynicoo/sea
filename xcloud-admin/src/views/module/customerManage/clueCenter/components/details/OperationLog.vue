<template>
  <div style="width: 1000px">
    <a-form :model="formModal" name="horizontal_login" layout="inline">
      <a-form-item label="行为">
        <a-select
          v-model:value="formModal.optList"
          mode="multiple"
          :maxTagCount="2"
          placeholder="请选择"
          style="width: 220px"
        >
          <a-select-option :value="1"> 创建 </a-select-option>
          <a-select-option :value="2"> 编辑 </a-select-option>
          <a-select-option :value="3"> 转移 </a-select-option>
          <a-select-option :value="4"> 转换 </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="操作时间">
        <a-range-picker v-model:value="formModal.createTimeQuery" valueFormat="YYYY-MM-DD HH:mm:ss" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" @click="getList()">查询</a-button>
      </a-form-item>
    </a-form>
    <DataTable ref="dataTable" :columns="columns" :methodName="getOptList" :mainTable="false">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'opt'">
          <span v-if="record.opt === 1"> 创建 </span>
          <span v-else-if="record.opt === 2"> 编辑 </span>
          <span v-else-if="record.opt === 3"> 转移 </span>
          <span v-else-if="record.opt === 4"> 转换 </span>
        </template>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { getOptList } from '@/api/customerManage/clueCenter';
import router from '@/router';

const formModal: any = ref({
  mobile: router.currentRoute.value.query.mobile,
  brandId: router.currentRoute.value.query.brandId,
  optList: [],
  createTimeQuery: [],
});
const columns = ref([
  {
    title: '时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作人',
    dataIndex: 'modifyBy',
    width: 120,
  },
  {
    title: '行为',
    dataIndex: 'opt',
    width: 120,
  },
  {
    title: '数据源',
    dataIndex: 'platformName',
    width: 120,
  },
  {
    title: '操作记录',
    dataIndex: 'content',
    width: 300,
  },
]);

onMounted(() => {
  getList();
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  if (formModal.value.createTimeQuery && formModal.value.createTimeQuery.length === 2) {
    formModal.value.createTimeQuery = [
      formModal.value.createTimeQuery[0].split(' ')[0] + ' 00:00:00',
      formModal.value.createTimeQuery[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  dataTable.value.getList(formModal.value);
};
</script>

<style scoped lang="less"></style>
