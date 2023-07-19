<template>
  <div class="recheck-page">
    <div class="slider" v-if="!data.isAdd"></div>
    <div v-if="!data.isAdd">
      <a-row class="title-wrap" justify="space-between">
        <h4>商标含义检索结果（{{ statusLabel }}）</h4>
        <a-button type="link" @click="handleDel">删除复核结果</a-button>
      </a-row>
      <AddBrandMean ref="branMeanRef" :is-recheck="true">
        <template #title> 商标含义检索结果 </template>
      </AddBrandMean>
    </div>
    <template
      v-if="
        !isEmpty(data.reportInfo?.lastCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'CONFIRM_WAIT_AUDIT'
      "
    >
      <div class="slider"></div>
      <ViewBrandMean
        :detail="data.reportInfo.lastCheckReport"
        v-if="data.reportInfo.lastCheckReport?.meaningCheckResult"
      >
        <template #title> 商标含义检索结果（终核） </template>
      </ViewBrandMean>
    </template>
    <template
      v-if="
        !isEmpty(data.reportInfo?.reCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_RECHECK'
      "
    >
      <div class="slider"></div>
      <ViewBrandMean :detail="data.reportInfo.reCheckReport" v-if="data.reportInfo.reCheckReport?.meaningCheckResult">
        <template #title> 商标含义检索结果（复核） </template>
      </ViewBrandMean>
    </template>
    <template
      v-if="
        !isEmpty(data.reportInfo?.firstCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_CHECK'
      "
    >
      <div class="slider"></div>
      <ViewBrandMean
        :detail="data.reportInfo.firstCheckReport"
        v-if="data.reportInfo.firstCheckReport?.meaningCheckResult"
      >
        <template #title> 商标含义检索结果（初核） </template>
      </ViewBrandMean>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { inject, reactive, computed, ref, watch, onMounted, nextTick } from 'vue';
import AddBrandMean from './AddBrandMean.vue';
import ViewBrandMean from './ViewBrandMean.vue';
import { isEmpty } from 'lodash-es';

const data = reactive({
  isAdd: inject('isAdd') as boolean,
  reportInfo: inject('reportInfo') as any,
  notifyDel: inject('notifyDel') as number,
  notifyUpdate: inject('notifyUpdate') as number,
  isViewReport: inject('isViewReport') as boolean,
  isFirst: inject('isFirst') as boolean,
});
const statusLabel = computed(() => {
  if (data?.reportInfo?.trademarkSearchRecord?.recordStatus === 'CONFIRM_WAIT_AUDIT') {
    return '终核';
  } else {
    return '复核';
  }
});
const handleDel = async () => {
  data.notifyDel++;
  data.isAdd = true;
  branMeanRef.value.formData.meaningCheckResult = '';
  branMeanRef.value.formData.imgs.splice(0);
  await branMeanRef.value.save();
  //data.notifyUpdate++;
};
const branMeanRef = ref<any>({});
defineExpose({
  branMeanRef,
});
</script>
<style lang="less" scoped>
.recheck-page {
  .title-wrap {
    padding: 10px 20px;
    border-bottom: 1px solid rgba(#000, 0.06);
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
  }
  .slider {
    height: 10px;
    background: #f0f2f5;
  }
}
</style>
