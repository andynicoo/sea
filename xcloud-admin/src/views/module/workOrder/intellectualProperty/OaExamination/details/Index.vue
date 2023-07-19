<template>
  <a-spin :spinning="showLoadding">
    <div class="wrap">
      <BackPage backUrl="/workOrder/intellectualProperty/OaExamination">
        <template #optSlot>
          <template v-if="detailsInfo.trademarkOrderServiceInfoVO">
            <a-space>
              <SendCustomFileModal
                btnText="发送注册资料"
                :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                @submit="getOaWorkorderDetailAPI()"
                v-if="
                  (detailsInfo.trademarkOrderServiceInfoVO.productFunctionCode === 61 &&
                    detailsInfo.trademarkOrderServiceInfoVO.nodeCode === 'NODE0036' &&
                    detailsInfo.trademarkOrderServiceInfoVO.serviceProgress === 8) ||
                  (detailsInfo.trademarkOrderServiceInfoVO.productFunctionCode === 61 &&
                    detailsInfo.trademarkOrderServiceInfoVO.nodeCode === 'NODE0037' &&
                    detailsInfo.trademarkOrderServiceInfoVO.serviceProgress === 8)
                "
                v-show="useButton('workOrder_intellectualProperty_OaExamination_registerInfo')"
              />
              <SendEmailModal
                btnText="客户发送邮件状态"
                :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                @submit="getOaWorkorderDetailAPI()"
                v-if="
                  ((detailsInfo.trademarkOrderServiceInfoVO.productFunctionCode === 61 &&
                    detailsInfo.trademarkOrderServiceInfoVO.nodeCode === 'NODE0036' &&
                    detailsInfo.trademarkOrderServiceInfoVO.serviceProgress === 8) ||
                    (detailsInfo.trademarkOrderServiceInfoVO.productFunctionCode === 61 &&
                      detailsInfo.trademarkOrderServiceInfoVO.nodeCode === 'NODE0037' &&
                      detailsInfo.trademarkOrderServiceInfoVO.serviceProgress === 8)) &&
                  detailsInfo.trademarkOrderServiceInfoVO.flagCustomerData
                "
                v-show="useButton('workOrder_intellectualProperty_OaExamination_emailState')"
              />
            </a-space>
          </template>
        </template>
      </BackPage>
      <div class="content">
        <div class="detailsInfo">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="fileInfo" tab="文件信息" />
            <a-tab-pane key="trademarkInfo" tab="商标信息" />
          </a-tabs>
          <div class="detailsInfo-overflow">
            <div v-show="activeKey === 'fileInfo'">
              <FileInfo :fileList="detailsInfo.fileOaWorkOrderList" @updateDetails="getOaWorkorderDetailAPI()" />
            </div>
            <div v-show="activeKey === 'trademarkInfo'">
              <TrademarkInfo
                :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                :moduleList="detailsInfo.workflowColumns"
              />
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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { getBusinessLogListByNo } from '@/api/base/basicsData';
import { oaWorkorderDetailAPI } from '@/api/workOrder/intellectualProperty/oaExamination';
import router from '@/router';
import FileInfo from './components/FileInfo.vue';
import BackPage from '@/components/assembly/BackPage.vue';
import TrademarkInfo from '../../components/TrademarkInfo.vue';
import TabsInfo from '../../components/TabsInfo.vue';
import SendCustomFileModal from './components/topOpt/SendCustomFileModal.vue';
import SendEmailModal from './components/topOpt/SendEmailModal.vue';
import { useButton } from '@/utils/utils';

const showLoadding = ref(false);
const activeKey = ref('fileInfo');
const detailsInfo: any = ref({});
const data: any = reactive({
  operationLog: [], //操作记录
});

onMounted(() => {
  getOaWorkorderDetailAPI();
});

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
