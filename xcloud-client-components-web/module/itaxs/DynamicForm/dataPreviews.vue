<template>
  <div class="data-previews">
    <div v-for="modules in moduleList" :key="modules.moduleId">
      <h2 class="module-name">
        <span v-if="showSubmit" @click="$emit('stepChange', modules.step)"><a-icon type="edit" /> 修改信息</span><b></b
        >{{ modules.moduleName }}
      </h2>
      <table class="data-preparation-list">
        <tr v-for="list in modules.columns" :key="list.id">
          <td class="upload-files-label">{{ list.keyLabel }}</td>
          <td class="upload-files-item">
            <div v-if="list.reViewValue">{{ list.reViewValue }}</div>
            <CompanyBusinessModeDescribe
              v-model="list.reView"
              :formItem="list"
              :isDetails="true"
              v-else-if="list.keyName == 'companyBusinessModeDescribe'"
            />
            <div v-else-if="list.inputType == 1 || list.inputType == 6 || list.inputType == 8">
              <b class="mr10">{{ list.reView }}</b
              >{{
                ['shopPredictSale', 'shopPredictNextSale', 'betrag', 'companyRegisteredCapital'].includes(list.keyName)
                  ? currencySign
                  : ''
              }}
              {{ ['companyRegisteredCapitalCny'].includes(list.keyName) ? '人民币' : '' }}
            </div>
            <div v-else-if="list.inputType == 9">
              {{ list.reView.join('-') }}
            </div>
            <div v-else-if="list.inputType == 4 || list.keyName === 'companyLegalPersonSign'">
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
import { taxCustUserVatNumber, countryListApi } from '../../../api/common/index';
import { workOrderCommonOperator } from './commonOperator.js';
import {
  companyInformation,
  legalPersonInformation,
  storeInformation,
} from '@comp/module/itaxs/DynamicForm/staticList.js';
import CompanyBusinessModeDescribe from '@comp/module/components/formCreate/CompanyBusinessModeDescribe'; //店铺业务范围
export default {
  props: {
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
  },
  components: {
    CompanyBusinessModeDescribe,
  },
  data() {
    return {
      moduleList: [],
      allCountryList: [],
      allCompanyList: [],
      //公司信息自动识别字段
      companyInformation,
      //法人信息自动识别字段
      legalPersonInformation,
      //店铺信息自动识别字段
      storeInformation,
      companyTypeVal: '',
      certificateTypeVal: '',
      shopSalePlatformNameVal: '',
      currencySign: '',
    };
  },
  created() {
    //获取详情
    if (this.$route.query.id) {
      workOrderCommonOperator('detail', this.$route.query.id).then((res) => {
        let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
        this.currencySign = res.data.currencySign;
        data.forEach((module) => {
          if (module.columns.length) {
            module.columns.forEach((item) => {
              if (item.keyName === 'companyType') {
                this.companyTypeVal = item.reView;
              } else if (item.keyName === 'certificateType') {
                this.certificateTypeVal = item.reView;
              } else if (item.keyName === 'shopSalePlatformName') {
                this.shopSalePlatformNameVal = item.reView;
              }
            });
          }
        });
        data.forEach((module, index) => {
          //税务信息和店铺信息是在同一个块
          if (module.moduleCode === 'taxInfo') {
            module.step = index + 1;
          } else {
            module.step = index + 2;
          }
          if (module.columns.length) {
            module.columns = module.columns.filter((item) => {
              let flag = true;
              if (!item.isNeed) {
                flag = false;
              }
              if (this.companyTypeVal === '1' && this.companyInformation.includes(item.keyName)) {
                flag = false;
              }
              if (this.certificateTypeVal === '1' && this.legalPersonInformation.includes(item.keyName)) {
                flag = false;
              }
              if (this.shopSalePlatformNameVal === '亚马逊' && this.storeInformation.includes(item.keyName)) {
                flag = false;
              }
              return flag;
            });
          }
        });
        this.moduleList = this.getControlData(data);
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
  mounted() {},
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
      item.infoJson = JSON.parse(item.info);
      if (item.infoJson.groups && item.infoJson.groups[0].value) {
        item.infoJson.groups.forEach((group) => {
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
    > div {
      word-wrap: break-word;
      word-break: break-all;
    }
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
.mr10 {
  margin-right: 5px;
  font-weight: normal;
}
</style>
