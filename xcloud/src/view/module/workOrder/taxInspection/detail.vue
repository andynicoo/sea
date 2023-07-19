<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <!-- 待上传资料 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE2">
          <el-button :disabled="isCancel" size="small" type="primary" @click="submit" v-show="hasAuthority('O1_7')">提交</el-button>
        </template>
        <!-- 驳回 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="hasAuthority('O1_8') && rejectNodeName">驳回</el-button>
        <!-- 待处理 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE3">
          <el-button :disabled="isCancel" size="small" type="primary" @click="deal" v-show="hasAuthority('O1_9')">开始处理</el-button>
        </template>
        <!-- 处理中 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE7">
          <el-button :disabled="isCancel" size="small" type="primary" @click="dealComplete" v-show="hasAuthority('O1_10')">处理完成</el-button>
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ nodeCodeName }}</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" taxInspection :taxInspectionCountry="info.countryNameZh" :workOrderId="workOrderId" :workInfo="info" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="工单信息"></el-tab-pane>
          <el-tab-pane name="vatInfo" label="税号信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <span v-show="tabNav === 'all' || tabNav === 'serviceInfo'">
            <WorkOrderInfo :serviceInfo="info" @refresh="getInfo"></WorkOrderInfo>
          </span>
          <span v-show="tabNav === 'all' || tabNav === 'vatInfo'">
            <VatInfo :serviceInfo="info" @refresh="getInfo" />
          </span>
          <OperationLog :activities="activities" v-show="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <RejectDialog :rejectDialog.sync="rejectDialog" :workOrderId="workOrderId" :nodeCodeName="nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo" />
    </div>
  </div>
</template>

<script>
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getRejectCode } from '@/api/newApi/common';
import * as comps from './components/index';
import taxRefundLink from '@/view/module/workOrder/mixin/taxRefundLink';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import { mapMutations } from 'vuex';
import { currentCodeEnum, currentCodeList } from '@/view/module/workOrder/map.js';
import RejectDialog from '@/view/module/workOrder/components/rejectDialog';
import WorkOrderInfo from '@/view/module/workOrder/components/common/workOrderInfo';
import VatInfo from '@/view/module/workOrder/components/common/vatInfo';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  data() {
    return {
      workOrderId: this.$route.query.workOrderId,
      userId: this.$route.query.userId,
      countryCode: '', // mixins获取用户公司列表用到
      info: {},
      orderServices: {},
      custUserInfoVo: {},
      workOrder: {},
      moduleList: [],
      rejectDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      fold: false,
      currentCodeEnum,
    };
  },
  mixins: [taxRefundLink, operationLog, isServiceCancel],
  components: {
    ...comps,
    OperationLog,
    DynamicForm,
    WorkOrderInfo,
    RejectDialog,
    VatInfo,
  },
  computed: {
    nodeCodeName() {
      return this.$options.filters.filterKey(this.info.currentNodeCode, currentCodeList);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getInfo();
      await this.getCountryList();
      this.getReview();
    },
    getInfo() {
      return new Promise((resolve) => {
        workOrderCommonOperator('detail', this.workOrderId).then((res) => {
          this.info = res.data;
          this.countryCode = res.data.countryCode;
          this.ifCancel(res.data.status);
          this._getRejectCode();
          this.getOperationLog(this.info.workNo, 3);
          resolve();
        });
      });
    },
    getReview() {
      if (this.info.dataReview && this.info.dataReview.length) {
        this.moduleList = this.info.dataReview;
      } else {
        this.getData();
      }
    },
    // 获取动态表单初始化数据
    getData() {
      getNodeField({
        nodeCode: this.info.currentNodeCode,
        workFlowId: this.info.workflowId,
      }).then((res) => {
        this.moduleList = res.data;
      });
    },
    // 获取驳回节点
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.info.currentNodeCode,
        workFlowId: this.info.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    // 提交
    submit() {
      this.$refs.dynamicForm.onSubmit().then((material) => {
        workOrderCommonOperator('commit', {
          workOrderId: this.workOrderId,
          material,
        }).then((res) => {
          if (res.code === 0) {
            this.getInfo();
          }
        });
      });
    },
    // 开始处理
    deal() {
      this.$confirm('是否开始处理该稽查服务？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.toNext('开始处理');
      });
    },
    // 处理完成
    dealComplete() {
      this.$confirm('该稽查服务是否处理完成？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.toNext('处理完成');
      });
    },
    toNext(operation) {
      workOrderCommonOperator('next', {
        serviceWorkOrderId: this.workOrderId,
        operation,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('处理成功');
          this.getInfo();
        }
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/taxInspection/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-top: 10px;
    transition: all 0.3s ease-in-out;
    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }
    .header-container {
      padding-left: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
        .fold {
          cursor: pointer;
          font-size: 14px;
        }
      }
      .el-form-wrapper {
        height: calc(100vh - 312px);
        overflow-y: auto;
      }
    }
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}
</style>
