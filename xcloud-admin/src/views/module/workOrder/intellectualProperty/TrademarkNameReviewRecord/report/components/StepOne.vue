<template>
  <div class="steps-one-page" v-if="data.reportInfo">
    <a-row class="panel-hd" justify="space-between">
      <h3>商标含义检索</h3>
      <a-row class="btn-group">
        <!-- ['WAIT_RECHECK', 'CONFIRM_WAIT_AUDIT '].includes(data.reportInfo.trademarkSearchRecord.recordStatus) -->
        <a-button type="primary" v-if="isAdd && !data.isViewReport && !data.isFirst" @click="isAdd = false"
          >新增审核意见</a-button
        >
        <a-button type="primary" @click="handleNext">下一步</a-button>
      </a-row>
    </a-row>
    <div class="slider" v-if="data.isFirst"></div>
    <div class="panel-bd">
      <AddBranMean v-if="data?.reportInfo?.trademarkSearchRecord.recordStatus === 'WAIT_CHECK'" ref="branMeanRef" />
      <RecheckBrandMean v-else ref="recheckRef" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, ref, reactive, provide, watch } from 'vue';
import { message } from 'ant-design-vue';
import AddBranMean from './AddBrandMean.vue';
import RecheckBrandMean from './RecheckBrandMean.vue';
import { nextTick } from 'vue';

const data = reactive({
  nowStep: inject('nowStep') as number,
  notifyUpdate: inject('notifyUpdate') as number,
  reportInfo: inject('reportInfo') as any,
  isViewReport: inject('isViewReport'),
  isFirst: inject('isFirst'),
  isPrevClick: inject('isPrevClick') as boolean,
});
const stepOneLoading = ref(true);
provide('stepOneLoading', stepOneLoading);
const branMeanRef = ref<any>({});
const recheckRef = ref<any>({});
const isAdd = ref(true);
provide('isAdd', isAdd);
const notifyDel = ref(0);
provide('notifyDel', notifyDel);
const nextClick = ref(false);
provide('nextClick', nextClick);
const handleNext = async () => {
  nextClick.value = true;
  data.isPrevClick = false;
  if (!data.isViewReport) {
    const isRecheck = ['WAIT_RECHECK', 'CONFIRM_WAIT_AUDIT'].includes(
      data.reportInfo.trademarkSearchRecord.recordStatus
    );
    let meaningCheckResult = '';
    if (!isRecheck) {
      meaningCheckResult = branMeanRef.value.formData.meaningCheckResult;
    } else {
      if (!isAdd.value) {
        meaningCheckResult = recheckRef.value.branMeanRef.formData.meaningCheckResult;
      }
    }
    if (isRecheck) {
      if (!isAdd.value && !meaningCheckResult) {
        return message.error('商标含义检索结果不能为空');
      }
      data.notifyUpdate++;
      if (!isAdd.value) {
        await recheckRef.value.branMeanRef.save();
      }
      notifyDel.value++;
      data.nowStep = data.nowStep + 1;
    } else {
      if (!meaningCheckResult) {
        return message.error('商标含义检索结果不能为空');
      }
      await branMeanRef.value.save();
      data.nowStep = data.nowStep + 1;
      data.notifyUpdate++;
    }
  } else {
    data.nowStep = data.nowStep + 1;
  }
};
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
      const curReport = reportMap[status];
      if (curReport?.meaningCheckResult || curReport?.meaningCheckUrl) {
        isAdd.value = false;
      } else {
        isAdd.value = true;
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.steps-one-page {
  background: #fff;
  margin: 10px 0;
  .panel-hd {
    padding: 20px 10px;
    // border-bottom: 1px solid rgba(#000, 0.06);
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
}
</style>
