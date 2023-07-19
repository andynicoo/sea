<template>
  <div class="upload-brand-page">
    <div class="box">
      <h5 v-if="!isUS">同类近似商标检索截图上传</h5>
      <a-form :model="formData">
        <h5 v-if="isUS">近似检索详情</h5>
        <a-form-item
          v-if="data.isUS"
          label="类别"
          name="type"
          :rules="[{ required: true, message: '类别不能为空', trigger: 'change' }]"
        >
          <a-select
            v-model:value="formData.type"
            style="width: 300px"
            :options="allCategoryList"
            :disabled="data.isViewReport"
            @change="handleChangeType"
          ></a-select>
        </a-form-item>
        <a-form-item
          v-else
          label="类别"
          name="type"
          :rules="[{ required: true, message: '类别不能为空', trigger: 'change' }]"
        >
          <a-select
            v-model:value="data.noUsInfo.curType"
            style="width: 300px"
            :options="allCategoryList"
            :disabled="data.isViewReport"
            @change="handleChangeType"
          ></a-select>
        </a-form-item>
        <TableBrand
          v-if="isUS"
          :title="tableData?.title || ''"
          :data="tableData.data"
          :loading="tableData.loading"
          @edit="handleEditBrandRecord"
          @refresh="refresh"
        ></TableBrand>
        <template v-else>
          <p class="tips">注：如有多个类别请逐一上传检索截图，支持JPG、JPEG、BMP、PNG，最大不超过2M</p>
          <template v-if="data.noUsInfo.comData.length">
            <div v-for="comp in data.noUsInfo.comData" :key="comp.type">
              <UploadImgPreview
                v-if="comp.type === data.noUsInfo.curType"
                :key="comp.type"
                v-model:modelValue="comp.data"
                :file-size="2"
                :max-count="10"
                :is-view="data.isViewReport"
                @update="emits('updateSave')"
              ></UploadImgPreview>
            </div>
          </template>
        </template>
      </a-form>
    </div>
    <div class="box" v-if="!isUS">
      <h5>全类近似商标检索截图上传</h5>
      <p class="tips">支持JPG、JPEG、BMP、PNG，最大不超过2M</p>
      <UploadImgPreview
        v-model:modelValue="data.noUsInfo.allData"
        :file-size="2"
        :max-count="10"
        :is-view="data.isViewReport"
        @update="emits('updateSave')"
      ></UploadImgPreview>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, nextTick, computed, onMounted, watch, provide } from 'vue';
import UploadImgPreview from '@/components/upload/UploadImgPreview.vue';
import TableBrand from './TableBrand.vue';
import { queryTrademarkName } from '@/api/workOrder/intellectualProperty/trademarkName';
import { message } from 'ant-design-vue';

interface Emits {
  (e: 'updateSave'): void;
}
const emits = defineEmits<Emits>();
const allCategoryList = inject('allCategoryList') as any;
const isUS = inject('isUS');
const reportInfo = inject('reportInfo') as any;
const nowStep = inject('nowStep') as number;
const data = reactive({
  nowStep: inject('nowStep') as number,
  isUS: inject('isUS'),
  pageLoading: inject('pageLoading'),
  isAddSecond: inject('isAddSecond') as boolean,
  allTrademarks: inject('allTrademarks') as any,
  noUsInfo: inject('noUsInfo') as any,
  isViewReport: inject('isViewReport') as any,
});
const trademarkName = computed(() => {
  if (reportInfo.value) {
    return reportInfo.value.trademarkSearchRecord.trademarkName;
  } else {
    return '';
  }
});
const categoryNum = computed(() => {
  if (reportInfo.value) {
    return reportInfo.value.categoryNum;
  } else {
    return null;
  }
});
const formData = reactive({
  type: '',
  imgs1: [],
  imgs2: [],
  likeCheckResult: '',
  likeCheckJson: '',
});
const comCategoryNum = computed(() => formData.type);
provide('comCategoryNum', comCategoryNum);
const tableData = reactive<any>({
  title: '',
  loading: false,
  data: {
    trademarkSearchCheckCategortyName: '',
    tbTrademarkCustomWordsList: [],
    trademarkSearchCheckResultList: [],
  },
});
const handleEditBrandRecord = (e: any) => {
  tableData.data.trademarkSearchCheckResultList = tableData.data.trademarkSearchCheckResultList.map((item: any) => {
    if (item.id === e.id) {
      item.similarTm = e.similarTm;
      item.remarkNumber = e.remarkNumber;
      item.ownerName = e.ownerName;
      item.categorySmall = e.categorySmall;
      item.similarTmStatus = e.similarTmStatus;
    }
    return item;
  });
  allDatas.value = allDatas.value.map((all: any) => {
    if (all.categoryNum === formData.type) {
      all.trademarkSearchCheckResultList.map((item: any) => {
        if (item.id === e.id) {
          item.similarTm = e.similarTm;
          item.remarkNumber = e.remarkNumber;
          item.ownerName = e.ownerName;
          item.categorySmall = e.categorySmall;
        }
        return item;
      });
    }
    return all;
  });
  const useJson = {
    type: formData.type,
    data: allDatas.value,
  };
  formData.likeCheckJson = JSON.stringify(useJson);
  emits('updateSave');
};
const noUsInfo = reactive<any>({
  curType: '', // 当前类别
  comData: [], // 同类近似商标截图 每个类型下都可以上传图片
  allData: [], // 全类近似商标截图
});
const getInitNoUsData = async () => {
  await nextTick();
  data.noUsInfo.curType = '';
  data.noUsInfo.comData.splice(0);
  data.noUsInfo.allData.splice(0);
  formData.type = categoryNum.value[0].toString();
  data.noUsInfo.curType = categoryNum.value[0].toString();
  categoryNum.value.forEach((item: any) => {
    data.noUsInfo.comData.push({
      type: item,
      data: [],
    });
  });
  if (curReport.value && curReport.value.likeCheckJson) {
    const dataTemp = JSON.parse(curReport.value.likeCheckJson);
    console.log('dataTemp', dataTemp);
    data.noUsInfo.curType = dataTemp?.curType || '';
    if (dataTemp?.comData) {
      data.noUsInfo.comData = dataTemp.comData.map((item: any) => {
        if (item.data?.length) {
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
    if (dataTemp?.allData) {
      dataTemp.allData.map((item: any) => {
        if (item.url) {
          data.noUsInfo.allData.push({
            url: item.url,
          });
        } else {
          data.noUsInfo.allData.push({
            url: item.response.data.fileUrl,
          });
        }
      });
    }
  }
};
const allDatas = ref<any>([]);
const isRefresh = ref(false);
watch(
  () => formData.type,
  () => {
    if (allDatas.value.length) {
      const curTrade = allDatas.value.filter((item: any) => item.categoryNum === formData.type)[0];
      tableData.title = (curTrade?.title as string) || '';
      tableData.data.tbTrademarkCustomWordsList = curTrade?.tbTrademarkCustomWordsList || [];
      tableData.data.trademarkSearchCheckResultList = curTrade?.trademarkSearchCheckResultList || [];
    }
  },
  { deep: true, immediate: true }
);
const getInitTableData = async () => {
  tableData.loading = true;
  allDatas.value.splice(0);
  formData.type = categoryNum.value[0].toString();
  const curCate = formData.type;
  const params = {
    catetoryNum: '',
    countryCode: 'US',
    trademarkName: trademarkName.value,
  };
  data.pageLoading = true;
  if (data.allTrademarks.length && !isRefresh.value) {
    tableData.loading = false;
    const curTrade = data.allTrademarks.filter((item: any) => item.categoryNum === curCate)[0];
    tableData.title = curTrade.title as string;
    tableData.data.tbTrademarkCustomWordsList = curTrade.tbTrademarkCustomWordsList;
    tableData.data.trademarkSearchCheckResultList = curTrade.trademarkSearchCheckResultList;
    allDatas.value = [...data.allTrademarks];
    data.pageLoading = false;
    formData.type = categoryNum.value[0].toString();
  } else {
    for (const cate of categoryNum.value) {
      try {
        params.catetoryNum = cate;
        const res = await queryTrademarkName(params);
        if (cate === curCate) {
          tableData.loading = false;
          tableData.title = res.trademarkSearchCheckCategortyName as string;
          tableData.data.tbTrademarkCustomWordsList = res.tbTrademarkCustomWordsList;
          tableData.data.trademarkSearchCheckResultList = res.trademarkSearchCheckResultList;
        }
        allDatas.value.push({
          title: res.trademarkSearchCheckCategortyName as string,
          categoryNum: cate,
          tbTrademarkCustomWordsList: res.tbTrademarkCustomWordsList,
          trademarkSearchCheckResultList: res.trademarkSearchCheckResultList,
        });
      } catch (error) {
        // 处理请求出错的情况
        console.error('请求出错:', error);
      }
    }
    message.success('数据加载完成');
    data.pageLoading = false;
    data.allTrademarks = [...allDatas.value];
  }
  const useJson = {
    type: formData.type,
    data: allDatas.value,
  };
  formData.likeCheckJson = JSON.stringify(useJson);
};
const refresh = async () => {
  isRefresh.value = true;
  await getInitTableData();
  isRefresh.value = false;
  emits('updateSave');
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
const handleData = async () => {
  const reportMap: any = {
    WAIT_CHECK: reportInfo.value.firstCheckReport,
    WAIT_RECHECK: reportInfo.value.reCheckReport,
    CONFIRM_WAIT_AUDIT: reportInfo.value.lastCheckReport,
  };
  const status = reportInfo.value.trademarkSearchRecord.recordStatus;
  const curReport = reportMap[status];
  formData.type = categoryNum?.value[0].toString();
  formData.likeCheckJson = curReport?.likeCheckJson;
  const curCate = formData.type;
  if (formData.likeCheckJson) {
    const datas = JSON.parse(formData.likeCheckJson).data;
    allDatas.value = datas;
    const curData = datas.filter((item: any) => item.categoryNum === curCate)[0];
    formData.type = JSON.parse(formData.likeCheckJson)?.type;
    tableData.title = curData.title;
    tableData.data.trademarkSearchCheckCategortyName = curData.trademarkSearchCheckCategortyName;
    tableData.data.tbTrademarkCustomWordsList = curData.tbTrademarkCustomWordsList;
    tableData.data.trademarkSearchCheckResultList = curData.trademarkSearchCheckResultList;
    return;
  } else {
    getInitTableData();
  }
};
watch(
  () => data.nowStep,
  () => {
    if (data.nowStep !== 1) {
      return;
    }
    if (data.isUS) {
      handleData();
    } else {
      getInitNoUsData();
    }
  },
  { immediate: true }
);
const handleChangeType = () => {
  if (!data.isUS) {
    emits('updateSave');
  } else {
    const curData = allDatas.value.filter((item: any) => item.categoryNum === formData.type)?.[0] || null;
    if (curData) {
      tableData.title = curData.title;
      tableData.data.trademarkSearchCheckCategortyName = curData.trademarkSearchCheckCategortyName;
      tableData.data.tbTrademarkCustomWordsList = curData.tbTrademarkCustomWordsList;
      tableData.data.trademarkSearchCheckResultList = curData.trademarkSearchCheckResultList;
    }
    const useJson = {
      type: formData.type,
      data: allDatas.value,
    };
    formData.likeCheckJson = JSON.stringify(useJson);
  }
};
defineExpose({
  formData,
  noUsInfo,
});
</script>
<style lang="less" scoped>
.upload-brand-page {
  h5 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  .tips {
    color: #999;
    margin-bottom: 6px;
  }
  .box {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(#000, 0.06);
  }
}
</style>
