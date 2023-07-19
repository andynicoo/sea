<template>
  <a-modal
    title="修改跟进人"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form :model="data.formModal" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="选择跟进人" required>
          <a-select
            v-model:value="data.formModal.followUserId"
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
import { reactive, ref, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { getValidUsers } from '@/api/base/basicsData';
import { updateFollowUserId } from '@/api/customerManage/clueCenter';

const props = defineProps({
  selectedRowKeys: {
    default: [],
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  formModal: {
    followUserId: null,
  },
  followUserName: '',
  userList: [], //跟进人
});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    data.formModal.followUserId = null;
    getValidUsersFun();
  }
});

//提交
const submitConfirm = () => {
  if (!data.formModal.followUserId) {
    message.error('请选择跟进人');
    return false;
  }
  Modal.confirm({
    title: '提示',
    width: 500,
    content: `是否将选中的 ${props.selectedRowKeys.length} 个线索分配给跟进人“ ${data.followUserName} ”`,
    onOk() {
      return new Promise((resolve, reject) => {
        updateFollowUserId({
          ids: props.selectedRowKeys.map((v: any) => v.customerLeadId),
          followUserId: data.formModal.followUserId,
        }).then((res: any) => {
          resolve(true);
          message.success('操作成功');
          showModal.value = false;
          emit('submit');
        });
      });
    },
  });
};

//选择跟进人 人员
const changeFollowUser = (val: any, record: any) => {
  data.followUserName = record.label;
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
