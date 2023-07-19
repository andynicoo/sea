<template>
  <a-modal
    title="重新上传授权书模板"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-form-item
          label="授权书模板文件"
          name="authorizationTemplateFile"
          :rules="[{ required: true, message: '请上传授权书模板文件' }]"
        >
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationTemplateFile')" />
          <div style="margin-top: 8px; font-size: 16px" v-if="formModal.authorizationTemplateFile">
            {{
              formModal.authorizationTemplateFile.split('/')[formModal.authorizationTemplateFile.split('/').length - 1]
            }}
          </div>
          <div class="form-tips">请上传PDF文档，客户可下载并签字</div>
        </a-form-item>
        <a-form-item
          label="授权书示例文件"
          name="authorizationExampleFile"
          :rules="[{ required: true, message: '请上传授权书示例文件' }]"
        >
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationExampleFile')" />
          <div style="margin-top: 8px; font-size: 16px" v-if="formModal.authorizationExampleFile">
            {{
              formModal.authorizationExampleFile.split('/')[formModal.authorizationExampleFile.split('/').length - 1]
            }}
          </div>
          <div class="form-tips">请上传PDF文档，指引客户签署授权书</div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { authorizationTemplateFile } from '@/api/workOrder/intellectualProperty/oaExamination';

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
        authorizationTemplateFile: props.record.authorizationTemplateFile,
        authorizationExampleFile: props.record.authorizationExampleFile,
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
    authorizationTemplateFile(formModal.value).then((res: any) => {
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
  .form-tips {
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }
  .scheme-wrap {
    .scheme-tips {
      color: #999;
      margin: 4px 0;
    }
    .scheme-text {
      margin-bottom: 10px;
    }
  }
  .no-data {
    color: #999;
  }
}
</style>
