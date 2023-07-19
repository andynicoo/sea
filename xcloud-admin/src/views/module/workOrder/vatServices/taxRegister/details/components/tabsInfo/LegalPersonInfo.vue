<template>
  <div class="box-info">
    <div class="cell-wrap">
      <div class="cont-info">
        <ToTableInfo
          :columns="columns"
          :filterKeyStr="[
            'companyLegalPersonSign',
            'identityCardFront',
            'identityCardReverse',
            'companyLegalPersonCardPassportShot',
            'legalrepresentativelastname',
            'legalrepresentativename',
            'personCardAddressProvinceZh',
            'personCardAddressCityZh',
            'personCardAddressDistrict',
            'personCardAddressZh',
            'personCardAddressProvinceEn',
            'personCardAddressCityEn',
            'personCardAddressDistrictEn',
            'personCardAddressEn',
          ]"
        />
        <div class="signature-wrap">
          <div class="title-text">法人签名</div>
          <div class="img" v-viewer>
            <img :src="companyLegalPersonSign()" />
          </div>
        </div>
        <slot name="optDiv"></slot>
      </div>
      <div class="img-show">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="身份证（人像面）" v-if="isIdCard">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of identityCardFront()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="身份证（国徽面）" v-if="isIdCard">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of identityCardReverse()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="法人护照" v-if="!isIdCard">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of companyLegalPersonCardPassportShot()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="900px" v-if="item.indexOf('.pdf') !== -1" />
                <img :src="item" v-else />
              </div>
            </div>
          </a-tab-pane>
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

const columns: any = computed(() => {
  const dataReview = props.detailsInfo.dataReview || [];
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'corporateInfo');
  if (list) {
    const columns = JSON.parse(JSON.stringify(list.columns)) || [];
    // const obj1 = columns.find((v: { keyName: string }) => v.keyName === 'legalrepresentativelastname');
    // const obj2 = columns.find((v: { keyName: string }) => v.keyName === 'legalrepresentativename');
    // if (obj1 && obj2) {
    //   columns.splice(
    //     columns.findIndex((v: { keyName: string }) => v.keyName === 'legalrepresentativelastname'),
    //     0,
    //     {
    //       keyName: '',
    //       keyLabel: '法人姓名（拼音）',
    //       value: obj1.value + ' ' + obj2.value,
    //     }
    //   );
    // }
    const obj3 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressProvinceZh');
    const obj4 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressCityZh');
    const obj5 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressDistrict');
    const obj6 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressZh');
    if (obj3 && obj4 && obj5 && obj6) {
      columns.splice(
        columns.findIndex((v: { keyName: string }) => v.keyName === 'personCardAddressProvinceZh'),
        0,
        {
          keyName: '',
          keyLabel: '身份证地址',
          value: obj3.value + ' ' + obj4.value + ' ' + obj5.value + ' ' + obj6.value,
        }
      );
    }
    const obj7 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressProvinceEn');
    const obj8 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressCityEn');
    const obj9 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressDistrictEn');
    const obj10 = columns.find((v: { keyName: string }) => v.keyName === 'personCardAddressEn');
    if (obj7 && obj8 && obj9 && obj10) {
      columns.splice(
        columns.findIndex((v: { keyName: string }) => v.keyName === 'personCardAddressProvinceEn'),
        0,
        {
          keyName: '',
          keyLabel: '身份证地址（拼音）',
          value: obj7.value + ' ' + obj8.value + ' ' + obj9.value + ' ' + obj10.value,
        }
      );
    }
    return columns;
  } else {
    return [];
  }
});

//是否身份证类型
const isIdCard: any = computed(() => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'certificateType');
  return obj && obj.reView === '1';
});

//法人签名
const companyLegalPersonSign = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'companyLegalPersonSign');
  return obj ? obj.value : '';
};

//身份证（人像面）
const identityCardFront = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'identityCardFront');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

//身份证（国徽面）
const identityCardReverse = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'identityCardReverse');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

//法人护照
const companyLegalPersonCardPassportShot = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'companyLegalPersonCardPassportShot');
  const val = obj ? obj.value : [];
  return typeof val === 'string' ? [val] : val;
};

const activeKey = ref(isIdCard.value ? '1' : '3');
</script>

<style scoped lang="less">
.box-info {
  .cell-wrap {
    display: flex;
    .cont-info {
      flex: 4;
      .signature-wrap {
        padding: 20px 0 0;
        .title-text {
          font-size: 14px;
          color: #000;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .img {
          width: 236px;
          border: 1px solid #eee;
          img {
            width: 100%;
          }
        }
      }
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
