<template>
  <!-- <div class="slider"></div> -->
  <div class="add-page">
    <a-row justify="space-between">
      <h5><slot name="title">商标含义检索结果</slot></h5>
      <a-button type="link" @click="saveResult" v-if="!data.isViewReport">保存</a-button>
    </a-row>
    <a-textarea
      placeholder="请输入商标含义的检索结果"
      v-model:value="formData.meaningCheckResult"
      :maxlength="1000"
      :showCount="true"
      :autoSize="{ minRows: 5 }"
      :disabled="data.isViewReport"
      @change="handleChange"
    ></a-textarea>
    <a-row v-if="!isRecheck" class="tools-wrap" type="flex" align="middle">
      <h6>常用工具</h6>
      <div>
        <a v-for="(link, index) in links" :key="index" :href="link.url" target="_blank">{{ link.label }}</a>
      </div>
    </a-row>
    <div class="upload-wrap">
      <h5>商标含义截图上传</h5>
      <p>支持JPG、JPEG、BMP、PNG，最大不超过10M</p>
      <UploadImgPreview
        v-model="formData.imgs"
        accept="image/jpeg,image/png,image/jpg,image/bmp"
        :fileSize="10"
        :maxCount="10"
        @update="save"
        :isView="data.isViewReport"
      ></UploadImgPreview>
    </div>
  </div>
</template>
<script lang="ts" setup>
import _ from 'lodash';
import { ref, reactive, inject, watch, computed, onMounted } from 'vue';
import UploadImgPreview from '@/components/upload/UploadImgPreview.vue';
import { saveTrademarkRecordReport } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

const props = defineProps({
  isRecheck: {
    default: false,
    type: Boolean,
  },
});
const links = ref([
  {
    label: '谷歌翻译',
    url: 'https://translate.google.com.hk/',
  },
  {
    label: '谷歌搜索',
    url: 'https://www.google.com/search',
  },
  {
    label: '姓氏搜索',
    url: 'https://www.whitepages.com/',
  },
  {
    label: '谷歌地图',
    url: 'https://www.google.com/maps',
  },
  {
    label: '必应翻译',
    url: 'http://www.bing.com/translator?mkt=zh-CN',
  },
]);
const formData = reactive<any>({
  checkConclusion: '',
  meaningCheckResult: '',
  imgs: [],
});
const recordId = inject('recordId') as string;
const reportId = inject('reportId') as any;
const reportInfo = inject('reportInfo') as any;
const notifyDel = inject('notifyDel') as number;
const data = reactive({
  stepOneLoading: inject('stepOneLoading') as boolean,
  isViewReport: inject('isViewReport') as boolean,
  nowStep: inject('nowStep') as number,
  nextClick: inject('nextClick') as boolean,
});
onMounted(() => {
  data.stepOneLoading = false;
});
watch(
  () => notifyDel,
  v => {
    if (v) {
      console.log('notifyDel', notifyDel);
      formData.meaningCheckResult = '';
      formData.imgs.splice(0);
    }
    save();
  }
);
watch(
  () => reportInfo.value,
  () => {
    if (reportInfo.value) {
      const reportMap: any = {
        WAIT_CHECK: reportInfo.value.firstCheckReport,
        WAIT_RECHECK: reportInfo.value.reCheckReport,
        CONFIRM_WAIT_AUDIT: reportInfo.value.lastCheckReport,
      };
      const status = reportInfo.value.trademarkSearchRecord.recordStatus;
      const createType = reportInfo.value.trademarkSearchRecord.createType;
      const curReport = createType === 'WORK' ? reportMap['CONFIRM_WAIT_AUDIT'] : reportMap[status];
      formData.meaningCheckResult = curReport?.meaningCheckResult;
      formData.checkConclusion = curReport?.checkConclusion;
      formData.imgs.splice(0);
      if (curReport?.meaningCheckUrl) {
        const imgs = curReport.meaningCheckUrl.split(',');
        imgs.map((item: string) => {
          formData.imgs.push({
            url: item,
          });
        });
      }
    }
  },
  { deep: true, immediate: true }
);
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
const similar = computed(() => {
  if (curReport.value.checkConclusion) {
    const data = JSON.parse(curReport.value.checkConclusion);
    if (data.similar) {
      return data.similar;
    } else {
      return '';
    }
  } else {
    return '';
  }
});
const checkConclusion = computed(() => {
  const data: any = { mean: formData.meaningCheckResult, similar: similar.value };
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
watch(
  () => data.nowStep,
  () => {
    if (+data.nowStep === 0) {
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
    save();
  }
}, 15000);
const saveResult = () => {
  if (formData.meaningCheckResult === '') {
    return message.error('商标含义检索结果不能为空');
  }
  save();
};
const save = () => {
  const params = {
    checkConclusion: checkConclusion.value,
    meaningCheckResult: formData.meaningCheckResult,
    meaningCheckUrl: '',
    recordId,
    type: 'save',
    curStep: 1,
    id: reportId.value,
  };
  if (formData.imgs.length) {
    const tempImgs = formData.imgs.map((item: any) => {
      if (item.url) {
        return item.url;
      } else {
        return item.response.data.fileUrl;
      }
    });
    params.meaningCheckUrl = tempImgs.join(',');
  }
  return saveTrademarkRecordReport(params);
};
defineExpose({
  formData,
  save,
  checkConclusion,
});
</script>
<style lang="less" scoped>
.add-page {
  padding: 20px 20px 20px;
  h5 {
    font-size: 16px;
  }
  .ant-input-textarea {
    margin-bottom: 20px;
  }
  .tools-wrap {
    margin-bottom: 20px;
    h6 {
      margin-right: 20px;
    }
    a {
      display: inline-block;
      margin-right: 20px;
      padding: 2px 20px;
      font-size: 12px;
      background: #f5f5f5;
      border-radius: 20px;
    }
  }
  .upload-wrap {
    p {
      margin: 10px 0;
      color: #999;
    }
  }
}
</style>
