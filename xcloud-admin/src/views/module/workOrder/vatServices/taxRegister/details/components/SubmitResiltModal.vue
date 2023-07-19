<template>
  <a-modal
    width="700px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
    @ok="submitConfirm"
  >
    <template #title>
      <div class="title-wrap">
        <span class="title-text">审核结果</span>
        <span class="title-result" :style="{ color: isResultPass ? 'green' : '#F5222D' }">
          {{ isResultPass ? '通过' : '驳回' }}
        </span>
      </div>
    </template>
    <div class="wrap">
      <div class="pass-text" v-if="isResultPass">确认审核通过？</div>
      <div v-else class="reject-wrap">
        <div class="cell">审核人：{{ userInfo.nickName || '---' }}</div>
        <div class="cell">
          <div class="cell-label">驳回原因：</div>
          <a-textarea v-model:value="formModal.remark" placeholder="请输入驳回原因" :rows="5" />
        </div>
        <div class="cell">
          发短信给客户：
          <a-radio-group v-model:value="formModal.isSend">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
          <!-- <div class="tips-red">如果选择发短信给客户，系统将会一并发送更改原因，请详细填写</div> -->
        </div>
        <div class="cell flex">
          <div class="flex1">
            <a-checkbox v-model:checked="formModal.saleUser" :disabled="!formModal.saleUserName">
              通知销售人员（{{ formModal.saleUserName || '-' }}）
            </a-checkbox>
            <div class="tipx-text">选择后系统会向该订单的销售发起待办通知</div>
          </div>
          <div class="flex1">
            <a-checkbox v-model:checked="formModal.customerUser" :disabled="!formModal.customerUserName">
              通知客服人员（{{ formModal.customerUserName || '-' }}）
            </a-checkbox>
            <div class="tipx-text">选择后系统会向该客服发起待办通知</div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { auditServiceWork, passServiceWork } from '@/api/workOrder/vatServices/taxRegister';
import { getUserInfo } from '@/api/user/user';
import { useStore } from '@/stores/store';

const props = defineProps({
  isShowStorageContract: {
    type: Boolean,
    default: true,
  },
  detailsInfo: {
    type: Object,
    default: () => null,
  },
  statusList: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
const userInfo: any = ref({});
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      if (!isResultPass.value) {
        getUserInfoFun();
        const handlerIdArr = props.detailsInfo.handlerUserId?.split('\n') || [];
        const handlerArr = props.detailsInfo.handler?.split('\n') || [];
        const handlerIndex = handlerArr.findIndex((item: string) => item.includes('客服'));
        formModal.value = {
          workOrderId: props.detailsInfo.workId,
          isPass: false,
          remark: '',
          isSend: true,
          saleUser: false,
          saleUserId: props.detailsInfo.attributionId,
          saleUserName: props.detailsInfo.attributionName,
          customerUser: false,
          customerUserId: handlerIndex === -1 ? undefined : handlerIdArr[handlerIndex],
          customerUserName: handlerIndex === -1 ? undefined : handlerArr[handlerIndex],
        };

        let list: any = [];
        try {
          list = list.concat(props.statusList.companyInfo.columns);
          list = list.concat(props.statusList.corporateInfo.columns);
          list = list.concat(props.statusList['storeInfo,taxInfo'].columns);
          list = list.concat(props.statusList.fileExamine.columns);
        } catch {
          console.log('err');
        }
        for (const li of list) {
          if (li.audit === 2) {
            formModal.value.remark += li.columnName + '：' + li.rejects + '\n\n';
          }
        }
      }
    });
  }
});

//所以审核均通过
const isResultPass = computed(() => {
  let flag = false;
  try {
    if (
      props.statusList.companyInfo.audit === 1 &&
      props.statusList.corporateInfo.audit === 1 &&
      props.statusList['storeInfo,taxInfo'].audit === 1
    ) {
      if (props.detailsInfo.functionCode === '2') {
        flag = true;
      } else {
        if (props.isShowStorageContract) {
          const list = props.statusList.fileExamine.columns.filter(
            (v: { columnKey: string }) => v.columnKey !== 'storageAddressImg'
          );
          if (list[0].audit === 1 && list[1].audit === 1) {
            flag = true;
          }
        } else {
          const list = props.statusList.fileExamine.columns.filter(
            (v: { columnKey: string }) => v.columnKey !== 'storageContract'
          );
          if (list[0].audit === 1 && list[1].audit === 1) {
            flag = true;
          }
        }
      }
    }
  } catch {
    flag = false;
  }
  return flag;
});

//提交
const submitConfirm = () => {
  if (isResultPass.value) {
    passServiceWork(props.detailsInfo.workId).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
      goDetailsPage();
    });
  } else {
    const params = JSON.parse(JSON.stringify(formModal.value));
    if (!params.remark) {
      message.error('请输入驳回原因');
      return false;
    }
    if (!params.saleUser) {
      params.saleUserId = undefined;
      params.saleUserName = undefined;
    }
    if (!params.customerUser) {
      params.customerUserId = undefined;
      params.customerUserName = undefined;
    }
    params.saleUser = undefined;
    params.customerUser = undefined;

    auditServiceWork(params).then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
      goDetailsPage();
    });
  }
};

//跳转页面
const goDetailsPage = () => {
  const userStore = useStore();
  if (props.detailsInfo.functionCode === '2') {
    userStore
      .$router()
      .push(
        '/serviceManage/taxInfo?workOrderId=' + props.detailsInfo.workId + '&serviceNo=' + props.detailsInfo.serviceNo
      );
  } else {
    userStore
      .$router()
      .push(
        '/serviceManage/taxRegisterInfo?workOrderId=' +
          props.detailsInfo.workId +
          '&serviceNo=' +
          props.detailsInfo.serviceNo
      );
  }
};

//获取当前用户信息
const getUserInfoFun = () => {
  getUserInfo().then((res: any) => {
    userInfo.value = res || {};
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.title-wrap {
  .tips-text {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  .title-result {
    margin-left: 13px;
    font-size: 16px;
    font-weight: 500;
  }
}
.wrap {
  padding: 0 10px;
  .pass-text {
    line-height: 30px;
    font-size: 16px;
    margin-left: 10px;
  }
  .reject-wrap {
    .cell {
      line-height: 30px;
      margin-bottom: 10px;
      font-weight: 500;
      color: #333;
      .cell-label {
        margin-bottom: 5px;
      }
      .tips-red {
        color: red;
      }
    }
    .flex {
      display: flex;
      .flex1 {
        flex: 1;
      }
    }
    .tipx-text {
      line-height: 22px;
      color: #666;
      font-weight: 400;
      margin-top: 5px;
    }
  }
}
</style>
