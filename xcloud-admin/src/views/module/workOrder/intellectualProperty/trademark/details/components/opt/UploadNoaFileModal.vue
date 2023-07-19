<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="上传NOA文件"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="上传文件" name="file" :rules="[{ required: true, message: '请上传文件' }]">
          <Upload @submitUrl="submitUrl" />
          <div style="margin-top: 8px" v-if="formModal.file">
            {{ formModal.file.split('/')[formModal.file.split('/').length - 1] }}
          </div>
          <div>注：需要上传NOTICE OF ALLOWANCE (NOA)文件</div>
        </a-form-item>
        <a-form-item label="官方日期" name="noticeDate" :rules="[{ required: true, message: '请选择公告日期' }]">
          <a-date-picker v-model:value="formModal.noticeDate" valueFormat="YYYY-MM-DD HH:mm:ss" style="width: 220px" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { updateNodeAPI } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceId: {
    type: String,
    default: '',
  },
  nodeCode: {
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
        serviceId: props.serviceId,
        file: null,
        noticeDate: null,
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
    formModal.value.noticeDate = formModal.value.noticeDate.split(' ')[0] + ' 00:00:00';
    updateNodeAPI(formModal.value).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string) => {
  formModal.value.file = url;
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
