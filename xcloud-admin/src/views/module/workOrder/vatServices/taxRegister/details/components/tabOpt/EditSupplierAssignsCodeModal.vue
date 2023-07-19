<template>
  <a-modal
    title="编辑服务商分配编码"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-form-item
          label="服务商分配编码"
          name="supplierAssignsCode"
          :rules="[{ required: true, message: '请输入服务商分配编码' }]"
        >
          <a-textarea v-model:value="formModal.supplierAssignsCode" placeholder="请输入服务商分配编码" :rows="3" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { updateSupplierAssignsCode } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  workId: {
    type: String,
    default: '',
  },
  supplierAssignsCode: {
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
        supplierAssignsCode: props.supplierAssignsCode,
      };
    });
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    updateSupplierAssignsCode(formModal.value).then((res: any) => {
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
  padding: 20px 0;
}
</style>
