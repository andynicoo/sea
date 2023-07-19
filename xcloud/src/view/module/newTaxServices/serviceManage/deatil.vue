<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="goBack">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div>
        <SendCustomFileModal
          btnText="发送注册资料"
          :params="{
            workId: detailObj.workId,
            customerData: detailObj.customerData,
            smsSend: detailObj.smsSend,
            functionCode: detailObj.functionCode,
            countryCode: detailObj.countryCode,
            enterpriseId: detailObj.enterpriseId,
          }"
          @submit="getOrderDetail()"
          v-if="detailObj.currentNodeCode === 'NODE7'"
          v-show="hasAuthority('xcloudplat_taxServices_serviceManage_registerInfo')"
        />
        <SendEmailModal
          btnText="客户发送邮件状态"
          :params="{
            workId: detailObj.workId,
            emailSend: detailObj.emailSend,
            functionCode: detailObj.functionCode,
          }"
          @submit="getOrderDetail()"
          v-if="detailObj.currentNodeCode === 'NODE7'"
          v-show="hasAuthority('xcloudplat_taxServices_serviceManage_emailState')"
        />

        <!--  showEdit 控制显示赢藏的计算属性 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="hasAuthority('K1_9') && showEdit && !isEdit">编辑</el-button>
        <template v-if="isEdit">
          <el-button @click="isEdit = false">取消</el-button>
          <el-button type="primary" @click="formSave">
            {{ detailObj.currentNodeCode === currentCodeEnum.NODE5 ? '提交' : '保存' }}
          </el-button>
        </template>
        <!-- 待上传资料 -->
        <template v-if="[currentCodeEnum.NODE2].includes(detailObj.currentNodeCode)">
          <el-button type="primary" @click="submitAudit" v-show="hasAuthority('K1_10')" :disabled="!(dataReview && dataReview.length && !isEdit) || isCancel"> 提交审核 </el-button>
        </template>
        <template v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(detailObj.currentNodeCode)">
          <el-button :disabled="isCancel" @click="batchReminder" v-show="hasAuthority('K1_11')">发送提醒</el-button>
        </template>
        <!-- 已审核 -->
        <template v-if="[currentCodeEnum.NODE4].includes(detailObj.currentNodeCode)">
          <el-button type="primary" :disabled="isCancel" @click="updateAuthorizationDialog = true" v-show="hasAuthority('K1_33')">替换授权书模板</el-button>
        </template>
        <!--待审核，待授权，待提交转代理，转代理中 -->
        <template v-if="rejectNodeName">
          <el-button :disabled="isCancel" @click="rejectDialog = true" v-show="hasAuthority('K1_13')">驳回</el-button>
        </template>

        <template v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE3].includes(detailObj.currentNodeCode)">
          <el-button :disabled="isCancel" type="primary" @click="changeSupplierAddressDialog = true" v-if="detailObj.countryCode === 'GB'" v-show="hasAuthority('K1_14')"> 修改服务商地址 </el-button>
          <el-button :disabled="isCancel" type="primary" @click="changeSupplierDialog = true" v-show="hasAuthority('K1_15')">修改服务商</el-button>
        </template>

        <template v-if="[currentCodeEnum.NODE3, currentCodeEnum.NODE4].includes(detailObj.currentNodeCode)">
          <el-button :disabled="isEdit || isCancel" type="primary" @click="approved" v-show="hasAuthority('K1_16')">审核通过</el-button>
        </template>

        <template v-if="detailObj.currentNodeCode == currentCodeEnum.NODE6">
          <el-button :disabled="isCancel" type="primary" @click="submitAgent" v-show="hasAuthority('K1_17')">提交转代理</el-button>
        </template>
        <template v-if="[currentCodeEnum.NODE7].includes(detailObj.currentNodeCode)">
          <el-button :disabled="isCancel" type="primary" @click="finishSubAgent" v-show="hasAuthority('K1_18')">完成转代理</el-button>
        </template>
        <el-button :disabled="isCancel" type="primary" @click="startTaxFun" v-if="detailObj.currentNodeCode == currentCodeEnum.NODE8 && detailObj.countryCode == 'GB' && !isAuth" v-show="hasAuthority('K1_19')"> 授权报税 </el-button>
        <!-- 待审核，已审核，待授权，待提交转代理，转代理中，转代理完成 -->
        <template v-if="[currentCodeEnum.NODE3, currentCodeEnum.NODE4, currentCodeEnum.NODE5, currentCodeEnum.NODE6, currentCodeEnum.NODE7, currentCodeEnum.NODE8].includes(detailObj.currentNodeCode)">
          <a v-show="hasAuthority('K1_12')" @click="_downloadTemp" style="margin-left: 10px">
            <el-button> 下载资料 </el-button>
          </a>
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
            <!-- 动态表单组件 -->
            <el-tabs v-model="activeName" v-if="showTabs">
              <el-tab-pane label="客户资料" name="customerMaterial"></el-tab-pane>
              <el-tab-pane label="授权书" name="auth">
                <DynamicForm ref="auth" :moduleList="dataReview" :workOrderId="workOrderId" :workInfo="detailObj" />
              </el-tab-pane>
            </el-tabs>
            <!-- 动态表单组件 -->
            <DynamicForm v-show="activeName === 'customerMaterial' || !showTabs" ref="dynamicForm" :moduleList="showTabs ? firstReviewData : dataReview" :workOrderId="workOrderId" :workInfo="detailObj" />
          </div>
        </div>

        <ProxyWorkerTable v-if="detailObj.groupId" :groupId="detailObj.groupId" :functionCode="functionCode" />
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
            <WorkOrderInfo :serviceInfo="detailObj" @refresh="getOrderDetail">
              <div class="info-block-item">
                <span class="info-block-title">申报周期：</span>
                <span>{{ detailObj.declarePeriod | filterPeriodType }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">下一次申报周期：</span>
                <span v-if="beginTime && endTime">{{ beginTime }} ~ {{ endTime }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">发送注册资料：</span>
                <span>
                  <template v-if="detailObj.flagCustomerData === true"> 是 </template>
                  <template v-else-if="detailObj.flagCustomerData === false"> 否 </template>
                  <template v-else> - </template>
                </span>
                <span>
                  <SendCustomFileModal
                    btnText="操作"
                    :params="{
                      workId: detailObj.workId,
                      customerData: detailObj.customerData,
                      smsSend: detailObj.smsSend,
                      functionCode: detailObj.functionCode,
                      countryCode: detailObj.countryCode,
                      enterpriseId: detailObj.enterpriseId,
                    }"
                    @submit="getOrderDetail()"
                    v-if="detailObj.currentNodeCode === 'NODE7'"
                    v-show="hasAuthority('xcloudplat_taxServices_serviceManage_registerInfo')"
                  />
                </span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">客户发送邮件状态：</span>
                <span>
                  <template v-if="detailObj.emailSend === true"> 是 </template>
                  <template v-else-if="detailObj.emailSend === false"> 否 </template>
                  <template v-else> - </template>
                </span>
                <span>
                  <SendEmailModal
                    btnText="操作"
                    :params="{
                      workId: detailObj.workId,
                      emailSend: detailObj.emailSend,
                      functionCode: detailObj.functionCode,
                    }"
                    @submit="getOrderDetail()"
                    v-if="detailObj.currentNodeCode === 'NODE7'"
                    v-show="hasAuthority('xcloudplat_taxServices_serviceManage_emailState')"
                  />
                </span>
              </div>
            </WorkOrderInfo>
          </span>
          <span v-show="tabNav === 'all' || tabNav === 'vatInfo'">
            <VatInfo :serviceInfo="detailObj" @refresh="getOrderDetail" />
          </span>
          <OperationLog :activities="activities" v-show="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
    </div>
    <Drag style="cursor: pointer" @handlepaly="showWaringDrawer = true" :workId="workOrderId" />
    <!-- 弹窗 -->
    <Model :dialog="model" v-if="detailObj.countryCode" :workOrderId="workOrderId" :serviceInfo="detailObj" :detailObj="detailObj" :getOrderDetail="getOrderDetail" />
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="detailObj.serviceNo" />
    <ChangeSupplierDialog :changeSupplierDialog.sync="changeSupplierDialog" :functionCode="functionCode" :checkedRow="checkedRow" @refresh="getOrderDetail" />
    <RejectDialog :rejectDialog.sync="rejectDialog" :workOrderId="workOrderId" :nodeCodeName="nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getOrderDetail" />
    <UpdateAuthorizationDialog :updateAuthorizationDialog.sync="updateAuthorizationDialog" :authorizeFileInfo="authorizeFileInfo" :workOrderId="workOrderId" @refresh="getOrderDetail" />
    <ChangeSupplierAddressDialog :changeSupplierAddressDialog.sync="changeSupplierAddressDialog" :workId="workOrderId" :supplierId="detailObj.supplierId" @refresh="getOrderDetail" />
    <WaringDrawer v-if="showWaringDrawer" :visible.sync="showWaringDrawer" :detailId="workOrderId" />
  </div>
</template>

<script>
import OperationLog from '../components/OperationLog'; // 操作记录
import DynamicForm from '@/components/DynamicForm/dynamicForm'; // 表单配置
import Model from './deatilModel'; // 详情页面的所有弹窗
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import ModifyExpirationTime from '../components/modifyExpirationTime';
import WorkOrderInfo from '@/view/module/workOrder/components/common/workOrderInfo';
import VatInfo from '@/view/module/workOrder/components/common/vatInfo';
import ModifyVatTaxModel from '../components/modifyVatTaxModel';
import ModifySiretModel from '../components/modifySiretModel';

import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { ifAuth, vatObligations, mtdAuth } from '@/api/newApi/taxServices/taxRegister.js';
import { statusNodeCode } from './staticList';
import { getRejectCode } from '@/api/newApi/common.js';
import { workOrderCommonOperator, downloadUrl } from '@/components/DynamicForm/commonOperator';
import { currentCodeEnum, currentCodeList } from '@/view/module/workOrder/map.js';
import ProxyWorkerTable from '@/view/module/workOrder/components/common/proxyWorkerTable';
import ChangeSupplierDialog from '@/view/module/workOrder/components/changeSupplierDialog';
import UpdateAuthorizationDialog from '@/view/module/workOrder/components/updateAuthorizationDialog';
import RejectDialog from '@/view/module/workOrder/components/rejectDialog';
import ChangeSupplierAddressDialog from '@/view/module/workOrder/components/changeSupplierAddressDialog';
import Drag from '../../../../components/drag/dragBall';
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
import dayjs from 'dayjs';
export default {
  components: {
    OperationLog,
    DynamicForm,
    Model,
    ModifyExpirationTime,
    CheckRejectInfoDialog,
    ModifyVatTaxModel,
    ModifySiretModel,
    WorkOrderInfo,
    ProxyWorkerTable,
    ChangeSupplierDialog,
    RejectDialog,
    VatInfo,
    UpdateAuthorizationDialog,
    ChangeSupplierAddressDialog,
    Drag,
    WaringDrawer: () => import('../../../../components/waringDrawer/waringDrawer.vue'),
    SendCustomFileModal,
    SendEmailModal,
  },
  data() {
    return {
      isEdit: false,
      taxStatus: statusNodeCode,
      workOrderId: this.$route.query.workOrderId,
      functionCode: this.$constant.TAXProxy_FUNCTION_CODE,
      activeName: 'auth',
      detailObj: {}, // 详情
      model: {
        ServiceModel: false, // 服务商编码弹窗
        showVatUkModel: false, // vat 审核/英国
        progressModel: false, // 驳回操作
        finishModel: false, // 完成转代理
        addreModel: false,
        shenHeModel: false, // 审核通过,
        nodeName: '',
        taxInfoModel: false,
      },
      checkRejectInfoDialog: false,
      authorizeFileInfo: [],
      firstReview: [],
      moduleList: [], // 表单数据
      rejectNodeName: '',
      isAuth: true, //是否授权
      beginTime: '',
      endTime: '',
      tabNav: 'all',
      changeSupplierDialog: false,
      rejectDialog: false,
      updateAuthorizationDialog: false,
      changeSupplierAddressDialog: false,
      fold: false,
      currentCodeEnum,
      currentCodeList,
      showWaringDrawer: false,
    };
  },
  created() {
    this.getOrderDetail(); // 获取详情
  },
  filters: {
    filterPeriodType(periodType) {
      switch (periodType) {
        case 0:
          return '月报';
        case 1:
          return '季报';
        case 2:
          return '年报';
        default:
          return '暂无';
      }
    },
  },
  mixins: [mixin, operationLog, isServiceCancel],
  computed: {
    showEdit() {
      return [currentCodeEnum.NODE2, currentCodeEnum.NODE3, currentCodeEnum.NODE5].includes(this.detailObj.currentNodeCode) && this.activeName === 'auth';
    },
    showTabs() {
      return [this.currentCodeEnum.NODE4, this.currentCodeEnum.NODE5, this.currentCodeEnum.NODE6].includes(this.detailObj.currentNodeCode);
    },
    nodeCodeName() {
      return this.$options.filters.filterKey(this.detailObj.currentNodeCode, currentCodeList);
    },
    checkedRow() {
      let { workId, countryCode, countryNameZh, currentNodeCode } = this.detailObj;
      return {
        id: workId,
        countryCode,
        countryNameZh,
        currentNodeCode,
      };
    },
  },
  watch: {
    activeName() {
      if (this.activeName === 'customerMaterial') {
        this.isEdit = false;
      }
    },
  },
  methods: {
    _downloadTemp() {
      this.$util.downFile(downloadUrl(this.workOrderId));
    },
    // 返回列表页
    goBack() {
      if (this.$route.query.isBack) {
        this.$router.back();
      } else {
        this.$router.push({ path: '/newTaxServices/serviceManage/index' });
      }
    },
    /** 工单详情 */
    getOrderDetail() {
      workOrderCommonOperator('detail', this.workOrderId).then((res) => {
        if (res.code === 0) {
          this.activeName = 'auth';
          this.detailObj = res.data;
          // 待审核资料 && 德国 跳转新详情
          if (this.detailObj.currentNodeCode === 'NODE3' && this.detailObj.countryCode === 'DE' && localStorage.getItem('enterpriseId') === '29' && dayjs(this.detailObj.flowCreateTime).isAfter(dayjs('2023-07-06 22:30:00'))) {
            this.$router.push(`/adminNewApp/workOrder/vatServices/taxRegister/details?id=${this.detailObj.workId}`);
          }
          this.ifCancel(res.data.status);
          this.beginTime = (this.detailObj.beginTime || '').split(' ')[0];
          this.endTime = (this.detailObj.endTime || '').split(' ')[0];
          if (this.detailObj.countryCode == 'GB' && this.detailObj.currentNodeCode == currentCodeEnum.NODE8) {
            this.isHasAuth(); //授权报税
          }
          this.authorizeFileInfo = JSON.parse(JSON.stringify(res.data.dataReview));
          this.firstReview = res.data.firstReview;
          if (res.data.dataReview.length > 0) {
            if (this.detailObj.currentNodeCode === this.currentCodeEnum.NODE4) {
              this.moduleList = this.translateReviewIntoSourceFileUrl(res.data.dataReview);
            } else {
              this.moduleList = res.data.dataReview;
            }
          } else {
            this.getData();
          }
          this._getRejectCode();
          this.getOperationLog(this.detailObj.workNo, 3);
        }
      });
    },
    /** 字段模板获取 */
    getData() {
      getNodeField({
        nodeCode: this.detailObj.currentNodeCode,
        workFlowId: this.detailObj.workflowId,
      }).then((res) => {
        this.moduleList = res.data;
      });
    },
    /** 获取驳回节点 (驳回节点可能为空) */
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.detailObj.currentNodeCode,
        workFlowId: this.detailObj.workflowId,
      }).then((res) => {
        if (res.code == 0) {
          this.rejectNodeName = res.data.nodeName;
        }
      });
    },
    // 保存表单
    async formSave() {
      if ([this.currentCodeEnum.NODE5].includes(this.detailObj.currentNodeCode)) {
        /**待授权状态 提交表单 */
        let material = await this.$refs.auth.onSubmit();
        let { code } = await workOrderCommonOperator('uploadAuth', {
          material,
          workOrderId: this.workOrderId,
        });
        code === 0 && this.materialRefresh('commit');
      } else {
        let { code } = await this.$refs.dynamicForm.formSave();
        code === 0 && this.materialRefresh('save');
      }
    },
    materialRefresh(type) {
      this.$Message.success(`${type === 'save' ? '保存' : '提交'}成功`);
      this.isEdit = false;
      this.getOrderDetail(); // 获取详情
    },
    /** 完成转代理 */
    finishSubAgent() {
      this.model.finishModel = true;
    },
    /**
     * 发送提醒
     */
    batchReminder() {
      this.$confirm('确认提醒', '发送提醒后，客户将收到短信通知', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        workOrderCommonOperator('remind', { workOrderIds: [this.workOrderId] }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
          }
        });
      });
    },
    /**
     * 提交审核
     */
    submitAudit() {
      this.$refs.dynamicForm.onSubmit().then((material) => {
        this.$confirm('提交审核后，服务进度将流转到【待审核】', '确认提醒', {
          type: 'warning',
          customClass: 'custom-confirm',
          dangerouslyUseHTMLString: true,
          center: true,
        }).then(() => {
          workOrderCommonOperator('commit', {
            workOrderId: this.workOrderId,
            material,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('审核成功');
              this.isEdit = false;
              this.getOrderDetail();
            }
          });
        });
      });
    },
    /** 审核通过 */
    approved() {
      this.$refs.dynamicForm.onSubmit().then((materialData) => {
        if (this.detailObj.countryCode == 'FR' || this.detailObj.countryCode == 'IT') {
          this.model.shenHeModel = true;
        } else {
          this.$confirm('确认审核通过？', '提示', {
            type: 'warning',
            customClass: 'custom-confirm',
            dangerouslyUseHTMLString: true,
            center: true,
          }).then(() => {
            workOrderCommonOperator('next', {
              serviceWorkOrderId: this.workOrderId,
              operation: '审核通过',
            }).then((res) => {
              if (res.code == 0) {
                this.$message.success('审核成功');
                this.getOrderDetail();
              }
            });
          });
        }
      });
    },
    /**
     * 提交转代理
     */
    submitAgent() {
      this.$confirm("<div>确定要提交资料吗？</div><div class='text-tips font-12 '>确认提交后，注册次数自动+1</div>", '提交资料确认', {
        type: 'warning',
        customClass: 'custom-confirm',
        dangerouslyUseHTMLString: true,
        center: true,
      }).then(() => {
        workOrderCommonOperator('next', {
          serviceWorkOrderId: this.workOrderId,
          operation: '提交转代理',
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功');
            this.getOrderDetail();
          }
        });
      });
    },
    /** 先查询是否授权 */
    isHasAuth() {
      ifAuth({
        workOrderId: this.workOrderId,
        // serviceId: this.detailObj.serviceId,
        vatTaxNumber: this.detailObj.vatTaxNumber,
        userId: this.detailObj.userId,
      }).then((res) => {
        if (res.code === 0) {
          this.isAuth = res.data;
          if (res.data == false) {
            this.$message.warning('该公司还没授权，请点击授权报税按钮进行授权');
          } else {
            if (this.detailObj.status == 1) {
              this.getVatObligations();
              this.$store.commit('hasAuth', {
                vatTaxNumber: this.detailObj.vatTaxNumber,
                auth: true,
              });
            }
          }
        }
      });
    },
    // 检索增值税义务
    getVatObligations() {
      vatObligations({
        serviceId: this.detailObj.serviceId,
        vatTaxNumber: this.detailObj.vatTaxNumber,
      }).then((res) => {
        if (res.code === 0) {
          // this.getWorkOrderDetail();
        }
      });
    },
    //税局getway 进去授权
    startTaxFun() {
      ifAuth({
        location: 2,
        workOrderId: this.workOrderId,
        // serviceId: this.detailObj.serviceId,
        vatTaxNumber: this.detailObj.vatTaxNumber,
        userId: this.detailObj.userId,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data) {
            this.getVatObligations();
          } else {
            this.getwayFun();
          }
        }
      });
    },
    // 税局getway 进去授权
    getwayFun() {
      mtdAuth({
        serviceId: this.detailObj.serviceId,
        vatTaxNumber: this.detailObj.vatTaxNumber,
        location: 2,
        userId: this.detailObj.userId,
      }).then((res) => {
        if (res.code === 0) {
          window.location.href = res.data;
        }
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
