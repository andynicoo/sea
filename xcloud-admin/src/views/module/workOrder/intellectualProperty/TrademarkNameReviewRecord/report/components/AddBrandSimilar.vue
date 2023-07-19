<template>
  <!-- <div class="slider"></div> -->
  <div class="add-page">
    <a-row justify="space-between">
      <h5><slot name="title">近似商标检索结果</slot></h5>
      <a-button type="link" @click="save" v-if="!data.isViewReport">保存</a-button>
    </a-row>
    <a-textarea
      placeholder="请根据下方检索情况填写检索结果"
      :maxlength="1000"
      :showCount="true"
      :autoSize="{ minRows: 5 }"
      v-model:value="formData.likeCheckResult"
      :disabled="data.isViewReport"
      @change="handleChange"
    ></a-textarea>
    <UploadBrandSimilar key="imgs" ref="imgsRef" @updateSave="save"></UploadBrandSimilar>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, watch, nextTick, computed, provide } from 'vue';
import _ from 'lodash';
import UploadBrandSimilar from './UploadBrandSimilar.vue';
import { saveTrademarkRecordReport } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
  isRecheck: {
    default: false,
    type: Boolean,
  },
});
const formData = reactive<any>({
  // 近似商标检索结果
  likeCheckResult: '',
  // 近似商标检索json（美标机检）
  likeCheckJson: '',
});
const recordId = inject('recordId') as string;
const reportId = inject('reportId') as any;
const reportInfo = inject('reportInfo') as any;
const notifyDelSecond = inject('notifyDelSecond') as number;
const data = reactive({
  notifyDelSecond: inject('notifyDelSecond') as number,
  isAddSecond: inject('isAddSecond') as boolean,
  isFirst: inject('isFirst') as boolean,
  isUS: inject('isUS') as boolean,
  pageLoading: inject('pageLoading') as boolean,
  noUsInfo: inject('noUsInfo') as any,
  isViewReport: inject('isViewReport') as boolean,
  indexLoading: inject('indexLoading') as boolean,
  nextClick: inject('nextClick') as boolean,
  nowStep: inject('nowStep') as number,
});
watch(
  () => notifyDelSecond,
  v => {
    if (v) {
      formData.likeCheckResult = '';
      formData.likeCheckJson = '';
    }
    save();
  }
);
const imgsRef = ref<any>({});
watch(
  () => reportInfo.value,
  async () => {
    await nextTick();
    if (reportInfo.value) {
      const reportMap: any = {
        WAIT_CHECK: reportInfo.value.firstCheckReport,
        WAIT_RECHECK: reportInfo.value.reCheckReport,
        CONFIRM_WAIT_AUDIT: reportInfo.value.lastCheckReport,
      };
      const status = reportInfo.value.trademarkSearchRecord.recordStatus;
      const createType = reportInfo.value.trademarkSearchRecord.createType;
      const curReport = createType === 'WORK' ? reportMap['CONFIRM_WAIT_AUDIT'] : reportMap[status];
      const curReportInfo = curReport.likeCheckJson ? JSON.parse(curReport.likeCheckJson) : null;
      formData.likeCheckResult = curReport?.likeCheckResult;
      if (!data.isUS) {
        // imgsRef.value.formData?.imgs1.splice(0);
        // imgsRef.value.formData?.imgs2.splice(0);
        //imgsRef.value.formData.type = curReportInfo?.type || '';
      }
      if (curReport?.likeCheckJson) {
        if (data.isUS) {
          imgsRef.value.formData.likeCheckJson = curReportInfo.likeCheckJson;
        } else {
          //imgsRef.value.noUsInfo = curReportInfo.likeCheckJso;
          // if (curReportInfo.imgs1.length) {
          //   curReportInfo.imgs1.map((item: any) => {
          //     imgsRef.value.formData.imgs1.push({
          //       url: item,
          //     });
          //   });
          // }
          // if (curReportInfo.imgs2.length) {
          //   curReportInfo.imgs2.map((item: any) => {
          //     imgsRef.value.formData.imgs2.push({
          //       url: item,
          //     });
          //   });
          // }
        }
      }
    }
  },
  { deep: true, immediate: true }
);
const saveResult = () => {
  return new Promise((resolve, reject) => {
    if (formData.likeCheckResult === '') {
      reject();
      return message.error('近似商标检索结果不能为空');
    }
    resolve(save());
  });
};
const curReport = computed(() => {
  if (reportInfo.value) {
    const reportMap: any = {
      WAIT_CHECK: reportInfo.value.firstCheckReport,
      WAIT_RECHECK: reportInfo.value.reCheckReport,
      CONFIRM_WAIT_AUDIT: reportInfo.value.lastCheckReport,
    };
    const status = reportInfo.value.trademarkSearchRecord.recordStatus;
    const curReport = reportMap[status];
    return curReport;
  } else {
    return null;
  }
});
const mean = computed(() => {
  if (curReport.value.checkConclusion) {
    const data = JSON.parse(curReport.value.checkConclusion);
    if (data.mean) {
      return data.mean;
    } else {
      return '';
    }
  } else {
    return '';
  }
});
const checkConclusion = computed(() => {
  const data: any = { similar: formData.likeCheckResult, mean: mean.value };
  const temp: any = {};
  for (const k in data) {
    if (data[k] !== '') {
      temp[k] = data[k];
    }
  }
  if (Object.keys(temp).length) {
    return JSON.stringify(temp);
  } else {
    return '';
  }
});
const isUS = inject('isUS');
// const noUsInfo = reactive<any>({
//   curType: '', // 当前类别
//   comData: [], // 同类近似商标截图 每个类型下都可以上传图片
//   allData: [], // 全类近似商标截图
// });
// provide('noUsInfo', noUsInfo);
const save = async () => {
  await nextTick();
  if (!data.isUS) {
    const noUsInfoData = cloneDeep(data.noUsInfo);
    console.log('noUsInfoData', noUsInfoData);
    if (noUsInfoData?.allData?.length) {
      noUsInfoData.allData = noUsInfoData.allData.map((item: any) => {
        if (item.url) {
          return {
            url: item.url,
          };
        } else {
          return {
            url: item.response.data.fileUrl,
          };
        }
      });
    }
    if (noUsInfoData?.comData?.length) {
      noUsInfoData.comData = noUsInfoData.comData.map((item: any) => {
        if (item?.data?.length) {
          item.data = item.data.map((child: any) => {
            if (child.url) {
              return {
                url: child.url,
              };
            } else {
              return {
                url: child.response.data.fileUrl,
              };
            }
          });
        }
        return item;
      });
    }
    formData.likeCheckJson = !data.isAddSecond || data.isFirst ? JSON.stringify(noUsInfoData) : '';
  } else {
    if (data.pageLoading) {
      return message.warn('数据加载中请稍后在试...');
    }
    const likeCheckJson = imgsRef?.value?.formData?.likeCheckJson;
    formData.likeCheckJson = !data.isAddSecond || data.isFirst ? likeCheckJson : '';
  }
  const params = {
    checkConclusion: checkConclusion.value,
    likeCheckResult: formData.likeCheckResult,
    likeCheckJson: formData.likeCheckJson,
    recordId,
    type: 'save',
    curStep: 2,
    id: reportId.value,
  };
  data.indexLoading = true;
  await saveTrademarkRecordReport(params);
  data.indexLoading = false;
};
watch(
  () => data.nowStep,
  () => {
    if (+data.nowStep === 1) {
      data.nextClick = false;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
const handleChange = _.debounce(() => {
  if (!data.nextClick) {
    console.log('触发第二步的自动保存');
    save();
  }
}, 15000);
defineExpose({
  saveResult,
  formData,
  save,
});
</script>
<style lang="less" scoped>
.add-page {
  padding: 20px 20px 20px;
  h5 {
    font-size: 16px;
  }
  .ant-input-textarea {
    margin-bottom: 30px;
  }
}
</style>
