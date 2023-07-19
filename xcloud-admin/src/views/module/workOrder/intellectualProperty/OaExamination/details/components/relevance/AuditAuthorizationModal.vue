<template>
  <a-modal
    title="审核授权书"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="授权书签名文件">
          <FileLink :fileUrl="record.authorizationFile" fileName="授权书签名文件.pdf" />
        </a-form-item>
        <a-form-item label="审核">
          <a-radio-group v-model:value="formModal.adopt">
            <a-radio :value="true">审核通过</a-radio>
            <a-radio :value="false">审核不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="驳回原因"
          name="rejectReason"
          :rules="[{ required: true, message: '请输入驳回原因' }]"
          v-if="!formModal.adopt"
        >
          <a-textarea v-model:value="formModal.rejectReason" placeholder="请输入驳回原因" show-count :maxlength="500" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import FileLink from '@/components/assembly/FileLink.vue';
import { authorizationFile } from '@/api/workOrder/intellectualProperty/oaExamination';

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
        adopt: true,
        rejectReason: null, //驳回原因
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
    authorizationFile(formModal.value).then((res: any) => {
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
  .tips {
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }
  .scheme-wrap {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #f1f1f1;
    border-radius: 4px;
    .scheme-title {
      font-size: 15px;
      font-weight: bold;
    }
    .scheme-tips {
      color: #999;
      margin: 4px 0;
    }
    .scheme-text {
      margin-bottom: 10px;
    }
  }
}
</style>
