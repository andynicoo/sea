<template>
  <DataTable ref="dataTable" :columns="data.columns" :methodName="queryByBusinessCostId">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'type'">
        <span v-if="record.type === 'ADD'">新增</span>
        <span v-else-if="record.type === 'EDIT'">修改</span>
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { queryByBusinessCostId } from '@/api/goodsCenter/costcontrol';
import router from '@/router';
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {
    businessCostId: router.currentRoute.value.query.id,
  },
  record: {},
  columns: [
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'createBy',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '详情',
      dataIndex: 'content',
      width: 200,
    },
  ],
});

onMounted(() => {
  getList();
});

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};
</script>

<style scoped lang="less"></style>
