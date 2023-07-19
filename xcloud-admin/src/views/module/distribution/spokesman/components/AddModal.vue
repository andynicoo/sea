<template>
  <a-modal
    title="新增代理人"
    width="700px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item
          label="新增的代理人用户手机号码"
          name="userMobile"
          :rules="[{ required: true, message: '请输入手机号码' }]"
        >
          <a-input
            v-model:value="formModal.userMobile"
            placeholder="请输入"
            @blur="changeInput"
            @pressEnter="changeInput"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { addAgent } from '@/api/customerManage/distribution';
import { getInfoByMobile } from '@/api/base/basicsData';
import { message } from 'ant-design-vue';
import { useStore } from '@/stores/store';

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
        userMobile: '',
        isSubmit: false,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//失去焦点
const changeInput = () => {
  const mobile: any = formModal.value.userMobile;
  const phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;

  if (!phonereg.test(mobile) && mobile != '') {
    message.warning('手机号格式不正确');
    formModal.value.isSubmit = false;
  } else {
    let res: any = null;
    res = getInfoByMobile({
      mobile: formModal.value.userMobile,
    });
    res.then((res: any) => {
      if (res.userId) {
        formModal.value.isSubmit = true;
        formModal.value.userId = res.userId;
      } else {
        formModal.value.isSubmit = false;
        message.warning('用户不存在');
      }
    });
  }
};
//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    if (formModal.value.userId && formModal.value.isSubmit) {
      let res: any = null;
      res = addAgent({
        enterpriseId: useStore().enterprise.record.id,
        parentUserId: props.record.userId,
        userId: formModal.value.userId,
        userMobile: formModal.value.userMobile,
      });
      res.then((res: any) => {
        showModal.value = false;
        message.success('操作成功');
        emit('submit');
      });
    }
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
  .tips-text {
    color: #ffc100;
  }
}
</style>
