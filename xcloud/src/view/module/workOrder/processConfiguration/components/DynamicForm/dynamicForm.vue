<template>
  <div>
    <div v-for="(ruleItem, index) in rule" :key="index">
      <div class="formInformation-sort">
        <form-create :rule="[ruleItem[0]]" class="form-create" :option="option" v-model="fApi" />
        <span>排序：<i class="el-icon-sort-down" @click="formInformationSort(index, 'down')"></i><i class="el-icon-sort-up" @click="formInformationSort(index, 'up')"></i></span>
      </div>
      <draggable :list="ruleItem" animation="300" ghost-class="ghostClass" @end="dragEnd($event, ruleItem, index)">
        <template v-for="(item, key) in ruleItem">
          <div v-if="key > 0" :class="{ 'formInformation-curr': currFormItem == item.title }" :key="key" class="formInformation-item" @click="onFormInformationItem(item)">
            <span class="formInformation-del text-primary" @click.stop="delFormItem(item, index)">移除</span>
            <form-create :rule="[item]" class="form-create" :option="option" v-model="fApi" />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script>
import { dynamicForm } from '@/components/DynamicForm/dataFormat.js';
import draggable from 'vuedraggable';
import { sortBy } from 'lodash';
export default {
  components: { draggable },
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
    //是否联动
    noControl: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    rule() {
      let ruleList = dynamicForm(this.moduleList, this._props);
      let ruleListHandel = [];
      let index = -1;
      ruleList.forEach((item) => {
        if (item.type == 'formTitle') {
          index += 1;
          ruleListHandel[index] = [];
        }
        ruleListHandel[index].push(item);
      });
      return ruleListHandel;
    },
  },
  data() {
    return {
      currFormItem: '',

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
    //块级排序
    formInformationSort(index, type) {
      console.log(index, type, 'index,type');
      this.$emit('updateModuleSort', index, type);
    },
    //选中表单元素
    onFormInformationItem(item) {
      this.currFormItem = item.title;
      this.$emit('selectFields', true, item.sourceData.moduleId, item.sourceData.id, item.sourceData);
    },
    //移除配置的表单项
    delFormItem(item, index) {
      this.$emit('deleteFields', item, index);
    },
    //排序
    dragEnd(event, list, index) {
      list.forEach((v, i) => {
        v.sourceData.sort = i;
      });
      this.$forceUpdate();
    },

    // 取消
    onCancel() {
      this.$emit('formCancel');
    },
    formSave() {
      this.onSave().then((res) => {
        this.$emit('formSave', res);
      });
    },
    formSubmit() {
      this.onSubmit().then((res) => {
        this.$emit('formSubmit', res);
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

.formInformation-item {
  padding: 10px;
  border-radius: 4px;
  position: relative;
  .formInformation-del {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 10;
  }
  &:hover {
    background-color: #f4f4f4;
    /* cursor: move; */
    .formInformation-del {
      display: block;
      cursor: pointer;
    }
  }
}
.formInformation-curr {
  background-color: #f4f4f4;
  .formInformation-del {
    display: block;
    cursor: pointer;
  }
}

.formInformation-sort {
  position: relative;
  overflow: hidden;
  .form-create {
    float: left;
  }
  > span {
    font-size: 14px;
    position: relative;
    top: 5px;
    i {
      cursor: pointer;
    }
    i:hover {
      color: #2d8cf0;
    }
  }
}
</style>
