<template>
  <a-modal
    title="调整积分"
    width="500px"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="会员账号"> {{ record.userMobile }} </a-form-item>
        <a-form-item label="当前积分"> {{ detailsInfo.integral }} </a-form-item>
        <a-form-item label="累计积分"> {{ detailsInfo.sumIntegral }} </a-form-item>
        <a-form-item label="调整方式">
          <a-radio-group v-model:value="formModal.opt">
            <a-radio :value="true">增加</a-radio>
            <a-radio :value="false">减少</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="调整数额">
          <a-input-number v-model:value="formModal.integral" :min="1" />
        </a-form-item>
        <a-form-item label="描写说明">
          <a-textarea v-model:value="formModal.remarks" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { optAdminUserIntegral } from '@/api/customerManage/accountInfo';

const visible = ref<boolean>(false);
//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
  detailsInfo: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);
const formModal: any = ref({});

watch(visible, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        userId: props.record.userId,
        enterpriseId: props.record.enterpriseId,
        opt: true,
        integral: 1,
        remarks: null,
      };
    });
  } else {
    formModal.value = {};
  }
});

//提交
const submit = () => {
  optAdminUserIntegral(formModal.value).then((res: any) => {
    message.success('操作成功');
    visible.value = false;
    emit('submit');
  });
};

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 40px;
}
</style>
