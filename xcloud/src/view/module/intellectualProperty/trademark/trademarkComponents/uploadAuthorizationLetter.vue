<template>
  <el-dialog title="上传授权书" :visible="visible" width="600px" :before-close="handleClose">
    <div class="answer-box-h3">上传授权书步骤</div>
    <ul class="auth-step">
      <li v-for="(item, index) in steps" :key="index">
        <img :src="item.img" alt="" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <form-create :rule="rule" class="form-create form-create-new" :option="option" v-model="fApi" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { dynamicForm } from '@/components/DynamicForm/dataFormat.js';
import * as API from '@/api/newApi/intellectualProperty/trademark';
export default {
  props: {
    serviceId: {
      type: String,
    },
    nodeCode: {
      type: String,
    },
  },
  data() {
    return {
      visible: true,
      steps: [
        {
          label: '下载授权书模板文件',
          img: require('@/assets/images/common/icon-down.svg'),
        },
        {
          label: '打印并签字',
          img: require('@/assets/images/common/icon-print.svg'),
        },
        {
          label: '上传电子版授权书',
          img: require('@/assets/images/common/icon-up.svg'),
        },
      ],
      moduleList: [],
      fApi: {},
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },
    };
  },
  computed: {
    rule() {
      console.log(dynamicForm(this.moduleList, this._props), 999);
      return dynamicForm(this.moduleList, { showSampleFile: true });
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取工单资料
    getDetail() {
      this.checkTwoClassifyList = [];
      API.workorderDetailAPI({
        serviceId: this.serviceId,
      })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.workflowColumns.length) {
              this.moduleList = [
                {
                  columns: [],
                },
              ];
              res.data.workflowColumns.forEach((modules) => {
                modules.columns.forEach((columns) => {
                  //上传授权书 固定三个字段
                  if (['registrationAuthorization', 'registrationAuthorization2', 'registrationAuthorization3'].includes(columns.keyName)) {
                    this.moduleList[0].columns.push(columns);
                  }
                });
              });
            }
          }
        })
        .finally(() => {});
    },
    // 保存信息
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
            json: { ...materialDataHandle },
            nodeCode: 'NODE0035',
            serviceId: this.serviceId,
            progressBar: 5,
          };
          API.updateNodeAPI(requestData).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '提交成功',
              });
              this.$emit('uploadAuthorization', false);
              this.$emit('getData');
            }
          });
        },
        () => {
          this.$Message.warning('请上传授权书！');
        }
      );
    },
    handleClose() {
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
      background: url(./../../../../../assets/images/common/arrow-a-lg.svg) no-repeat left center / 100% auto;
    }
    img {
      width: 44px;
      margin-bottom: 8px;
    }
  }
}

.form-create {
  ::v-deep .el-upload-dragger {
    border: 0;
    width: 100%;
    height: 100%;
    // padding: 5px;
    border-radius: 0;
  }
  /deep/ .el-form-item__error {
    min-width: 200px;
  }
}

.form-create-new {
  padding: 24px 24px 0;
  /deep/ .el-row {
    display: block;
  }
  /deep/ .el-form-item {
    margin-bottom: 30px;
    .el-form-item__label {
      width: 120px;
      text-align: left;
      position: relative;
      top: 10px;
      font-size: 14px;
      color: #515a6e;
      font-weight: normal;
      line-height: 14px;
    }
    .el-form-item__label + .el-form-item__content {
      display: inline-block;
      vertical-align: top;
      width: auto;
      ._fc-upload {
        max-height: 60px;
      }
    }
    .el-form-item__label {
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
