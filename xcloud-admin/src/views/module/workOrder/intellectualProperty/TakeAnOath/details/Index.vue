<template>
  <a-spin :spinning="showLoadding">
    <div class="wrap">
      <BackPage backUrl="/workOrder/intellectualProperty/TakeAnOath">
        <template #optSlot>
          <a-button size="small" type="primary" @click="sendMessage()">发送短信</a-button>
          <a-button size="small" type="primary" @click="preliminaryReviewFun()">初步审核</a-button>
          <a-button size="small" type="primary" @click="modifyData()">修改资料</a-button>
          <a-button size="small" type="primary" @click="downloadData()">下载资料</a-button>
          <a-button size="small" type="primary" @click="platformAuditFun()">平台审核</a-button>
          <a-button size="small" type="primary" @click="approvedFun()">审查通过</a-button>
          <a-button size="small" type="primary" @click="changeHandlerFun()">修改处理人</a-button>
        </template>
      </BackPage>
      <div class="content">
        <div class="detailsInfo">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="trademarkInfo" tab="商标信息" />
            <a-tab-pane key="fileInfo" tab="文件信息" />
          </a-tabs>
          <div class="detailsInfo-overflow">
            <div v-show="activeKey === 'trademarkInfo'">
              <TrademarkInfo
                :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                :moduleList="detailsInfo.workflowColumns"
              />
            </div>
            <div v-show="activeKey === 'fileInfo'">
              <FileInfo :fileList="detailsInfo.fileOaWorkOrderList" @updateDetails="getOaWorkorderDetailAPI()" />
            </div>
          </div>
        </div>
        <div class="tabsInfo">
          <TabsInfo
            :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
            :userInfo="detailsInfo.trademarkOrderUserInfoVO"
            :operationLog="data.operationLog"
          />
        </div>
      </div>
    </div>
  </a-spin>
  <PreliminaryReviewModal ref="preliminaryReviewModal" :record="detailsInfo" />
  <PlatformAuditModal ref="platformAuditModal" :record="detailsInfo" />
  <ApproveModal ref="approveModal" :record="detailsInfo" />
  <ChangeHandlerModal ref="changeHandlerModal" :record="detailsInfo" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue';
import { getBusinessLogListByNo } from '@/api/base/basicsData';
import { oaWorkorderDetailAPI } from '@/api/workOrder/intellectualProperty/takeAnOath';
import router from '@/router';
import { message } from 'ant-design-vue';
import { downloadFile } from '@/utils/utils';
import BackPage from '@/components/assembly/BackPage.vue';
import TrademarkInfo from '../../components/TrademarkInfo.vue';
import FileInfo from './components/FileInfo.vue';
import TabsInfo from '../../components/TabsInfo.vue';

import PreliminaryReviewModal from './components/opt/PreliminaryReviewModal.vue';
import PlatformAuditModal from './components/opt/PlatformAuditModal.vue';
import ApproveModal from './components/opt/ApproveModal.vue';
import ChangeHandlerModal from './components/opt/ChangeHandlerModal.vue';

const showLoadding = ref(false);
const activeKey = ref('trademarkInfo');
const detailsInfo: any = ref({});
const data: any = reactive({
  operationLog: [], //操作记录
});

onMounted(() => {
  getOaWorkorderDetailAPI();
});

//发送短信
const sendMessage = () => {
  oaWorkorderDetailAPI({
    serviceId: router.currentRoute.value.query.serviceId,
  }).then((res: any) => {
    message.success('操作成功');
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
  oaWorkorderDetailAPI(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};

//平台审核
const platformAuditModal: Ref = ref(null);
const platformAuditFun = () => {
  platformAuditModal.value.showModal = true;
};

//审查通过
const approveModal: Ref = ref(null);
const approvedFun = () => {
  approveModal.value.showModal = true;
};

//修改处理人
const changeHandlerModal: Ref = ref(null);
const changeHandlerFun = () => {
  changeHandlerModal.value.showModal = true;
};

//获取详情
const getOaWorkorderDetailAPI = () => {
  showLoadding.value = true;
  oaWorkorderDetailAPI({
    serviceId: router.currentRoute.value.query.serviceId,
  })
    .then((res: any) => {
      detailsInfo.value = res || {};
      getBusinessLogListByNoFun(detailsInfo.value.trademarkOrderServiceInfoVO.serviceNo);
    })
    .catch(() => {
      showLoadding.value = false;
    });
};

//获取操作记录
const getBusinessLogListByNoFun = (serviceNo: string) => {
  getBusinessLogListByNo({
    businessNo: serviceNo,
    businessType: 2,
  })
    .then((res: any) => {
      data.operationLog = res || [];
      showLoadding.value = false;
    })
    .catch(() => {
      showLoadding.value = false;
    });
};
</script>

<style scoped lang="less">
.wrap {
  height: calc(100vh - 120px);
  overflow: auto;
  .content {
    height: calc(100% - 50px);
    display: flex;
    .detailsInfo {
      flex: 1;
      padding: 0 10px;
      background-color: #fff;
      .detailsInfo-overflow {
        height: calc(100% - 70px);
        overflow-y: auto;
      }
    }
    .tabsInfo {
      width: 25%;
      margin-left: 10px;
      padding: 0 10px;
      background-color: #fff;
      overflow-y: auto;
    }
  }
}
</style>
