<template>
  <a-modal
    title="翻译暂停信"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="翻译暂停信">
          <a-textarea
            v-model:value="formModal.interpretFileContent"
            placeholder="请输入翻译暂停信"
            show-count
            :maxlength="200"
          />
        </a-form-item>
        <a-form-item label="操作方案">
          <a-textarea
            v-model:value="formModal.operateMethod"
            placeholder="请输入操作方案"
            show-count
            :maxlength="200"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, Modal, type FormInstance } from 'ant-design-vue';
import { translateStopLetterAPI } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  record: {
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
        oaFileId: props.record.id,
        interpretFileContent: props.record.interpretFileContent ?? null,
        operateMethod: props.record.operateMethod ?? null,
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
      width: 500,
      content: '请确认录入的信息是否无误？',
      onOk() {
        return new Promise(resolve => {
          resolve(true);
          translateStopLetterAPI(formModal.value).then(() => {
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
