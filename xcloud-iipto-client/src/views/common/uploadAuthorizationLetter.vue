<template>
  <a-modal
    title="上传授权书"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :centered="true"
    :width="600"
    :confirm-loading="confirmLoading"
  >
    <div class="answer-box-h3">上传授权书步骤</div>
    <ul class="auth-step">
      <li v-for="(item, index) in steps" :key="index">
        <img :src="item.img" alt="" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <a-spin :spinning="spinning" size="large">
      <form-create :rule="rule" class="form-create form-create-new" :option="option" v-model="fApi" />
    </a-spin>
  </a-modal>
</template>
<script>
import { dynamicForm } from '@/libs/dynamicForm.js';
import { workorderDetailAPI, updateNodeAPI } from '@/api/trademarkRegister/myBread';
export default {
  props: {
    currRow: {
      type: Object,
    },
  },
  data() {
    return {
      visible: true,
      steps: [
        {
          label: '下载授权书模板文件',
          img: require('@/views/myBrand/component/img/icon-down.svg'),
        },
        {
          label: '打印并签字',
          img: require('@/views/myBrand/component/img/icon-print.svg'),
        },
        {
          label: '上传电子版授权书',
          img: require('@/views/myBrand/component/img/icon-up.svg'),
        },
      ],
      moduleList: [],
      fApi: {},
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },
      confirmLoading: false,
      spinning: false,
    };
  },
  computed: {
    rule() {
      console.log(dynamicForm(this.moduleList, this._props), 999);
      return dynamicForm(this.moduleList, { isAuthorizationLetter: true });
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取工单资料
    getDetail() {
      console.log(this.currRow, 'this.currRow');
      let data = {
        serviceId: this.currRow.servicesId,
        nodeCode: this.currRow.cureentNodeCode,
      };
      this.checkTwoClassifyList = [];
      this.spinning = true;
      workorderDetailAPI(data)
        .then((res) => {
          if (res.code == 0) {
            if (res.data.workflowColumns.length) {
              if (res.data.workflowColumns.length) {
                this.moduleList = [
                  {
                    columns: [],
                  },
                ];
                res.data.workflowColumns.forEach((modules) => {
                  modules.columns.forEach((columns) => {
                    //上传授权书 固定三个字段
                    if (
                      [
                        'registrationAuthorization',
                        'registrationAuthorization2',
                        'registrationAuthorization3',
                      ].includes(columns.keyName)
                    ) {
                      this.moduleList[0].columns.push(columns);
                    }
                  });
                });
              }
            }
          }
        })
        .finally(() => {
          this.spinning = false;
        });
    },
    // 保存信息
    formSave(info, next) {
      const infoObj = JSON.parse(info);
    },
    handleOk() {
      this.fApi.submit(
        (formData, fApi) => {
          let { testField, ...materialData } = formData;
          console.log(materialData, 'materialData');
          let materialDataHandle = {};
          Object.keys(materialData).forEach((key) => {
            materialDataHandle[key] = materialData[key];
            if (Array.isArray(materialData[key])) {
              materialDataHandle[key] = materialData[key][0];
            }
          });
          let requestData = {
            serviceId: this.currRow.servicesId,
            nodeCode: this.currRow.cureentNodeCode,
            progressBar: 5,
            json: {
              ...materialDataHandle,
            },
          };
          this.confirmLoading = true;
          updateNodeAPI(requestData).then((res) => {
            if (res.code == 0) {
              this.confirmLoading = false;
              this.$Message.success('提交成功');
              this.$emit('uploadAuthorization', false);
              this.$emit('getList');
              this.$emit('getViewWorkNum');
            }
          });
        },
        () => {
          this.$Message.warning('请上传授权书！');
        }
      );
    },
    handleCancel() {
      this.$emit('uploadAuthorization', false);
    },
  },
};
</script>
<style lang="less" scoped>
.answer-box-h3 {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 16px;
  margin-bottom: 16px;
}
.auth-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  line-height: 14px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &:not(:last-child):after {
      content: '';
      position: absolute;
      top: 15px;
      left: calc(100% + 16px);
      width: 79px;
      height: 13px;
      background: url(./../myBrand/component/img/arrow-a-lg.svg) no-repeat left center / 100% auto;
    }
    img {
      width: 44px;
      margin-bottom: 8px;
    }
  }
}
.form-create {
  /deep/ .ivu-upload-list-remove {
    opacity: 1;
    display: inherit !important;
  }
  //上传文件样式
  /deep/ .ivu-upload-select {
    min-width: 110px;
    color: #919498;
    border: 1px solid #d9d9d9;
    line-height: 36px;
    height: 36px;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    .ivu-icon-ios-cloud-upload-outline {
      font-size: 16px;
      font-weight: bold;
    }
  }
  /deep/ .ivu-upload-list-file {
    background: #f3f3f3;
  }
}
.form-create-new {
  padding: 24px 24px 0;
  /deep/ .ivu-form-item {
    .ivu-upload-list {
      margin-bottom: 0;
    }
    .ivu-form-item-label {
      width: 120px;
      text-align: left;
      position: relative;
      top: 10px;
      font-size: 14px;
      color: #515a6e;
      font-weight: normal;
      line-height: 14px;
    }
    .ivu-form-item-label + .ivu-form-item-content {
      display: inline-block;
      vertical-align: top;
      width: auto;
    }
    .ivu-form-item-label {
      position: relative;
      &::before {
        position: absolute;
      }
      span {
        padding-left: 10px;
        display: inline-block;
      }
    }
  }
}
</style>
