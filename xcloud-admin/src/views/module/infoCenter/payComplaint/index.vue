<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getComplaintList"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #bodyCell="{ record, column, index }">
      <template v-if="column.dataIndex === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.dataIndex === 'source'">
        <span v-if="record.source === 'WECHAT'">微信</span>
        <span v-else>支付宝</span>
      </template>
      <template v-if="column.dataIndex === 'complaintStatus'">
        <span v-if="record.complaintStatus === 'PENDING'">待处理</span>
        <span v-if="record.complaintStatus === 'PROCESSING'">处理中</span>
        <span v-if="record.complaintStatus === 'PROCESSED'">已处理完成</span>
      </template>
      <template v-if="column.dataIndex === 'complaintList'">
        <template v-if="record.complaintList">
          <span v-for="(item, index) in JSON.parse(record.complaintList)" :key="index">
            <ImageViewer :img="item" />
          </span>
        </template>
        <template v-else> -- </template>
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref } from 'vue';
import { getComplaintList } from '@/api/infoCenter/payComplaint';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import type { SearchType } from '@/types/paycomplaint';
import ImageViewer from '@/components/page/ImageViewer.vue';

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    startTime: '',
    endTime: '',
  },
});

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  if (p && p.searchTime) {
    data.searchParams.startTime = p.searchTime[0]+ ' 00:00:00' || '';
    data.searchParams.endTime = p.searchTime[1] + ' 23:59:59' || '';
  }
  getList();
};

const dataTable: Ref = ref(null);
//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.searchParams, resetCurrent);
};
</script>
