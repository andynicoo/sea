<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="平台审核"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="审核工单" name="type" :rules="[{ required: true, message: '请选择审核工单' }]">
          <a-radio-group v-model:value="formModal.type">
            <a-radio :value="1">平台审核通过</a-radio>
            <a-radio :value="2">平台审核驳回</a-radio>
            <!-- 废弃  3 -->
            <a-radio :value="2" v-if="serviceInfo.subServicesId">驳回使用证据</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="工单审核备注" v-if="formModal.type === 1">
          <a-textarea
            v-model:value="formModal.operateLogRemark"
            placeholder="如果通过率太低，与客户沟通后任执意进行注册需备注好通过原因"
            show-count
            :maxlength="500"
          />
        </a-form-item>
        <template v-else>
          <a-form-item
            label="驳回原因备注"
            name="operateLogoperateReason"
            :rules="[{ required: true, message: '请输入驳回原因备注' }]"
          >
            <a-textarea
              v-model:value="formModal.operateLogoperateReason"
              placeholder="请输入驳回原因备注"
              show-count
              :maxlength="500"
            />
          </a-form-item>
          <a-form-item
            label="短信通知"
            name="sendSms"
            :rules="[{ required: true, message: '请选择短信通知' }]"
            v-if="formModal.type === 2"
          >
            <a-radio-group v-model:value="formModal.sendSms">
              <a-radio :value="true">通知用户</a-radio>
              <a-radio :value="false">不通知用户</a-radio>
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
        type: 1,
        operateLogRemark: null,
        sendSms: true,
        operateLogoperateReason: null,
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
    const params: any = {
      serviceId: props.serviceInfo.serviceId,
      nodeCode: props.serviceInfo.nodeCode,
    };
    if (formModal.value.type === 1) {
      params.progressBar = 3;
      params.json = {
        operateLogRemark: formModal.value.operateLogRemark,
      };
    } else if (formModal.value.type === 2) {
      params.path = false;
      params.sendSms = formModal.value.sendSms;
      params.json = {
        operateLogoperateReason: formModal.value.operateLogoperateReason,
      };
    } else if (formModal.value.type === 3) {
      //废弃
      params.progressBar = 2;
      params.json = {
        operateLogoperateReason: formModal.value.operateLogoperateReason,
      };
    }
    updateNodeAPI(params).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
