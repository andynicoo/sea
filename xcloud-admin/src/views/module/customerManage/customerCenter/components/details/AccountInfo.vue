<template>
  <div>
    <DataTable
      ref="dataTable"
      :columns="columns"
      :methodName="getAccList"
      :mainTable="false"
      scrollY="calc(100vh - 340px)"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'details'"> {{ record.details }} </template>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { getAccList } from '@/api/customerManage/customerCenter';
import router from '@/router';
import { getEnterpriseSelect } from '@/api/base/basicsData';

const columns = ref([
  {
    title: '序号',
    dataIndex: 'index',
    width: 60,
  },
  {
    title: '收款公司',
    dataIndex: 'companyName',
    width: 120,
  },
  {
    title: '收款账号',
    dataIndex: 'accountNumber',
    width: 120,
  },
  {
    title: '开户行名称',
    dataIndex: 'bankName',
    width: 120,
  },
  {
    title: '联行行号',
    dataIndex: 'bankNumber',
    width: 120,
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: 120,
  },
]);

onMounted(() => {
  // getEnterpriseList();
  getList();
});

// const getEnterpriseList = () => {
//   getEnterpriseSelect().then((res: any) => {
//     const idList = (res || []).map((v: { id: number }) => v.id);
//     getList(idList);
//   });
// };

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList({
    userId: router.currentRoute.value.query.userId,
  });
};
</script>

<style scoped lang="less"></style>
