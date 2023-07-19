<template>
  <div class="recheck-page">
    <div class="slider" v-if="!data.isAddSecond"></div>
    <div v-show="!data.isAddSecond">
      <a-row class="title-wrap" justify="space-between">
        <h4>近似商标检索结果（{{ statusLabel }}）</h4>
        <a-button type="link" @click="handleDel" v-if="!data.isViewReport">删除复核结果</a-button>
      </a-row>
      <AddBrandSimilar ref="addBrandRef" :is-recheck="true"></AddBrandSimilar>
    </div>
    <template
      v-if="
        !isEmpty(data.reportInfo?.lastCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'CONFIRM_WAIT_AUDIT'
      "
    >
      <div class="slider"></div>
      <ViewBrandSimilar :detail="data.reportInfo.lastCheckReport" v-if="data.reportInfo.lastCheckReport?.likeCheckJson">
        <template #title> 近似商标检索结果（终核） </template>
      </ViewBrandSimilar>
    </template>
    <template
      v-if="
        !isEmpty(data.reportInfo?.reCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_RECHECK'
      "
    >
      <div class="slider"></div>
      <ViewBrandSimilar :detail="data.reportInfo.reCheckReport" v-if="data.reportInfo.reCheckReport?.likeCheckJson">
        <template #title> 近似商标检索结果（复核） </template>
      </ViewBrandSimilar>
    </template>
    <template
      v-if="
        !isEmpty(data.reportInfo?.firstCheckReport) &&
        data.reportInfo.trademarkSearchRecord.recordStatus !== 'WAIT_CHECK'
      "
    >
      <div class="slider"></div>
      <ViewBrandSimilar
        :detail="data.reportInfo.firstCheckReport"
        v-if="data.reportInfo.firstCheckReport?.likeCheckJson"
      >
        <template #title> 近似商标检索结果（初核） </template>
      </ViewBrandSimilar>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, computed } from 'vue';
import AddBrandSimilar from './AddBrandSimilar.vue';
import ViewBrandSimilar from './ViewBrandSimilar.vue';
import { isEmpty } from 'lodash-es';
import { message } from 'ant-design-vue';

const addBrandRef = ref<any>({});
const data = reactive({
  isAddSecond: inject('isAddSecond') as boolean,
  reportInfo: inject('reportInfo') as any,
  notifyDelSecond: inject('notifyDelSecond') as number,
  pageLoading: inject('pageLoading') as boolean,
  notifyUpdate: inject('notifyUpdate') as number,
  isViewReport: inject('isViewReport') as boolean,
});
const handleDel = async () => {
  if (data.pageLoading) {
    return message.warn('数据加载中请稍后在试');
  }
  data.notifyDelSecond++;
  data.isAddSecond = true;
  addBrandRef.value.formData.likeCheckResult = '';
  addBrandRef.value.formData.likeCheckJson = '';
  await addBrandRef.value.save();
  //data.notifyUpdate++;
};
const statusLabel = computed(() => {
  if (data?.reportInfo?.trademarkSearchRecord?.recordStatus === 'CONFIRM_WAIT_AUDIT') {
    return '终核';
  } else {
    return '复核';
  }
});
defineExpose({
  addBrandRef,
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
  .imgs-wrap {
    h6 {
      font-size: 16px;
    }
    .ant-row {
      margin: 10px 0 0;
      ::v-deep .ant-image {
        margin: 10px;
      }
    }
  }
}
</style>
