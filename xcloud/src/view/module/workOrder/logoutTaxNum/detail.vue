<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <!-- 待上传资料 -->
        <template v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(info.currentNodeCode)">
          <el-button :disabled="isCancel" size="small" type="primary" @click="submit" v-show="hasAuthority('P1_5')">提交</el-button>
        </template>
        <!-- 已审核 -->
        <template v-if="[currentCodeEnum.NODE4].includes(info.currentNodeCode)">
          <el-button type="primary" :disabled="isCancel" @click="updateAuthorizationDialog = true" v-show="hasAuthority('P1_13')">替换授权书模板</el-button>
        </template>
        <!-- 待审核 -->
        <template v-if="[currentCodeEnum.NODE3, currentCodeEnum.NODE4, currentCodeEnum.NODE6].includes(info.currentNodeCode)">
          <el-button :disabled="isCancel" size="small" type="primary" @click="audit" v-show="hasAuthority('P1_6')">审核通过</el-button>
        </template>
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="hasAuthority('P1_7') && rejectNodeName">驳回</el-button>
        <!-- 注销中 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE7">
          <!-- <el-button :disabled="isCancel" size="small" type="primary" @click="logoutFail" v-show="hasAuthority('P1_8')">注销失败</el-button> -->
          <el-button :disabled="isCancel" size="small" type="primary" @click="logoutCompleteDialog = true" v-show="hasAuthority('P1_9')">完成注销</el-button>
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
            <el-tabs v-model="activeName" v-if="showTabs">
              <el-tab-pane label="客户资料" name="customerMaterial"></el-tab-pane>
              <el-tab-pane label="授权书" name="auth">
                <DynamicForm ref="auth" :moduleList="dataReview" :workOrderId="workOrderId" :workInfo="info" />
              </el-tab-pane>
            </el-tabs>
            <!-- 动态表单组件 -->
            <DynamicForm v-show="activeName === 'customerMaterial' || !showTabs" ref="dynamicForm" :moduleList="showTabs ? firstReviewData : dataReview" logoutTaxNum :logoutTaxNumCountry="info.countryNameZh" :workOrderId="workOrderId" :workInfo="info" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="工单信息"></el-tab-pane>
          <el-tab-pane name="vatInfo" label="税号信息"></el-tab-pane>
          <el-tab-pane name="receiptFile" label="注销文件" v-if="info.currentNodeCode === currentCodeEnum.NODE8"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <span v-show="tabNav === 'all' || tabNav === 'serviceInfo'">
            <WorkOrderInfo :serviceInfo="info" @refresh="getInfo"></WorkOrderInfo>
          </span>
          <span v-show="tabNav === 'all' || tabNav === 'vatInfo'">
            <VatInfo :serviceInfo="info" @refresh="getInfo" />
          </span>
          <span v-show="info.currentNodeCode === currentCodeEnum.NODE8 && (tabNav === 'all' || tabNav === 'receiptFile')">
            <div class="block-title">
              <span>注销文件</span>
              <el-link type="primary" :underline="false" style="float: right" @click="changeFile" v-show="hasAuthority('P1_10')">修改文件</el-link>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注销文件：</span>
              <el-link type="primary" :underline="false" :href="info.receiptFile" target="_blank">注销回执</el-link>
            </div>
          </span>
          <OperationLog :activities="activities" v-show="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <RejectDialog :rejectDialog.sync="rejectDialog" :workOrderId="workOrderId" :nodeCodeName="nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo" />
      <LogoutCompleteDialog :logoutCompleteDialog.sync="logoutCompleteDialog" :workOrderId="workOrderId" :changeFlag="changeFlag" :file="info.receiptFile" @refresh="getInfo"></LogoutCompleteDialog>
      <UpdateAuthorizationDialog :updateAuthorizationDialog.sync="updateAuthorizationDialog" :authorizeFileInfo="authorizeFileInfo" :workOrderId="workOrderId" @refresh="getInfo" />
    </div>
  </div>
</template>

<script>
import * as comps from './components/index';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import { handleWorkOrderToReject } from '@/api/newApi/workOrder/logoutTaxNum';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getRejectCode } from '@/api/newApi/common';
import taxRefundLink from '@/view/module/workOrder/mixin/taxRefundLink';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import { currentCodeEnum, currentCodeList } from '@/view/module/workOrder/map.js';
import RejectDialog from '@/view/module/workOrder/components/rejectDialog';
import UpdateAuthorizationDialog from '@/view/module/workOrder/components/updateAuthorizationDialog';
import WorkOrderInfo from '@/view/module/workOrder/components/common/workOrderInfo';
import VatInfo from '@/view/module/workOrder/components/common/vatInfo';
export default {
  data() {
    return {
      workOrderId: this.$route.query.workOrderId,
      userId: this.$route.query.userId,
      countryCode: '', // mixins获取用户公司列表用到
      functionCode: this.$constant.LOGOUTTAXNUM_FUNCTION_CODE,
      currentCodeEnum,
      currentCodeList,
      info: {},
      activeName: 'auth',
      authorizeFileInfo: [],
      firstReview: [],
      moduleList: [],
      rejectDialog: false,
      logoutCompleteDialog: false,
      updateAuthorizationDialog: false,
      rejectNodeName: '',
      changeFlag: false,
      tabNav: 'all',
      fold: false,
    };
  },
  mixins: [taxRefundLink, operationLog, isServiceCancel],
  components: {
    ...comps,
    OperationLog,
    DynamicForm,
    RejectDialog,
    UpdateAuthorizationDialog,
    WorkOrderInfo,
    VatInfo,
  },
  mounted() {
    this.init();
  },
  computed: {
    showEdit() {
      return [this.currentCodeEnum.NODE2, this.currentCodeEnum.NODE5].includes(this.info.currentNodeCode) && this.activeName === 'auth';
    },
    nodeCodeName() {
      return this.$options.filters.filterKey(this.info.currentNodeCode, currentCodeList);
    },
    showTabs() {
      return [this.currentCodeEnum.NODE4, this.currentCodeEnum.NODE5, this.currentCodeEnum.NODE6].includes(this.info.currentNodeCode);
    },
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
          this.activeName = 'auth';
          this.changeFlag = false;
          this.info = res.data;
          this.countryCode = res.data.countryCode;
          this.ifCancel(res.data.status);
          this.authorizeFileInfo = JSON.parse(JSON.stringify(res.data.dataReview));
          this.firstReview = res.data.firstReview;
          this._getRejectCode();
          this.getOperationLog(this.info.workNo, 3);
          resolve();
        });
      });
    },
    getReview() {
      if (this.info.dataReview && this.info.dataReview.length) {
        if (this.info.currentNodeCode === this.currentCodeEnum.NODE4) {
          this.moduleList = this.translateReviewIntoSourceFileUrl(this.info.dataReview);
        } else {
          this.moduleList = this.info.dataReview;
        }
      } else {
        this.getData();
      }
    },
    // 获取动态表单初始化数据
    getData() {
      getNodeField({
        nodeCode: this.info.currentNodeCode,
        nodeId: '',
        workFlowId: this.info.workflowId,
      }).then((res) => {
        this.moduleList = res.data;
      });
    },
    // 获取驳回节点
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.info.currentNodeCode,
        nodeId: this.info.nodeId,
        workFlowId: this.info.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    // 提交
    async submit() {
      if ([this.currentCodeEnum.NODE5].includes(this.info.currentNodeCode)) {
        /**待授权状态 提交表单 */
        let material = await this.$refs.auth.onSubmit();
        let { code } = await workOrderCommonOperator('uploadAuth', {
          material,
          workOrderId: this.workOrderId,
        });
        code === 0 && this.materialRefresh();
      } else {
        let { code } = await this.$refs.dynamicForm.formSubmit();
        code === 0 && this.materialRefresh();
      }
    },
    materialRefresh(type) {
      this.$Message.success(`提交成功`);
      this.getInfo(); // 获取详情
    },

    // 审核通过
    audit() {
      this.$confirm('确认审核通过？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        workOrderCommonOperator('next', {
          serviceWorkOrderId: this.workOrderId,
          operation: '审核通过',
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('审核成功');
            this.getInfo();
          }
        });
      });
    },
    // 注销失败
    logoutFail() {
      this.$prompt('', '注销失败', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入失败原因',
      }).then(({ value }) => {
        handleWorkOrderToReject({
          cancelReason: value,
          workId: this.workOrderId,
        }).then((res) => {
          this.getInfo();
        });
      });
    },
    // 修改注销回执
    changeFile() {
      this.logoutCompleteDialog = true;
      this.changeFlag = true;
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/logoutTaxNum/index',
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
