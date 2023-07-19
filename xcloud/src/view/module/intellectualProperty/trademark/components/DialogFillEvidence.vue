<template>
  <el-dialog title="填写使用证据" :visible.sync="visible" :destroy-on-close="true" @close="cancel" width="68%">
    <form-create :rule="moduleList" class="form-create" @submit="onSubmit" :option="option" v-model="fApi" />
    <classificationEvidence :calssifyList="calssifyList" :categoryCount="categoryCount" :countryCode="rowInfo.countryCode" :linkList="linkList" :usrProductImgList="usrProductImgList" :useEvidenceList="useEvidenceList" ref="classItem"></classificationEvidence>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitFuncDeb()">仅保存不提交</el-button>
      <el-button type="primary" @click="submitFuncDeb(true)" :loading="loading">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { trademarkDataHandle } from '@/libs/trademarkDataHandle.js';
import * as API from '@/api/newApi/intellectualProperty/trademark';
import classificationEvidence from '../../components/classificationEvidence.vue';
import { Debounce } from '@/libs/throttle';

export default {
  props: ['workflowColumns', 'trademarkAapplicantColumns', 'categoryCount', 'rowInfo'],
  data() {
    return {
      loading: false,
      fApi: {},
      visible: true,
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
  components: { classificationEvidence },
  computed: {
    validata() {
      if (this.workflowColumns.length) {
        const arr = this.workflowColumns
          .filter((item) => +item.moduleId === 18)[0]
          .columns.map((item) => ({ keyName: item.keyName, isNeed: item.isNeed, keyLabel: item.keyLabel }))
          .reduce((prev, cur) => {
            prev[cur.keyName] = {
              isNeed: cur.isNeed,
              keyLabel: cur.keyLabel,
            };
            return prev;
          }, {});
        return arr;
      }
    },
    moduleList() {
      const workflowColumns = this.workflowColumns.filter((item) => item.moduleCode == 'trademarkEvidence');
      return trademarkDataHandle(workflowColumns, 1, true);
    },
  },
  mounted() {
    this.initDataFunc();
  },
  methods: {
    submitFuncDeb: Debounce('submitFunc'),
    submitFunc(type = false) {
      this.formData = this.fApi.formData();
      let data = this.$refs.classItem.trademarkCategoryList;
      this.getSubclassInfo();
      this.submitApiFunc(data, type);
      // if (type) {
      //   this.onSubmit(data, type);
      // } else {
      //   this.submitApiFunc(data, type);
      // }
    },
    /**
     * 如果上次用户选择了小类 初始重新获取小类
     */
    getSubclassInfo() {
      if (this.$refs.classItem.trademarkCategoryList.length > 0) {
        this.getSubclassData();
      } else {
        const found = this.workflowColumns.find((element) => element.moduleCode == 'trademarkCategory');
        found && found.columns[0].keyNameValue && typeof found.columns[0].keyNameValue === 'string' && this.getSubclassData(found.columns[0].keyNameValue);
      }
    },

    /**
     * 重新获取小类数据
     */
    getSubclassData() {
      this.$refs.classItem.trademarkCategoryList.forEach((item, index) => {
        item.searchtext && item.searchtext != '' && item.category1Num && item.category1Num != '' && this.$refs.classItem.searchSubclass(index);
      });
    },
    submitApiFunc(data, type) {
      let queryData = { ...this.formData };
      let { usrProductImgList, marketHrefList } = this.$refs.classItem;
      if (queryData.firstBusinessUseDate) {
        queryData.firstBusinessUseDate = `${queryData.firstBusinessUseDate} 00:00:00`;
      } else {
        queryData.firstBusinessUseDate = '';
      }
      if (queryData.firstUseDate) {
        queryData.firstUseDate = `${queryData.firstUseDate} 00:00:00`;
      } else {
        queryData.firstUseDate = '';
      }
      this.setAdviserData(queryData);
      if (type) {
        for (let key in this.validata) {
          const cur = this.validata[key];
          if (key === 'firstBusinessUseDate' || key === 'firstUseDate') {
            if (cur.isNeed && queryData[key] === '') {
              this.$message.error(`${cur.keyLabel}不能为空`);
              return;
            }
          } else if (key === 'marketHref') {
            const marketHrefItem = JSON.parse(queryData[key]);
            if (cur.isNeed && marketHrefItem[0].marketHref === '') {
              this.$message.error(`${cur.keyLabel}不能为空`);
              return;
            }
          } else {
            if (cur.isNeed && (!queryData[key] || queryData[key] === '[]')) {
              this.$message.error(`${cur.keyLabel}不能为空`);
              return;
            }
          }
        }
      }
      let requestData = {
        json: queryData,
        serviceId: this.rowInfo.serviceId,
        submitFlag: type,
      };
      API.submitEvidence(requestData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功');
          const val = type ? res.data.paymentUrl : null;
          this.$emit('update', val);
        }
      });
    },
    // 表单数据组装
    setAdviserData(queryData) {
      let { useEvidenceList, usrProductImgList, marketHrefList } = this.$refs.classItem;
      queryData['useEvidence'] = JSON.stringify(useEvidenceList);
      queryData['useProductImg'] = JSON.stringify(usrProductImgList);
      queryData['marketHref'] = JSON.stringify(marketHrefList);
    },
    cancel() {
      this.$emit('close');
    },
    onSubmit(data, type) {
      this.fApi.submit((formData, fApi) => {
        this.formData = formData;
        this.submitApiFunc(data, type);
      });
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
                if (vv.keyNameValue && vv.keyNameValue !== '{}') {
                  this.useEvidenceList = JSON.parse(vv.keyNameValue);
                }
              } else if (vv.keyName == 'useProductImg') {
                if (vv.keyNameValue && vv.keyNameValue !== '{}') {
                  this.usrProductImgList = JSON.parse(vv.keyNameValue);
                }
              }
            }
          });
        }
      });
      this.isInit = true;
      // setTimeout(() => {
      //   this.getSubclassInfo();
      // }, 500);
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
