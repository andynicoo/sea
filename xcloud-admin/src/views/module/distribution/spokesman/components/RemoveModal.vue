<template>
  <a-modal
    title="解除上下级关系"
    width="400px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <p>是否确定解除？</p>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { unbindDrpUser } from '@/api/customerManage/distribution';
import { message } from 'ant-design-vue';
import { useStore } from '@/stores/store';

//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showModal = ref<boolean>(false);

//提交
const submit = () => {
  let res: any = null;
  res = unbindDrpUser({
    enterpriseId: useStore().enterprise.record.id,
    userId: props.record.userId,
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
