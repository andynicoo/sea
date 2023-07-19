<template>
  <a-modal
    title="初步审核"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="审核">
          <a-radio-group v-model:value="formModal.operationType">
            <a-radio :value="1">审核通过</a-radio>
            <a-radio :value="2">审核不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="formModal.operationType === 1">
          <a-form-item label="备注">
            <a-textarea v-model:value="formModal.reason" placeholder="请输入备注" show-count :maxlength="500" />
          </a-form-item>
        </template>
        <template v-if="formModal.operationType === 2">
          <a-form-item label="驳回原因" name="reason" :rules="[{ required: true, message: '请输入驳回原因' }]">
            <a-textarea v-model:value="formModal.reason" placeholder="请输入驳回原因" show-count :maxlength="500" />
          </a-form-item>
          <a-form-item label="短信">
            <a-radio-group v-model:value="formModal.xxxxxxx">
              <a-radio :value="1">通知用户</a-radio>
              <a-radio :value="2">不通知用户</a-radio>
            </a-radio-group>
          </a-form-item>
        </template>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
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
        serviceId: props.record.serviceId, //服务id
        operationType: 1, //审核类型
        signAuthorization: true, //是否需要签署授权书 默认（是）
        authorizationTemplateFile: null, //授权书模板文件
        authorizationExampleFile: null, //授权书示列文件

        reason: null, //驳回原因
        rejectFile: null, //驳回原因附件
        customerDeadDate: null, //客户截止日期
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
