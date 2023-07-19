<template>
  <div class="report-page">
    <div class="view-box">
      <div class="steps-page">
        <a-steps progress-dot :current="nowStep">
          <a-step title="第一步：商标含义检索" />
          <a-step title="第二步：近似商标检索" />
          <a-step title="第三步：填写结果" />
        </a-steps>
      </div>
      <a-spin :spinning="indexLoading">
        <!-- 第一步：商标含义检索 -->
        <StepOne v-show="nowStep === 0"></StepOne>
        <!-- 第二步：近似商标检索 -->
        <StepTwo v-show="nowStep === 1"></StepTwo>
        <!-- 第三步：填写结果 -->
        <StepThree v-show="nowStep === 2"></StepThree>
      </a-spin>
    </div>
    <GuideText />
    <a-button type="primary" class="fixed-tips-btn" @click="showTips = !showTips"
      >{{ showTips ? '收起' : '展开' }}操作指引</a-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, provide, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import StepOne from './components/StepOne.vue';
import StepTwo from './components/StepTwo.vue';
import StepThree from './components/StepThree.vue';
import GuideText from './components/GuideText.vue';
import {
  saveTrademarkRecordReportInfo,
  addTrademarkRecordReport,
  getAllCategoryList,
} from '@/api/workOrder/intellectualProperty/trademark';

const route = useRoute();
const recordId = ref(route.query.recordId);
provide('recordId', route.query.recordId);
const recordNo = ref(route.query.recordNo);
provide('recordNo', recordNo.value);
const nowStep = ref(0);
onMounted(() => {
  if (route.query?.curStep) {
    const step = +route.query.curStep - 1;
    nowStep.value = step;
  }
});
provide('nowStep', nowStep);
const reportInfo = ref<any>(null);
const reportId = ref('');
const showTips = ref(false);
provide('showTips', showTips);
const notifyUpdate = ref(0);
provide('notifyUpdate', notifyUpdate);
watch(
  () => notifyUpdate.value,
  () => updateReportInfo()
);
const trademarkName = ref('');
// 点击的是上一步按钮
const isPrevClick = ref(false);
provide('isPrevClick', isPrevClick);
const indexLoading = ref(false);
provide('indexLoading', indexLoading);
const updateReportInfo = async () => {
  console.log('notifyUpdate.value out', notifyUpdate.value);
  if (!isPrevClick.value) {
    console.log('notifyUpdate.value', notifyUpdate.value);
    indexLoading.value = true;
  }
  try {
    reportInfo.value = await saveTrademarkRecordReportInfo(route.query.recordId as string);
    trademarkName.value = reportInfo.value.trademarkSearchRecord.trademarkName;
    _.delay(() => (indexLoading.value = false), 100);
  } catch (error) {
    indexLoading.value = false;
  }
};
provide('trademarkName', trademarkName);
const allCategoryList = ref<any>([]);
provide('allCategoryList', allCategoryList);
const isViewReport = computed(() => {
  if (route.query?.viewReport) {
    return true;
  } else {
    if (reportInfo.value) {
      return !['WAIT_CHECK', 'WAIT_RECHECK', 'CONFIRM_WAIT_AUDIT'].includes(
        reportInfo.value?.trademarkSearchRecord.recordStatus
      );
    } else {
      return false;
    }
  }
});
provide('isViewReport', isViewReport);
// 是否待初核（不显示新增审核意见按钮）
const isFirst = computed(() => {
  if (reportInfo.value) {
    return reportInfo.value.trademarkSearchRecord.recordStatus === 'WAIT_CHECK';
  } else {
    return false;
  }
});
provide('isFirst', isFirst);
const isUS = computed(() => {
  if (reportInfo.value) {
    return reportInfo.value.trademarkSearchRecord.country === 'US';
  } else {
    return false;
  }
});
provide('isUS', isUS);
onMounted(async () => {
  await updateReportInfo();
  getAllCategoryList().then(res => {
    if (res.length) {
      allCategoryList.value = res
        .filter((item: any) => reportInfo.value.categoryNum.includes(item.categoryNum))
        .map((item: any) => {
          return {
            label: `${+item.categoryNum > 9 ? item.categoryNum : '0' + item.categoryNum}类 ${item.categoryName}`,
            value: item.categoryNum,
          };
        });
    }
  });
  console.log('reportInfo.value?.trademarkSearchRecord.createType', reportInfo.value?.trademarkSearchRecord.createType);
  if (reportInfo.value?.trademarkSearchRecord.recordStatus === 'WAIT_CHECK') {
    if (reportInfo.value?.trademarkSearchRecord.createType === 'WORK') {
      if (reportInfo.value.lastCheckReport?.id) {
        return (reportId.value = reportInfo.value.lastCheckReport.id);
      }
    } else {
      if (reportInfo.value.firstCheckReport?.id) {
        return (reportId.value = reportInfo.value.firstCheckReport.id);
      }
    }
  } else if (reportInfo.value?.trademarkSearchRecord.recordStatus === 'WAIT_RECHECK') {
    if (reportInfo.value.reCheckReport?.id) {
      return (reportId.value = reportInfo.value.reCheckReport.id);
    }
  } else if (reportInfo.value?.trademarkSearchRecord.recordStatus === 'CONFIRM_WAIT_AUDIT') {
    if (reportInfo.value.lastCheckReport?.id) {
      return (reportId.value = reportInfo.value.lastCheckReport.id);
    }
  }
  const params = {
    recordId: recordId.value,
    type: 'save',
    curStep: nowStep.value + 1,
  };
  if (!isViewReport.value) {
    const res = await addTrademarkRecordReport(params);
    reportId.value = res;
  }
});
provide('reportInfo', reportInfo);
provide('reportId', reportId);
</script>
<style lang="less" scoped>
.report-page {
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  .view-box {
    flex: 1;
    overflow-y: auto;
  }
  .steps-page {
    padding: 20px 10px;
    background: #fff;
    font-size: 14px;
  }
  .fixed-tips-wrap {
    width: 0;
    overflow: auto;
    background: #fff;
    border-left: 20px solid #f0f2f5;
    transition: all 0.3s;
    .content {
      padding: 20px;
      width: 480px;
      box-sizing: border-box;
      .hold {
        cursor: pointer;
        margin-bottom: 20px;
        color: #40a9ff;
      }
      &-box {
        margin-bottom: 20px;
        h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
        li {
          margin-bottom: 6px;
          font-size: 16px;
          p {
            line-height: 28px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .fixed-tips-btn {
    position: fixed;
    right: 0;
    top: 54%;
    border-radius: 20px 0 0 20px;
  }
}
::v-deep .ant-steps-item-title {
  font-size: 14px;
}
::v-deep textarea:disabled {
  background: #eee;
  border: 0;
  color: #999;
}
::v-deep h5 {
  text-shadow: 0 0 0.25px currentcolor;
}
::v-deep h6 {
  text-shadow: 0 0 0.25px currentcolor;
}
::v-deep .result-wrap {
  .content {
    background: #eee;
    min-height: 100px;
    padding: 10px;
    margin: 10px 0 20px;
  }
}
::v-deep div.slider + div.slider {
  display: none;
}
::v-deep .slider {
  height: 10px;
  background: #f0f2f5;
}
::v-deep .result-text-item {
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
