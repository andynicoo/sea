<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <SendCustomFileModal
          btnText="发送注册资料"
          :params="{
            serviceId: orderServices.id,
            customerData: orderServices.customerData,
            smsSend: orderServices.smsSend,
            functionCode: orderServices.productFunctionCode,
            countryCode: orderServices.countryCode,
            enterpriseId: orderServices.enterpriseId,
          }"
          @submit="getInfo()"
          v-if="orderServicesVO.cureentNodeCode === 'NODE0065' || orderServicesVO.cureentNodeCode === 'NODE0265'"
          v-show="hasAuthority('xcloudplat_workOrder_EPRTaxServices_registerInfo')"
        />
        <SendEmailModal
          btnText="客户发送邮件状态"
          :params="{
            serviceId: orderServices.id,
            emailSend: orderServices.emailSend,
            functionCode: orderServices.productFunctionCode,
          }"
          @submit="getInfo()"
          v-if="orderServicesVO.cureentNodeCode === 'NODE0065' || orderServicesVO.cureentNodeCode === 'NODE0265'"
          v-show="hasAuthority('xcloudplat_workOrder_EPRTaxServices_emailState')"
        />

        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="showEdit && !isEdit && hasAuthority('N2_8')">编辑</el-button>
        <template v-if="isEdit && showEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave" v-show="hasAuthority('N2_9')">保存</el-button>
        </template>

        <!-- 授权书编辑 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="showEditAuth && !isEdit && hasAuthority('J2_7')">编辑</el-button>
        <template v-if="isEdit && showEditAuth">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSubmitAuth" v-show="hasAuthority('J2_8')">提交</el-button>
        </template>

        <!-- 待上传资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD">
          <!-- <el-button size="small" type="primary" @click="changeServiceProviderDialog = true"">修改服务商</el-button> -->
          <el-button size="small" type="primary" @click="submit" v-show="hasAuthority('N2_10')" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel">提交</el-button>
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('N2_11')">修改服务商</el-button>
          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('N2_12')">发送提醒</el-button>
        </template>
        <!-- 待审核资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_REVIEW">
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('N2_11')">修改服务商</el-button>
          <el-button size="small" type="primary" @click="audit" :disabled="isEdit || isCancel" v-show="hasAuthority('N2_13')">审核</el-button>
        </template>
        <!-- 驳回按钮 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="rejectNodeName" v-show="hasAuthority('N2_14')">驳回</el-button>

        <!-- 已审核 -->
        <template v-if="info.nodeCode === progressBarObj.REVIEWED">
          <el-button
            :disabled="isCancel"
            size="small"
            type="primary"
            @click="
              uploadCertificateDialog = true;
              isReplace = false;
            "
            v-show="hasAuthority('N2_20')"
            >替换授权书</el-button
          >
          <el-button size="small" type="primary" @click="audit" :disabled="isCancel" v-show="hasAuthority('N2_21')">审核通过</el-button>
        </template>

        <!-- 待授权 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_AUTHORIZE">
          <el-button :disabled="isCancel" size="small" type="primary" @click="sendRemind" v-show="hasAuthority('N2_12')">发送提醒</el-button>
        </template>
        <!-- 授权待确认 -->
        <template v-if="info.nodeCode === progressBarObj.AUTHORIZE_WAIT_CONFIRM">
          <!-- <el-button size="small" type="primary" @click="rejectAuthorizationFunc" :disabled="isEdit">授权驳回</el-button> -->
          <el-button size="small" type="primary" @click="commitSupplierFunc" :disabled="isEdit || isCancel" v-show="hasAuthority('N2_15')">提交服务商</el-button>
        </template>
        <!-- 下载资料 -->
        <el-button v-if="info.nodeCode && info.nodeCode !== progressBarObj.WAIT_UPLOAD && hasAuthority('N2_16')">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>
        <!-- 转代理中 -->
        <template v-if="info.nodeCode === progressBarObj.REGISTERING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="recordDialog = true" v-show="hasAuthority('N2_17')">录入转代理结果</el-button>
          <el-button :disabled="isCancel || !eprBaseInfo.registrationReceipt.length" size="small" type="primary" @click="completeDialog = true" v-show="hasAuthority('N2_18')">录入完成</el-button>
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ info.nodeCodeName }}</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <!-- <div style="text-align: right; height: 20px" >
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="isEdit = true"
              v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD || info.nodeCode === progressBarObj.WAIT_REVIEW"
            >
              编辑
            </el-link>
          </div> -->
          <div class="el-form-wrapper">
            <!-- 动态表单组件 -->
            <el-tabs v-model="activeName" v-if="showTabs">
              <el-tab-pane label="客户资料" name="customerMaterial"></el-tab-pane>
              <el-tab-pane label="授权书" name="auth">
                <DynamicForm ref="auth" :moduleList="authReview" :showSampleFile="true" :workOrderId="serviceId" :workInfo="info" />
              </el-tab-pane>
            </el-tabs>
            <DynamicForm v-show="activeName === 'customerMaterial' || !showTabs" ref="dynamicForm" :moduleList="dataReview" isEPRTaxServices :countryCode="info.orderServices ? info.orderServices.countryCode : ''" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备案：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span>{{ info.nodeCodeName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ orderServices.serviceName }} <span v-if="orderServicesVO.specName">({{ orderServicesVO.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ orderServices.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServices.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ orderServices.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ eprBaseInfo.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ eprBaseInfo.completionTime }}</span>
            </div>
            <div v-if="[progressBarObj.REGISTERING, progressBarObj.REGISTER_COMPLETE, progressBarObj.AUTHORIZE_WAIT_CONFIRM].includes(info.nodeCode)">
              <div class="block-title">文件信息</div>
              <div class="sub-title">授权资料</div>
              <div v-for="item in authFileLists" :key="item.id" class="info-block-item">
                <span class="info-block-title">{{ item.keyLabel }}：</span>
                <span v-if="!lodash.isEmpty(item.reView)">
                  <el-link v-for="(img, i) in $util.convertImage(item.reView)" :key="i" :href="img" type="primary" target="_blank" style="vertical-align: initial"> 查看 </el-link>
                </span>
              </div>

              <div v-for="item in info.downloadTemplateList" :key="item.id" class="info-block-item">
                <span class="info-block-title">{{ item.templateName }}：</span>
                <span v-if="item.templateUrl">
                  <el-link style="vertical-align: initial" :href="item.templateUrl" type="primary" target="_blank"> 查看 </el-link>
                </span>
              </div>
              <div v-if="!authFileLists.length && !info.downloadTemplateList.length" class="info-block-item">
                <span class="info-block-title">暂无</span>
              </div>
            </div>

            <!-- <div v-if="info.nodeCode === progressBarObj.WAIT_RECOVER || info.nodeCode === progressBarObj.AUTH_RECOVER || info.nodeCode == progressBarObj.REGISTER_COMPLETE">
              <div class="sub-title">缴费信息</div>
              <div class="info-block-item">
                <span class="info-block-title">账单：</span>
                <span v-for="(item, i) in eprBaseInfo.billFiles" :key="i" style="margin-right: 10px">
                  <el-link style="vertical-align: initial" v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">查看</el-link>
                </span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">缴费凭证：</span>
                <span v-for="item in eprBaseInfo.voucherFiles" :key="item" style="margin-right: 10px">
                  <el-link target="_blank" :href="item" type="primary" :underline="false" style="margin-right: 10px; vertical-align: initial"> 查看 </el-link>
                </span>
              </div>
            </div> -->
            <div v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE">
              <div class="sub-title">下号信息</div>
              <div class="info-block-item">
                <span class="info-block-title">证书：</span>
                <span v-for="(item, i) in eprBaseInfo.registrationReceipt" :key="i" style="margin-right: 10px">
                  <el-link style="vertical-align: initial" v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">查看</el-link>
                  <!-- <i class="el-icon-delete" @click="deleteCertificate(i)" style="margin-left:6px;font-size:16px;vertical-align:middle;cursor:pointer"></i> -->
                </span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">UIN号：</span>
                <span style="margin-right: 10px">{{ eprBaseInfo.uinStr }}</span>
                <el-button v-if="eprBaseInfo.uinStr" id="uinStr" data-clipboard-action="copy" :data-clipboard-text="eprBaseInfo.uinStr" type="text" size="mini" @click="copyUIN">复制</el-button>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务截止时间：</span>
                <span>{{ eprBaseInfo.expirationTime }}</span>
              </div>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
            <div class="block-title">用户信息</div>
            <div class="info-block-item" v-if="userInfo && userInfo.userLogin">
              <span class="info-block-title">手机号：</span>
              <span>{{ userInfo.userLogin.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ orderServices.companyNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">发送注册资料：</span>
              <span>
                <template v-if="orderServices.flagCustomerData === true"> 是 </template>
                <template v-else-if="orderServices.flagCustomerData === false"> 否 </template>
                <template v-else> - </template>
              </span>
              <span>
                <SendCustomFileModal
                  btnText="操作"
                  :params="{
                    serviceId: orderServices.id,
                    customerData: orderServices.customerData,
                    smsSend: orderServices.smsSend,
                    functionCode: orderServices.productFunctionCode,
                    countryCode: orderServices.countryCode,
                    enterpriseId: orderServices.enterpriseId,
                  }"
                  @submit="getInfo()"
                  v-if="orderServicesVO.cureentNodeCode === 'NODE0065' || orderServicesVO.cureentNodeCode === 'NODE0265'"
                  v-show="hasAuthority('xcloudplat_workOrder_EPRTaxServices_registerInfo')"
                />
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">客户发送邮件状态：</span>
              <span>
                <template v-if="orderServices.emailSend === true"> 是 </template>
                <template v-else-if="orderServices.emailSend === false"> 否 </template>
                <template v-else> - </template>
              </span>
              <span>
                <SendEmailModal
                  btnText="操作"
                  :params="{
                    serviceId: orderServices.id,
                    emailSend: orderServices.emailSend,
                    functionCode: orderServices.productFunctionCode,
                  }"
                  @submit="getInfo()"
                  v-if="orderServicesVO.cureentNodeCode === 'NODE0065' || orderServicesVO.cureentNodeCode === 'NODE0265'"
                  v-show="hasAuthority('xcloudplat_workOrder_EPRTaxServices_emailState')"
                />
              </span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <CompleteDialog :completeDialog.sync="completeDialog" :serviceId="serviceId" :showTip="false" @refresh="getInfo"></CompleteDialog>

      <AuditDialog :auditDialog.sync="auditDialog" :serviceId="serviceId" :nodeCode="info.nodeCode" @refresh="getInfo"></AuditDialog>
      <RecordDialog :recordDialog.sync="recordDialog" :serviceId="serviceId" :certificates="eprBaseInfo.registrationReceipt" :uinStr="eprBaseInfo.uinStr" :countryCode="orderServices.countryCode" :billFiles="eprBaseInfo.billFiles" @refresh="getInfo"></RecordDialog>
      <UINDialog :UINDialog.sync="UINDialog" :isEditUIN="isEditUIN" :serviceId="serviceId" @refresh="getInfo"></UINDialog>
      <ChangeContractAndPower :changeContract.sync="changeContractAndPower" :fileObj="fileObj" :replace="replace" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false"></ChangeContractAndPower>
      <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :serviceId="serviceId" :countryCode="orderServices.countryCode" @refresh="getInfo"></ChangeServiceProviderDialog>
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="serviceId" :nodeCodeName="info.nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo"></RejectDialog>
      <UploadCertificateDialog :uploadCertificateDialog.sync="uploadCertificateDialog" :authorizeFileInfo="authorizeFileInfo" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false" :isReplace="isReplace"></UploadCertificateDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import CompleteDialog from '@/view/module/workOrder/components/completeDialog';
import * as comps from './components/index';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getAuthAgentInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import { saveEpr, submitEpr, eprCheck, eprRejectAuthorization, eprCommitSupplier, eprCertificate, eprNotice } from '@/api/newApi/workOrder/EPRManage';
import { getRejectCode } from '@/api/newApi/common';
import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
import lodash from 'lodash';
export default {
  data() {
    return {
      lodash,
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      isEdit: false,
      completeDialog: false,
      info: {},
      eprBaseInfo: {},
      authorizedAgentWorkOrder: {},
      orderServices: {},
      orderServicesVO: {},
      fileObj: '',
      replace: false,
      moduleList: [],
      countrySelectList: [],
      auditDialog: false,
      recordDialog: false,
      changeContractAndPower: false,
      uploadCertificateDialog: false,
      changeServiceProviderDialog: false,
      UINDialog: false,
      rejectDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      userInfo: {},
      authorizeFileInfo: [],
      isReplace: false,
      isEditUIN: false,
      fold: false,
      activeName: 'auth',
      resAuthReview: [],
      isShowDownloadTemplateList: false,
    };
  },
  mixins: [mixin, operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    CompleteDialog,
    SendCustomFileModal,
    SendEmailModal,
  },
  computed: {
    showEdit() {
      return this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.info.nodeCode === this.progressBarObj.WAIT_REVIEW;
    },
    // 授权书节点
    showEditAuth() {
      return this.activeName === 'auth' && [this.progressBarObj.WAIT_AUTHORIZE].includes(this.info.nodeCode);
    },
    authReview() {
      if (this.showEditAuth) {
        this.resAuthReview.forEach((pro) => {
          pro.columns.forEach((item) => {
            if (!item.hasOwnProperty('disabled')) {
              this.$set(item, 'disabled', !this.isEdit);
            } else {
              item.disabled = !this.isEdit;
            }
          });
        });
        return this.resAuthReview;
      }
      return [];
    },
    showTabs() {
      return [progressBarObj.WAIT_AUTHORIZE].includes(this.info.nodeCode);
    },
    authFileLists() {
      return this.info?.authorizeColumns || [];
    },
  },
  watch: {
    activeName() {
      if (this.activeName === 'customerMaterial') {
        this.isEdit = false;
      }
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    _downloadTemp() {
      downloadTemp(this.serviceId).then((res) => {
        if (res.message) {
          this.$message.error(res.message);
        } else {
          window.open(this.baseUrl + '/workorder/management/vat/download/' + this.serviceId);
        }
      });
    },
    getInfo() {
      getAuthAgentInfo({
        serviceId: this.serviceId,
      }).then((res) => {
        this.info = res.data;

        this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
        this.orderServices = res.data.orderServices;
        this.orderServicesVO = res.data.orderServicesVO;
        this.ifCancel(res.data.orderServices.status);
        this.userInfo = res.data.userInfoVo;
        this.resAuthReview = this.translateReviewIntoSourceFileUrl(res.data.dataReview);
        if (res.data.dataReview.length) {
          if ([this.progressBarObj.WAIT_UPLOAD, this.progressBarObj.WAIT_REVIEW, this.progressBarObj.REGISTER_COMPLETE].includes(res.data.nodeCode)) {
            this.moduleList = res.data.dataReview;
          } else {
            this.moduleList = res.data.firstReview;
            this.authorizeFileInfo = res.data.dataReview;
          }
          this.eprBaseInfo = res.data.eprWorkOrder;
        } else {
          this.getData();
        }
        this._getRejectCode();
        this.getOperationLog(this.orderServices.serviceNo, 2);
      });
    },
    getData() {
      getNodeField({
        nodeCode: this.info.nodeCode,
        nodeId: '',
        workFlowId: this.orderServices.workflowId,
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
        nodeCodeName: this.info.nodeCodeName,
        nodeId: this.info.nodeId,
        workFlowId: this.orderServices.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    // 发送提醒
    sendRemind() {
      this.$confirm('系统将给客户发送短信，提醒客户提交资料，是否确认发送短信？', '短信提醒', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        eprNotice({
          idColl: [this.serviceId],
          code: this.info.nodeCode,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('发送成功！');
          }
        });
      });
    },
    showUINModal(falg) {
      this.isEditUIN = falg;
      this.UINDialog = true;
    },
    // 提交
    submit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          submitEpr({
            materialData: info,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.getInfo();
            }
          });
        });
      });
    },
    // 保存
    formSave() {
      this.$refs.dynamicForm.onSave().then((materialData) => {
        saveEpr({
          materialData,
          serviceId: this.serviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('保存成功');
            this.isEdit = false;
            this.getInfo();
          }
        });
      });
    },
    formSubmitAuth() {
      this.$refs.auth.onSubmit().then((materialData) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(async () => {
          // const clientMaterialData = await this.$refs.dynamicForm.onSave();
          // const materialData = JSON.stringify({ ...JSON.parse(authMaterialData), ...JSON.parse(clientMaterialData) });
          submitEpr({
            materialData,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.isEdit = false;
              this.getInfo();
            }
          });
        });
      });
    },
    // 审核
    audit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('确认审核通过？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          eprCheck({
            status: 1,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('审核成功');
              this.getInfo();
            }
          });
        });
      });
    },
    // 提交服务商
    commitSupplierFunc() {
      this.$confirm('确认提交服务商？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        eprCommitSupplier(this.serviceId).then((res) => {
          if (res.code === 0) {
            this.$message.success('审核成功');
            this.getInfo();
          }
        });
      });
    },
    // 授权驳回
    rejectAuthorizationFunc() {
      this.$confirm('客户上传的授权书或者合同有误，需要客户重新提交', '驳回', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(() => {
          eprRejectAuthorization({
            serviceId: this.serviceId,
            remark: '客户上传的授权书或者合同有误，需要客户重新提交',
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('审核成功');
              this.getInfo();
            }
          });
        })
        .catch((action) => {});
    },
    // 录入转代理
    completeRegister() {
      // this.$confirm('确认录入完成吗？', '提示', {
      //   customClass: 'custom-confirm',
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true,
      // }).then(() => {
      //   eprComplete(this.serviceId).then((res) => {
      //     if (res.code === 0) {
      //       this.$message.success('操作成功');
      //       this.getInfo();
      //     }
      //   });
      //
      // });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/EPRTaxServices/index',
      });
    },
    ifBack() {
      if (this.isEdit) {
        this.$confirm('本页面如有填写资料，请先点击页面顶部的保存按钮保存资料，再离开', '温馨提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '我已点保存按钮',
          cancelButtonText: '还没点保存按钮',
          type: 'warning',
          center: true,
        }).then(() => {
          this.back();
        });
      } else {
        this.back();
      }
    },
    initURL(obj = '') {
      let url = '';
      if (this.IsJsonString(obj)) {
        url = this.replaceHttps(JSON.parse(obj)[0] || '');
      } else {
        url = this.replaceHttps(obj);
      }
      return url;
    },
    // 判断是不是json
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    // 删除证书
    deleteCertificate(i) {
      this.$confirm('是否确认删除证书？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        let certificatesList = this.eprBaseInfo.registrationReceipt;
        certificatesList.splice(i, 1);
        eprCertificate({
          certificates: certificatesList,
          serviceId: this.serviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getInfo();
          }
        });
      });
    },
    copyUIN() {
      //复制链接
      let _this = this;
      let clipboard = new this.clipboard('#uinStr');
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
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
.sub-title {
  font-size: 12px;
  margin: 8px 0;
  font-weight: bold;
  color: #333;
}
</style>
