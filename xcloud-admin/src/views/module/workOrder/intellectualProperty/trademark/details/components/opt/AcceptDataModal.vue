<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    :title="btnText"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="审核工单" name="path" :rules="[{ required: true, message: '请选择审核工单' }]">
          <a-radio-group v-model:value="formModal.path">
            <a-radio :value="true">已获取受理信息</a-radio>
            <a-radio :value="false" v-if="btnText === '录入受理信息'">驳回注册资料</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="formModal.path">
          <a-form-item label="代理律师">
            <div style="padding: 5px 0">{{ serviceInfo.attorneyName || '-' }}</div>
            <div style="color: red">请核对律师信息后，再录入受理信息。</div>
          </a-form-item>
          <a-form-item label="受理号">
            <a-input v-model:value="formModal.acceptNum" placeholder="请输入受理号" />
          </a-form-item>
          <a-form-item label="受理日期" name="acceptTime" :rules="[{ required: true, message: '请选择受理日期' }]">
            <a-date-picker
              v-model:value="formModal.acceptTime"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              style="width: 220px"
            />
          </a-form-item>
          <div style="margin: 0 20px">
            注意：受理书、电子证书等官方文件，可点击【抓取官方文件】下载，或点击【上传官方文件】自行上传。
          </div>
        </template>
        <template v-else>
          <a-form-item label="短信通知" name="sendSms" :rules="[{ required: true, message: '请选择短信通知' }]">
            <a-radio-group v-model:value="formModal.sendSms">
              <a-radio :value="true">通知用户</a-radio>
              <a-radio :value="false">不通知用户</a-radio>
            </a-radio-group>
          </a-form-item>
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
        </template>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, Modal, type FormInstance } from 'ant-design-vue';
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
        path: true,
        acceptNum: props.serviceInfo.acceptNum ?? null,
        acceptTime: props.serviceInfo.acceptTime ? props.serviceInfo.acceptTime.split(' ')[0] + ' 00:00:00' : null,
        sendSms: true,
        operateLogoperateReason: null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交确认
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    if (
      formModal.value.path &&
      !formModal.value.acceptNum &&
      ['US', 'EU', 'JP', 'GB', 'CA', 'AU'].includes(props.serviceInfo.countryCode)
    ) {
      message.error('请填写受理号');
      return false;
    }
    Modal.confirm({
      title: '提示',
      content: '请再次确认录入的受理信息无误后，点击确定',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return new Promise<void>(resolve => {
          resolve();
          submitForm();
        });
      },
    });
  });
};

//提交
const submitForm = () => {
  const params: any = {
    serviceId: props.serviceInfo.serviceId,
    nodeCode: props.serviceInfo.nodeCode,
    path: props.btnText === '录入受理信息' ? formModal.value.path : undefined,
  };
  if (formModal.value.path) {
    params.json = {
      acceptNum: formModal.value.acceptNum,
      acceptTime: formModal.value.acceptTime.split(' ')[0] + ' 00:00:00',
    };
  } else {
    params.sendSms = formModal.value.sendSms;
    params.json = {
      operateLogoperateReason: formModal.value.operateLogoperateReason,
    };
  }
  updateNodeAPI(params).then(() => {
    message.success('操作成功');
    showModal.value = false;
    emit('submit');
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
