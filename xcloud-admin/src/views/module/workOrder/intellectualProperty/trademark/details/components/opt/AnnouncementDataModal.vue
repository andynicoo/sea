<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="录入公告日期"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="公告日期" name="noticeDate" :rules="[{ required: true, message: '请选择公告日期' }]">
          <a-date-picker v-model:value="formModal.noticeDate" valueFormat="YYYY-MM-DD HH:mm:ss" style="width: 220px" />
        </a-form-item>
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
    Modal.confirm({
      title: '提示',
      content: '请再次确认录入的受理信息无误后，点击确定',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return new Promise<void>((resolve, reject) => {
          resolve();
          updateNodeAPI({
            path: true,
            serviceId: props.serviceInfo.serviceId,
            nodeCode: props.serviceInfo.nodeCode,
            json: {
              noticeDate: formModal.value.noticeDate.split(' ')[0] + ' 00:00:00',
            },
          }).then(() => {
            message.success('操作成功');
            showModal.value = false;
            emit('submit');
          });
        });
      },
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
