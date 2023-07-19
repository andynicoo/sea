<template>
  <!-- 如果工单状态为已取消（9）或 取消中（11），则禁用所有操作按钮 -->
  <a-space v-if="serviceInfo.status !== 9 && serviceInfo.status !== 11">
    <a-button size="small" type="primary" @click="editInfo()" v-if="['NODE0034'].includes(serviceInfo.nodeCode)">
      修改资料
    </a-button>
    <a-button size="small" type="primary" @click="sendMessage()" v-if="['NODE0033'].includes(serviceInfo.nodeCode)">
      发送短信
    </a-button>
    <PreliminaryReviewModal
      btnText="初步审核"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="['NODE0034'].includes(serviceInfo.nodeCode) && (detailsInfo.rejectNodeCode || detailsInfo.nextNodeCode)"
    />
    <PlatformAuditModal
      btnText="平台审核"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="
        ['NODE0035'].includes(serviceInfo.nodeCode) &&
        serviceInfo.serviceProgress !== 3 &&
        (!serviceInfo.subServicesId || serviceInfo.subNodeCode === 'NODE0043')
      "
    />
    <a-button
      size="small"
      type="primary"
      @click="cancelWoedOrder()"
      v-if="['NODE0033', 'NODE0034'].includes(serviceInfo.nodeCode)"
    >
      取消工单
    </a-button>
    <CloseWorkOrderModal
      btnText="关闭工单"
      :serviceNo="serviceInfo.serviceNo"
      @submit="emitSubmit()"
      v-if="['NODE0036', 'NODE0037'].includes(serviceInfo.nodeCode)"
    />
    <UploadTrademarkModal
      btnText="上传商标证书"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="['NODE0038'].includes(serviceInfo.nodeCode)"
    />
    <UploadOfficialFileModal
      btnText="上传官方文件"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="['NODE0036', 'NODE0037'].includes(serviceInfo.nodeCode)"
    />
    <AcceptDataModal
      btnText="录入受理信息"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="['NODE0035'].includes(serviceInfo.nodeCode) && serviceInfo.serviceProgress === 3"
    />
    <AcceptDataModal
      btnText="修改受理信息"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="!['NODE0033', 'NODE0034', 'NODE0035'].includes(serviceInfo.nodeCode)"
    />
    <AnnouncementDataModal
      btnText="录入公告"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="!serviceInfo.noticeDate && ['NODE0036', 'NODE0038', 'NODE0037'].includes(serviceInfo.nodeCode)"
    />
    <RegisterDataModal
      btnText="录入注册日期"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="!serviceInfo.registerNo && ['NODE0037', 'NODE0038'].includes(serviceInfo.nodeCode)"
    />
    <a-button size="small" type="primary" @click="downLoadFile()" v-if="showDownloadBtn()"> 下载资料 </a-button>
    <DataImportModal
      btnText="资料导入"
      :serviceInfo="serviceInfo"
      @submit="emitSubmit()"
      v-if="['NODE0033'].includes(serviceInfo.nodeCode) && ['US', 'EU', 'JP', 'GB'].includes(serviceInfo.countryCode)"
    />
    <ChangeHandlerModal
      btnText="修改处理人"
      btnSize="small"
      :serviceIdsArr="[serviceInfo.serviceId]"
      @submit="emitSubmit()"
      v-if="!['NODE0033'].includes(serviceInfo.nodeCode)"
    />
    <ChangeLawyerModal
      btnText="修改律师"
      btnSize="small"
      :serviceIds="serviceInfo.serviceId"
      :countryCode="serviceInfo.countryCode"
      :functionCode="String(serviceInfo.productFunctionCode)"
      @submit="emitSubmit()"
      v-if="['NODE0035', 'NODE0036', 'NODE0037', 'NODE0038'].includes(serviceInfo.nodeCode)"
    />

    <!-- <a-button size="small" type="primary" @click="sendMessage()">填写使用证据</a-button> -->
    <!-- <PreliminaryReviewModal
      btnText="审核使用证据"
      :serviceId="serviceInfo.serviceId"
      :nodeCode="serviceInfo.nodeCode"
      @submit="emitSubmit()"
    /> -->
    <!-- <UploadNoaFileModal
      btnText="上传NOA文件"
      :serviceId="serviceInfo.serviceId"
      :nodeCode="serviceInfo.nodeCode"
      @submit="emitSubmit()"
    /> -->
    <!-- <a-button size="small" type="primary" @click="downLoadUseOfEvidence()">下载使用证据</a-button> -->
  </a-space>
</template>

<script setup lang="ts">
import {
  cacelWordOrder,
  dowloadWordOrder,
  getTrademarkDetailInfo,
} from '@/api/workOrder/intellectualProperty/trademark';
import router from '@/router';
import { downloadFile } from '@/utils/utils';
import { message, Modal } from 'ant-design-vue';
import { ref, type Ref } from 'vue';

import DataImportModal from './opt/DataImportModal.vue';
import PlatformAuditModal from './opt/PlatformAuditModal.vue';
import PreliminaryReviewModal from './opt/PreliminaryReviewModal.vue';
import AcceptDataModal from './opt/AcceptDataModal.vue';
import ChangeHandlerModal from '../../../components/ChangeHandlerModal.vue';
import CloseWorkOrderModal from './opt/CloseWorkOrderModal.vue';
import AnnouncementDataModal from './opt/AnnouncementDataModal.vue';
import RegisterDataModal from './opt/RegisterDataModal.vue';
import ChangeLawyerModal from '../../../components/ChangeLawyerModal.vue';
import UploadOfficialFileModal from './opt/UploadOfficialFileModal.vue';

import UploadNoaFileModal from './opt/UploadNoaFileModal.vue';
import UploadTrademarkModal from './opt/UploadTrademarkModal.vue';

const props = defineProps({
  detailsInfo: {
    type: Object,
    default: null,
  },
  serviceInfo: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['submit', 'editMeans']);

//返回提交
const emitSubmit = () => {
  emit('submit');
};

//修改资料
const editInfo = () => {
  emit('editMeans');
};

//发送短信
const sendMessage = () => {
  getTrademarkDetailInfo({
    serviceId: router.currentRoute.value.query.serviceId || '',
  }).then((res: any) => {
    message.success('操作成功');
  });
};

//下载资料
const downLoadFile = () => {
  dowloadWordOrder({ trademarkWorkOrderId: props.serviceInfo.workOrderId }).then((res: any) => {
    downloadFile(res, '下载文件.zip');
  });
};

//取消工单
const cancelWoedOrder = () => {
  Modal.confirm({
    title: '提示',
    width: 500,
    content: '确认要取消工单吗？',
    onOk() {
      return new Promise(resolve => {
        resolve(true);
        cacelWordOrder({
          productId: props.serviceInfo.productId,
          orderNo: props.serviceInfo.orderNo,
          serviceNo: props.serviceInfo.serviceNo,
        }).then(() => {
          message.success('操作成功');
          emitSubmit();
        });
      });
    },
  });
};

//下载使用证据
const downLoadUseOfEvidence = () => {
  dowloadWordOrder({ trademarkWorkOrderId: props.serviceInfo.workOrderId }).then((res: any) => {
    downloadFile(res, '使用证据.zip');
  });
};

//初步审核
const preliminaryReviewModal: Ref = ref(null);
const preliminaryReviewFun = () => {
  preliminaryReviewModal.value.showModal = true;
};

//修改资料
const modifyData = () => {
  //++++++
};

//下载资料
const downloadData = () => {
  getTrademarkDetailInfo({}).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};

//是否显示下载资料按钮
const showDownloadBtn = () => {
  let resFlag = false;
  const serviceInfo = props.serviceInfo;
  if (serviceInfo.serviceName === '美国商标注册（顾问）') {
    if (['NODE0043'].includes(serviceInfo.subNodeCode) && serviceInfo.status == 1) {
      if (['NODE0035'].includes(serviceInfo.countryCode) && ['US', 'GB', 'EU'].includes(serviceInfo.countryCode)) {
        resFlag = true;
      }
    }
  } else {
    if (!['NODE0033', 'NODE0034'].includes(serviceInfo.countryCode)) {
      resFlag = true;
    }
  }
  return resFlag;
};
</script>

<style scoped lang="less"></style>
