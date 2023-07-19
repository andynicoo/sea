<template>
  <div>
    <el-card class="cardBox">
      <calssification
        :countryCode="rowInfo.countryCode"
        :isNeedEvidence="isNeedEvidence"
        :servicesStatus="servicesStatus"
        :categoryCount="trademarkCategoryCount"
        :calssifyList="calssifyList"
        :linkList="linkList"
        :usrProductImgList="usrProductImgList"
        :useEvidenceList="useEvidenceList"
        ref="classItem"
      ></calssification>
      <form-create :rule="moduleList" class="form-create" @submit="onSubmit" :option="option" v-model="fApi" />

      <div v-show="servicesStatus != 9">
        <el-button type="primary" :disabled="isCancel" @click="submitFuncDeb()">仅保存不提交</el-button>
        <el-button type="primary" :disabled="isCancel" @click="submitFuncDeb(true)" v-if="rowInfo.nodeCode == 'NODE0033'">确认并提交</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { trademarkDataHandle } from '@/libs/trademarkDataHandle.js';
import calssification from '../components/calssification';
import LegalSigned from '@/components/WorkOrderComponents/LegalSigned';
import * as API from '@/api/newApi/intellectualProperty/trademark';
import { Debounce } from '@/libs/throttle';
export default {
  components: {
    calssification,
    LegalSigned,
  },
  props: ['workflowColumns', 'trademarkCategoryCount', 'rowInfo', 'trademarkAapplicantColumns', 'servicesStatus', 'isCancel'],
  data() {
    return {
      fApi: {},
      option: {
        form: { labelWidth: '130px' },
        resetBtn: false,
        submitBtn: false,
        innerText: '取消',
        formData: {},
      },
      calssifyList: [],
      linkList: [],
      signatureUrl: '',
      usrProductImgList: [],
      useEvidenceList: [],
      isNeedEvidence: false,
      isInit: false,
    };
  },
  computed: {
    moduleList() {
      let index = this.workflowColumns.findIndex((item) => item.moduleCode == 'trademarkAapplicant');
      if (index) this.workflowColumns[index].columns = this.trademarkAapplicantColumns;
      return trademarkDataHandle(this.workflowColumns, this.servicesStatus);
    },
  },
  mounted() {
    this.initDataFunc();
  },
  methods: {
    onChange() {
      this.fapi.reload();
    },

    // 初始化商标使用证据信息和签名
    initDataFunc() {
      this.workflowColumns.map((item) => {
        if (item.moduleName == '商标分类') {
          if (item.columns[0].keyNameValue != '' && JSON.stringify(item.columns[0].keyNameValue) != '{}') {
            this.calssifyList = JSON.parse(item.columns[0].keyNameValue);
          }
        }

        if (item.moduleName == '商标使用证据') {
          item.columns.map((vv) => {
            if (vv.keyName == 'marketHref') {
              this.linkList = vv.keyNameValue;
            }

            this.isNeedEvidence = true;
            if (vv.keyNameValue != '' && JSON.stringify(vv.keyNameValue) != '{}') {
              if (vv.keyName == 'useEvidence') {
                this.useEvidenceList = JSON.parse(vv.keyNameValue);
              } else if (vv.keyName == 'useProductImg') {
                this.usrProductImgList = JSON.parse(vv.keyNameValue);
              }
            }
          });
        }
        if (item.moduleName == '商标申请人信息') {
          item.columns.map((vv) => {
            if (vv.keyName == 'companyLegalPersonSign' && JSON.stringify(vv.keyNameValue) != '{}') {
              this.signatureUrl = vv.keyNameValue;
            }
          });
        }
      });
      this.isInit = true;
      setTimeout(() => {
        this.getSubclassInfo();
      }, 500);
    },
    onSubmit(data, type) {
      this.fApi.submit((formData, fApi) => {
        this.formData = formData;
        if (formData.trademarkType === '0') {
          this.$message.error('请选择商标类型');
        } else {
          this.submitApiFunc(data, type);
        }
      });
    },
    submitFuncDeb: Debounce('submitFunc'),
    submitFunc(type) {
      this.formData = this.fApi.formData();
      let data = this.$refs.classItem.trademarkCategoryList;
      if (this.$refs.classItem.countryCode === 'JP') {
        const categoryArr = data;
        console.log('categoryArr', categoryArr);
        let arr = [];
        let all = [];
        let repeat = [];
        categoryArr.forEach((v) => {
          let subArr = [];
          let tempArr = [];
          tempArr = v.listTrademarkCategory2.filter((child) => child.isRepeat);
          if (tempArr.length) repeat.push([...tempArr]);
          v.listTrademarkCategory2.forEach((v) => {
            if (v.similarGroup) {
              console.log('v.similarGroup.indexOf(', ')', v.similarGroup.indexOf(','));
              if (v.similarGroup.indexOf(',') != -1) {
                const arr = v.similarGroup.split(',');
                arr.forEach((v) => subArr.push(v));
              } else {
                const arr = v.similarGroup.split(' ');
                arr.forEach((v) => subArr.push(v));
              }
            }
          });
          arr = [...new Set(subArr.filter((v) => v != ''))];
          all.push([...arr]);
          console.log('小类群组', subArr.length, [...new Set(subArr)].length, arr.length);
        });
        console.log('小类群组all', all);
        for (let i = 0; i < all.length; i++) {
          if (all[i].length > 22) {
            return this.$Message.error(`已选择类似群组${all[i].length}个，最多不能超过22个`);
          }
        }

        // let repeat = [];
        // let groups = [];
        // let all = [];
        // data.forEach((item) => {
        //   let tempArr = [];
        //   let tempArr2 = [];
        //   tempArr = item.listTrademarkCategory2.filter((child) => child.isRepeat);
        //   if (tempArr.length) repeat.push([...tempArr]);
        //   item.listTrademarkCategory2.forEach((child) => {
        //     if (child.similarGroup !== '') {
        //       let arr = child.similarGroup.split(' ').filter((v) => v);
        //       tempArr2.push(...arr);
        //     }
        //   });
        //   groups.push(...tempArr2);
        //   groups = [...new Set(groups)];
        //   all.push([...groups]);
        // });
        // console.log('all', all, groups);
        // for (let i = 0; i < all.length; i++) {
        //   if (all[i].length > 22) {
        //     return this.$Message.error(`已选择类似群组${all[i].length}个，最多不能超过22个`);
        //   }
        // }
        // if (groups.length > 22) {
        //   this.$Message.error(`已选择类群组${groups.length}个，最多不能超过22个`);
        //   return;
        // }
        if (repeat.length) {
          this.$Message.error('存在重复的日文小类，请保留一个');
          return;
        }
      }
      console.log('打塔', data);
      this.getSubclassInfo();
      if (type) {
        this.onSubmit(data, type);
      } else {
        console.log(11111111111111111111111111111111);
        this.submitApiFunc(data, type);
      }
    },
    /**
     * 如果上次用户选择了小类 初始重新获取小类
     */
    getSubclassInfo() {
      if (this.$refs.classItem.trademarkCategoryList.length > 0) {
        this.getSubclassData2();
      } else {
        const found = this.workflowColumns.find((element) => element.moduleCode == 'trademarkCategory');
        found && found.columns[0].keyNameValue && typeof found.columns[0].keyNameValue === 'string' && this.getSubclassData(found.columns[0].keyNameValue);
      }
    },

    /**
     * 重新获取小类数据
     */
    getSubclassData2() {
      this.$refs.classItem.trademarkCategoryList.forEach((item, index) => {
        item.searchtext && item.searchtext != '' && item.category1Num && item.category1Num != '' && this.$refs.classItem.searchSubclass(index);
      });
    },

    /**
     * 根据获取的小类重新获取数据
     */
    getSubclassData(found) {
      let data = JSON.parse(found);
      Array.isArray(data) &&
        data.forEach((item, index) => {
          if (item.category1Num != '' && item.searchtext != '') {
            this.$refs.classItem.searchSubclass(index);
          }
        });
    },

    /**
     * 查看  form-create 插件返回的图片是不是数组，不是的话转化为数组
     */
    setImgList() {
      let { companyBusinessLicense, identityCardFront, identityCardReverse, trademarkLogo } = this.formData;
      [companyBusinessLicense, identityCardFront, identityCardReverse, trademarkLogo].forEach((item) => {
        if (!Array.isArray(item) && item != undefined) this.formData[item] = [item];
      });
    },

    /**
     * 风险小类判断
     */
    riskCategoryJudgment() {
      let riskClassifyList = this.$refs.classItem.riskClassifyList;
      if (this.rowInfo.countryCode === 'US' && riskClassifyList.some((item) => item.keyword[0].trim() === '')) {
        this.$message.warning('请填写风险小类关键词');
        return false;
      } else {
        return this.$refs.classItem.trademarkCategoryList;
      }
    },

    /**
     * 过滤没选中的小类
     */
    filterResultData(data) {
      if (data) {
        data.map((item) => {
          item.resultData && delete item.resultData;
        });
      }
      return JSON.stringify(data);
    },
    /**
     * 普通小类判断
     */
    noRiskCategoryJudgment(data) {
      data.forEach((item, index) => {
        if (data[index].category1Name == ' ') {
          this.$Message.success('请选择商标分类');
          return false;
        } else {
          if (!this.$refs.classItem.existSubclass() && data[index].textareaubclass) {
            let textareaubclass = data[index].textareaubclass.split(';') || [];
            data[index].listTrademarkCategory2 = [];
            textareaubclass.forEach((element) => {
              let obj = {
                category2NameEn: element,
                category2Num: '000-00',
                parentCategoryNum: '',
              };

              data[index].listTrademarkCategory2.push(obj);
            });
          }
        }
      });
      return data;
    },

    /**
     * 判断风险小类 && 风险小类用户输入值判断
     */
    setTrademarkCategoryVal(data) {
      // debugger
      let riskClassifyList = this.$refs.classItem.riskClassifyList;
      // let data;
      if (this.rowInfo.countryCode == 'US' && riskClassifyList.length > 0) {
        data = this.riskCategoryJudgment();
      } else {
        data = this.noRiskCategoryJudgment(data);
      }
      return this.filterResultData(data);
    },

    /**
     *顾问单类型数据
     */
    setAdviserData(queryData) {
      let { useEvidenceList, usrProductImgList, marketHrefList } = this.$refs.classItem;

      if (this.rowInfo.countryCode == 'US' && (useEvidenceList.length > 0 || usrProductImgList.length > 0)) {
        queryData['useEvidence'] = JSON.stringify(useEvidenceList);
        queryData['useProductImg'] = JSON.stringify(usrProductImgList);
        queryData['marketHref'] = JSON.stringify(marketHrefList);
      }
    },

    submitApiFunc(data, type) {
      let queryData = { ...this.formData };

      this.setImgList();
      if (queryData.companyBusinessLicense) {
        queryData.companyBusinessLicense = this.formData.companyBusinessLicense.length > 0 ? JSON.stringify(this.formData.companyBusinessLicense) : '';
      }
      if (queryData.identityCardFront) {
        queryData.identityCardFront = this.formData.identityCardFront.length > 0 ? JSON.stringify(this.formData.identityCardFront) : '';
      }
      if (queryData.identityCardReverse) {
        queryData.identityCardReverse = this.formData.identityCardReverse.length > 0 ? JSON.stringify(this.formData.identityCardReverse) : '';
      }
      if (queryData.trademarkLogo) {
        queryData.trademarkLogo = this.formData.trademarkLogo.length > 0 ? JSON.stringify(this.formData.trademarkLogo) : '';
      }
      if (queryData.otherSmallLanguagesFiles) {
        queryData.otherSmallLanguagesFiles = this.formData.otherSmallLanguagesFiles.length > 0 ? JSON.stringify(this.formData.otherSmallLanguagesFiles) : '';
      }
      queryData.trademarkCategory = data.length > 0 ? this.setTrademarkCategoryVal(data) : '';
      if (queryData.trademarkCategory == 'false' || queryData.trademarkCategory === false) return; // 如果false 终止程序

      this.setAdviserData(queryData);

      let requestData = {
        json: queryData,
        path: type,
        nodeCode: this.rowInfo.nodeCode,
        serviceId: this.rowInfo.serviceId,
        isManager: true,
      };
      API.updateNodeAPI(requestData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功');
          if (type) {
            this.$router.push({ path: '/intellectualProperty/trademark/index' });
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.form-create {
  /deep/ .el-input {
    width: 300px !important;
  }
  /deep/ .el-textarea {
    width: 300px !important;
  }
  /deep/ .el-input__inner {
    width: 300px !important;
  }
}
.cardBox {
  overflow: auto;
  max-height: calc(100vh - 214px);
}
</style>
