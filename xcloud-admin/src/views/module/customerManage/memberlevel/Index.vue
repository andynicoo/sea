<template>
  <DataTable ref="dataTable" :columns="columns" :methodName="findVipList" initSearch>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'min'">
        <img src="@/assets/img/level/V1.svg" v-if="record.key === 1" />
        <img src="@/assets/img/level/V2.svg" v-if="record.key === 2" />
        <img src="@/assets/img/level/V3.svg" v-if="record.key === 3" />
        <img src="@/assets/img/level/V4.svg" v-if="record.key === 4" />
        <img src="@/assets/img/level/V5.svg" v-if="record.key === 5" />
      </template>
      <template v-if="column.dataIndex === 'max'"> {{ record.min }}-{{ record.max }} 经验值 </template>
      <template v-if="column.dataIndex === 'zk'"> 无 </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { findVipList } from '@/api/customerManage/memberConfig';

import DataTable from '@/components/page/DataTable.vue';
import { columns } from './config';

const dataTable: Ref = ref(null);
</script>
