<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div>
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="hasAuthority('X1_7') && showEdit && !isEdit"> 编辑 </el-button>
        <template v-if="isEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave">保存</el-button>
        </template>
        <!-- 待上传资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD">
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('X1_8')"> 修改服务商 </el-button>
          <el-button size="small" type="primary" @click="submit" v-show="hasAuthority('X1_9')" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel"> 提交 </el-button>
          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('X1_10')">发送提醒</el-button>
        </template>
        <!-- 待审核资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_REVIEW">
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('X1_8')"> 修改服务商 </el-button>
          <el-button size="small" type="primary" @click="audit" v-show="hasAuthority('X1_11')" :disabled="isEdit || isCancel"> 审核 </el-button>
        </template>
        <!-- 驳回按钮 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="hasAuthority('X1_12') && rejectNodeName"> 驳回 </el-button>
        <!-- 已审核 -->
        <template v-if="info.nodeCode === progressBarObj.REVIEWED">
          <el-button :disabled="isCancel" size="small" type="primary" @click="uploadCertificateDialog = true" v-show="hasAuthority('X1_13')"> 替换模板协议/证书 </el-button>
        </template>
        <template v-if="[progressBarObj.WAIT_AUTHORIZE, progressBarObj.AUTHORIZE_WAIT_CONFIRM, progressBarObj.REGISTERING].includes(info.nodeCode)">
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeFile" v-show="hasAuthority('X1_13')"> 上传协议/证书 </el-button>
        </template>
        <!-- 授权待确认 -->
        <template v-if="info.nodeCode === progressBarObj.AUTHORIZE_WAIT_CONFIRM">
          <el-button size="small" type="primary" @click="audit" v-show="hasAuthority('X1_14')" :disabled="isEdit || isCancel"> 授权审核通过 </el-button>
          <!-- <el-button size="small" type="primary" @click="rejectDialog = true" v-if="rejectNodeName">授权驳回</el-button> -->
        </template>
        <!-- 下载资料 -->
        <el-button v-if="info.nodeCode && info.nodeCode !== progressBarObj.WAIT_UPLOAD">
          <a @click="_downloadTemp" v-show="hasAuthority('X1_15')">下载资料</a>
        </el-button>
        <!-- 注册中 -->
        <template v-if="info.nodeCode === progressBarObj.REGISTERING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="record" v-show="hasAuthority('X1_16')"> 录入{{ typeName }}信息 </el-button>
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
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="authAgentInfo" :label="typeName + '信息'" v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE && (tabNav === 'all' || tabNav === 'authAgentInfo')">
            <div class="block-title">{{ typeName }}信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">订单备注：</span>
              <span>{{orderServices.orderRemark}}</span>
            </div> -->
            <div class="info-block-item" v-if="orderServices.countryCode === 'EU'">
              <span class="info-block-title">国家：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCountry }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCompanyName }}</span>
            </div>
            <div class="info-block-item" v-if="orderServices.countryCode === 'EU'">
              <span class="info-block-title">城市：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCity }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">电话：</span>
              <span>{{ authorizedAgentWorkOrder.supplierTel }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">邮箱：</span>
              <span>{{ authorizedAgentWorkOrder.supplierEmail }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">邮编：</span>
              <span>{{ authorizedAgentWorkOrder.supplierPostcode }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">街道详细地址：</span>
              <span>{{ authorizedAgentWorkOrder.supplierAddr }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">协议生效日期：</span>
              <span>{{ authorizedAgentWorkOrder.agreementBeginTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">协议到期日期：</span>
              <span>{{ authorizedAgentWorkOrder.agreementEndTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}标签协议：</span>
              <el-link type="primary" :href="authorizedAgentWorkOrder.tagFile" target="_blank"> {{ typeName }}标签协议 </el-link>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ authAgentInfo.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备注：</span>
              <span>{{ authAgentInfo.remark }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <span>{{ authAgentInfo.workNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">状态：</span>
              <span>{{ authAgentInfo.status }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">服务公司：</span>
              <span>{{authAgentInfo.companyNameZh}}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ authAgentInfo.serviceName }}<span v-if="orderServicesVO.specName">({{ orderServicesVO.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ authAgentInfo.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ authAgentInfo.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServices.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ authAgentInfo.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}协议：</span>
              <span>
                <!-- <el-link type="primary" :href="authAgentInfo.agreement" target="_blank" v-if="authAgentInfo.agreement">
                  {{ typeName }}协议
                </el-link> -->
                <template v-if="authAgentInfo.agreement">
                  <el-link type="primary" v-for="(img, i) in $util.convertImage(authAgentInfo.agreement)" :key="i" :href="img" target="_blank"> {{ typeName }}协议 </el-link>
                </template>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}证书：</span>
              <span>
                <template v-if="authAgentInfo.certificat && authAgentInfo.certificat != '[]'">
                  <el-link v-for="(img, i) in $util.convertImage(authAgentInfo.certificat)" :key="i" :href="img" type="primary" target="_blank"> {{ typeName }}证书 </el-link>
                </template>
              </span>
            </div>
          </template>
          <template v-if="authAgentInfo.agentUserVO && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">用户昵称：</span>
              <span>{{ authAgentInfo.agentUserVO.nickName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ authAgentInfo.agentUserVO.mobile }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">电子邮箱：</span>
              <span>{{authAgentInfo.agentUserVO.mobile}}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ authAgentInfo.agentUserVO.email }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">地址：</span>
              <span>{{authAgentInfo.agentUserVO.addr}}</span>
            </div> -->
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <!-- <AuditDialog :auditDialog.sync="auditDialog" :serviceId="serviceId" :nodeCode="info.nodeCode" @refresh="getInfo"></AuditDialog> -->
      <RecordDialog :recordDialog.sync="recordDialog" :serviceId="serviceId" :typeName="typeName" :countryCode="orderServices.countryCode" @refresh="getInfo"></RecordDialog>
      <UploadCertificateDialog :info="info" :uploadCertificateDialog.sync="uploadCertificateDialog" :typeName="typeName" :fileObj="fileObj" :replace="replace" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false" :authorizeFileInfo="authorizeFileInfo"></UploadCertificateDialog>
      <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :serviceId="serviceId" :countryCode="orderServices.countryCode" @refresh="getInfo"></ChangeServiceProviderDialog>
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="serviceId" :nodeCodeName="info.nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo"></RejectDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { getNodeField, sendsmsMsg } from '@/api/newApi/taxServices/serviceManage.js';
import { getAuthAgentInfo, saveAuthAgent, submitAuthAgent, authAgentCheck } from '@/api/newApi/workOrder/authorizedRepresent';
import { getRejectCode } from '@/api/newApi/common';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      isEdit: false,
      info: {},
      authAgentInfo: {},
      authorizedAgentWorkOrder: {},
      orderServices: {},
      orderServicesVO: {},
      fileObj: {
        agreement: [],
        certificat: [],
      },
      replace: false,
      moduleList: [],
      countrySelectList: [],
      auditDialog: false,
      recordDialog: false,
      uploadCertificateDialog: false,
      changeServiceProviderDialog: false,
      rejectDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      authorizeFileInfo: [],
      fold: false,
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
  },
  computed: {
    typeName() {
      return this.orderServices.countryCode === 'EU' ? '欧代' : '英代';
    },
    showEdit() {
      return this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.info.nodeCode === this.progressBarObj.WAIT_REVIEW;
    },
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          let disabled = !this.isEdit;
          if (this.info.renewOrder && this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD && ['shopNature', 'companyNameZh', 'companyCreditCode', 'companyPostCode', 'companyNameEn'].includes(item.keyName)) {
            disabled = true;
          }
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', disabled);
          } else {
            item.disabled = disabled;
          }
        });
      });
      return this.moduleList;
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    _downloadTemp() {
      // const params = {
      //   serviceId: this.serviceId,
      //   nodeId: this.info.nodeId
      // }
      // downloadTemp(params).then(res => {
      //   if (res.message) {
      //     this.$message.error(res.message)
      //   } else {
      //     window.open(baseUrl + '/workorder/management/vat/download/' + this.serviceId)
      //   }
      // })
      window.open(this.baseUrl + '/workorder/management/authAgent/down?no=' + this.serviceId + '&type=1');
    },
    getInfo() {
      getAuthAgentInfo({
        serviceId: this.serviceId,
      }).then((res) => {
        this.info = res.data;
        try {
          res.data.authAgentInfo.remark = JSON.parse(res.data.authAgentInfo.orderRemark).creator.remark;
        } catch (error) {}
        this.authAgentInfo = res.data.authAgentInfo;
        this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
        this.orderServices = res.data.orderServices;
        this.orderServicesVO = res.data.orderServicesVO;
        this.ifCancel(res.data.orderServices.status);
        if (res.data.dataReview.length) {
          // this.moduleList = res.data.dataReview
          if (res.data.nodeCode === this.progressBarObj.WAIT_UPLOAD) {
            this.moduleList = res.data.dataReview;
          } else {
            this.moduleList = res.data.firstReview;
            this.authorizeFileInfo = res.data.dataReview.filter((item) => item.moduleCode === 'authorizeFileInfo');
          }
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
      this.$confirm('温馨提示：确认后，系统将给客户发送相关短信提醒', '是否确认发送', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
      }).then(() => {
        sendsmsMsg({
          servicesId: this.serviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('发送成功！');
          }
        });
      });
    },
    // 提交
    submit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          submitAuthAgent({
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
        saveAuthAgent({
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
          authAgentCheck({
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
    // 录入英代/欧代信息
    record() {
      // 美代不检测证书
      if (!this.authAgentInfo.certificat && this.orderServices.countryCode !== 'US') {
        this.$confirm(`系统检测到【${this.authAgentInfo.serviceName}】服务信息中，${this.typeName}证书为空，请您在【录入${this.typeName}信息】前，上传证书，注册完成后不再提供上传功能`, '温馨提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '知道了',
          showCancelButton: false,
          type: 'warning',
          center: true,
        });
        return;
      }
      this.recordDialog = true;
    },
    // 替换/上传证件
    changeFile() {
      // 证书与协议会被清空. 所以这边要重新赋值
      const authorizeFileInfo = this.authorizeFileInfo.find((item) => item.moduleCode === 'authorizeFileInfo') || {};
      authorizeFileInfo.columns?.forEach((item) => {
        if (item.keyName === 'agreement') {
          item.reView = this.authAgentInfo.agreement;
        }
        if (item.keyName === 'certificat') {
          item.reView = this.authAgentInfo.certificat;
        }
      });
      this.fileObj = {
        agreement: this.authAgentInfo.agreement
          ? [
              {
                url: this.authAgentInfo.agreement,
                name: this.typeName + '协议',
              },
            ]
          : [],
        certificat: this.authAgentInfo.certificat
          ? [
              {
                url: this.authAgentInfo.certificat,
                name: this.typeName + '证书',
              },
            ]
          : [],
      };
      this.replace = true;
      this.uploadCertificateDialog = true;
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/authorizedRepresent/index',
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
  /deep/ .el-upload-list__item:first-child {
    margin-top: 5px;
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}
</style>
