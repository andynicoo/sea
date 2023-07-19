<template>
  <a-modal
    :title="record.status == 'DISABLED' ? '启用' : '停用'"
    width="400px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <p>{{ record.status == 'DISABLED' ? '是否启用？' : '是否停用？' }}</p>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { updateConfig } from '@/api/customerManage/distribution';
import { message } from 'ant-design-vue';

//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showModal = ref<boolean>(false);
const formModal: any = ref({});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        userMobile: '',
      };
    });
  } else {
    formModal.value = {};
  }
});

//提交
const submit = () => {
  let res: any = null;
  res = updateConfig({
    drpId: props.record.drpId,
    status: props.record.status == 'DISABLED' ? 'ENABLED' : 'DISABLED',
  });
  res.then((res: any) => {
    showModal.value = false;
    message.success('操作成功');
    emit('submit');
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
  .tips-text {
    color: #ffc100;
  }
}
</style>
