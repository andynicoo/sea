<!-- 文件显示连接，点击跳转查看或下载 -->
<template>
  <div :style="style">
    <a v-if="fileUrl" :href="fileUrl" target="_blank" style="word-break: keep-all; color: #00a3ff">
      <span v-if="fileName">{{ fileName }}（点击查看）</span>
      <span v-else>{{ fileUrl.substring(fileUrl.lastIndexOf('/') + 1) }}（可点击查看）</span>
    </a>
    <span v-else>-</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  fileUrl: {
    default: '',
  },
  fileName: {
    default: '',
  },
  style: {
    default: {
      maxWidth: '200px',
    },
  },
});
</script>
