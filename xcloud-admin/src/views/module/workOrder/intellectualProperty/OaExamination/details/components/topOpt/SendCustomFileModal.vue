<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="发送注册资料"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="目标邮箱"> {{ email || '-' }} </a-form-item>
        <a-form-item label="发送注册资料" name="customerData" :rules="[{ required: true, message: '请上传文件' }]">
          <Upload @submitUrl="submitUrl" :fileSize="200" />
          <div style="margin-top: 8px" v-if="formModal.customerData">
            {{ formModal.customerData.split('/')[formModal.customerData.split('/').length - 1] }}
          </div>
          <div>文件限制：文件大小不超过200M，文件名不能包含特殊字符如：+、%等</div>
        </a-form-item>
        <a-form-item label="发送短信" name="smsSend" :rules="[{ required: true, message: '请选择发送短信' }]">
          <a-radio-group v-model:value="formModal.smsSend">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <div>提示：请上传压缩包文件，保存后会给客户发送短信告知用 户自行提交资料给服务商</div>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { getEmailConfig, sendCustomFile } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceInfo: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(['submit']);

const email = ref('');
const formModal: any = ref({});
const showModal = ref(false);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getEmailConfigFun();
      formModal.value = {
        customerData: props.serviceInfo.customerData || '',
        smsSend: true,
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
    sendCustomFile({
      workId: props.serviceInfo.workOrderId || undefined,
      serviceId: props.serviceInfo.serviceId || undefined,
      functionCode: props.serviceInfo.productFunctionCode,
      smsSend: formModal.value.smsSend,
      customerData: formModal.value.customerData,
    }).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//获取邮箱
const getEmailConfigFun = () => {
  getEmailConfig({
    functionCode: props.serviceInfo.productFunctionCode,
    countryCode: props.serviceInfo.countryCode,
    enterpriseId: props.serviceInfo.enterpriseId,
  }).then((res: { sendEmail: string }) => {
    email.value = res.sendEmail;
  });
};

//上传文件
const submitUrl = (url: string) => {
  formModal.value.customerData = url;
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
