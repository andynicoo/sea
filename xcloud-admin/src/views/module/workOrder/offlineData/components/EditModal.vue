<template>
  <a-modal title="编辑" width="600px" v-model:visible="showModal" :maskClosable="false" :keyboard="false" @ok="submit">
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="订单号" name="sn" :rules="[{ required: true, message: '请输入订单号' }]">
          <a-input v-model:value="formModal.sn" placeholder="请输入订单号" />
        </a-form-item>
        <a-form-item label="订单金额" name="price" :rules="[{ required: true, message: '请输入订单金额' }]">
          <a-input v-model:value="formModal.price" placeholder="请输入订单金额" />
        </a-form-item>
        <a-form-item label="国家" name="countryCn" :rules="[{ required: true, message: '请输入订单号' }]">
          <a-input v-model:value="formModal.countryCn" placeholder="请输入订单号" />
        </a-form-item>
        <a-form-item label="商品明细" name="productDetails" :rules="[{ required: true, message: '请输入商品明细' }]">
          <a-input v-model:value="formModal.productDetails" placeholder="请输入商品明细" />
        </a-form-item>
        <a-form-item label="销售名" name="salesName" :rules="[{ required: true, message: '请输入销售名' }]">
          <a-input v-model:value="formModal.salesName" placeholder="请输入销售名" />
        </a-form-item>
        <a-form-item label="联系电话" name="telephone" :rules="[{ required: true, message: '请输入联系电话' }]">
          <a-input v-model:value="formModal.telephone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="类目" name="category" :rules="[{ required: true, message: '请输入类目' }]">
          <a-input v-model:value="formModal.category" placeholder="请输入类目" />
        </a-form-item>
        <a-form-item label="商标名称" name="tradeName" :rules="[{ required: true, message: '请输入商标名称' }]">
          <a-input v-model:value="formModal.tradeName" placeholder="请输入商标名称" />
        </a-form-item>
        <a-form-item label="商标申请人" name="tradeApply" :rules="[{ required: true, message: '请输入商标申请人' }]">
          <a-input v-model:value="formModal.tradeApply" placeholder="请输入商标申请人" />
        </a-form-item>
        <a-form-item label="申请样式" name="applyStyle" :rules="[{ required: true, message: '请输入申请样式' }]">
          <a-input v-model:value="formModal.applyStyle" placeholder="请输入申请样式" />
        </a-form-item>
        <a-form-item
          label="提交官方日期"
          name="submitTime"
          :rules="[{ required: true, message: '请输入提交官方日期' }]"
        >
          <a-date-picker show-time placeholder="请输入提交官方日期" v-model:value="formModal.submitTime" />
        </a-form-item>
        <a-form-item label="受理号" name="acceptanceNo" :rules="[{ required: true, message: '请输入受理号' }]">
          <a-input v-model:value="formModal.acceptanceNo" placeholder="请输入受理号" />
        </a-form-item>
        <a-form-item label="目前状态" name="targetStatus" :rules="[{ required: true, message: '请输入目前状态' }]">
          <a-input v-model:value="formModal.targetStatus" placeholder="请输入目前状态" />
        </a-form-item>
        <a-form-item label="备注" name="remarks" :rules="[{ required: true, message: '请输入备注' }]">
          <a-textarea v-model:value="formModal.remarks" :rows="4" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { editConfig } from '@/api/workOrder/offlineData';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

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
        ...props.record,
      };
      formModal.value.submitTime = dayjs(props.record.submitTime);
    });
  } else {
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    const submitTime = dayjs(formModal.value.submitTime).format('YYYY-MM-DD HH:mm:ss');
    editConfig({
      dataTrademarkTransfer: {
        ...formModal.value,
        transferId: props.record.transferId,
        submitTime,
      },
    }).then((res: any) => {
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
