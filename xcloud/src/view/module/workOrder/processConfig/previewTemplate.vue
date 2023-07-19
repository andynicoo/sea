<template>
  <div class="app-container">
    <header class="previewBack">
      <div cclass="el-page-header">
        <div class="el-page-header__left" @click="goback">
          <i class="el-icon-arrow-left"></i>
          <div class="el-page-header__title">返回列表</div>
        </div>
      </div>

      <div class="page-header">
        <div style="flex: 1">
          <h2>资料字段配置：{{ processInfo.currentNodeName }}</h2>
          <div class="nodeText">
            {{ processInfo.functionCodeName }}-{{ processInfo.countryNameCh }}-{{ processInfo.serviceProviderName }}：
            <span v-for="(item, index) in processInfo.forwardNodes" :key="index">
              <span>
                {{ item.nodeName }}
              </span>
              <span v-if="index < processInfo.forwardNodes.length - 1" style="margin: 0px 2px">/</span>
            </span>
          </div>
        </div>
        <div>
          <el-button size="mini" type="default" @click="goback">取消</el-button>
          <el-button size="mini" type="primary" @click="handlePrevNode" :disabled="currentIndex == 0">
            上一节点
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleNextNode"
            :disabled="currentIndex == processNodeList.length - 1"
          >
            下一节点
          </el-button>
          <el-button
            v-if="processInfo.status == 1"
            size="mini"
            type="primary"
            @click="auditModal = true"
            :disabled="currentIndex < processNodeList.length - 1"
          >
            审核
          </el-button>
        </div>
      </div>
    </header>

    <!-- 表单 -->
    <div class="preview-container">
      <!-- 模块信息 -->
      <!-- <div class="field-box" v-for="(item, index) in templateData" :key="index">
        <Title class="t-class" :titieName="item.moduleName"></Title>
        <TemplateField class="templateField" :ref="item.moduleCode" :fields="item.columns" :key="item.moduleId" />
      </div> -->
      <!-- 动态表单组件 -->
      <DynamicForm ref="dynamicForm" :moduleList="templateData" :isTemplate="true" />
      <!-- 表单校验 -->
      <div class="btn-box">
        <!-- <el-button type="default" @click="handleReset">重置（预览）</el-button>
        <el-button type="primary" @click="handleSubmit">提交（预览）</el-button> -->
      </div>
    </div>

    <!-- 审核操作弹框 -->
    <el-dialog title="审核操作" :visible.sync="auditModal" width="640px">
      <el-form ref="auditFormRef" :model="auditForm" :rules="auditFormRules" label-width="0px">
        <el-form-item>
          <div>审核是否通过？</div>
          <el-radio-group v-model="auditForm.status">
            <el-radio label="1">是，发布上线</el-radio>
            <el-radio label="2">否，审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-align-center">
        <el-button @click="auditModal = false">取消</el-button>
        <el-button type="primary" @click="handleAudit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TemplateField from "./components/TemplateField";
import DynamicForm from "@/components/DynamicForm/dynamicForm.vue"; // 表单配置
import { findTemplateFields, getProcessInfo } from "@/api/newApi/processFields/templateConfig";
import { auditProcess } from "@/api/newApi/processFields/processConfig";
import title from "@/components/title/index";
export default {
  components: { TemplateField, Title: title, DynamicForm },
  data() {
    return {
      // 流程和节点id
      flowId: "",
      nodeId: "",

      // 流程以及字段模板信息
      processInfo: {},
      // 字段模板数据
      templateData: [],
      // 整个表单的数据
      formData: {},

      // 当前的流程下标，以及所有服务流程数据
      currentIndex: 0,
      processNodeList: [],

      // 审核操作
      auditModal: false,
      auditForm: {
        status: ""
      },
      auditFormRules: {
        status: [{ required: true, message: "请选择审核的结果", trigger: "change" }]
      }
    };
  },
  created() {
    if (this.$route.query && this.$route.query.flowId) {
      this.flowId = this.$route.query.flowId;
      this.queryProcessInfo();
    }
  },
  methods: {
    /**
     * 查询流程详情
     */
    queryProcessInfo() {
      getProcessInfo({ nodeId: this.nodeId, flowId: this.flowId }).then(res => {
        if (res.code == 0) {
          this.processInfo = res.data;
          this.nodeId = res.data.currentNodeId;
          this.processNodeList = res.data.forwardNodes;
          this.queryTemplateFields();
        }
      });
    },

    /**
     * 查询流程节点对应的字段模板
     */
    queryTemplateFields() {
      findTemplateFields({
        nodeId: this.nodeId,
        workFlowId: this.flowId
      }).then(res => {
        if (res.code == 0) {
          this.templateData = res.data;
          // 转化字段配置json对象
          // this.templateData.forEach(v => {
          //   v.columns &&
          //     v.columns.forEach(vv => {
          //       // 格式化组件配置的数据
          //       if (vv.info) {
          //         vv.info = JSON.parse(vv.info);
          //       }
          //     });
          // });
          // console.log("模板数据：", this.templateData);
        }
      });
    },

    /**
     * 上一节点
     */
    handlePrevNode() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.nodeId = this.processNodeList[this.currentIndex].nodeId;
        this.queryProcessInfo();
      }
    },
    /**
     * 下一节点
     */
    handleNextNode() {
      if (this.currentIndex < this.processNodeList.length - 1) {
        this.currentIndex++;
        this.nodeId = this.processNodeList[this.currentIndex].nodeId;
        this.queryProcessInfo();
      }
    },
    /**
     * 审核操作
     */
    handleAudit() {
      this.$refs["auditFormRef"].validate(valid => {
        if (valid) {
          auditProcess({
            flowId: this.flowId,
            operation: this.auditForm.status
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.auditModal = false;
              this.goback();
            }
          });
        }
      });
    },

    /**
     * 点击改变选中，只包含一层的关系
     * @params item 选择的项
     * @params index 当前选中的下标
     * @params prop 当前项所属的对象
     */
    handleSelectTag(item, index, prop) {
      let selected = item.selected;
      item.selected = !selected;
      this.templateData[prop][index] = item;
      this.$set(this.templateData[prop], index, item);
    },
    showEditFieldsModal() {
      this.editFieldsModal = true;
    },

    /**
     * 多表单的重置和校验提交
     */
    handleReset() {
      this.templateData.forEach(v => {
        this.$refs[v.moduleCode][0].$refs["fieldForm"].resetFields();
      });
    },
    // 提交表单
    handleSubmit() {
      let list = [];
      this.templateData.forEach(v => {
        list.push(this.checkForm(v.moduleCode, v.moduleName));
      });
      // 批量校验
      Promise.all(list)
        .then(() => {
          console.log("所有表单校验通过，提交的数据：", this.formData);
        })
        .catch(() => {});
    },
    // 校验表单
    checkForm(moduleCode, moduleName) {
      return new Promise((resolve, reject) => {
        this.$refs[moduleCode][0].$refs["fieldForm"].validate(valid => {
          if (valid) {
            console.log(moduleName + "-表单校验通过");
            this.formData = { ...this.formData, ...this.$refs[moduleCode][0].fieldForm };
            resolve();
          } else {
            console.warn(moduleName + "-表单校验未通过");
            reject();
          }
        });
      });
    },

    /**
     * 返回列表
     */
    goback() {
      this.$router.push({
        path: "/workOrder/processConfig/index"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  min-width: 1000px;
  .previewBack {
    padding: 30px;
    background: #fff;
    border-radius: 4px;
    height: 160px;
    .el-page-header__left {
      align-items: baseline;
      padding-bottom: 30px;
    }
    .page-header {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Medium, PingFang SC;

      h2 {
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
        margin-bottom: 10px;
      }
      .nodeText {
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
      }
    }
  }

  // 预览的信息
  .preview-container {
    margin-top: 16px;
    background: #fff;
    ::v-deep .el-col-8 {
      padding: 0 25px;
    }
    ::v-deep .el-col-23 {
      padding: 0 25px;
    }
    // padding: 16px;
    // border-radius: 4px;
    // margin-bottom: 24px;
    // 字段展示
    .field-box {
      background: #fff;
      border: 1px solid #ebeef5;
      margin-bottom: 20px;
      .t-class {
        height: 62px;
        padding-left: 30px;
        border-bottom: 1px solid #ebeef5;
      }
      .templateField {
        /deep/ .el-col {
          // width: auto !important;
          // // min-width: 25%;
          // margin-left: 10px
          .el-date-editor--daterange.el-input,
          .el-date-editor--daterange.el-input__inner,
          .el-date-editor--timerange.el-input,
          .el-date-editor--timerange.el-input__inner {
            width: auto;
          }
        }
      }
      form {
        /deep/ .el-form-item {
          display: flex;
          // margin-right: 82px;
          .el-form-item__label {
            // width: auto !important;
            // min-width: 120px !important;
            text-align: left !important;
          }

          .el-form-item__content {
            margin-left: 0px !important;
          }
        }
        padding: 30px 0px 30px 30px;
      }

      .field-title {
        font-size: 18px;
        font-weight: bold;
        background: rgba(24, 144, 255, 0.19);
        color: #333;
        padding: 14px 30px;
        margin-bottom: 24px;
      }
    }
    // 按钮
    .btn-box {
      text-align: center;
    }
    ::v-deep .titleStyle {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      padding: 0px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      .talkbubble {
        height: 30px;
        line-height: 60px;
        background-color: #fff;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(51, 51, 51, 0.85);
        &::before {
          content: "";
          width: 2px;
          height: 14px;
          background: #1890ff;
          border-radius: 2px;
          margin-right: 8px;
          display: inline-block;
        }
      }
      .triangle {
        border-left: #fff;
      }
    }
    /deep/._fc-upload .fc-upload-btn,
    ._fc-upload .fc-files {
      width: 300px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #16ade9;
      background: #f4f9ff;
      .el-icon-upload2:before {
        color: #16ade9;
      }
    }
    /deep/.category-box {
      .el-input__suffix {
        right: 105px;
      }
    }
    /deep/.el-form-item__label {
      font-weight: 600;
    }
  }
  .margin-top-10 {
    margin-top: 10px;
  }
}
</style>
<style lang="less">
.preview-form {
  .el-form-item {
    .el-form-item__label {
      font-weight: bold;
    }
  }
}
</style>
