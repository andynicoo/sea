<!-- 小标题提示，鼠标hover时显示小标题 -->
<template>
  <span>{{ title }}</span>
  <a-tooltip placement="top">
    <template #title>
      <div style="font-size: 12px">{{ tips || '' }}</div>
    </template>
    <ExclamationCircleFilled style="color: #f0b955; margin-left: 6px" />
  </a-tooltip>
</template>

<script setup lang="ts">
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
defineProps({
  title: {
    default: '',
  },
  tips: {
    default: '',
  },
});
</script>
