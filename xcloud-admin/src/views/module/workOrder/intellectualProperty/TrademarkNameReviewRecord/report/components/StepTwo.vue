<template>
  <div class="steps-two-page">
    <a-spin :spinning="false">
      <a-row class="panel-hd" justify="space-between">
        <h3>近似商标检索</h3>
        <a-row class="btn-group">
          <a-button
            type="primary"
            v-if="isAddSecond && !data.isViewReport && !data.isFirst"
            @click="isAddSecond = false"
            >新增审核意见</a-button
          >
          <a-button type="primary" @click="handlePrev">上一步</a-button>
          <a-button type="primary" @click="handleNext">下一步</a-button>
        </a-row>
      </a-row>
      <div class="slider" v-if="data.isFirst"></div>
      <div class="panel-bd">
        <!-- <a-button type="primary" @click="editBrandSimilarShow = true">修改近似商标</a-button> -->
        <AddBranSimilar
          v-if="data?.reportInfo?.trademarkSearchRecord.recordStatus === 'WAIT_CHECK'"
          ref="addBrandRef"
        />
        <RecheckBrandSimilar v-else ref="recheckSimilarRef" />
        <ModalEditBrandSimilar
          v-if="editBrandSimilarShow"
          @close="editBrandSimilarShow = false"
        ></ModalEditBrandSimilar>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, reactive, provide, onMounted, watch, h, computed } from 'vue';
import AddBranSimilar from './AddBrandSimilar.vue';
import RecheckBrandSimilar from './RecheckBrandSimilar.vue';
import ModalEditBrandSimilar from './ModalEditBrandSimilar.vue';
import { message, Modal } from 'ant-design-vue';

const props = defineProps({
  isUs: {
    type: Boolean,
    default: false,
  },
});
const noUsInfo = reactive<any>({
  curType: '', // 当前类别
  comData: [], // 同类近似商标截图 每个类型下都可以上传图片
  allData: [], // 全类近似商标截图 每个类型下都可以上传图片
});
const hasEmptyImgsCom = computed(() => {
  if (!noUsInfo.comData.length) {
    return true;
  } else {
    const noEmpty = noUsInfo.comData.every((item: any) => item.data.length);
    return !noEmpty;
  }
});
const hasEmptyImgsAll = computed(() => {
  if (!noUsInfo.allData.length) {
    return true;
  } else {
    return false;
  }
});
const hasEmptyImgs = computed(() => {
  return hasEmptyImgsCom.value || hasEmptyImgsAll.value;
});
provide('noUsInfo', noUsInfo);
const editBrandSimilarShow = ref(false);
const data = reactive({
  nowStep: inject('nowStep') as number,
  notifyUpdate: inject('notifyUpdate') as number,
  reportInfo: inject('reportInfo') as any,
  isViewReport: inject('isViewReport'),
  isFirst: inject('isFirst'),
  isUs: inject('isUS') as boolean,
  isPrevClick: inject('isPrevClick') as boolean,
});
const pageLoading = ref(false);
provide('pageLoading', pageLoading);
const isAddSecond = ref(true);
provide('isAddSecond', isAddSecond);
const notifyDelSecond = ref(0);
provide('notifyDelSecond', notifyDelSecond);
const handlePrev = async () => {
  if (pageLoading.value) {
    return message.warn('数据加载中请稍后在试');
  }
  if (!isAddSecond.value) {
    if (recheckSimilarRef?.value?.addBrandRef.formData) {
      await recheckSimilarRef?.value?.addBrandRef.save();
    } else {
      await addBrandRef?.value?.save();
    }
  }
  data.isPrevClick = true;
  data.notifyUpdate++;
  data.nowStep = data.nowStep - 1;
};
const allTrademarks = ref<any>([]);
provide('allTrademarks', allTrademarks);
const addBrandRef = ref<any>({});
const recheckSimilarRef = ref<any>({});
const nextClick = ref(false);
provide('nextClick', nextClick);
const handleNext = async () => {
  if (pageLoading.value) {
    return message.warn('数据加载中请稍后在试');
  }
  nextClick.value = true;
  data.isPrevClick = false;
  if (!data.isViewReport) {
    const isRecheck = ['WAIT_RECHECK', 'CONFIRM_WAIT_AUDIT'].includes(
      data.reportInfo.trademarkSearchRecord.recordStatus
    );
    let likeCheckResult = '';
    let comData = [];
    if (!isRecheck) {
      likeCheckResult = addBrandRef.value.formData.likeCheckResult;
    } else {
      if (!isAddSecond.value) {
        likeCheckResult = recheckSimilarRef?.value?.addBrandRef?.formData?.likeCheckResult;
        comData = recheckSimilarRef?.value?.addBrandRef?.noUsInfo?.comData;
      }
    }
    if (isRecheck) {
      if (!isAddSecond.value) {
        if (likeCheckResult === '') {
          return message.error('近似商标检索结果不能为空');
        } else if (hasEmptyImgs.value && !data.isUs) {
          Modal.confirm({
            title: '提示',
            content: h('div', {}, [h('p', '您还有同类近似商标检索未上传截图，'), h('p', '是否继续提交？')]),
            cancelText: '取消',
            okText: '确定',
            closable: true,
            onOk() {
              data.nowStep = data.nowStep + 1;
              data.notifyUpdate++;
            },
          });
        } else {
          await recheckSimilarRef.value.addBrandRef.save();
          data.nowStep = data.nowStep + 1;
          data.notifyUpdate++;
        }
      } else {
        data.nowStep = data.nowStep + 1;
        data.notifyUpdate++;
      }
      //await recheckSimilarRef.value.addBrandRef.save();
    } else {
      if (likeCheckResult === '') {
        return message.error('近似商标检索结果不能为空');
      } else if (hasEmptyImgs.value && !data.isUs) {
        Modal.confirm({
          title: '提示',
          content: h('div', {}, [h('p', '您还有同类近似商标检索未上传截图，'), h('p', '是否继续提交？')]),
          cancelText: '取消',
          okText: '确定',
          closable: true,
          onOk: async () => {
            await addBrandRef.value.save();
            data.nowStep = data.nowStep + 1;
            data.notifyUpdate++;
          },
        });
      } else {
        await addBrandRef.value.save();
        data.nowStep = data.nowStep + 1;
        data.notifyUpdate++;
      }
    }
  } else {
    data.notifyUpdate++;
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
      if (curReport?.likeCheckResult || curReport?.likeCheckUrl) {
        isAddSecond.value = false;
      } else {
        isAddSecond.value = true;
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.steps-two-page {
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
}
</style>
