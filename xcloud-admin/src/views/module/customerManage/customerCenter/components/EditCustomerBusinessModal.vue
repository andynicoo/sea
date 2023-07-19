<template>
  <a-modal
    title="批量修改客户成功"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item
          label="选择业务线"
          name="customerBusinessType"
          :rules="[{ required: true, message: '请选择业务线' }]"
        >
          <a-select
            v-model:value="formModal.customerBusinessType"
            placeholder="请选择"
            optionFilterProp="label"
            style="width: 230px"
          >
            <a-select-option value="VAT"> VAT </a-select-option>
            <a-select-option value="EPR"> EPR </a-select-option>
            <a-select-option value="IIPTO"> 商标 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="选择客户成功"
          name="customerSuccessId"
          :rules="[{ required: true, message: '请选择客户成功' }]"
        >
          <a-select
            v-model:value="formModal.customerSuccessId"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 230px"
            :dropdownMatchSelectWidth="400"
            @change="changeFollowUser"
          >
            <a-select-option v-for="(li, index) of data.userList" :key="index" :value="li.userId" :label="li.nickName">
              {{ li.nickName }} —— {{ li.mobile }} —— {{ li.departmentName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { getValidUsers } from '@/api/base/basicsData';
import { addOrEditCustomerSuccess } from '@/api/customerManage/customerCenter';

const props = defineProps({
  selectedRowKeys: {
    default: [],
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  userList: [], //人员列表
});
const showModal = ref(false);
const formModal: any = ref({});
watch(showModal, newVal => {
  if (newVal) {
    getValidUsersFun();
    nextTick(() => {
      formModal.value = {
        customerIds: props.selectedRowKeys.map((v: { customerId: string }) => v.customerId),
        customerBusinessType: 'VAT',
        customerSuccessId: null,
        customerSuccessName: null,
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
    addOrEditCustomerSuccess(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//选择 人员
const changeFollowUser = (val: any, record: any) => {
  formModal.value.customerSuccessName = record.label;
};

//获取 人员
const getValidUsersFun = () => {
  getValidUsers().then((res: any) => {
    data.userList = (res || []).filter((v: { status: number }) => v.status === 1);
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
