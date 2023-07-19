<template>
  <div class="verify-report" v-if="detail">
    <a-row type="flex" justify="space-between" align="middle" class="panel-hd">
      <a-col class="title">核名报告</a-col>
      <a-col>
        <a-button
          type="link"
          v-if="showEditReportBtnSmall && useButton('trademarkDetail_report_edit')"
          @click="toReport"
          >编辑报告</a-button
        >
        <a-button
          type="link"
          v-else-if="
            ['GENERATE_LINK', 'SUBMITTED'].includes(allReport?.reportStatus) && useButton('trademarkDetail_report_view')
          "
          @click="toViewReport"
          >查看报告</a-button
        >
      </a-col>
    </a-row>
    <div class="panel-bd">
      {{ detail.reportStatus }}
      <a-button
        type="primary"
        @click="toReport"
        v-if="showEditReportBtn && useButton('trademarkDetail_report_edit_big')"
        >编辑核名报告</a-button
      >
      <div class="panel-bd-table" v-if="allReport?.checkResult">
        <a-row>
          <a-col :span="colspan1" class="center">检索结果</a-col>
          <a-col :span="colspan2">通过率：{{ allReport.checkPassRate }} / {{ allReport.checkResult }}</a-col>
        </a-row>
        <a-row v-if="allReport.checkConclusion">
          <a-col :span="colspan1" class="center">检索结果概述</a-col>
          <a-col :span="colspan2">
            <div class="result-text">
              <div class="result-text-item">
                <h6>商标含义部分：</h6>
                <a-textarea :value="allReport?.meaningCheckResult" disabled :autoSize="true"></a-textarea>
              </div>
              <div class="result-text-item">
                <h6>近似检索部分：</h6>
                <a-textarea :value="allReport?.likeCheckResult" disabled :autoSize="true"></a-textarea>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="colspan1" class="center">修改建议</a-col>
          <a-col :span="colspan2"
            ><a-textarea :value="allReport?.editSuggest" disabled :autoSize="true"></a-textarea
          ></a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, inject } from 'vue';
import { jumpPage, useButton } from '@/utils/utils';
import router from '@/router';

const colspan1 = ref(2);
const colspan2 = computed(() => {
  return 24 - colspan1.value;
});
const allReport = inject('allReport') as any;
const recordId = inject('id') as string;
const recordNo = inject('recordNo') as string;
const detail = inject('detail') as any;
const canUsStep = inject('canUsStep');
const data = reactive({
  canUsStep: inject('canUsStep'),
});
const showEditReportBtn = computed(() => {
  const case1 = detail.value.recordStatus === 'WAIT_CHECK';
  if (case1 && !allReport.value) {
    return true;
  } else if (
    case1 &&
    allReport &&
    ['WAIT_SUBMIT', 'WAIT_EDIT', 'SUBMITTED'].includes(allReport.value.reportStatus) &&
    !allReport.value.checkResult &&
    !allReport.value.lastLinkUrl
  ) {
    return true;
  } else {
    return false;
  }
});
const showEditReportBtnSmall = computed(() => {
  const case1 = detail.value.recordStatus === 'WAIT_CHECK';
  if (
    case1 &&
    allReport.value &&
    ['WAIT_SUBMIT', 'WAIT_EDIT', 'SUBMITTED'].includes(allReport.value.reportStatus) &&
    allReport.value.checkResult &&
    !allReport.value.lastLinkUrl
  ) {
    return true;
  } else {
    return false;
  }
});
const toReport = () => {
  if (data.canUsStep) {
    jumpPage(
      `/workOrder/intellectualProperty/TrademarkNameReviewRecord/report?recordId=${recordId}&recordNo=${recordNo}&curStep=${
        allReport?.value?.curStep || 1
      }`
    );
  } else {
    jumpPage(
      `/workOrder/intellectualProperty/TrademarkNameReviewRecord/report?recordId=${recordId}&recordNo=${recordNo}`
    );
  }
};
const toViewReport = () => {
  jumpPage(
    `/workOrder/intellectualProperty/TrademarkNameReviewRecord/report?recordId=${recordId}&recordNo=${recordNo}&viewReport=true`
  );
};
</script>
<style lang="less" scoped>
.verify-report {
  padding: 0 0 20px;
  background: #fff;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
  }
  .panel-bd-table {
    .center {
      justify-content: center;
      background: #fafafa;
    }
    .ant-col {
      display: flex;
      align-items: center;
      padding: 20px 10px;
      border: 1px solid #eee;
      margin-left: -1px;
      margin-bottom: -1px;
    }
  }
  .result-text {
    width: 100%;
    &-item {
      margin-bottom: 10px;
      h6 {
        font-size: 14px;
      }
      p {
        color: #999;
      }
    }
  }
  textarea:disabled {
    background: none;
    border: 0;
    color: #999;
  }
}
</style>
