<template>
  <a-modal
    title="新增跟进记录"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="手机号">
          <a-input v-model:value="formModal.mobile" placeholder="请输入" disabled />
        </a-form-item>
        <a-form-item label="跟进记录" required>
          <a-textarea v-model:value="formModal.content" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import router from '@/router';
import { message } from 'ant-design-vue';
import { addFollowRecord } from '@/api/customerManage/clueCenter';

const emit = defineEmits(['submit']);
const showModal = ref(false);
const formModal: any = ref({
  mobile: router.currentRoute.value.query.mobile,
  brandId: router.currentRoute.value.query.brandId,
  content: null,
});
watch(showModal, newVal => {
  if (newVal) {
    formModal.value.content = null;
  }
});

//提交
const submitConfirm = () => {
  addFollowRecord(formModal.value).then((res: any) => {
    message.success('操作成功');
    showModal.value = false;
    emit('submit');
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less"></style>
