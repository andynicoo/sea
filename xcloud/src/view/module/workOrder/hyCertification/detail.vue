<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="hasAuthority('N1_7') && showEdit && !isEdit">编辑</el-button>
        <template v-if="isEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave">保存</el-button>
        </template>
        <!-- 待上传资料 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE2">
          <el-button size="small" v-show="hasAuthority('N1_8')" type="primary" @click="submitAudit" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel">提交审核</el-button>
        </template>
        <!-- 修改服务商 -->
        <el-button :disabled="isCancel" size="small" v-if="hasAuthority('N1_9') && [currentCodeEnum.NODE2, currentCodeEnum.NODE3].includes(info.currentNodeCode)" @click="changeSupplierDialog = true">修改服务商</el-button>
        <!-- 修改服务商 -->
        <!-- <el-button :disabled="isCancel" size="small" v-show="hasAuthority('N1_17')" @click="updateHagueServeDialog = true">修改海牙服务商</el-button> -->
        <!-- 下载资料 -->
        <el-button v-if="hasAuthority('N1_10') && info.currentNodeCode && info.currentNodeCode !== currentCodeEnum.NODE2">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>
        <!-- 驳回按钮 -->
        <el-button :disabled="isCancel" size="small" @click="rejectDialog = true" v-if="hasAuthority('N1_11') && rejectNodeName">驳回</el-button>
        <!-- 待审核 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE3">
          <el-button size="small" v-show="hasAuthority('N1_12')" type="primary" @click="audit" :disabled="isEdit || isCancel">审核通过</el-button>
        </template>
        <!-- 待授权 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE5">
          <el-button :disabled="isCancel" size="small" type="primary" v-show="hasAuthority('N1_13')" @click="sendProviderDialog = true">已发送服务商</el-button>
        </template>
        <!-- 海牙认证中 -->
        <template v-if="info.currentNodeCode === currentCodeEnum.NODE7">
          <el-button :disabled="isCancel" size="small" type="primary" v-show="hasAuthority('N1_14')" @click="showHYFile(false)">上传海牙文件</el-button>
        </template>
        <!-- 认证完成 -->
        <el-button v-if="info.currentNodeCode === currentCodeEnum.NODE8">
          <a :href="info.hyFile" target="_blank" v-show="hasAuthority('N1_15')">查看海牙文件</a>
        </el-button>
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
            <template v-if="info.currentNodeCode === currentCodeEnum.NODE2">
              <div class="tips">温馨提示：若您要认证的公司已在本平台进行税务代理，那么只需选择公司名称，平台会自动补充其它相关资料</div>
              <el-divider></el-divider>
            </template>

            <DynamicForm ref="dynamicForm" :moduleList="dataReview" :workOrderId="workOrderId" :workInfo="info" />
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
            <WorkOrderInfo :serviceInfo="info" @refresh="getInfo">
              <div class="info-block-item">
                <span class="info-block-title">海牙编号：</span>
                <span>{{ info.fileEncode }}</span>
                <el-link type="primary" :underline="false" icon="el-icon-edit" @click="showHYFile(true)" v-if="info.currentNodeCode === currentCodeEnum.NODE8"></el-link>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">客户寄来物流：</span>
                <span>{{ info.customerLogisticsProviders }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">客户寄来单号：</span>
                <span>{{ info.customerTrackingNumber }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">客户寄来日期：</span>
                <span>{{ info.customerSendTime }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">寄出物流：</span>
                <span>{{ info.logisticsProviders }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">寄出单号：</span>
                <span>{{ info.hyTrackingNumber }}</span>
              </div>
            </WorkOrderInfo>
          </span>
          <span v-show="tabNav === 'all' || tabNav === 'vatInfo'">
            <VatInfo :serviceInfo="info" @refresh="getInfo" />
          </span>
          <OperationLog :activities="activities" v-show="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="serviceNo" />
      <RejectDialog :rejectDialog.sync="rejectDialog" :workOrderId="workOrderId" :nodeCodeName="nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo" />
      <!-- <AuditDialog :auditDialog.sync="auditDialog" :serviceId="info.serviceId" :supplierId="info.supplierId" @refresh="getInfo" /> -->
      <ChangeSupplierDialog :changeSupplierDialog.sync="changeSupplierDialog" :functionCode="functionCode" :checkedRow="checkedRow" @refresh="getInfo" />
      <SendProviderDialog :sendProviderDialog.sync="sendProviderDialog" :workId="workOrderId" @refresh="getInfo" />
      <UploadHYFileDialog :uploadHYFileDialog.sync="uploadHYFileDialog" :editHYFile="editHYFile" :fEncode="info.fileEncode" :workId="workOrderId" @refresh="getInfo" />
      <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :countryNameZh="info.countryNameZh" :countryCode="info.countryCode" :serviceId="info.serviceId" @refresh="getInfo" />
      <updateHagueServeDialog :isShow.sync="updateHagueServeDialog" :countryCode="info.countryCode" :workId="info.serviceId" @refresh="getInfo" />
    </div>
  </div>
</template>

<script>
import * as comps from './components/index';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import { getRejectCode } from '@/api/newApi/common';
import hyLink from '@/view/module/workOrder/mixin/hyLink';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import { mapMutations } from 'vuex';
import { currentCodeEnum, currentCodeList } from '@/view/module/workOrder/map.js';
import RejectDialog from '@/view/module/workOrder/components/rejectDialog';
import ChangeSupplierDialog from '@/view/module/workOrder/components/changeSupplierDialog';
import WorkOrderInfo from '@/view/module/workOrder/components/common/workOrderInfo';
import VatInfo from '@/view/module/workOrder/components/common/vatInfo';
import { downloadUrl } from '@/components/DynamicForm/commonOperator';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  mixins: [hyLink, operationLog, isServiceCancel],
  components: {
    ...comps,
    OperationLog,
    DynamicForm,
    FormTitle,
    CheckRejectInfoDialog,
    RejectDialog,
    ChangeSupplierDialog,
    WorkOrderInfo,
    VatInfo,
  },
  data() {
    return {
      serviceNo: this.$route.query.serviceNo,
      workOrderId: this.$route.query.workOrderId,
      functionCode: this.$constant.HYCERTIFICATION_FUNCTION_CODE,
      info: {},
      moduleList: [],
      currentCodeEnum,
      rejectDialog: false,
      auditDialog: false,
      sendProviderDialog: false,
      uploadHYFileDialog: false,
      editHYFile: false,
      checkRejectInfoDialog: false,
      changeServiceProviderDialog: false,
      updateHagueServeDialog: false,
      changeSupplierDialog: false,
      isEdit: false,
      rejectNodeName: '',
      tabNav: 'all',
      fold: false,
    };
  },
  computed: {
    showEdit() {
      return [this.currentCodeEnum.NODE2, this.currentCodeEnum.NODE3].includes(this.info.currentNodeCode);
    },
    nodeCodeName() {
      return this.$options.filters.filterKey(this.info.currentNodeCode, currentCodeList);
    },
    checkedRow() {
      let { workId, countryCode, countryNameZh, currentNodeCode } = this.info;
      return {
        id: workId,
        countryCode,
        countryNameZh,
        currentNodeCode,
      };
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    _downloadTemp() {
      this.$util.downFile(downloadUrl(this.workOrderId));
    },
    getInfo() {
      workOrderCommonOperator('detail', this.workOrderId).then((res) => {
        try {
          res.data.remark = JSON.parse(res.data.remark).creator.remark;
        } catch (error) {}
        this.info = res.data;
        this.ifCancel(res.data.status);
        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        } else {
          this.getData();
        }
        this._getRejectCode();
        this.getOperationLog(this.info.workNo, 3);
      });
    },
    getData() {
      getNodeField({
        nodeCode: this.info.currentNodeCode,
        workFlowId: this.info.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.info.currentNodeCode,
        workFlowId: this.info.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    submitAudit() {
      this.$refs.dynamicForm.onSubmit().then((materialData) => {
        this.$confirm('提交审核后，服务进度将流转到【待审核】是否确认提交？', '确认提醒', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          workOrderCommonOperator('next', {
            serviceWorkOrderId: this.workOrderId,
            operation: '提交审核',
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.getInfo();
            }
          });
        });
      });
    },
    showHYFile(flag) {
      this.uploadHYFileDialog = true;
      this.editHYFile = flag;
    },
    // 保存
    formSave() {
      this.$refs.dynamicForm.formSave().then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
          this.isEdit = false;
          this.getInfo();
        }
      });
    },
    audit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
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
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/hyCertification/index',
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
