<template>
  <div class="process-configuration-wrapper">
    <div class="process-handle-btn">
      <el-button @click="$router.go(0)">刷新</el-button>
    </div>
    <div class="process-configuration-header">
      <img class="max-logo" src="@/assets/images/common/icon_logo.svg" />

      <dl class="process-name">
        <dt>流程预览</dt>
      </dl>
    </div>
    <div class="process-config-tabs">
      <el-tabs v-model="activeName" @before-leave="handleBeforeClick">
        <el-tab-pane label="客户端" name="first"></el-tab-pane>
        <el-tab-pane label="业务中台" name="third"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="process-preview-title">
      <span>流程名称：{{ flowName }}</span>
      <span>业务类型：{{ businessType }}</span>
      <span>主体：{{ enterpriseName.join() }}</span>
      <span>国家：{{ countryName.join() }}</span> <span>供应商：{{ supplierName }}</span>
    </div>
    <div class="preview-container-client" v-if="activeName == 'first'">
      <el-tabs v-model="nodeActiveName" @tab-click="nodeActiveChange">
        <el-tab-pane :label="item.nodeName" :name="item.nodeId" v-for="item in processDetail.forwardNodes" :key="item.nodeId"></el-tab-pane>
      </el-tabs>
      <!-- 动态表单组件 -->
      <div class="dynamicForm-view">
        <DynamicForm ref="dynamicForm" :moduleList="templateData" :isTemplate="true" />
      </div>
    </div>
    <div class="preview-container-system" v-else>
      <MiddleOfficePreview />
    </div>
    <!-- <ServiceInformation ref="serviceForm" @handleNext="handleNext" v-show="activeName=='first'" /> -->
    <!-- <ProcessChoreography @handleNext="handleNext" v-show="activeName=='third'" /> -->
  </div>
</template>

<script>
// import ServiceInformation from './components/serviceInformation.vue'
// import ProcessChoreography from './components/processChoreography.vue'
import DynamicForm from '@/components/DynamicForm/dynamicForm.vue'; // 表单配置
import MiddleOfficePreview from './components/middleOfficePreview.vue'; // 业务中台预览
import { findModuleFields } from '@/api/newApi/processFields/templateConfig';
import { addProcess, getProcessDetail, findNodes } from '@/api/newApi/processFields/processConfig';
import { supplierList } from '@/api/newApi/workOrder/processConfiguration';
import { cloneDeep, sortBy } from 'lodash';
export default {
  name: 'processPreview',
  components: {
    DynamicForm,
    MiddleOfficePreview,
    // ServiceInformation,
    // ProcessChoreography
  },
  data() {
    return {
      processDetail: {},
      businessType: '',
      workOrderType: '',
      activeName: 'first',
      processForm: {},
      enterpriseList: [],
      countryList: [],
      supplierList: [
        {
          erpSupplierId: '120925',
          supplierName: 'ASIN SERVICE',
        },
        {
          erpSupplierId: '208883',
          supplierName: '深圳市中凯检测技术有限公司',
        },
      ],
      enterpriseName: [],
      countryName: [],
      supplierName: [],

      flowId: '',
      nodeId: '',
      nodeActiveName: '',
      // 字段模板数据
      templateData: [],
    };
  },
  created() {
    this.enterpriseList = JSON.parse(localStorage.enterpriseList);
    this.countryList = JSON.parse(localStorage.countryList);
    this.querySupplierList();
    if (this.$route.query.fid) {
      this.flowId = this.$route.query.fid;
      this.queryProcessDetail();
    }
  },
  methods: {
    /**
     * 查询流程详情
     */
    queryProcessDetail() {
      getProcessDetail({ flowId: this.flowId }).then((res) => {
        if (res.code == 0) {
          this.processDetail = res.data;
          this.flowName = this.processDetail.flowName;
          this.businessType = this.processDetail.functionName;
          this.nodeActiveName = this.processDetail.forwardNodes[0].nodeId;
          this.nodeId = this.processDetail.forwardNodes[0].nodeId;
          this.supplierName = this.processDetail.supplierName;
          this.queryTemplateFields();
          this.enterpriseList.forEach((item) => {
            if (this.processDetail.enterpriseId.includes(item.id)) {
              this.enterpriseName.push(item.name);
            }
          });
          this.countryList.forEach((item) => {
            if (this.processDetail.countryCode.includes(item.countryCode)) {
              this.countryName.push(item.countryNameZh);
            }
          });
        }
      });
    },
    /**
     * 查询流程节点对应的字段模板
     */
    queryTemplateFields() {
      findModuleFields({
        nodeId: this.nodeId,
        workFlowId: this.flowId,
      }).then((res) => {
        if (res.code == 0) {
          let currentNode = this.processDetail.forwardNodes.filter((item) => item.nodeId == this.nodeId)[0].moduleList;
          this.templateData = [];
          res.data.forEach((dataItem) => {
            let currentDataItem = cloneDeep(dataItem);
            currentDataItem.columns = [];
            dataItem.columns.forEach((ele) => {
              if (ele.selected && ele.platform != 'SYSTEM') {
                ele.inputType = Number(ele.inputType);
                currentDataItem.columns.push(ele);
              }
            });
            if (currentDataItem.columns.length) {
              currentNode.forEach((item) => {
                if (item.moduleId == currentDataItem.moduleId) {
                  currentDataItem.sort = item.sort;
                }
              });
              this.templateData.push(currentDataItem);
            }
          });
          this.templateData = sortBy(this.templateData, 'sort');
        }
      });
    },
    //切换节点
    nodeActiveChange(tab) {
      this.nodeId = tab.name;
      this.queryTemplateFields();
    },
    /**
     * 查询服务商列表
     */
    querySupplierList() {
      supplierList().then((res) => {
        if (res.code == 0) {
          // this.supplierList = res.data;
        }
      });
    },
    //tabs切换
    handleBeforeClick(activeName, oldActiveName) {
      console.log(activeName, oldActiveName);
      if (tab.index == 1) {
        return false;
      }
    },
    //下一步
    handleNext(val) {
      this.activeName = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.process-configuration-wrapper {
  background-color: #f4f7f9;
}

.process-handle-btn {
  position: absolute;
  top: 16px;
  right: 32px;
  z-index: 2;
}

.process-configuration-header {
  width: 100%;
  background: #fff;
  padding: 0 10px;
  height: 64px;
  position: absolute;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .max-logo {
    float: left;
    margin-top: 14px;
    margin-left: 22px;
  }

  .process-name {
    float: left;
    height: 30px;
    margin-top: 15px;
    margin-left: 30px;

    dt {
      float: left;
      margin-top: 5px;
      font-size: 14px;
    }
  }
}

.process-config-tabs {
  text-align: center;
  padding-top: 9px;

  .el-tabs {
    display: inline-block;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }

  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
}

.process-preview-title {
  display: flex;
  background: #fff;
  text-align: center;
  align-items: center;
  height: 60px;
  justify-content: center;

  > span {
    padding: 0 15px;
    font-size: 14px;
  }
}

.preview-container-system,
.preview-container-client {
  background-color: #fff;
  margin: 10px;
  padding: 10px 20px;
}
.preview-container-client {
  ::v-deep .el-col-8 {
    padding: 0 25px;
  }

  ::v-deep .el-col-23 {
    padding: 0 25px;
  }

  ::v-deep .el-tabs__item {
    font-size: 16px;
    padding: 5px 20px;
    height: 50px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    height: 0;
  }

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
        content: '';
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

.dynamicForm-view {
  height: calc(100vh - 222px);
  overflow-y: auto;
}
</style>
