<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="审核资料"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="审核" name="path" :rules="[{ required: true, message: '请选择审核' }]">
          <a-radio-group v-model:value="formModal.path" @change="formModal.json.operateLogoperateReason = null">
            <a-radio :value="true">审核通过</a-radio>
            <a-radio :value="false">资料不对，驳回</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="formModal.json">
          <a-form-item label="备注通过原因" v-if="formModal.path">
            <a-textarea
              v-model:value="formModal.json.operateLogoperateReason"
              placeholder="如果通过率太低，与客户沟通后任执意进行注册需备注好通过原因"
              show-count
              :maxlength="500"
            />
          </a-form-item>
          <a-form-item label="驳回原因" v-else>
            <a-textarea
              v-model:value="formModal.json.operateLogoperateReason"
              placeholder="请输入驳回原因"
              show-count
              :maxlength="500"
            />
          </a-form-item>
        </template>
        <a-form-item label="短信通知" name="sendSms" :rules="[{ required: true, message: '请选择短信通知' }]">
          <a-radio-group v-model:value="formModal.sendSms">
            <a-radio :value="true">通知用户</a-radio>
            <a-radio :value="false">不通知用户</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { updateNodeAPI } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceInfo: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        serviceId: props.serviceInfo.serviceId,
        nodeCode: props.serviceInfo.nodeCode,
        path: true,
        sendSms: true,
        json: {
          operateLogoperateReason: null,
        },
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
    updateNodeAPI(formModal.value).then(() => {
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
}
</style>
