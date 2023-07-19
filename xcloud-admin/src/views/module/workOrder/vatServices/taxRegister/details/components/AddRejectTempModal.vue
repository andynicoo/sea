<template>
  <a-modal
    title="新增模版"
    width="700px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="模版内容" name="content" :rules="[{ required: true, message: '请输入模版内容' }]">
          <a-textarea v-model:value="formModal.content" placeholder="请输入模版内容" :rows="6" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { addRejectTemp } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  moduleKey: {
    type: String,
    default: '',
  },
  columnKey: {
    type: String,
    default: '',
  },
  columnName: {
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
        moduleKey: props.moduleKey,
        columnKey: props.columnKey,
        columnName: props.columnName,
        content: null,
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
    addRejectTemp(formModal.value).then((res: any) => {
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
  .tips-text {
    line-height: 30px;
    text-align: center;
  }
}
</style>
