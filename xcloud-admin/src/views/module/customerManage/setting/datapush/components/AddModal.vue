<template>
  <a-modal
    title="新建任务"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="任务名称" name="name" :rules="[{ required: true, message: '请输入任务名称' }]">
          <a-input v-model:value="formModal.name" placeholder="请输入任务名称" maxLength="30" />
        </a-form-item>
        <a-form-item label="请选择任务类型" name="type" :rules="[{ required: true, message: '请选择任务类型' }]">
          <a-select v-model:value="formModal.type" placeholder="请选择任务类型">
            <a-select-option value="download">下载任务</a-select-option>
            <a-select-option value="push">推送任务</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="请选择推送方向"
          name="sendDirection"
          :rules="[{ required: true, message: '请选择推送方向' }]"
          v-if="formModal.type === 'push'"
        >
          <a-select v-model:value="formModal.sendDirection" placeholder="请选择推送方向">
            <a-select-option value="lxy">励销云</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="填写审批ID" name="dingTalkApplyId" :rules="[{ required: true, message: '请输入审批ID' }]">
          <a-input v-model:value="formModal.dingTalkApplyId" placeholder="请输入审批ID" />
        </a-form-item>
        <a-form-item label="申请人" name="applyBy" :rules="[{ required: true, message: '请选择申请人' }]">
          <a-select
            v-model:value="formModal.applyBy"
            :options="userList"
            placeholder="请选择申请人"
            showSearch
            optionFilterProp="label"
            :dropdownMatchSelectWidth="400"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="处理人" name="handledBy" :rules="[{ required: true, message: '请选择处理人' }]">
          <a-select
            v-model:value="formModal.handledBy"
            :options="userList"
            placeholder="请选择处理人"
            showSearch
            optionFilterProp="label"
            :dropdownMatchSelectWidth="400"
          >
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { addPush } from '@/api/customerManage/datapush';
import { getAllUsers } from '@/api/base/basicsData';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';

const emit = defineEmits(['submit']);
const showModal = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const formModal: any = ref({});
const userList = ref<Array<any>>([]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getUserList();
      formModal.value = {
        name: null,
        dingTalkApplyId: null,
        applyBy: null,
        handledBy: null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    const applyBy = userList.value.find(o => o.value === formModal.value.applyBy);
    const handledBy = userList.value.find(o => o.value === formModal.value.handledBy);
    console.log(applyBy);
    addPush({
      dataSqlTask: {
        ...formModal.value,
        applyByName: applyBy.nickName,
        handledByName: handledBy.nickName,
      },
    }).then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//获取人员
const getUserList = () => {
  getAllUsers().then((res: any) => {
    userList.value = (res || [])
      .filter((v: { status: number }) => v.status === 1)
      .map((v: { userId: string; nickName: string; mobile: string; departmentName: string }) => {
        return {
          value: v.userId,
          label: v.nickName + '-' + v.mobile + '-' + v.departmentName,
          nickName: v.nickName,
        };
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
