<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">{{ title || '-' }}</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <DataTable
      ref="dataTable"
      :columns="props.columns"
      :methodName="methodName"
      :mainTable="false"
      :pageSize="10"
      layerKey="renewalStatisticsRankVOList"
    >
      <template #bodyCell="{}"></template>
      <template #summary>
        <slot name="summary" />
      </template>
    </DataTable>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { CloseOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  title: {
    default: '',
  },
  columns: {
    default: [],
  },
  columnTitle: {
    default: '-',
  },
  params: {
    default: {},
  },
  otherParams: {
    default: {},
  },
  methodName: {
    default: null,
    type: Function,
  },
  aggregationRankField: {
    default: '',
    type: String,
  },
  //退款原因分析使用
  refundApplyType: {
    default: undefined,
    type: String,
  },
  response: {
    default: null,
  },
});

const showDrawer = ref(false);

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      getList();
    });
  }
});

//获取列表
const dataTable: Ref = ref(null);
const getList = () => {
  dataTable.value.getList(Object.assign({}, props.params, props.otherParams));
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
</style>
