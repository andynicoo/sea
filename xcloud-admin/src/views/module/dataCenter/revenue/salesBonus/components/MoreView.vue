<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">个人业绩</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <a-table
      size="small"
      :columns="columns"
      :data-source="dataSource"
      :pagination="{
          position: ['bottomRight'],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total: number) => `共 ${total} 条`,
      }"
    >
    </a-table>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

defineProps({
  dataSource: {
    default: [],
  },
});

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    width: 120,
  },
  {
    title: '个人业绩',
    dataIndex: 'value',
    width: 120,
  },
];

const showDrawer = ref(false);

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
&:deep(.ant-table-small .ant-table-thead > tr > th) {
  background-color: #e8f5ff;
  color: #666;
}
</style>
