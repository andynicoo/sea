<template>
  <a-modal
    title="修改处理人"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="选择处理人" name="userIds" :rules="[{ required: true, message: '请选择处理人' }]">
          <a-select
            v-model:value="formModal.userIds"
            placeholder="请选择"
            allowClear
            showSearch
            mode="multiple"
            optionFilterProp="label"
            style="width: 300px"
            :maxTagCount="1"
            :maxTagTextLength="5"
            :dropdownMatchSelectWidth="400"
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
import { reactive, ref, watch } from 'vue';
import { message, Modal, type FormInstance } from 'ant-design-vue';
import { getValidUsers } from '@/api/base/basicsData';
import { updateBeLonger } from '@/api/goodsCenter/costcontrol';

const props = defineProps({
  selectedRowKeys: {
    default: [],
  },
});
const emit = defineEmits(['submit']);
const formModal: any = ref({});
const data: any = reactive({
  userList: [], //处理人
});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    formModal.value = {
      businessCostIdList: props.selectedRowKeys.map((v: { businessCostId: string }) => v.businessCostId),
      userIds: [],
    };
    getValidUsersFun();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    updateBeLonger(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//获取跟进人 人员
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
