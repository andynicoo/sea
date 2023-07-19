<template>
  <a-modal v-model:visible="visible" :footer="null" title="更多近似商标" @cancel="onClose" width="1100px">
    <div class="my-table-title">{{ title }}</div>
    <a-table :dataSource="data" :columns="columns" bordered :pagination="false">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'queryItem'"> 用 {{ text }} 检索 </template>
        <template v-if="['remarkNumber', 'ownerName', 'categorySmall', 'similarTm'].includes(column.dataIndex)">
          <span @click="textCopy(text)"> {{ text }}</span>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { textCopy } from '@/utils/utils';
const visible = ref(true);
interface Props {
  title?: string;
  columns?: any;
  data?: any;
}
const props = defineProps<Props>();
const emit = defineEmits(['close']);
const onClose = () => {
  emit('close');
};
</script>
<style lang="less" scoped>
.my-table-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  border: 1px solid #f0f0f0;
  border-bottom: 0;
  background: #fafafa;
}
.ant-table-wrapper {
  overflow: auto;
  max-height: 600px;
}
::v-deep .cell-bg {
  background: rgb(249, 229, 215) !important;
}
</style>
