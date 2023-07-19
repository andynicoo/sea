<template>
  <div class="view-page">
    <a-row class="panel-hd" justify="space-between">
      <h4><slot name="title">检索结果（初核）</slot></h4>
      <a-button type="link" @click="hide = !hide">{{ !hide ? '收起' : '展开' }}</a-button>
    </a-row>
    <div class="panel-bd">
      <div class="result-wrap">
        <h6>近似商标检索结果</h6>
        <div class="content">
          <a-textarea disabled :value="detail.likeCheckResult" :autoSize="true"></a-textarea>
        </div>
      </div>
      <div v-show="!hide">
        <div class="imgs-wrap" v-if="!isUS">
          <div class="imgs-wrap-item" v-if="curComData">
            <h6>同类近似商标检索截图上传</h6>
            <a-form-item style="width: 300px">
              <a-select :options="allCategoryList" v-model:value="noUsInfo.curType"></a-select>
            </a-form-item>
            <a-row>
              <a-image-preview-group>
                <a-image v-for="(img, index) in curComData" :key="index" height="150px" :src="img"></a-image>
              </a-image-preview-group>
            </a-row>
          </div>
          <div class="imgs-wrap-item" v-if="curAllData">
            <h6>全类近似商标检索截图上传</h6>
            <a-row>
              <a-image-preview-group>
                <a-image v-for="(img, index) in curAllData" :key="index" height="150px" :src="img"></a-image>
              </a-image-preview-group>
            </a-row>
          </div>
        </div>
        <div v-else class="us-wrap">
          <h6 style="margin-bottom: 10px">近似检索详情</h6>
          <a-form-item label="类别" style="width: 300px" :colon="false" :required="true">
            <a-select :options="allCategoryList" v-model:value="usInfo.type"></a-select>
          </a-form-item>
          <TableBrand
            :title="similarInfo.tableData.title"
            :data="similarInfo.tableData.data"
            :loading="false"
            :readonly="true"
          ></TableBrand>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, ref, reactive, watch } from 'vue';
import TableBrand from './TableBrand.vue';

interface Props {
  detail: any;
}
const props = defineProps<Props>();
const allCategoryList = inject('allCategoryList') as any;
const isUS = inject('isUS');
const data = reactive({
  isUS: inject('isUS') as boolean,
  isViewReport: inject('isViewReport') as boolean,
});
const noUsInfo = reactive<any>({
  curType: '', // 当前类别
  comData: [], // 同类近似商标截图 每个类型下都可以上传图片
  allData: [], // 全类近似商标截图
});
const curComData = computed(() => {
  if (noUsInfo.curType && noUsInfo.comData.length) {
    let imgs = noUsInfo.comData.filter((item: any) => item.type === noUsInfo.curType)[0].data;
    imgs = imgs.map((item: any) => {
      if (item.url) {
        return item.url;
      } else {
        return item.response.data.fileUrl;
      }
    });
    return imgs;
  } else {
    return null;
  }
});
const curAllData = computed(() => {
  if (noUsInfo.curType && noUsInfo.allData.length) {
    let imgs = noUsInfo.allData;
    imgs = imgs.map((item: any) => {
      if (item.url) {
        return item.url;
      } else {
        return item.response.data.fileUrl;
      }
    });
    return imgs;
  } else {
    return null;
  }
});
// 美标信息
const usInfo = reactive({
  type: '',
});
watch(
  () => props.detail,
  () => {
    if (props.detail.likeCheckJson) {
      const dataTemp: any = JSON.parse(props.detail.likeCheckJson);
      console.log('dataTemp', dataTemp);
      if (dataTemp.curType) {
        noUsInfo.curType = dataTemp.curType;
        noUsInfo.comData = dataTemp.comData;
        noUsInfo.allData = dataTemp.allData;
      }
      if (dataTemp.type) {
        usInfo.type = dataTemp.type;
      }
    }
  },
  { deep: true, immediate: true }
);

const similarInfo = computed<any>(() => {
  if (props.detail.likeCheckJson && data.isUS) {
    const info = JSON.parse(props.detail.likeCheckJson);
    const datas = info.data;
    const curCate = usInfo.type;
    const curData = datas.filter((item: any) => item.categoryNum === curCate)[0];
    const tableData = {
      title: '',
      data: {
        trademarkSearchCheckCategortyName: '',
        tbTrademarkCustomWordsList: [],
        trademarkSearchCheckResultList: [],
      },
    };
    tableData.title = curData?.title || '';
    tableData.data.trademarkSearchCheckCategortyName = curData?.trademarkSearchCheckCategortyName || '';
    tableData.data.tbTrademarkCustomWordsList = curData?.tbTrademarkCustomWordsList || [];
    tableData.data.trademarkSearchCheckResultList = curData?.trademarkSearchCheckResultList || [];
    if (!isUS) {
      return {
        type: info.type,
        imgs: info?.imgs1 || [],
      };
    } else {
      return {
        type: info.type,
        tableData,
      };
    }
  } else {
    return null;
  }
});
const similarAllimgs = computed(() => {
  if (props.detail.likeCheckJson) {
    const info = JSON.parse(props.detail.likeCheckJson);
    if (info?.img2?.length) {
      return info.img2;
    } else {
      return [];
    }
  } else {
    return [];
  }
});
const hide = ref(false);
</script>
<style lang="less" scoped>
.view-page {
  .panel-hd {
    padding: 10px 20px;
    border-bottom: 1px solid rgba(#000, 0.06);
    h4 {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .panel-bd {
    padding: 20px;
    h6 {
      font-size: 16px;
    }
  }
  .imgs-wrap {
    &-item {
      margin-bottom: 20px;
    }
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
