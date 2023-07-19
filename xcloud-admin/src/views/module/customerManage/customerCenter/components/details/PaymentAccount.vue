<template>
  <div style="width: 800px">
    <div class="tip-box">
      <p>请提交客户信息，审核通过后可获取打款账号，客户可通过打款账号进行线下支付</p>
      <p>1，提交客户基本信息申请打款账号</p>
      <p>2，开通成功后可获取线下打款账号</p>
      <p>3，在销售订单中复制付款链接让客户选择“线下转账"方式进行打款</p>
      <p>注：一个手机号+公司主体只能申请一个打款账号</p>
    </div>
    <div class="tip-status" v-if="detailsInfo.openFailReason && detailsInfo.status === 'FAIL'">
      {{ detailsInfo.openFailReason || '-' }}
    </div>
    <a-form class="form-wrap" ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="状态">
        <span v-if="detailsInfo.status === 'INIT'">申请中</span>
        <span v-else-if="detailsInfo.status === 'NORMAL'">开通成功</span>
        <span v-else-if="detailsInfo.status === 'FAIL'">开通失败</span>
        <span v-else-if="detailsInfo.status === 'UNOPEN'">未开通</span>
        <span v-else> - </span>
      </a-form-item>
      <a-form-item label="主体" name="enterpriseId" :rules="[{ required: true, message: '请选择主体' }]">
        <a-select
          v-model:value="formModal.enterpriseId"
          placeholder="请选择"
          style="width: 100%"
          @change="getDetailsInfo()"
        >
          <a-select-option v-for="(li, index) of enterpriseList" :key="index" :value="li.id">
            {{ li.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="开户类型" name="accountType" :rules="[{ required: true, message: '请选择开户类型' }]">
        <a-select
          v-model:value="formModal.accountType"
          :disabled="disabledFlag"
          placeholder="请选择"
          style="width: 100%"
        >
          <a-select-option value="ENTERPRISE"> 企业 </a-select-option>
          <!-- <a-select-option value="PERSONAL"> 个人 </a-select-option> -->
        </a-select>
      </a-form-item>
      <a-form-item label="客户名称" name="userName" :rules="[{ required: true, message: '请输入客户名称' }]">
        <a-input v-model:value="formModal.userName" :disabled="disabledFlag" placeholder="请输入客户名称" />
      </a-form-item>
      <a-form-item label="证件类型" name="documentType" :rules="[{ required: true, message: '请选择证件类型' }]">
        <a-select
          v-model:value="formModal.documentType"
          :disabled="disabledFlag"
          placeholder="请选择"
          style="width: 100%"
        >
          <a-select-option v-if="formModal.accountType == 'ENTERPRISE'" value="CREDIT_CODE">
            统一社会信用代码
          </a-select-option>
          <a-select-option v-if="formModal.accountType == 'PERSONAL'" value="ID_CARD"> 身份证 </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="证件号码" name="documentNumber" :rules="[{ required: true, message: '请输入证件号码' }]">
        <a-input v-model:value="formModal.documentNumber" :disabled="disabledFlag" placeholder="请输入证件号码" />
      </a-form-item>
      <template v-if="detailsInfo.status === 'NORMAL'">
        <a-form-item label="收款公司">
          <span>{{ detailsInfo.companyName }}</span>
        </a-form-item>
        <a-form-item label="收款账号">
          <span>{{ detailsInfo.accountNumber }}</span>
        </a-form-item>
        <a-form-item label="开户行名称">
          <span>{{ detailsInfo.bankName }}</span>
        </a-form-item>
        <a-form-item label="联行行号">
          <span>{{ detailsInfo.bankNumber }}</span>
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" v-if="!disabledFlag" @click="submitConfirm()">提交申请</a-button>
          <a-button type="primary" v-else @click="disabledFlag = false"> 修改 </a-button>
          <!-- <a-button style="margin-left: 10px">取消</a-button> -->
        </a-form-item>
      </template>
    </a-form>
  </div>
  <a-modal
    title="确认提交"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="onSubmit"
  >
    <div class="wrap">
      <div class="tip-modal">提示：注意核算手机号和主体信息</div>
      <a-form :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="客户手机号">
          {{ router.currentRoute.value.query.mobile || '-' }}
        </a-form-item>
        <a-form-item label="所属主体">
          {{ enterpriseFilter(formModal.enterpriseId) }}
        </a-form-item>
        <a-form-item label="开户类型">
          <span v-if="formModal.accountType === 'ENTERPRISE'">企业</span>
          <span v-else-if="formModal.accountType === 'PERSONAL'">个人</span>
        </a-form-item>
        <a-form-item label="客户名称">
          {{ formModal.userName }}
        </a-form-item>
        <a-form-item label="证件类型">
          <span v-if="formModal.documentType === 'CREDIT_CODE'">统一社会信用代码</span>
          <span v-else-if="formModal.documentType === 'ID_CARD'">身份证</span>
        </a-form-item>
        <a-form-item label="证件号码">
          {{ formModal.documentNumber }}
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getUserTransferAccount,
  addUserTransferAccount,
  updateUserTransferAccount,
} from '@/api/customerManage/customerCenter';
import router from '@/router';
import { getEnterpriseSelect } from '@/api/base/basicsData';
import { useStore } from '@/stores/store';
import { message, type FormInstance } from 'ant-design-vue';

const enterpriseList: any = ref([]);
const detailsInfo: any = ref({});
const disabledFlag = ref(false);
const showModal = ref(false);
const formModal: any = ref({
  enterpriseId: useStore().enterprise.record.id,
});

onMounted(() => {
  getEnterpriseList();
  getDetailsInfo();
});

//提交确认
const onSubmit = () => {
  let res = null;
  if (detailsInfo.value.status === 'UNOPEN') {
    res = addUserTransferAccount(formModal.value);
  } else {
    res = updateUserTransferAccount(formModal.value);
  }
  res.then((res: any) => {
    message.success('操作成功');
    showModal.value = false;
    getDetailsInfo();
  });
};

//提交确认
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    showModal.value = true;
  });
};

//获取主体下拉框
const getEnterpriseList = () => {
  getEnterpriseSelect().then((res: any) => {
    enterpriseList.value = res || [];
  });
};

//主体过滤
const enterpriseFilter = (id: number) => {
  return enterpriseList.value.find((v: { id: number }) => v.id === id).name;
};

//获取信息
const getDetailsInfo = () => {
  getUserTransferAccount({
    userId: router.currentRoute.value.query.userId,
    enterpriseId: formModal.value.enterpriseId,
  }).then((res: any) => {
    if (JSON.stringify(res) == '{}') {
      detailsInfo.value = {
        status: 'UNOPEN',
      };
      disabledFlag.value = false;
    } else {
      detailsInfo.value = res || {};
      disabledFlag.value = res.status == 'UNOPEN' ? false : true;
    }
    formModal.value = {
      userId: router.currentRoute.value.query.userId,
      userMobile: router.currentRoute.value.query.mobile,
      // status: res.status || 'UNOPEN',
      enterpriseId: Number(res.enterpriseId) || formModal.value.enterpriseId,
      accountType: res.accountType || 'ENTERPRISE',
      userName: res.userName || '',
      documentType: res.documentType || 'CREDIT_CODE',
      documentNumber: res.documentNumber || '',
    };
  });
};
</script>

<style scoped lang="less">
.tip-box {
  background-color: #f2f2f2;
  padding: 15px 20px;
  margin-bottom: 10px;
  p {
    margin: 0;
    line-height: 26px;
  }
}
.tip-status {
  line-height: 30px;
  color: red;
  margin: 10px 20px;
}
.form-wrap {
  width: 600px;
}
.tip-modal {
  background: #dff4fd;
  line-height: 40px;
  padding-left: 30px;
  margin-bottom: 10px;
}
</style>
