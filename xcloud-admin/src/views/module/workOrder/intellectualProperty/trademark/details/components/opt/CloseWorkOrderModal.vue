<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="关闭工单"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <div class="text-warning">关闭工单前，请务必确认该商标已经“死掉”</div>
        <a-form-item label="关闭原因" name="closeReason" :rules="[{ required: true, message: '请输入关闭原因' }]">
          <a-textarea v-model:value="formModal.closeReason" placeholder="请输入关闭原因" show-count :maxlength="500" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { closeWorkOrder } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceNo: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        serviceNo: props.serviceNo,
        closeReason: null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    closeWorkOrder(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  .text-warning {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
