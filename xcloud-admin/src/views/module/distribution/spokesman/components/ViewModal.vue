<template>
  <a-modal
    :title="record.type == 'SPOKESMAN' ? '代言人ID' + record.userMobile : '代理人ID' + record.userMobile"
    width="1300px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="wrap">
      <DataTable
        ref="dataTable"
        :columns="record.type == 'SPOKESMAN' ? columnsSpokesman : columnsAgent"
        :methodName="drpUserList"
        :mainTable="false"
      >
      </DataTable>
    </div>
    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';

import DataTable from '@/components/page/DataTable.vue';
import { drpUserList } from '@/api/customerManage/distribution';
import { columnsSpokesman, columnsAgent } from '../config';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  const params = {
    userId: props.record.userId,
    enterpriseId: props.record.enterpriseId,
  };
  dataTable.value.getList(params);
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
}
</style>
