<template>
  <a-modal title="下载文件记录" width="800px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <DataTable ref="dataTable" :columns="columns" :methodName="fileDownloadRecord" :mainTable="false"></DataTable>
    </div>

    <template #footer>
      <a-button @click="showModal = false">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { fileDownloadRecord } from '@/api/customerManage/datapush';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);

const columns = ref([
  {
    title: '下载日期',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: '下载人',
    dataIndex: 'createBy',
    width: 120,
  },
]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取下载列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList({
    dataSqlTaskDownloadLog: {
      sqlTaskId: props.record.sqlTaskId,
    },
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
