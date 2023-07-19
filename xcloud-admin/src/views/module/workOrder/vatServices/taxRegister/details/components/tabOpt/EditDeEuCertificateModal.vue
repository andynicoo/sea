<template>
  <a-modal
    title="编辑DE欧盟证书"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="文件" name="deEuCertificate" :rules="[{ required: true, message: '请上传文件' }]">
          <Upload accept="*" @submitUrl="submitUrl" />
          <div style="margin-top: 8px" v-if="formModal.deEuCertificate">
            {{ formModal.deEuCertificate.split('/')[formModal.deEuCertificate.split('/').length - 1] }}
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { editDeEuCertificateApi } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  workId: {
    type: String,
    default: '',
  },
  deEuCertificate: {
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
        workId: props.workId,
        isUpdate: true,
        deEuCertificate: props.deEuCertificate,
      };
    });
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    editDeEuCertificateApi(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string) => {
  formModal.value.deEuCertificate = url;
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 20px 0;
}
</style>
