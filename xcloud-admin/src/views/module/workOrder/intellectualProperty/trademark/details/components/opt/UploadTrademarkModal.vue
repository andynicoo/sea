<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="上传商标证书"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="上传文件" name="fileUrl" :rules="[{ required: true, message: '请上传文件' }]">
          <Upload @submitUrl="submitUrl" />
          <div style="margin-top: 8px" v-if="formModal.fileUrl">
            {{ formModal.fileUrl.split('/')[formModal.fileUrl.split('/').length - 1] }}
          </div>
          <div>文件限制：文件大小不超过5M</div>
        </a-form-item>
        <a-form-item label="官方日期" name="officialDate" :rules="[{ required: true, message: '请选择官方日期' }]">
          <a-date-picker
            v-model:value="formModal.officialDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { addFileOaAPI } from '@/api/workOrder/intellectualProperty/trademark';

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
        fileUrl: null,
        officialDate: null,
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
    addFileOaAPI({
      fileType: 8,
      workOrderId: props.serviceInfo.workOrderId,
      fileUrl: formModal.value.fileUrl,
      officialDate: formModal.value.officialDate.split(' ')[0] + ' 00:00:00',
    }).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string) => {
  formModal.value.fileUrl = url;
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
