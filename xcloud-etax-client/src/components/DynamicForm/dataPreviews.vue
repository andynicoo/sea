<template>
  <div class="data-previews">
    <div v-for="modules in moduleList" :key="modules.moduleId">
      <h2 class="module-name">
        <span v-if="showSubmit" @click="$emit('nextStep', 2)"><a-icon type="edit" /> 修改信息</span><b></b
        >{{ modules.moduleName }}
      </h2>
      <table class="data-preparation-list">
        <tr v-for="list in modules.columns" :key="list.id">
          <td class="upload-files-label">{{ list.keyLabel }}</td>
          <td class="upload-files-item">
            <div v-if="list.reViewValue">{{ list.reViewValue }}</div>
            <WeeeProductDtos v-else-if="list.keyName == 'weeeInfos'" v-model="list.reView" :isDetails="true" :isRemark="list.isRemark" :workInfo="workInfo" :countryCode="workInfo.countryCode"  />
            <BatteryProductDtos v-else-if="list.keyName == 'batteryInfos'" v-model="list.reView" :isDetails="true" />
            <PackingProductDtos v-else-if="list.keyName == 'packageInfos'" v-model="list.reView" :isDetails="true" />
            <ProductItems v-else-if="list.keyName == 'productItems'" v-model="list.reView" :isDetails="true" />
            <TaxOtherEuTaxNumInfos
              v-else-if="list.keyName == 'otherEuTaxNumInfos'"
              v-model="list.reView"
              :isDetails="true"
            />
            <WeeeInfosFR v-else-if="list.keyName == 'weeeInfosFR'" v-model="list.reView" :isDetails="true" />
            <EPRBackProductItems
              v-else-if="list.keyName == 'eprBacktrackingProductDtos'"
              v-model="list.reView"
              :isDetails="true"
            />
            <EPRProductItems v-else-if="list.keyName == 'eprProductDtos'" v-model="list.reView" :isDetails="true" />
            <BatteryInfosES v-else-if="list.keyName == 'batteryInfosES'" v-model="list.reView" :isDetails="true" />
            <WeeeInfosES v-else-if="list.keyName == 'weeeInfosES'" v-model="list.reView" :isDetails="true" />
            <div v-else-if="list.inputType == 1 || list.inputType == 6 || list.inputType == 8">
              {{ list.reView }}
            </div>
            <div v-else-if="list.inputType == 4">
              <viewer v-if="Array.isArray(list.reView)" :images="list.reView" style="width: 200px">
                <template v-for="(src, index) in list.reView">
                  <img
                    :src="src"
                    :key="index"
                    class="module-img"
                    v-if="
                      src.includes('png') ||
                      src.includes('jpg') ||
                      src.includes('jpeg') ||
                      src.includes('bmp') ||
                      src.includes('PNG') ||
                      src.includes('JPG') ||
                      src.includes('JPEG') ||
                      src.includes('BMP')
                    "
                  />
                  <a :href="src" target="_blank" :key="index" v-else class="fileModel-other">
                    {{ fileModelUrlSuffix(src) }}
                  </a>
                </template>
              </viewer>
              <viewer v-else-if="list.reView && list.reView.length" :images="[list.reView]" style="width: 200px">
                <template v-for="(src, index) in [list.reView]">
                  <img
                    :src="src"
                    :key="index"
                    class="module-img"
                    v-if="
                      src.includes('png') ||
                      src.includes('jpg') ||
                      src.includes('jpeg') ||
                      src.includes('bmp') ||
                      src.includes('PNG') ||
                      src.includes('JPG') ||
                      src.includes('JPEG') ||
                      src.includes('BMP')
                    "
                  />
                  <a :href="src" target="_blank" :key="index" v-else class="fileModel-other">
                    {{ fileModelUrlSuffix(src) }}
                  </a>
                </template>
              </viewer>
            </div>
            <div v-else-if="list.inputType == 5">
              {{ getListName(list.reView, list.keyName) }}
            </div>
            <div v-else>{{ list.keyLabel }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { taxCustUserVatNumber } from '@/api/taxInspection';
import { countryListApi } from '@/api/shoppingCar/shoppingCar';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
import { getDetail, getDeclareDetail } from '@/api/taxRegister.js';
import { getEprRenewalDetailAPI } from './../../../xcloud-client-components-web/api/eprManage';

import WeeeProductDtos from '@/views/complianceBusiness/components/weeeProductDtos'; //WEEE产品信息
import BatteryProductDtos from '@/views/complianceBusiness/components/batteryProductDtos'; //电池法产品信息
import PackingProductDtos from '@/views/complianceBusiness/components/packingProductDtos'; //包装法申报信息
import ProductItems from '@/views/complianceBusiness/components/ProductItemsTable'; //产品信息
import TaxOtherEuTaxNumInfos from '@/components/WorkOrderComponents/numInfosCompnents'; //其他欧盟国家税号信息表
import WeeeInfosFR from '@/views/complianceBusiness/components/weeeInfosFR'; //法国WEEE
import EPRBackProductItems from '@/views/complianceBusiness/components/EPRBackProductItem'; //EPR回溯产品信息
import EPRProductItems from '@/views/complianceBusiness/components/EPRProductItems'; //EPR预申报产品信息
import BatteryInfosES from '@/views/complianceBusiness/components/batteryInfosES'; //电池法
import WeeeInfosES from '@/views/complianceBusiness/components/weeeInfosES'; //法国WEEE

export default {
  props: {
    workOrderId: {
      typeof: String,
    },
    //tabs选中的值
    tabsCurrent: {
      typeof: String | Number,
    },
    // 是否支持提交
    showSubmit: {
      type: Boolean,
      default: true,
    },
    moduleListEPR: Array,
    workInfo: Object,
  },
  components: {
    WeeeProductDtos,
    BatteryProductDtos,
    PackingProductDtos,
    ProductItems,
    TaxOtherEuTaxNumInfos,
    WeeeInfosFR,
    EPRBackProductItems,
    EPRProductItems,
    BatteryInfosES,
    WeeeInfosES,
  },
  data() {
    return {
      moduleList: [],
      allCountryList: [],
      allCompanyList: [],
    };
  },
  created() {
    //获取详情
    if (this.$route.query.id) {
      workOrderCommonOperator('detail', this.$route.query.id).then((res) => {
        let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
        this.moduleList = this.getControlData(data);
        console.log(this.moduleList, this.tabsCurrent, 'this.moduleList');
      });
    } else if (this.$route.query.workNo) {
      //德国WEEE注册+申报
      getDeclareDetail({ workNo: this.$route.query.workNo }).then((res) => {
        let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
        this.moduleList = this.getControlData(data);
        console.log(this.moduleList, this.tabsCurrent, 'this.moduleList');
      });
    } else if (this.$route.query.workOrderId) {
      this.moduleList = this.moduleListEPR
      // getEprRenewalDetailAPI(this.$route.query.workOrderId).then((res) => {
      //   let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
      //   this.moduleList = this.getControlData(data);
      //   console.log(this.moduleList, this.tabsCurrent, 'this.moduleList');
      // });
    } else if (this.$route.query.serviceId) {
      getDetail({ serviceId: this.$route.query.serviceId }).then((res) => {
        console.log(res);
        let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
        this.moduleList = this.getControlData(data);
        console.log(this.moduleList, this.tabsCurrent, 'this.moduleList');
      });
    }
    //获取国家列表
    if (localStorage.allCountryList) {
      this.allCountryList = JSON.parse(localStorage.allCountryList);
    } else {
      countryListApi().then((res) => {
        if (res.code === 0) {
          this.allCountryList = res.data;
          localStorage.allCountryList = JSON.stringify(res.data);
        }
      });
    }
    //获取公司列表
    if (localStorage.allCompanyList) {
      this.allCompanyList = JSON.parse(localStorage.allCompanyList);
    } else {
      if (this.$route.query.countryCode) {
        taxCustUserVatNumber({
          countryCode: this.$route.query.countryCode,
          userId: JSON.parse(localStorage.getItem('objInfo')).userId,
        }).then((res) => {
          this.allCompanyList = res.data;
        });
      }
    }
  },
  mounted() {
    console.log('dataPreviews this :>> ', this);
  },
  methods: {
    //获取文件后缀
    fileModelUrlSuffix(url) {
      let urlArray = url.split('.');
      return urlArray[urlArray.length - 1];
    },
    //获取国家名称
    getListName(reView, keyName) {
      if (keyName === 'companyNameZh') {
        let companyName = this.allCompanyList.filter((item) => reView == item.vatNumberServicesId);
        if (companyName.length) {
          return companyName[0].companyNameZh;
        } else {
          return reView;
        }
      } else if (keyName === 'companyNameEn') {
        let companyName = this.allCompanyList.filter((item) => reView == item.vatNumberServicesId);
        if (companyName.length) {
          return companyName[0].companyNameEn;
        } else {
          return reView;
        }
      } else {
        let countryName = this.allCountryList.filter((item) => reView == item.countryCode);
        if (countryName.length) {
          return countryName[0].countryNameZh;
        } else {
          return reView;
        }
      }
    },
    //处理数据
    getItemVal(item) {
      item.info = JSON.parse(item.info);
      if (item.info.groups && item.info.groups[0].value) {
        item.info.groups.forEach((group) => {
          if (group.value == item.reView) {
            this.$set(item, 'reViewValue', group.label);
          }
        });
      }
      return item;
    },
    getControlData(datalist) {
      let map = new Map();
      datalist.forEach((module) => {
        if (module.columns.length) {
          module.columns.forEach((item) => {
            if (item.columnId) {
              map.set(item.columnId, item);
            }
          });
        }
      });
      datalist.forEach((module) => {
        module.columns.sort((a, b) => {
          //字段排序
          return a.sort - b.sort;
        });
        if (module.columns.length) {
          module.columns = module.columns.filter((item) => {
            const parent = map.get(item.columnPid);
            if (parent) {
              if (item.columnOption.split(',').includes(parent.reView)) {
                return this.getItemVal(item);
              }
            } else {
              return this.getItemVal(item);
            }
          });
        }
      });
      console.log(datalist, 'datalist');
      return datalist;
    },
  },
};
</script>
<style scoped lang="less">
.data-previews {
  padding-bottom: 30px;
}
.information-tips {
  background: #fffbe6;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #ffe58f;
  padding: 7px 16px;
  font-size: 14px;
  color: #303132;
  margin-right: 6px;
  margin-top: 20px;
  img {
    vertical-align: top;
  }
}
.module-img {
  width: 64px;
  height: 64px;
  border: 1px solid #f0f0f0;
}
.module-name {
  font-size: 16px;
  color: #303132;
  margin-top: 48px;
  span {
    float: right;
    font-size: 14px;
    color: #3a7fff;
    cursor: pointer;
  }
  b {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: #3a7fff;
    margin-right: 8px;
    position: relative;
    top: 2px;
  }
}
.data-preparation-list {
  margin-top: 24px;
  width: 100%;
  td {
    border: 1px solid #f0f0f0;
    padding: 10px 32px;
  }
  .upload-files-label {
    background: #fafafa;
    width: 264px;
  }
  .upload-files-item {
    span {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      padding: 0 30px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      &:hover {
        color: #3a7fff;
        cursor: pointer;
      }
    }
    span:last-child {
      border: none;
    }
  }
}
.fileModel-other {
  width: 64px;
  height: 64px;
  background: #cb6565;
  display: inline-block;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 64px;
  margin-right: 5px;
}


</style>
