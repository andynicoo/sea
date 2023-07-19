<template>
  <slot>
    <a-space>
      <a-button
        type="primary"
        v-for="(item, index) in data.operateBtns"
        @click="openModal(item)"
        :key="index"
        v-show="useButton(item.auth)"
      >
        {{ `分配${item.label}` }}
      </a-button>
    </a-space>
  </slot>
  <a-modal
    :title="`分配${data.operate.label}`"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form
        ref="ruleFormRef"
        layout="vertical"
        :model="formModal"
        name="basic"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 13 }"
      >
        <a-form-item
          :label="`选择${data.operate.label}人员`"
          name="newUserId"
          :rules="[{ required: true, message: `请选择要分配的${data.operate.label}人员` }]"
        >
          <a-select
            v-model:value="formModal.newUserId"
            :placeholder="`请选择要分配的${data.operate.label}人员`"
            allowClear
            showSearch
            optionFilterProp="label"
            @change="changeHandlerUser"
          >
            <a-select-option
              v-for="(item, index) of data.userList"
              :key="index"
              :value="item.userId"
              :label="item.nickName"
            >
              {{ item.nickName }} —— {{ item.departmentName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useButton } from '@/utils/utils';
import { nextTick, reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { getAllUsers } from '@/api/base/basicsData';
import { updateHandlerUserTypeAPI } from '@/api/workOrder/intellectualProperty/oaExamination';
import {
  handleEditCheck,
  handleEditCurCheck,
  handleEditCustomer,
  handleEditSale,
} from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  ids: {
    type: Array<string>,
    default: [],
  },
});
const emit = defineEmits(['submit']);
const data: any = reactive({
  handlerUserTypeList: [], //处理人类型
  userList: [], //处理人
  operateBtns: [
    {
      type: 1,
      label: '销售',
      auth: 'workOrder_intellectualProperty_trademarkRecord_assign_sales',
      api: handleEditSale,
    },
    {
      type: 2,
      label: '客服',
      auth: 'workOrder_intellectualProperty_trademarkRecord_assign_service',
      api: handleEditCustomer,
    },
    {
      label: '专员',
      auth: 'workOrder_intellectualProperty_trademarkRecord_assign_specialist',
      api: handleEditCheck,
      type: 3,
    },
    {
      type: 4,
      label: '处理人',
      auth: 'workOrder_intellectualProperty_trademarkRecord_assign_handler',
      api: handleEditCurCheck,
    },
  ],
  operate: {},
});
const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getAllUsersFun();
      formModal.value = {
        ids: props.ids,
        newUserId: null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//打开模态框
const openModal = (item: object) => {
  if (props.ids.length === 0) {
    message.error('请先选择操作项');
    return false;
  }
  showModal.value = true;
  data.operate = item;
};

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    data.operate.api(formModal.value).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//选择指定处理人
const changeHandlerUser = (val: string) => {
  formModal.value.newUserId = val;
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
