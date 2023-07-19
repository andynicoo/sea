<template>
  <div class="steps-three-page">
    <a-row class="panel-hd" justify="space-between">
      <h3>近似商标检索</h3>
      <a-row class="btn-group">
        <a-button type="primary" v-if="isAddThird && !data.isViewReport && !data.isFirst" @click="isAddThird = false"
          >新增审核意见</a-button
        >
        <a-button type="primary" @click="handlePrev">上一步</a-button>
        <a-button v-if="!data.isViewReport" type="primary" @click="handleSubmit">提交</a-button>
      </a-row>
    </a-row>
    <div class="panel-bd">
      <template v-if="data.isViewReport && !isEmpty(curReport)">
        <div class="slider"></div>
        <a-row class="title-wrap" justify="space-between">
          <h4>核名结果（{{ statusLabel }}）</h4>
          <a-button
            type="link"
            @click="handleDel"
            v-if="data?.reportInfo?.trademarkSearchRecord?.recordStatus !== 'WAIT_CHECK' && !data.isViewReport"
            >删除核名结果</a-button
          >
        </a-row>
        <EditResult ref="editRef" :detail="curReport" :readonly="(data.isViewReport as boolean)"></EditResult>
      </template>
      <template v-if="!isAddThird && curReport && !data.isViewReport">
        <div class="slider"></div>
        <a-row class="title-wrap" justify="space-between">
          <h4>核名结果（{{ statusLabel }}）</h4>
          <a-button
            type="link"
            @click="handleDel"
            v-if="data?.reportInfo?.trademarkSearchRecord?.recordStatus !== 'WAIT_CHECK' && !data.isViewReport"
            >删除核名结果</a-button
          >
        </a-row>
        <EditResult ref="editRef" :detail="curReport" :readonly="(data.isViewReport as boolean)"></EditResult>
      </template>
      <template
        v-if="
          !isEmpty(data.reportInfo?.lastCheckReport) &&
          data.reportInfo.trademarkSearchRecord.createType !== 'WORK' &&
          data.reportInfo.trademarkSearchRecord.recordStatus !== 'CONFIRM_WAIT_AUDIT' &&
          data.reportInfo?.lastCheckReport?.checkConclusion
        "
      >
        <div class="slider"></div>
        <a-row class="title-wrap" justify="space-between">
          <h4>核名结果（终核）</h4>
          <a-button type="link" @click="hideLast = !hideLast">{{ !hideLast ? '收起' : '展开' }}</a-button>
        </a-row>
        <EditResult :readonly="true" :detail="data.reportInfo?.lastCheckReport" :hideVal="hideLast"></EditResult>
      </template>
      <template
        v-if="
          !isEmpty(data.reportInfo?.reCheckReport) &&
          data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_RECHECK' &&
          data.reportInfo?.reCheckReport?.checkConclusion
        "
      >
        <div class="slider"></div>
        <a-row class="title-wrap" justify="space-between">
          <h4>核名结果（复核）</h4>
          <a-button type="link" @click="hideRecheck = !hideRecheck">{{ !hideRecheck ? '收起' : '展开' }}</a-button>
        </a-row>
        <EditResult :readonly="true" :detail="data.reportInfo?.reCheckReport" :hideVal="hideRecheck"></EditResult>
      </template>
      <template
        v-if="
          !isEmpty(data.reportInfo?.firstCheckReport) &&
          data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_CHECK' &&
          data.reportInfo?.firstCheckReport?.checkConclusion
        "
      >
        <div class="slider"></div>
        <a-row class="title-wrap" justify="space-between">
          <h4>核名结果（初核）</h4>
          <a-button type="link" @click="hideFirst = !hideFirst">{{ !hideFirst ? '收起' : '展开' }}</a-button>
        </a-row>
        <EditResult :readonly="true" :detail="data.reportInfo?.firstCheckReport" :hideVal="hideFirst"></EditResult>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, reactive, provide, computed, watch } from 'vue';
import EditResult from './EditResult.vue';
import { saveTrademarkRecordReport } from '@/api/workOrder/intellectualProperty/trademark';
import router from '@/router';
import { message } from 'ant-design-vue';
import { isEmpty, delay } from 'lodash-es';
import { jumpPage } from '@/utils/utils';

const hideFirst = ref(false);
const hideRecheck = ref(false);
const hideLast = ref(false);
const data = reactive({
  nowStep: inject('nowStep') as number,
  notifyUpdate: inject('notifyUpdate') as number,
  reportInfo: inject('reportInfo') as any,
  recordId: inject('recordId') as string,
  reportId: inject('reportId') as any,
  isViewReport: inject('isViewReport'),
  isFirst: inject('isFirst'),
  recordNo: inject('recordNo') as string,
  indexLoading: inject('indexLoading') as boolean,
  isPrevClick: inject('isPrevClick') as boolean,
});
const statusLabel = computed(() => {
  if (data?.reportInfo?.trademarkSearchRecord.createType === 'WORK') {
    return '终核';
  }
  if (data?.reportInfo?.trademarkSearchRecord?.recordStatus === 'CONFIRM_WAIT_AUDIT') {
    return '终核';
  } else if (data?.reportInfo?.trademarkSearchRecord?.recordStatus === 'WAIT_RECHECK') {
    return '复核';
  } else if (data?.reportInfo?.trademarkSearchRecord?.recordStatus === 'WAIT_CHECK') {
    return '初核';
  } else {
    return '';
  }
});
const curReport = computed(() => {
  const reportMap: any = {
    WAIT_CHECK: data.reportInfo?.firstCheckReport,
    WAIT_RECHECK: data.reportInfo?.reCheckReport,
    CONFIRM_WAIT_AUDIT: data.reportInfo?.lastCheckReport,
  };
  const status = data.reportInfo?.trademarkSearchRecord.recordStatus;
  const createType = data.reportInfo?.trademarkSearchRecord.createType;
  const curReport = createType === 'WORK' ? reportMap['CONFIRM_WAIT_AUDIT'] : reportMap[status];
  return curReport;
});
const isAddThird = ref(false);
provide('isAddThird', isAddThird);
watch(
  () => data.reportInfo,
  () => {
    if (data.reportInfo) {
      const reportMap: any = {
        WAIT_CHECK: data.reportInfo.firstCheckReport,
        WAIT_RECHECK: data.reportInfo.reCheckReport,
        CONFIRM_WAIT_AUDIT: data.reportInfo.lastCheckReport,
      };
      const status = data.reportInfo.trademarkSearchRecord.recordStatus;
      const createType = data.reportInfo.trademarkSearchRecord.createType;
      const curReport = createType === 'WORK' ? reportMap['CONFIRM_WAIT_AUDIT'] : reportMap[status];
      if (curReport?.checkConclusion !== '' || data.reportInfo.trademarkSearchRecord.recordStatus === 'WAIT_CHECK') {
        isAddThird.value = false;
      } else {
        isAddThird.value = true;
      }
    }
  },
  { deep: true, immediate: true }
);
const editRef = ref<any>({});
// 删除核名结果
const handleDel = () => {
  if (curReport.value.checkConclusion) {
    return message.error('不可删除');
  }
  data.notifyUpdate++;
  isAddThird.value = true;
  editRef.value.save();
};
const handlePrev = async () => {
  if (editRef?.value?.save) {
    await editRef.value.save('save', false);
  }
  data.isPrevClick = true;
  data.notifyUpdate++;
  data.nowStep = data.nowStep - 1;
};
const notifySubmit = ref(0);
provide('notifySubmit', notifySubmit);
const nextClick = ref(false);
provide('nextClick', nextClick);
const handleSubmit = async () => {
  nextClick.value = true;
  data.isPrevClick = false;
  data.notifyUpdate++;
  if (!isAddThird.value) {
    try {
      console.log('触发提交');
      await editRef.value.submit('submit');
    } catch (error) {
      data.indexLoading = false;
    }
  } else {
    submitEmpty();
  }
};
const submitEmpty = () => {
  const params = {
    checkPassRate: '', // 通过率
    checkConclusion: '', // 检索结论
    checkResult: '', // 检索结果
    editSuggest: '', // 修改建议
    recordId: data.recordId,
    type: 'submit',
    curStep: 3,
    id: data.reportId,
  };
  saveTrademarkRecordReport(params).then(() => {
    delay(() => (data.indexLoading = false), 200);
    jumpPage(
      `/workOrder/intellectualProperty/TrademarkNameReviewRecord/details?id=${data.recordId}&recordNo=${data.recordNo}`
    );
  });
};
</script>
<style lang="less" scoped>
.steps-three-page {
  background: #fff;
  margin: 10px 0;
  .panel-hd {
    padding: 20px 10px;
    // border-bottom: 10px solid rgba(#000, 0.06);
    h3 {
      font-size: 18px;
      font-weight: bold;
    }
    .btn-group {
      button {
        margin-left: 10px;
      }
    }
  }
  .panel-bd {
    .slider {
      height: 10px;
      background: #f0f2f5;
    }
    .title-wrap {
      padding: 10px 20px;
      border-bottom: 1px solid rgba(#000, 0.06);
    }
    h4 {
      font-size: 16px;
      font-weight: bold;
    }
    .btn-group {
      button {
        margin-left: 10px;
      }
    }
  }
}
</style>
