<template>
  <a-modal
    title=""
    width="600px"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
    :bodyStyle="{ padding: '10px 24px' }"
  >
    <div class="wrap">
      <a-form :model="formModal" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-tabs v-model:activeKey="tabActive">
          <a-tab-pane :key="0" tab="联系信息">
            <a-form-item label="联系人" required>
              <a-input v-model:value="formModal.contactPerson" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="联系方式" required>
              <a-input v-model:value="formModal.contactPhone" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="联系地址" required>
              <a-textarea v-model:value="formModal.contactAddress" placeholder="请输入" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane :key="1" tab="账户状态">
            <a-form-item label="状态">
              <a-select v-model:value="formModal.status" placeholder="请选择">
                <a-select-option :value="0"> 禁用 </a-select-option>
                <a-select-option :value="1"> 启用 </a-select-option>
                <a-select-option :value="3"> 锁定 </a-select-option>
              </a-select>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="会员管理">
            <a-form-item label="积分">
              <span>{{ detailsInfo.integral || 0 }} 积分</span>
              <a-button type="link" @click="editIntegral()">调整积分</a-button>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </a-modal>
  <IntegralModal ref="integralModal" :record="record" :detailsInfo="detailsInfo" @submit="getUserInegralAccountFun()" />
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import { getUserInegralAccount, updateUser } from '@/api/customerManage/accountInfo';
import IntegralModal from './IntegralModal.vue';

const visible = ref<boolean>(false);
//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);
const formModal: any = ref({});
const detailsInfo: any = ref({});
type TypeTabActive = 0 | 1 | 2;
const tabActive = ref<TypeTabActive>(0);
interface Params {
  contactPerson?: string;
  contactPhone?: string;
  contactAddress?: string;
  /** 0:禁用 1:启用 3:锁定 */
  status?: 0 | 1 | 3;
  userId?: number | string;
  enterpriseId?: number | string;
}
const params = ref<Params>({});

watch(visible, newVal => {
  if (newVal) {
    nextTick(() => {
      getUserInegralAccountFun();
      formModal.value = {
        userId: props.record.userId,
        enterpriseId: props.record.enterpriseId,
        contactPerson: props.record.contactPerson || null,
        contactPhone: props.record.contactPhone || null,
        contactAddress: props.record.contactAddress || null,
        status: props.record.status ?? 1,
      };
      params.value.userId = props.record.userId;
      params.value.enterpriseId = props.record.enterpriseId;
      tabActive.value = 0;
    });
  } else {
    formModal.value = {};
    detailsInfo.value = {};
  }
});

//提交
const submit = () => {
  if (tabActive.value === 0) {
    if (!formModal.value.contactPerson) {
      message.error('请输入联系人');
      return false;
    }
    if (!formModal.value.contactPhone) {
      message.error('请输入联系方式');
      return false;
    }
    if (!formModal.value.contactAddress) {
      message.error('请输入联系地址');
      return false;
    }
    const { contactPerson, contactPhone, contactAddress } = formModal.value;
    params.value.contactPerson = contactPerson;
    params.value.contactPhone = contactPhone;
    params.value.contactAddress = contactAddress;
  } else if (tabActive.value === 1) {
    params.value.status = formModal.value.status;
  }

  updateUser(params.value).then((res: any) => {
    message.success('操作成功');
    visible.value = false;
    emit('submit');
  });
};

//调整积分
const integralModal: Ref = ref(null);
const editIntegral = () => {
  integralModal.value.visible = true;
};

//获取详情
const getUserInegralAccountFun = () => {
  getUserInegralAccount({
    userId: props.record.userId,
    enterpriseId: props.record.enterpriseId,
  }).then((res: any) => {
    detailsInfo.value = res || {};
  });
};

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin-bottom: 30px;
}
</style>
