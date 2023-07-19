<template>
  <a-modal
    title="修改处理人"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }">
        <a-form-item label="处理人类型" name="handleType" :rules="[{ required: true, message: '请选择处理人类型' }]">
          <a-select
            v-model:value="formModal.handleType"
            placeholder="请选择处理人类型"
            allowClear
            showSearch
            optionFilterProp="label"
            @change="changeHandleType"
          >
            <a-select-option
              v-for="(li, index) of data.handlerUserTypeList"
              :key="index"
              :value="li.type"
              :label="li.typeName"
            >
              {{ li.typeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="指定处理人" name="handlerUserId" :rules="[{ required: true, message: '请选择指定处理人' }]">
          <a-select
            v-model:value="formModal.handlerUserId"
            placeholder="请选择指定处理人"
            allowClear
            showSearch
            optionFilterProp="label"
            @change="changeHandlerUser"
          >
            <a-select-option v-for="(li, index) of data.userList" :key="index" :value="li.userId" :label="li.nickName">
              {{ li.nickName }} —— {{ li.departmentName }}
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
import { getAllUsers } from '@/api/base/basicsData';
import { getHandlerUserType, updateHandlerUserTypeAPI } from '@/api/workOrder/intellectualProperty/oaExamination';

const props = defineProps({
  selectedRowKeys: {
    default: [],
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  handlerUserTypeList: [], //处理人类型
  userList: [], //处理人
});
const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getHandlerUserTypeFun();
      getAllUsersFun();
      formModal.value = {
        serviceType: 61,
        serviceIds: props.selectedRowKeys.map((v: { serviceId: string }) => v.serviceId).join(','),
        handleType: null,
        handleTypeName: null,
        handlerUserId: null,
        handlerUserName: null,
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
    updateHandlerUserTypeAPI(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//选择处理人类型
const changeHandleType = (val: any, record: any) => {
  formModal.value.handleTypeName = record.label;
};

//选择指定处理人
const changeHandlerUser = (val: any, record: any) => {
  formModal.value.handlerUserName = record.label;
};

//获取所有处理人类型
const getHandlerUserTypeFun = () => {
  getHandlerUserType({ productFunctionCode: 61 }).then((res: any) => {
    data.handlerUserTypeList = res || [];
  });
};

//获取 人员
const getAllUsersFun = () => {
  getAllUsers().then((res: any) => {
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
