<template>
  <a-modal
    title="审查通过"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <div class="title-tips">确认商标局已审查通过？</div>
        <a-form-item
          label="上传文件"
          name="authorizationTemplateFile"
          :rules="[{ required: true, message: '请上传文件' }]"
        >
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationTemplateFile')" />
          <div style="margin-top: 8px" v-if="formModal.authorizationTemplateFile">
            {{
              formModal.authorizationTemplateFile.split('/')[formModal.authorizationTemplateFile.split('/').length - 1]
            }}
          </div>
          <div class="form-tips">支持格式：PDF、PNG、JPG</div>
        </a-form-item>
        <a-form-item label="备注" name="reason" :rules="[{ required: true, message: '请输入备注' }]">
          <a-textarea v-model:value="formModal.reason" placeholder="请输入备注" show-count :maxlength="500" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { rejectMaterials } from '@/api/workOrder/intellectualProperty/takeAnOath';

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
        oaFileId: props.record.id,
        authorizationTemplateFile: null, //上传文件
        reason: null, //备注
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
    rejectMaterials(formModal.value).then((res: any) => {
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
  .title-tips {
    font-size: 15px;
    font-weight: bold;
    margin-left: 90px;
    margin-bottom: 30px;
  }
  .form-tips {
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }
}
</style>
