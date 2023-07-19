<template>
  <a-spin :spinning="showLoadding">
    <div class="wrap">
      <BackPage backUrl="/workOrder/intellectualProperty/trademark">
        <template #optSlot>
          <TopOperation
            v-if="detailsInfo.trademarkOrderServiceInfoVO"
            :detailsInfo="detailsInfo"
            :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
            @submit="getOaWorkorderDetailAPI()"
            @editMeans="editMeans()"
          />
        </template>
      </BackPage>
      <div class="content">
        <div class="detailsInfo">
          <template v-if="detailsInfo && detailsInfo.trademarkOrderServiceInfoVO">
            <a-tabs v-model:activeKey="activeKey">
              <template v-if="detailsInfo.trademarkOrderServiceInfoVO.nodeCode === 'NODE0033' || data.editFlag">
                <a-tab-pane key="submittals" tab="提交资料" />
              </template>
              <template v-else>
                <a-tab-pane
                  key="fileInfo"
                  tab="文件信息"
                  v-if="!['NODE0034', 'NODE0035'].includes(detailsInfo.trademarkOrderServiceInfoVO.nodeCode)"
                />
                <a-tab-pane
                  key="customerFileInfo"
                  tab="客户上传的材料"
                  v-if="!['NODE0034', 'NODE0035'].includes(detailsInfo.trademarkOrderServiceInfoVO.nodeCode)"
                />
                <a-tab-pane key="trademarkInfo" tab="商标信息" />
              </template>
            </a-tabs>
            <div class="detailsInfo-overflow">
              <div v-if="activeKey === 'submittals'">
                <WorkForm
                  :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                  :workflowColumns="detailsInfo.workflowColumns"
                  :editFlag="data.editFlag"
                />
              </div>
              <div v-else-if="activeKey === 'fileInfo'">
                <FileInfo
                  :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                  :fileList="detailsInfo.fileOaWorkOrderList"
                  @submit="getOaWorkorderDetailAPI()"
                />
              </div>
              <div v-else-if="activeKey === 'customerFileInfo'">
                <CustomerFileInfo
                  :fileList="detailsInfo.fileOaWorkOrderList.filter((v: any )=> v.answerFile)"
                  @updateDetails="getOaWorkorderDetailAPI()"
                />
              </div>
              <div v-else-if="activeKey === 'trademarkInfo'">
                <TrademarkInfo
                  :showRegisterInfo="true"
                  :serviceInfo="detailsInfo.trademarkOrderServiceInfoVO"
                  :moduleList="detailsInfo.workflowColumns"
                />
              </div>
            </div>
          </template>
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
import { getTrademarkDetailInfo } from '@/api/workOrder/intellectualProperty/trademark';
import router from '@/router';
import BackPage from '@/components/assembly/BackPage.vue';
import TopOperation from './components/TopOperation.vue';
import WorkForm from './components/WorkForm.vue';
import FileInfo from './components/FileInfo.vue';
import CustomerFileInfo from './components/CustomerFileInfo.vue';
import TrademarkInfo from '../../components/TrademarkInfo.vue';
import TabsInfo from '../../components/TabsInfo.vue';
import { message } from 'ant-design-vue';

const showLoadding = ref(false);
const activeKey = ref('trademarkInfo');
const detailsInfo: any = ref({});
const data: any = reactive({
  editFlag: false, //修改资料
  operationLog: [], //操作记录
});

onMounted(() => {
  getOaWorkorderDetailAPI();
});

//获取详情
const getOaWorkorderDetailAPI = () => {
  showLoadding.value = true;
  getTrademarkDetailInfo({
    serviceId: router.currentRoute.value.query.serviceId,
  })
    .then((res: any) => {
      detailsInfo.value = res || {};
      const serviceInfoVO = detailsInfo.value.trademarkOrderServiceInfoVO || {};
      getBusinessLogListByNoFun(serviceInfoVO.serviceNo);
      if (serviceInfoVO.status === 11) {
        message.warning('此服务在取消中，暂时不能操作');
      } else if (serviceInfoVO.status === 9) {
        message.warning('该服务已取消');
      }
      if (serviceInfoVO.nodeCode === 'NODE0033') {
        activeKey.value = 'submittals';
      }
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

//修改资料
const editMeans = () => {
  data.editFlag = true;
  activeKey.value = 'submittals';
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
