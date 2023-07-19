<template>
  <div>
    <div class="middleOfficePreview-info info-block-wrapper">
      <div class="text-align-right">
        <el-button v-for="item in forwardNodesFunctions" :key="item.functionId" type="primary">{{ item.functionName }}</el-button>
      </div>
      <el-tabs class="el-tabs" v-model="tabNav">
        <el-tab-pane name="all" label="全部"></el-tab-pane>
        <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
        <el-tab-pane name="vatInfo" label="税号信息"></el-tab-pane>
        <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
      </el-tabs>
      <div class="info-block">
        <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
          <div class="block-title">服务信息</div>
          <div class="info-block-item">
            <span class="info-block-title">税务类型：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">国家：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务名称：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务号：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务状态：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务商：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务商分配编码：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">客户公司名称：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">公司英文名称：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">订单号：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">提交次数：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">上传资料时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">最后审核时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">提交服务商时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">转代理完成时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务创建时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务开始时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务截止时间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">转代理开始申报区间：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">驳回原因：</span>
          </div>
        </template>
        <template v-if="tabNav === 'all' || tabNav === 'vatInfo'">
          <div class="block-title">税号信息</div>
          <div class="info-block-item">
            <span class="info-block-title">税号：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">周期类型：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">下一次申报周期：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">税号生效日期：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">国家：</span>
            <span></span>
          </div>
          <div class="info-block-item">
            <span></span>
          </div>
        </template>
        <div v-if="tabNav === 'all' || tabNav === 'operationInfo'">
          <div class="block-title">操作记录</div>
        </div>
      </div>
    </div>
    <div class="middleOfficePreview">
      <el-tabs v-model="nodeActiveName" @tab-click="nodeActiveChange">
        <el-tab-pane :label="item.nodeName" :name="item.nodeId" v-for="item in processDetail.forwardNodes" :key="item.nodeId"></el-tab-pane>
      </el-tabs>
      <!-- 动态表单组件 -->
      <div class="dynamicForm-view">
        <DynamicForm ref="dynamicForm" :moduleList="templateData" :isTemplate="true" />
      </div>
    </div>
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm.vue'; // 表单配置
import { getProcessDetail } from '@/api/newApi/processFields/processConfig';
import { findModuleFields } from '@/api/newApi/processFields/templateConfig';
import { cloneDeep, sortBy } from 'lodash';
export default {
  name: 'middleOfficePreview',
  components: {
    DynamicForm,
  },
  props: {},
  data() {
    return {
      processDetail: {},
      templateData: [],
      nodeActiveName: '',
      tabNav: 'all',
      forwardNodesFunctions: [],
    };
  },
  created() {
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
          this.nodeActiveName = this.processDetail.forwardNodes[0].nodeId;
          this.nodeId = this.processDetail.forwardNodes[0].nodeId;
          this.forwardNodesFunctions = this.processDetail.forwardNodes[0].functions;
          this.queryTemplateFields();
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
              if (ele.selected && ele.platform != 'CLIENT') {
                console.log(ele);
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
      this.forwardNodesFunctions = this.processDetail.forwardNodes.filter((item) => item.nodeId == tab.name)[0].functions;
    },
  },
};
</script>
<style lang="scss" scoped>
.preview-container-system {
  .middleOfficePreview {
    margin-right: 430px;

    ::v-deep .el-tabs__item {
      font-size: 16px;
    }

    ::v-deep .el-tabs__nav-wrap::after {
      height: 0;
    }
  }

  .dynamicForm-view {
    height: calc(100vh - 232px);
    overflow-y: auto;
    margin-top: 5px;

    ::v-deep .form-create .el-col-8 {
      width: 100%;
    }
  }
}

.middleOfficePreview-info {
  float: right;
  width: 390px;
  .info-block {
    height: calc(100vh - 232px);
    overflow-y: auto;
  }
}
</style>
