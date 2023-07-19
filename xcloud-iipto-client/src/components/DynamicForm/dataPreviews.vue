<template>
  <div class="data-previews">
    <div v-for="modules in moduleList" :key="modules.moduleId">
      <h2 class="module-name">
        <span v-if="showSubmit" @click="$emit('nextStep', 2)"><a-icon type="edit" /> 修改信息</span><b></b
        >{{ modules.moduleName }}
      </h2>
      <table class="data-preparation-list" v-if="$route.path == '/infoDetail' || $route.path == '/myBrand'">
        <tr v-for="list in modules.columns" :key="list.id">
          <td class="upload-files-label">{{ list.keyLabel }}</td>
          <td class="upload-files-item">
            <div v-if="list.keyName == 'trademarkCategory'" class="trademarkCategory-box">
              <table v-for="(item, index) in JSON.parse(list.keyNameValue)" :key="item.category1Num">
                <tr class="trademarkCategory-head">
                  <td width="110">大类{{ index + 1 }}</td>
                  <td :colspan="['DE', 'KR'].includes(countryCode) ? 4 : countryCode === 'CN' ? 2 : 3">
                    {{ item.category1Name }}
                  </td>
                </tr>
                <tr v-for="(sub, index) in item.listTrademarkCategory2" :key="sub.category2Num">
                  <td :rowspan="item.listTrademarkCategory2.length" v-if="index == 0">小类</td>
                  <td>{{ index + 1 }}</td>
                  <td v-if="sub.category2Name">{{ sub.category2Name }}</td>
                  <td v-if="countryCode !== 'CN'">{{ sub.category2NameEn }}</td>
                  <td v-if="['DE', 'KR'].includes(countryCode)">{{ sub.categoryNameMore }}</td>
                </tr>
              </table>
            </div>
            <div v-else-if="list.keyName == 'marketHref'">
              <div class="marketHref-category" v-for="(item, index) in JSON.parse(list.keyNameValue)" :key="index">
                {{ item.marketHref }}
                <p>{{ item.category2Name }}-{{ item.category2NameEn }}</p>
              </div>
            </div>
            <div v-else-if="list.keyName == 'useProductImg'">
              <div class="marketHref-category" v-for="(item, index) in useProductImgList" :key="index">
                <!-- <viewer :images="item.fileList" style="width: 200px;">
                  <img v-for="(src, index) in item.fileList" :src="src" :key="index" class="module-img" />
                </viewer> -->
                <viewer :images="item.fileList" style="width: 200px;">
                  <template v-for="(src, index) in item.fileList">
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
                <p>{{ item.category2Name }}-{{ item.category2NameEn }}</p>
              </div>
            </div>
            <div v-else-if="list.keyName == 'useEvidence'">
              <div class="marketHref-category" v-for="(item, index) in useEvidenceList" :key="index">
                <!-- <viewer :images="item.fileList" style="width: 200px;">
                  <img v-for="(src, index) in item.fileList" :src="src" :key="index" class="module-img" />
                </viewer> -->
                <viewer :images="item.fileList" style="width: 200px;">
                  <template v-for="(src, index) in item.fileList">
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
                <p>{{ item.category2Name }}-{{ item.category2NameEn }}</p>
              </div>
            </div>
            <div v-else-if="['firstUseDate', 'firstBusinessUseDate'].includes(list.keyName)">
              {{ list.keyNameValue.split(' ')[0] }}
            </div>
            <div v-else-if="list.inputType == 4 || list.keyName == 'companyLegalPersonSign'">
              <viewer v-if="Array.isArray(list.keyNameValue)" :images="list.keyNameValue" style="width: 200px;">
                <template v-for="(src, index) in list.keyNameValue">
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
              <viewer
                v-else-if="list.keyNameValue && JSON.stringify(list.keyNameValue) !== '{}'"
                :images="[list.keyNameValue]"
                style="width: 200px;"
              >
                <template v-for="(src, index) in [list.keyNameValue]">
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
            <div v-else-if="list.inputType == 2">{{ getValue2(list) }}</div>
            <div v-else-if="list.inputType == 1 || list.inputType == 6 || list.inputType == 8">
              {{ list.keyNameValue }}
            </div>
            <div v-else-if="list.inputType == 5">
              {{ getCountryNameZh(list.keyNameValue) }}
            </div>
            <div v-else>{{ list.keyLabel }}</div>
          </td>
        </tr>
      </table>

      <table class="data-preparation-list" v-else>
        <tr v-for="list in modules.columns" :key="list.id">
          <td class="upload-files-label">{{ list.keyLabel }}</td>
          <td class="upload-files-item">
            <div v-if="list.keyName == 'modelingFile'">
              <a v-for="(src, index) in list.reView" :href="src" :key="index" target="_blank">查看文件</a>
            </div>
            <div v-else-if="list.keyName == 'drawingFile'">
              <a v-for="(src, index) in list.reView" :href="src" :key="index" target="_blank">查看文件</a>
            </div>
            <div v-else-if="list.reViewValue">{{ list.reViewValue }}</div>
            <div v-else-if="list.inputType == 1 || list.inputType == 6 || list.inputType == 8">
              {{ list.reView }}
            </div>
            <div v-else-if="list.inputType == 4">
              <viewer v-if="Array.isArray(list.reView)" :images="list.reView" style="width: 200px;">
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
              <viewer v-else-if="list.reView" :images="[list.reView]" style="width: 200px;">
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
            <div v-else>{{ list.keyLabel }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { getCacheCountryListApi } from '@/api/country';
import { getPatentDetail } from '@/api/myPatent';
import { workorderDetailAPI } from '@/api/trademarkRegister/myBread';
import { cloneDeep, uniqBy } from 'lodash';
export default {
  props: {
    workOrderId: {
      typeof: String,
    },
    //tabs选中的值
    tabsCurrent: {
      typeof: String,
    },
    // 是否支持提交
    showSubmit: {
      type: Boolean,
      default: true,
    },
    servicesId: {
      typeof: String,
    },
    cureentNodeCode: {
      typeof: String,
    },
    countryCode: String,
  },
  data() {
    return {
      moduleList: [],
      allCountryList: [],
      serviceId: this.$route.params.id,
      subCategoryList: [],
      useProductImgList: [],
      useEvidenceList: [],
      serviceInfo: {},
    };
  },
  created() {
    // 商标
    if (['/myBrand', '/infoDetail'].includes(this.$route.path)) {
      let data = {
        serviceId: this.$route.query.id || this.servicesId,
        nodeCode: this.$route.query.nodeCode || this.cureentNodeCode,
      };
      this.checkTwoClassifyList = [];
      workorderDetailAPI(data)
        .then((res) => {
          if (res.code == 0) {
            this.serviceInfo = res.data.trademarkOrderServiceInfoVO;
            if (res.data.workflowColumns.length) {
              this.moduleList = this.handleData(res.data.workflowColumns);
              this.handleImg(this.moduleList);
            }
          }
        })
        .finally(() => {});
    } else {
      //外观
      getPatentDetail(this.serviceId).then((res) => {
        this.serviceInfo = res.data.serviceInfo;
        let data = this.tabsCurrent == '2' ? res.data.firstReview : res.data.dataReview;
        this.moduleList = this.getControlData(data);
      });
    }
    //获取国家列表
    if (localStorage.allCountryList) {
      this.allCountryList = JSON.parse(localStorage.allCountryList);
    } else {
      getCacheCountryListApi().then((res) => {
        if (res.code === 0) {
          this.allCountryList = res.data;
          localStorage.allCountryList = JSON.stringify(res.data);
        }
      });
    }
  },
  mounted() {},
  methods: {
    //获取文件后缀
    fileModelUrlSuffix(url) {
      let urlArray = url.split('.');
      return urlArray[urlArray.length - 1];
    },
    //分类处理
    handleImg(moduleList) {
      this.subCategoryList = [];
      let useProductImgListSourse = [];
      let useEvidenceListSourse = [];
      moduleList.forEach((modules) => {
        modules.columns.forEach((list) => {
          if (list.keyName == 'trademarkCategory') {
            JSON.parse(list.keyNameValue).forEach((ele) => {
              this.subCategoryList.push(...ele.listTrademarkCategory2);
            });
            this.subCategoryList = uniqBy(this.subCategoryList, 'category2Num');
          }
          if (list.keyName == 'useProductImg') {
            useProductImgListSourse = list.keyNameValue || [];
          }
          if (list.keyName == 'useEvidence') {
            useEvidenceListSourse = list.keyNameValue || [];
          }
        });
      });
      this.useProductImgList = this.productPicturesHandle(useProductImgListSourse);
      this.useEvidenceList = this.productPicturesHandle(useEvidenceListSourse);
    },
    productPicturesHandle(Sourse) {
      let productPictures = [];
      let category2NumArr = [];
      let reg = /_|\r|\n|\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
      let sourseHD = Sourse;
      if (typeof Sourse == 'string') {
        sourseHD = JSON.parse(Sourse);
      }
      sourseHD.forEach((item) => {
        this.subCategoryList.forEach((sub) => {
          let itemFileName = item.fileName.replace(reg, '').slice(0, -4);
          if (itemFileName[itemFileName.length - 1] == ')') {
            itemFileName = itemFileName.slice(0, -3);
          }
          let subFileName = sub.category2NameEn.replace(reg, '');
          if (itemFileName == subFileName) {
            category2NumArr.push({
              category2Num: sub.category2Num,
              category2Name: sub.category2Name,
              category2NameEn: sub.category2NameEn,
            });
          }
        });
      });
      category2NumArr = uniqBy(category2NumArr, 'category2Num');
      category2NumArr.forEach((item) => {
        let fileArr = [];
        sourseHD.forEach((pic) => {
          let picFileName = pic.fileName.replace(reg, '').slice(0, -4);
          if (picFileName[picFileName.length - 1] == ')') {
            picFileName = picFileName.slice(0, -3);
          }
          let subFileName = item.category2NameEn.replace(reg, '');
          if (picFileName == subFileName) {
            fileArr.push(pic.fileUrl);
          }
        });
        productPictures.push({
          ...item,
          fileList: fileArr,
        });
      });
      return productPictures;
    },
    //联动数据处理
    handleData(workflowColumns) {
      let map = new Map();
      workflowColumns.forEach((md) => {
        md.columns.forEach((item) => {
          if (item.columnId) {
            map.set(item.columnId, item);
          }
        });
      });
      let workflowColumnsHandle = [];
      workflowColumns.forEach((md) => {
        let mdHandle = cloneDeep(md);
        mdHandle.columns = [];
        md.columns.forEach((item) => {
          if (item.inputType == 4 && item.keyNameValue) {
            console.log(typeof item.keyNameValue == 'string', item.keyNameValue);
            if (typeof item.keyNameValue == 'string') {
              try {
                item.keyNameValue = JSON.parse(item.keyNameValue);
              } catch (e) {
                item.keyNameValue = item.keyNameValue;
              }
            }
          }
          if (!item.columnPid) {
            mdHandle.columns.push(item);
          } else {
            const parentVal = map.get(item.columnPid).keyNameValue;
            if (item.columnOption.includes(parentVal)) {
              mdHandle.columns.push(item);
            }
          }
        });
        workflowColumnsHandle.push(mdHandle);
      });
      return workflowColumnsHandle;
    },
    //获取数据
    getValue2(list) {
      let currDate = JSON.parse(list.info).groups.filter((item) => item.value == list.keyNameValue);
      return currDate && currDate.length ? currDate[0].label : '';
    },
    //预览图片
    invoiceFileHandle(urls) {
      urls instanceof Array && urls.length && this.$viewerApi({ images: urls });
    },
    //获取国家中文
    getCountryNameZh(reView) {
      let item = this.allCountryList.filter((item) => reView == item.countryCode);
      if (item.length) {
        return item[0].countryNameZh;
      }
      {
        return '';
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
      if (item.keyName == 'modelingFile') {
        if (![1, 2].includes(this.serviceInfo.modelingDrawType)) {
          return false;
        }
      }
      if (item.keyName == 'drawingFile') {
        if (![1].includes(this.serviceInfo.modelingDrawType)) {
          return false;
        }
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
              if (item.columnOption == parent.reView) {
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
    padding: 0;
    > div {
      padding: 10px 32px;
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
.trademarkCategory-box {
  width: 100%;
  padding: 0 !important;
  .trademarkCategory-head {
    td {
      background: #fafafa;
    }
  }
}
.marketHref-category {
  p {
    margin: 5px 0 15px;
    border-radius: 2px 2px 2px 2px;
    background: rgba(58, 127, 255, 0.06);
    line-height: 24px;
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
