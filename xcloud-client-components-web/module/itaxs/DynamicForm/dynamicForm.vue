<template>
  <div class="formCreate">
    <ul class="data-steps">
      <li class="ds-current"><span>1</span>准备资料</li>
      <li v-for="item in moduleListBlock" :class="{ 'ds-current': stepsIndex > item.index - 1 }" :key="item.index">
        <span>{{ item.index }}</span
        >{{ item.lable }}<a-icon v-if="item.reject.length" class="info-circle" type="info-circle" theme="filled" />
      </li>
      <li :class="{ 'ds-current': stepsIndex === stepsLength }">
        <span>{{ stepsLength }}</span
        >预览提交
      </li>
    </ul>
    <DataPreparation
      v-if="stepsIndex === 1"
      :moduleListUpload="moduleListUpload"
      :workInfo="workInfo"
      :moduleListUploadSelect="moduleListUploadSelect"
    />
    <DataPreviews
      @stepChange="stepChange"
      v-if="stepsIndex === stepsLength"
      :moduleListEPR="moduleList"
      :tabsCurrent="tabsCurrent"
      :showSubmit="showSubmit"
    />
    <div
      class="form-create-wrap"
      v-for="(block, key) in moduleListBlock"
      :key="key"
      v-show="stepsIndex === block.index"
    >
      <div class="form-create-rejectInfo" v-if="block.reject.length">
        <h4>
          待改正字段：<span>{{ block.reject.length }}</span
          >个
        </h4>
        <div class="rejectInfo-field">
          <span v-for="(item, index) in block.reject" :key="index">{{ item.keyLabel }}</span>
        </div>
      </div>
      <form-create :rule="block.rule" class="form-create-ocr" :option="option" v-model="block.fApi" />
    </div>
    <div class="btn-group">
      <Button v-if="stepsIndex === 1" :disabled="isCancel" class="keep" @click="$router.go(-1)">取消</Button>
      <Button v-if="stepsIndex > 1 && showSubmit" :disabled="isCancel" class="keep" @click="stepChange(stepsIndex - 1)"
        >上一步</Button
      >
      <Button v-if="![1, stepsLength].includes(stepsIndex)" :disabled="isCancel" class="keep" @click="preserveBtn"
        >暂存</Button
      >
      <Button
        v-if="![stepsLength].includes(stepsIndex)"
        :disabled="isCancel"
        type="primary"
        @click="nextStep(stepsIndex + 1)"
        >下一步</Button
      >
      <Button
        :disabled="isCancel"
        type="primary"
        v-if="showSubmit && stepsIndex === stepsLength"
        @click="submitMaterials"
        >提交</Button
      >
      <Button type="primary" v-if="!showSubmit && stepsIndex === stepsLength" @click="$router.go(-1)">返回</Button>
    </div>
  </div>
</template>
<script>
import { dynamicForm } from '@comp/utils/dynamicForm.js';
import SampleFile from '@/components/WorkOrderComponents/SampleFile';
import DataPreparation from './dataPreparation.vue';
import DataPreviews from './dataPreviews.vue';
import { cloneDeep, uniqBy } from 'lodash';
export default {
  props: {
    // 数据列表
    moduleList: { type: Array },
    // 是否显示保存按钮
    showSave: {
      type: Boolean,
      default: true,
    },
    // 是否显示提交按钮
    showSubmit: {
      type: Boolean,
      default: true,
    },
    // 是否取消中或已取消状态，禁用按钮
    isCancel: {
      type: Boolean,
      default: false,
    },
    // 工单详情
    workInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    // Tabs选中的值
    tabsCurrent: {
      type: String | Number,
      default: '1',
    },
  },
  components: {
    SampleFile,
    DataPreparation,
    DataPreviews,
  },
  watch: {
    moduleList: {
      handler(newVal) {
        if (this.watchOpen && newVal && newVal.length) {
          this.watchOpen = false;
          //表单分块处理
          this.stepsLength = this.moduleListBlock.length + 2;
          this.moduleListBlock.forEach((block, index) => {
            let currentBlock = [];
            let rejectArray = [];
            newVal.forEach((list) => {
              if (block.code.includes(list.moduleCode)) {
                list.columns.forEach((item) => {
                  if (item.rejectDTO && item.rejectDTO.reject) {
                    rejectArray.push(item);
                  }
                });
                currentBlock.push(
                  ...dynamicForm(
                    newVal.filter((item) => [list.moduleCode].includes(item.moduleCode)),
                    { ...this._props, moduleListBlock: this.moduleListBlock },
                    block.fApi
                  )
                );
              }
            });
            // currentBlock.forEach((item) => {
            //   console.log(item, '8989');
            //   if (item.rejectDTO && item.rejectDTO.reject) {
            //     rejectArray.push(item);
            //   }
            // });
            block.reject = rejectArray;
            block.rule = currentBlock;
          });
          //上传资料处理
          this.moduleListUpload = cloneDeep(newVal);
          let map = new Map();
          this.moduleListUpload.forEach((module) => {
            module.uploadArr = [];
            module.columns.forEach((item) => {
              if (item.columnId) {
                map.set(item.columnId, item);
              }
              if (item.inputType == 4) {
                module.uploadArr.push(item);
              }
              if (item.inputType == 4 && item.columnPid) {
                let columnParrent = cloneDeep(map.get(item.columnPid));
                if (columnParrent && columnParrent.info) {
                  columnParrent.info = JSON.parse(columnParrent.info);
                  let defaultVal = columnParrent.info.groups[0].value;
                  if (columnParrent.keyName === 'ifChangeNextDeclarePeriodLetter') {
                    defaultVal = '2';
                  }
                  columnParrent.value =
                    ['""', '{}'].includes(JSON.stringify(columnParrent.reView)) || !columnParrent.reView
                      ? defaultVal
                      : columnParrent.reView;
                  this.moduleListUploadSelect.push(columnParrent);
                }
              }
            });
          });
          this.moduleListUploadSelect = uniqBy(this.moduleListUploadSelect, 'columnId');
          this.moduleListUpload = this.moduleListUpload.filter((module) => {
            if (module.uploadArr.length) {
              return module;
            }
          });
          //步骤
          if (this.moduleListUpload.length) {
            this.stepsIndex = 1;
            this.$store.dispatch('app/setStepIndex', 1);
          } else {
            this.stepsIndex = 2;
            this.$store.dispatch('app/setStepIndex', 2);
          }
          if (!this.showSubmit) {
            this.stepsIndex = this.stepsLength;
            this.$store.dispatch('app/setStepIndex', this.stepsLength);
          }
        }
      },
      deep: true,
    },
  },

  data() {
    return {
      receptFile: '',
      fApi: {},
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },
      assistantShow: false,
      assistantInfo: {},
      moduleListUpload: [],
      moduleListUploadSelect: [],
      //表单分块信息
      moduleListBlock: [
        {
          lable: '公司信息',
          code: ['companyInfo'],
          index: 2,
          rule: [],
          fApi: {},
          reject: [],
        },
        {
          lable: '法人信息',
          code: ['corporateInfo'],
          index: 3,
          rule: [],
          fApi: {},
          reject: [],
        },
        {
          lable: '店铺信息和税务信息',
          code: ['storeInfo', 'taxInfo'],
          index: 4,
          rule: [],
          fApi: {},
          reject: [],
        },
      ],
      stepsIndex: 1,
      stepsLength: 5, //总步数
      watchOpen: true,
      verificationPass: true,
    };
  },
  created() {
    this.isReject = this.$route.query.isReject;
    //在Remark.vue中触发
    this.$bus.$on('rejectedProcessed', (data) => {
      this.rejectedHandle(data);
    });
  },
  mounted() {
    document.querySelector('.main-container').addEventListener('scroll', () => {
      this.assistantShow = false;
    });
    if (!this.showSubmit) {
      this.stepsIndex = this.stepsLength;
      this.$store.dispatch('app/setStepIndex', this.stepsLength);
    }
    this.moduleListBlock[2].fApi.on(
      `${'ifSubmitLastYearAnnualReturn'.replace(/([A-Z])/g, '-$1').toLowerCase()}-on-change`,
      (e) => {
        console.log();
        //TODO
        let iValue = this.moduleListBlock[2].fApi.getValue('ifSubmitLastYearAnnualReturn');
        let title =
          iValue === '1'
            ? '由于您已完成上一年的年报/年度汇总申报，我司将不再为您开放上一年的年度汇总申报端口，请在下方文件框上传您的年报回执'
            : '为合规履行申报义务，建议联系前代理获取并保存好您的历史预申报回执（月度或季度），以便转入后完成上一年的年度汇总年报。请在下方文件框上传您的历史申报回执。';
        this.$bus.$emit('ifSubmitLastYearAnnualReturnChange', title);
      }
    );
  },
  methods: {
    //处理驳回字段
    rejectedHandle(key) {
      console.log(key);
      let currrentReject = this.moduleListBlock[this.stepsIndex - 2].reject;
      this.moduleListBlock[this.stepsIndex - 2].reject = currrentReject.filter((item) => item.keyName !== key);
      console.log(currrentReject);
    },
    //步骤改变
    stepChange(index) {
      this.stepsIndex = index;
      this.$store.dispatch('app/setStepIndex', index);
      this.$nextTick(() => {
        document.querySelector('.main-container').scrollTop = 0;
      });
    },
    //下一步
    async nextStep(index) {
      this.assistantShow = false;
      if (index !== this.stepsLength) {
        let setObj = {};
        this.moduleListUploadSelect.forEach((item) => {
          this.moduleListBlock[index - 2].rule.forEach((block) => {
            if (item.keyName === block.field) {
              console.log(index, item.keyName);
              let kval = this.moduleListBlock[index - 2].fApi.getValue(item.keyName);
              setObj[item.keyName] = kval || item.value;
            }
          });
        });
        this.moduleListBlock[index - 2].fApi.setValue(setObj);
        this.$nextTick(() => {
          document.querySelector('.main-container').scrollTop = 0;
        });
      }
      if (this.stepsIndex === 1) {
        this.stepChange(index);
      } else {
        this.verificationPass = true;
        this.moduleListBlock[index - 3].fApi.submit(
          (formData) => {
            console.log(formData, 'formData');
            this.$emit('submitVerification', index - 3, this.moduleListBlock);
            if (this.verificationPass) {
              let { testField, ...materialData } = this.moduleListBlock[index - 3].fApi.form;

              let material = JSON.stringify(this.removePropertyOfNull(materialData));

              if (index === this.stepsLength) {
                this.$emit('formSave', material, true);
              } else {
                this.$emit('formSave', material);
                this.stepChange(index);
              }
            }
          },
          (...error) => {
            this.$Message.warning('请检查输入的数据');
            this.$nextTick(() => {
              let topNum =
                document.querySelector('.main-container').scrollTop +
                document.querySelector('.ivu-form-item-error-tip').getBoundingClientRect().top -
                410;
              document.querySelector('.main-container').scrollTo({
                top: topNum,
                behavior: 'smooth',
              });
            });
          }
        );
      }
    },
    // 移除对象中的空属性
    removePropertyOfNull(obj) {
      return Object.fromEntries(Object.entries(obj).filter((item) => item[1] !== ''));
    },
    //暂存
    async preserveBtn() {
      let { testField, ...materialData } = this.moduleListBlock[this.stepsIndex - 2].fApi.form;
      let material = JSON.stringify(this.removePropertyOfNull(materialData));
      this.$emit('formSave', material);
    },
    //确定提交资料
    submitMaterials() {
      let materialData = {};
      this.moduleListBlock.forEach((item) => {
        Object.assign(materialData, item.fApi.form);
      });
      this.$emit('formsubmit', JSON.stringify(materialData));
    },
  },
};
</script>
<style scoped lang="less">
.formCreate {
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  padding: 24px;
  margin-bottom: 75px;
  min-height: calc(100vh - 245px);
  padding-bottom: 90px;
  .form-create {
    /deep/.ivu-form-item-label {
      padding: 0;
    }
    /deep/.ivu-col > .ivu-form-item {
      margin-bottom: 48px;
    }
    /deep/.ivu-form-item-label {
      &::before {
        content: '';
      }
    }
    /deep/ .confirm-success {
      .ivu-form-item-label::before {
        content: '';
        width: 20px;
        height: 20px;
        background: url('../../../assets/images/duigou.svg');
        background-size: cover;
        margin-right: 12px;
        position: relative;
        top: 4px;
      }
    }
    /deep/ .ivu-input-group {
      width: auto !important;
    }
    /deep/ .ivu-input-wrapper input:hover,
    /deep/ .ivu-input-wrapper input:focus,
    /deep/ .ivu-select-visible .ivu-select-selection,
    /deep/ .ivu-select-selection-focused,
    /deep/ .ivu-select-selection:hover {
      border-color: #639fff !important;
      box-shadow: none !important;
    }
    /deep/ .ivu-input,
    /deep/ .el-textarea,
    /deep/ .ivu-select,
    /deep/ .ant-select-selection,
    /deep/.ant-input {
      width: 280px;
      border-radius: 2px;
      .ivu-select-selection {
        border-radius: 2px;
      }
    }
    /deep/.shopPredictSaleAppend {
      .ivu-input-group-append {
        position: relative;
        left: -44px;
        border-left: 1px solid #dcdee2;
        z-index: 2;
      }
    }
    /deep/.formMaxWidth {
      width: 560px !important;
      .ivu-input,
      .ant-select-selection {
        width: 560px;
      }
    }
  }
}

.btn-group {
  text-align: center;
  height: 64px;
  padding-top: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  box-shadow: 0px -1px 10px 0px #ebf0f5;
  z-index: 2;
  button {
    margin: 5px;
    height: 32px;
    border-radius: 0;
  }
  .ivu-btn-primary {
    background: #3a7fff;
    border-color: #3a7fff;
  }
}

.form-create-ocr {
  transform: none;
  margin: 24px 64px 0;
  /deep/.tittleStyle {
    font-size: 16px;
    color: #303132;
    height: auto;
    line-height: inherit;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    padding: 8px 0;
    b {
      display: inline-block;
      width: 2px;
      height: 15px;
      background: #3a7fff;
      margin-right: 12px;
      position: relative;
      top: 2px;
    }
  }
}

.data-steps {
  width: 100%;
  display: flex;
  margin-bottom: 0;
  li {
    flex-grow: 1;
    height: 40px;
    background: #d9d9d9;
    position: relative;
    margin-right: 11px;
    line-height: 40px;
    padding-left: 30px;
    color: #fff;
    font-size: 16px;
    .store-tax {
      flex-shrink: 0;
    }
    > span {
      display: inline-block;
      width: 24px;
      height: 24px;

      background: #ffffff;
      border-radius: 50%;

      color: #bbbbbb;
      line-height: 24px;
      text-align: center;
      margin-right: 16px;
    }
  }
  li.ds-current {
    background: #549bff;
    border-color: #549bff;
    color: #fff;
    > span {
      background: #fff;
      color: #6caaff;
    }
  }
}

.form-create-rejectInfo {
  height: 83px;
  background: #f0f6ff;
  padding: 15px 23px;
  margin-top: 14px;
  h4 {
    font-size: 14px;
    color: #000;
    span {
      color: #e81e19;
    }
  }
  .rejectInfo-field {
    span {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      // text-decoration: underline;
      // cursor: pointer;
      padding-right: 20px;
    }
  }
}
.info-circle {
  color: #ff5f61;
  background: #fff;
  border-radius: 55%;
  margin-left: 5px;
}
</style>
