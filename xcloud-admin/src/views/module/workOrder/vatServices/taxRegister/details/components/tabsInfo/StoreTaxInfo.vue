<template>
  <div class="box-info">
    <div class="cell-wrap">
      <div class="cont-info">
        <ToTableInfo
          :columns="columns"
          :filterKeyStr="['shopConsoleScreenshot', 'storageAddressImg', 'vatTaxNumberFile', 'vatTaxEuFile']"
          :companyInfo="companyInfo"
        />
        <slot name="optDiv"></slot>
      </div>
      <div class="img-show">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="店铺信息截图" v-if="shopConsoleScreenshot().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of shopConsoleScreenshot()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="仓储地址截图" v-if="storageAddressImg().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of storageAddressImg()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="本土税号文件" v-if="vatTaxNumberFile().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of vatTaxNumberFile()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="欧盟税号文件" v-if="vatTaxEuFile().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of vatTaxEuFile()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <!-- <a-tab-pane key="3" tab="上一年的年报回执" v-if="receiptOfLastYearAnnualReturn().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of receiptOfLastYearAnnualReturn()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ToTableInfo from '../ToTableInfo.vue';

const props = defineProps({
  detailsInfo: {
    type: Object,
    default: () => null,
  },
});

const companyInfo: any = computed(() => {
  const dataReview = props.detailsInfo.dataReview || [];
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'companyInfo');
  let resObj: any = {};
  if (list) {
    const columns = JSON.parse(JSON.stringify(list.columns)) || [];
    const obj1 = columns.find((v: { keyName: string }) => v.keyName === 'companyNameZh');
    const obj2 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredCompanyNameEn');
    const obj3 = columns.find((v: { keyName: string }) => v.keyName === 'companyCreditCode');
    resObj = {
      companyNameZh: obj1 ? obj1.value : '',
      licenseRegisteredCompanyNameEn: obj2 ? obj2.value : '',
      companyCreditCode: obj3 ? obj3.value : '',
    };
  }
  return resObj;
});

const columns: any = computed(() => {
  const dataReview = props.detailsInfo.dataReview || [];
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'storeInfo');
  const list2 = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'taxInfo');
  if (list) {
    return list.columns.concat(list2.columns);
  } else {
    return [];
  }
});

const shopConsoleScreenshot = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'shopConsoleScreenshot');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const storageAddressImg = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'storageAddressImg');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const vatTaxNumberFile = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'vatTaxNumberFile');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const vatTaxEuFile = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'vatTaxEuFile');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const receiptOfLastYearAnnualReturn = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'receiptOfLastYearAnnualReturn');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const activeKey = ref('1');
</script>

<style scoped lang="less">
.box-info {
  .cell-wrap {
    display: flex;
    .cont-info {
      flex: 4;
    }
    .img-show {
      flex: 6;
      margin-left: 30px;
      .img-wrap {
        border-radius: 4px;
        .img-li {
          border: 1px solid #ddd;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
