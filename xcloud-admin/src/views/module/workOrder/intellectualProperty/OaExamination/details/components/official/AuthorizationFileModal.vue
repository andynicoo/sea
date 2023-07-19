<template>
  <a-modal
    title="代客户上传授权书"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-steps size="small" :current="-1" class="steps-wrap">
          <a-step key="1" title="下载授权书模板文件" />
          <a-step key="2" title="打印并签字" />
          <a-step key="3" title="扫描成电子版再上传" />
        </a-steps>
        <a-form-item label="授权书模板文件">
          <a
            v-if="record.authorizationTemplateFile"
            :href="record.authorizationTemplateFile"
            target="_blank"
            style="word-break: keep-all; color: #00a3ff"
          >
            授权书模板文件（点击下载）
          </a>
          <span v-else>-</span>
        </a-form-item>
        <a-form-item label="授权书示例文件">
          <a
            v-if="record.authorizationExampleFile"
            :href="record.authorizationExampleFile"
            target="_blank"
            style="word-break: keep-all; color: #00a3ff"
          >
            授权书示例文件（点击查看）
          </a>
          <span v-else>-</span>
        </a-form-item>
        <a-form-item label="上传授权书" name="authorizationFile" :rules="[{ required: true, message: '请上传授权书' }]">
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationFile')" />
          <div style="margin-top: 8px; font-size: 16px" v-if="formModal.authorizationFile">
            {{ formModal.authorizationFile.split('/')[formModal.authorizationFile.split('/').length - 1] }}
          </div>
          <div>请参照授权书示例文件签名后上传，支持上传格式：pdf</div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { oaAuthorizationFile } from '@/api/workOrder/intellectualProperty/oaExamination';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        oaId: props.record.id,
        authorizationFile: props.record.authorizationFile,
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
    oaAuthorizationFile(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string, keyStr: string) => {
  formModal.value[keyStr] = url;
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  .steps-wrap {
    padding: 0 10px;
    margin-bottom: 30px;
  }
}
</style>
