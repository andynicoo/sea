<template>
  <div>
    <form-create :rule="rule" class="form-create" :option="option" v-model="fApi" />
    <div class="btn-group" v-show="showBtn">
      <el-button @click="onCancel" v-if="showCancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="formSave" v-if="showSave">{{ saveText }}</el-button>
      <el-button type="primary" @click="formSubmit" v-if="showSubmit">{{ submitText }}</el-button>
    </div>
    <div style="padding-bottom: 50px" v-show="showBtn"></div>
  </div>
</template>
<script>
import { dynamicForm } from './dataFormat.js';
import { workOrderCommonOperator } from './commonOperator';
export default {
  props: {
    // 数据列表
    moduleList: { type: Array },
    // 是否显示所有按钮
    showBtn: {
      type: Boolean,
      default: false,
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: true,
    },
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
    // 取消按钮文字
    cancelText: {
      type: String,
      default: '取消',
    },
    // 保存按钮文字
    saveText: {
      type: String,
      default: '保存',
    },
    // 提交按钮文字
    submitText: {
      type: String,
      default: '提交',
    },
    // 是否税务稽查
    taxInspection: {
      type: Boolean,
      default: false,
    },
    // 税务稽查国家
    taxInspectionCountry: String,
    // 是否注销税号
    logoutTaxNum: {
      type: Boolean,
      default: false,
    },
    // 是否是EPR转代理
    isEPRTaxServices: {
      type: Boolean,
      default: false,
    },
    // 注销税号国家
    logoutTaxNumCountry: String,
    // 是否隐藏产品信息
    hideProductItem: {
      type: Boolean,
      default: false,
    },
    // 是否为模板
    isTemplate: {
      type: Boolean,
      default: false,
    },
    // 保存是否校验
    saveValidate: {
      type: Boolean,
      default: false,
    },
    // 定义每行字段个数
    rowKeyNum: {
      type: Number,
      default: 1,
    },
    // 服务号
    serviceNo: {
      type: String,
      default: '',
    },
    // 工单id
    workOrderId: {
      type: String,
      default: '',
    },
    // 工单详情
    workInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    showSampleFile: {
      type: Boolean,
      default: false,
    },
    countryCode: String,
  },
  computed: {
    rule() {
      return dynamicForm(this.moduleList, this._props);
    },
  },
  data() {
    return {
      fApi: {},
      option: {
        form: { labelWidth: '110px' },
        resetBtn: false,
        submitBtn: false,
      },
    };
  },
  mounted() {
    if (this.isTemplate) {
      this.option.form.labelWidth = undefined;
      this.option.form.labelPosition = 'top';
    }
  },
  methods: {
    // 取消
    onCancel() {
      this.$emit('formCancel');
    },
    formSave() {
      let result = {};
      return new Promise((resolve) => {
        this.onSave().then(async (res) => {
          if (this.workOrderId) {
            result = await workOrderCommonOperator('save', {
              material: res,
              workOrderId: this.workOrderId,
            });
          }
          this.$emit('formSave', res);
          resolve(result);
        });
      });
    },
    formSubmit() {
      return new Promise((resolve) => {
        let result = {};
        this.onSubmit().then(async (res) => {
          if (this.workOrderId) {
            result = await workOrderCommonOperator('commit', {
              material: res,
              workOrderId: this.workOrderId,
            });
          }
          this.$emit('formSubmit', res);
          resolve(result);
        });
      });
    },
    // 保存
    onSave() {
      return new Promise((resolve) => {
        // 保存校验必填
        if (this.saveValidate) {
          this.onSubmit().then((res) => {
            resolve(res);
          });
        } else {
          // 保存不校验必填
          let { testField, ...materialData } = this.fApi.form;
          let data = JSON.stringify(this.$util.removePropertyOfNull(materialData));
          resolve(data);
        }
      });
    },
    // 提交
    onSubmit() {
      return new Promise((resolve) => {
        this.fApi.submit(
          (formData, fApi) => {
            let { testField, ...materialData } = formData;
            resolve(JSON.stringify(materialData));
          },
          () => {
            this.$message.warning('请检查输入的数据');
          }
        );
      });
    },
  },
};
</script>
<style scoped lang="scss">
.form-create {
  ::v-deep .el-input {
    width: 300px;
  }
  ::v-deep .el-textarea {
    width: 300px;
  }
  ::v-deep .el-input__inner {
    width: 300px;
  }
  ::v-deep .el-form-item__label {
    word-break: break-all;
  }
  ::v-deep .el-upload-dragger {
    border: 0;
    width: 100%;
    height: 100%;
    // padding: 5px;
    border-radius: 0;
  }
}
.btn-group {
  position: fixed;
  bottom: 0;
  text-align: center;
  margin-bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
}
</style>
