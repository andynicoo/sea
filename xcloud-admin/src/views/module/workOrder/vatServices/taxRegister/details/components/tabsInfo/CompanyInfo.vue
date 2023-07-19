<template>
  <div class="box-info">
    <div class="cell-wrap">
      <div class="cont-info">
        <ToTableInfo
          :columns="columns"
          :filterKeyStr="[
            'companyBusinessLicense',
            'licenseRegisteredLegalPersonLastname',
            'licenseRegisteredLegalPersonFirstname',
            'companyAddressZhProvince',
            'companyAddressZhCity',
            'licenseRegisteredCompanyAddressZhDistrict',
            'companyAddressZh',
            'companyAddressEnProvince',
            'companyRegisteredCityEn',
            'licenseRegisteredCompanyAddressEnDistrict',
            'licenseRegisteredCompanyEnAddress',
          ]"
        />
        <slot name="optDiv"></slot>
      </div>
      <div class="img-show">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="营业执照" v-if="businessLicenseList().length > 0">
            <div class="img-wrap">
              <div class="img-li" v-for="(item, index) of businessLicenseList()" :key="index" v-viewer>
                <embed :src="item" width="100%" height="800px" v-if="item.indexOf('.pdf') !== -1" />
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
  const list = dataReview.find((v: { moduleCode: string }) => v.moduleCode === 'companyInfo');
  if (list) {
    const columns = JSON.parse(JSON.stringify(list.columns)) || [];
    const obj1 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredLegalPersonLastname');
    const obj2 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredLegalPersonFirstname');
    if (obj1 && obj2) {
      columns.splice(
        columns.findIndex((v: { keyName: string }) => v.keyName === 'licenseRegisteredLegalPersonLastname'),
        0,
        {
          keyName: '',
          keyLabel: '法定代表人姓名（拼音）',
          value: obj2.value + ' ' + obj1.value,
        }
      );
    }
    const obj3 = columns.find((v: { keyName: string }) => v.keyName === 'companyAddressZhProvince');
    const obj4 = columns.find((v: { keyName: string }) => v.keyName === 'companyAddressZhCity');
    const obj5 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredCompanyAddressZhDistrict');
    const obj6 = columns.find((v: { keyName: string }) => v.keyName === 'companyAddressZh');
    if (obj3 && obj4 && obj5 && obj6) {
      columns.splice(
        columns.findIndex((v: { keyName: string }) => v.keyName === 'companyAddressZhProvince'),
        0,
        {
          keyName: '',
          keyLabel: '营业执照地址',
          value: obj3.value + ' ' + obj4.value + ' ' + obj5.value + ' ' + obj6.value,
        }
      );
    }
    const obj7 = columns.find((v: { keyName: string }) => v.keyName === 'companyAddressEnProvince');
    const obj8 = columns.find((v: { keyName: string }) => v.keyName === 'companyRegisteredCityEn');
    const obj9 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredCompanyAddressEnDistrict');
    const obj10 = columns.find((v: { keyName: string }) => v.keyName === 'licenseRegisteredCompanyEnAddress');
    if (obj7 && obj8 && obj9 && obj10) {
      columns.splice(
        columns.findIndex((v: { keyName: string }) => v.keyName === 'companyAddressEnProvince'),
        0,
        {
          keyName: '',
          keyLabel: '营业执照地址(拼音)',
          value: obj7.value + ' ' + obj8.value + ' ' + obj9.value + ' ' + obj10.value,
        }
      );
    }
    return columns;
  } else {
    return [];
  }
});

const businessLicenseList = () => {
  const obj = columns.value.find((v: { keyName: string }) => v.keyName === 'companyBusinessLicense');
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
