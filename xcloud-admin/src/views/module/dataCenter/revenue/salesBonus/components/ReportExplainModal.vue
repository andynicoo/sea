<template>
  <a-modal title="报表说明" width="750px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <div v-html="remarkHtml"></div>
    </div>

    <template #footer>
      <a-button type="primary" @click="showModal = false">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  remarkHtml: {
    default: '',
  },
});

const showModal = ref(false);

defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;
  p {
    font-size: 14px;
    color: #666;
  }
}
</style>
