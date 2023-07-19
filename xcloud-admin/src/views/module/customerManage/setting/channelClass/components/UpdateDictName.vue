<template>
  <a-modal
    title="编辑名称"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="当前名称">
          {{ record?.dictValue || '-' }}
        </a-form-item>
        <a-form-item label="新名称" name="dictValue" :rules="[{ required: true, message: '请输入新名称' }]">
          <a-input v-model:value="formModal.dictValue" placeholder="请输入新名称" :maxLength="30" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { updateDictName } from '@/api/customerManage/channelClass';

//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showModal = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const formModal: any = ref({});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        dictId: props.record.dictId,
        dictValue: props.record.dictValue,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    updateDictName(formModal.value).then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
}
</style>
