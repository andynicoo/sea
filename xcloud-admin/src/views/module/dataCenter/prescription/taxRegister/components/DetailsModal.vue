<template>
  <a-modal title="超时效未下号明细" width="1000px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <DataTable ref="dataTable" :columns="columns" :methodName="overTimePage" :mainTable="false"> </DataTable>
    </div>

    <template #footer>
      <a-button @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { overTimePage } from '@/api/dataCenter/taxRegister';
import type { TableColumnsType } from 'ant-design-vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
  params: {
    default: {},
  },
});

const showModal = ref(false);

const columns = ref<TableColumnsType>([
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 120,
  },
  {
    title: '时效截止日期',
    dataIndex: 'registerTaxEnd',
    width: 120,
    sorter: (a, b) => a.registerTaxEnd - b.registerTaxEnd,
  },
  {
    title: '超时天数',
    dataIndex: 'overDay',
    width: 120,
    sorter: (a, b) => a.overDay - b.overDay,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceStatusName',
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
  dataTable.value.getList(
    Object.assign(
      {},
      {
        countryCode: props.record.countryCode,
      },
      props.params
    )
  );
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
