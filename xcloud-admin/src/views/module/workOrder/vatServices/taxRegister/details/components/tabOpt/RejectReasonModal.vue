<template>
  <a-modal
    title="驳回原因"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
  >
    <div class="wrap">
      <a-timeline class="timeline-wrap">
        <a-timeline-item v-for="(li, index) of data.list" :key="index">
          <div class="timeline-text">操作人：{{ li.createBy }}</div>
          <div class="timeline-text">时间：{{ li.createTime }}</div>
          <div class="timeline-text">驳回路径：{{ li.comment }}</div>
          <div class="timeline-text">驳回原因：{{ li.reason }}</div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <template #footer>
      <a-button type="primary" @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { listRejectByWorkNo } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  workNo: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  list: [], //列表
});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      listRejectByWorkNoFun();
    });
  }
});

//获取 服务商
const listRejectByWorkNoFun = () => {
  listRejectByWorkNo({
    workNo: props.workNo,
  }).then((res: any) => {
    data.list = res || [];
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 20px 0;
  .timeline-wrap {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
