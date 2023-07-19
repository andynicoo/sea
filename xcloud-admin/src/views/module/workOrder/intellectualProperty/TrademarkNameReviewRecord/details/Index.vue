<template>
  <div class="page">
    <!-- 核名状态 -->
    <StatusInfo @handle="handleStatus" @update="updatePage" />
    <!-- 核名进度 -->
    <ComProgress />
    <!-- 核名商标 -->
    <VerifyBrand @edit="editBrandShow = true" />
    <!-- 核名报告 -->
    <VerifyReport />
    <!-- 备注 -->
    <Remark @edit="dealRemarkShow = true" ref="remarkRef" />
    <!-- 操作日志 -->
    <OperateLogs ref="logs" />
    <!-- 核名商标修改弹窗 -->
    <ModalEditBrand v-if="editBrandShow" @close="editBrandShow = false" @update="updatePage"></ModalEditBrand>
    <!-- 填写修改备注弹窗 -->
    <ModalDealRemark v-if="dealRemarkShow" @close="dealRemarkShow = false"></ModalDealRemark>
    <!-- 生成/查看报告链接 -->
    <MoDalReportLink v-if="reportLinkShow" @close="reportLinkShow = false" @update="updatePage"></MoDalReportLink>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, computed } from 'vue';
import { useRoute } from 'vue-router';
import { jumpPage } from '@/utils/utils';
import type { StatusBtnTypes } from './index';
import router from '@/router';
import StatusInfo from './components/StatusInfo.vue';
import ComProgress from './components/ComProgress.vue';
import VerifyBrand from './components/VerifyBrand.vue';
import VerifyReport from './components/VerifyReport.vue';
import Remark from './components/Remark.vue';
import OperateLogs from './components/OperateLogs.vue';
import ModalEditBrand from './components/ModalEditBrand.vue';
import ModalDealRemark from './components/ModalDealRemark.vue';
import MoDalReportLink from './components/MoDalReportLink.vue';
import useDetailFn from './useDetailHooks';
import { recheckTrademarkReport } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

interface TypeStatusFn {
  [key: string]: () => void;
}
const route = useRoute();
const id = ref(route.query.id);
provide('id', id.value);
const recordNo = ref(route.query.recordNo);
provide('recordNo', recordNo.value);
const { trademarkDetail, update, allReport } = useDetailFn(id.value as string);
provide('detail', trademarkDetail);
provide('allReport', allReport);
const remarkRef = ref<any>();
const updatePage = () => {
  update();
  logs.value.getData();
  remarkRef.value.getList();
};
const hasReportLink = computed(() => {
  if (allReport.value) {
    return allReport.value?.createLink !== '';
  } else {
    return false;
  }
});
provide('hasReportLink', hasReportLink);
const editBrandShow = ref(false);
const dealRemarkShow = ref(false);
const reportLinkShow = ref(false);
const canUsStep = computed(() => {
  if (trademarkDetail.value && allReport.value) {
    const recordStatus = trademarkDetail.value.recordStatus;
    const reportType = allReport.value.reportType;
    // 初核报告
    const case1 = recordStatus === 'WAIT_CHECK' && reportType === 'FIRST_CHECK';
    // 复核报告
    const case2 = recordStatus === 'WAIT_RECHECK' && reportType === 'RE_CHECK';
    // 终核报告
    const case3 = recordStatus === 'CONFIRM_WAIT_AUDIT' && reportType === 'LAST_CHECK';
    if (case1 || case2 || case3) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});
provide('canUsStep', canUsStep);
const handleStatusFn = reactive<TypeStatusFn>({
  1: () => console.log('预览报告'),
  2: () => {
    if (canUsStep.value) {
      jumpPage(
        `/workOrder/intellectualProperty/TrademarkNameReviewRecord/report?recordId=${id.value}&recordNo=${
          recordNo.value
        }&curStep=${allReport?.value?.curStep || 1}`
      );
    } else {
      jumpPage(
        `/workOrder/intellectualProperty/TrademarkNameReviewRecord/report?recordId=${id.value}&recordNo=${recordNo.value}`
      );
    }
  },
  3: () => (reportLinkShow.value = true),
  4: () => handleRechckReport(),
});
const logs = ref<any>({});
const handleRechckReport = async () => {
  await recheckTrademarkReport(id.value as string);
  message.success('操作成功');
  update();
  logs.value.getData();
};
const handleStatus = (e: StatusBtnTypes) => handleStatusFn[e]();
</script>

<style lang="less" scoped>
::v-deep .panel {
  &-hd {
    padding: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 18px;
    }
  }
  &-bd {
    padding: 20px 10px 0;
  }
}
</style>
