<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div>
        <SendCustomFileModal
          btnText="发送注册资料"
          :params="{
            workId: designPatentWorkOrder.id,
            serviceId: serviceInfo.id,
            customerData: designPatentWorkOrder.customerRegisterData,
            smsSend: serviceInfo.smsSend,
            functionCode: serviceInfo.productFunctionCode,
            countryCode: serviceInfo.countryCode,
            enterpriseId: serviceInfo.enterpriseId,
          }"
          @submit="getInfo()"
          style="float: right"
          v-if="serviceInfo.cureentNodeCode === 'NODE0076'"
          v-show="hasAuthority('appearance_patent_registerInfo')"
        />
        <SendEmailModal
          btnText="客户发送邮件状态"
          :params="{
            trademarkType: 3,
            workId: designPatentWorkOrder.id,
            serviceId: serviceInfo.id,
            emailSend: serviceInfo.emailSend,
            functionCode: serviceInfo.productFunctionCode,
          }"
          @submit="getInfo()"
          style="float: right"
          v-if="serviceInfo.cureentNodeCode === 'NODE0076' && serviceInfo.flagCustomerData"
          v-show="hasAuthority('appearance_patent_emailState')"
        />

        <el-button size="small" type="primary" :disabled="isCancel" @click="isHandleLawyer = true" v-if="[progressBarObj.LAWYER_REVIEW, progressBarObj.REVIEW_PERIOD, progressBarObj.REGISTER_SUCCESS].includes(serviceInfo.cureentNodeCode)" v-show="hasAuthority('M2_29')"> 修改律师 </el-button>
        <!-- 待提交资料 -->
        <template v-if="serviceInfo.cureentNodeCode === progressBarObj.WAIT_UPLOAD">
          <el-button style="position: relative" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_27')">
            模板导入资料
            <div class="import-template-block">
              <ManualUploadFile v-model="templateFile" accept=".xls,.xlsx" />
            </div>
          </el-button>
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_2')" @click="sendMessage"> 发送短信 </el-button>
        </template>
        <!-- 初步审核 -->
        <template v-if="serviceInfo.cureentNodeCode === progressBarObj.PRE_REVIEW">
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_3')" @click="isEdit = !isEdit">
            {{ isEdit ? '取消修改' : '修改资料' }}
          </el-button>
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_4')" @click="preAuditDialog = true"> 初步审核 </el-button>
        </template>
        <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_5')" @click="changeHandler = true"> 修改处理人 </el-button>
        <!-- 律师审核，且没有绘图建模的子流程未完成 -->
        <template v-if="serviceInfo.cureentNodeCode === progressBarObj.LAWYER_REVIEW && isModelingComplete">
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_6')" @click="lawyerDialog = true"> 律师审核 </el-button>
        </template>
        <template v-if="serviceInfo.cureentNodeCode === progressBarObj.LAWYER_REVIEW">
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_7')" @click="download"> 下载资料 </el-button>
        </template>
        <!-- 审核期 -->
        <template v-if="serviceInfo.cureentNodeCode === progressBarObj.REVIEW_PERIOD">
          <el-button size="small" type="primary" :disabled="isCancel" v-show="hasAuthority('M2_8')" @click="uploadOfficialFileDialog = true"> 上传官方文件 </el-button>
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <template v-if="serviceInfo.cureentNodeCode !== progressBarObj.WAIT_UPLOAD && !isEdit">
            <el-tabs v-model="activeName" ref="elTabs">
              <el-tab-pane label="专利信息" name="patentInfo"></el-tab-pane>
              <el-tab-pane label="官方文件" name="officialFile"></el-tab-pane>
              <el-tab-pane label="客户上传的文件" name="uploadFile"></el-tab-pane>
            </el-tabs>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
            <div class="el-form-wrapper">
              <span v-show="activeName === 'patentInfo'">
                <DynamicForm ref="dynamicForm" :moduleList="dataReview" :rowKeyNum="2" :showBtn="false" />
                <el-descriptions title="寄件信息" v-if="serviceInfo.cureentNodeCode" style="margin-bottom: 20px" :column="2" :colon="false" :labelStyle="{ color: '#666666', fontSize: '14px', width: '110px', textAlign: 'right' }" :contentStyle="{ color: '#333333', fontSize: '14px' }">
                  <div class="titleStyle" slot="title">
                    <div class="talkbubble">寄件信息</div>
                    <div class="triangle"></div>
                  </div>
                  <el-descriptions-item label="快递公司">{{ designPatentWorkOrder.courierCompany }}</el-descriptions-item>
                  <el-descriptions-item label="物流单号">{{ designPatentWorkOrder.courierNo }}</el-descriptions-item>
                </el-descriptions>
              </span>
              <div v-show="activeName === 'officialFile' || activeName === 'uploadFile'">
                <el-table border :data="activeName === 'officialFile' ? officialFile : uploadFile">
                  <el-table-column align="center" min-width="200" label="文件" show-overflow-tooltip prop="files">
                    <template slot-scope="{ row }">
                      <el-link target="_blank" :href="row.url" type="primary" class="fileUrl" style="margin-right: 20px">{{ row.name }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" min-width="150" label="类型" show-overflow-tooltip prop="typeName"> </el-table-column>
                  <el-table-column align="center" min-width="200" label="上传时间" show-overflow-tooltip prop="time"> </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="el-form-wrapper" style="height: calc(100vh - 225px)">
              <DynamicForm
                :moduleList="dataReview"
                :showBtn="true"
                :showCancel="false"
                :showSubmit="serviceInfo.cureentNodeCode !== progressBarObj.PRE_REVIEW"
                :saveText="serviceInfo.cureentNodeCode === progressBarObj.PRE_REVIEW ? '保存资料' : '仅保存不提交'"
                submitText="确认并提交"
                @formSave="formSave"
                @formSubmit="formSubmit"
              />
            </div>
          </template>
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
              <span class="info-block-title">订单编号：</span>
              <span>{{ serviceInfo.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务编号：</span>
              <span>{{ serviceInfo.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span>{{ serviceInfo.serviceName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ serviceInfo.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册进度：</span>
              <span>{{ serviceInfo.cureentNodeCode | filterNodeCode }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务生成时间：</span>
              <span>{{ serviceInfo.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">律师：</span>
              <span>{{ serviceInfo.attorneyName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">备注：</span>
              <span>{{ serviceInfo.remark }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">建模绘图进度：</span>
              <span>{{ modelingDrawProgress }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">OA进度：</span>
              <span>{{ oaProgress }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">授权书进度：</span>
              <span>{{ authorizationProgress }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">发送注册资料：</span>
              <span>
                <template v-if="serviceInfo.flagCustomerData === true"> 是 </template>
                <template v-else-if="serviceInfo.flagCustomerData === false"> 否 </template>
                <template v-else> - </template>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">客户发送邮件状态：</span>
              <span>
                <template v-if="serviceInfo.emailSend === true"> 是 </template>
                <template v-else-if="serviceInfo.emailSend === false"> 否 </template>
                <template v-else> - </template>
              </span>
            </div>
          </template>
          <template v-if="userInfo && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ userInfo.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册时间：</span>
              <span>{{ userInfo.createTime }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" type="trademark" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <PreAuditDialog :preAuditDialog.sync="preAuditDialog" :rejectNodeName="rejectNodeName" :serviceId="serviceId" @refresh="getInfo" />
      <LawyerDialog :lawyerDialog.sync="lawyerDialog" :rejectNodeName="rejectNodeName" :serviceId="serviceId" :showModelingDrawProgress="[1, 3].includes(serviceInfo.modelingDrawType)" :showOaProgress="[2, 3].includes(serviceInfo.modelingDrawType)" @refresh="getInfo" />
      <UploadOfficialFileDialog :uploadOfficialFileDialog.sync="uploadOfficialFileDialog" :isOaComplete="isOaComplete" :isAuthComplete="isAuthComplete" :serviceId="serviceId" @refresh="getInfo" />
      <ChangeHandler :changeHandler.sync="changeHandler" :serviceId="serviceId" @refresh="getInfo" />
    </div>
    <!-- <Drag style="cursor: pointer" @handlepaly="showWaringDrawer = true" :workId="serviceId" /> -->
    <WaringDrawer v-if="showWaringDrawer" :visible.sync="showWaringDrawer" :detailId="serviceId" />
    <HandleLawyer v-if="isHandleLawyer" :serviceIds="serviceId" :countryCode="countryCode" :functionCode="productFunctionCode" :showConsumed="serviceInfo.cureentNodeCode !== progressBarObj.LAWYER_REVIEW" entry="appearancePatent" @cancelFunc="cancelFunc"></HandleLawyer>
  </div>
</template>

<script>
import { progressBarObj, progressBarList } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import HandleLawyer from '../components/handleLawyer';
import { patentInfo, patentAttorneyMessage, savePatent, submitPatent, patentAttorneyDownload } from '@/api/newApi/intellectualProperty/appearancePatent';
import { getRejectCode } from '@/api/newApi/common';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import { progressBarList as modelingDrawProgressBarList } from '@/view/module/intellectualProperty/modelingAndDrawing/enumObj.js';
import { progressBarList as oaProgressBarList } from '@/view/module/intellectualProperty/OAAppearancePatent/enumObj.js';
import { progressBarList as authorizationProgressBarList } from '@/view/module/intellectualProperty/certificate/enumObj.js';
import ManualUploadFile from '@/components/manualUploadFile/index.vue';
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      countryCode: '',
      productFunctionCode: this.$route.query.productFunctionCode,
      progressBarObj: progressBarObj,
      activeName: 'patentInfo',
      isEdit: false,
      info: {},
      serviceInfo: {},
      userInfo: {},
      workOrder: {},
      designPatentWorkOrder: {},
      modelingDrawWorkOrder: {},
      moduleList: [],
      countrySelectList: [],
      preAuditDialog: false,
      lawyerDialog: false,
      uploadOfficialFileDialog: false,
      changeHandler: false,
      rejectNodeName: '',
      tabNav: 'all',
      authorizeFileInfo: [],
      officialFile: [],
      uploadFile: [],
      templateFile: [],
      fold: false,
      showWaringDrawer: false,
      isHandleLawyer: false,
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    ManualUploadFile,
    HandleLawyer,
    SendCustomFileModal,
    SendEmailModal,
  },
  filters: {
    filterNodeCode(nodeCode) {
      let result = progressBarList.find((item) => item.value === nodeCode);
      return result ? result.label : '';
    },
  },
  watch: {
    templateFile(val) {
      if (val && val.length) {
        let formData = new FormData();
        formData.append('file', val[0].raw);
        this.$util
          .formDataRequest({
            url: '/workorder/management/design_patent/importMaterial/' + this.serviceId,
            data: formData,
          })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('导入成功');
              this.getInfo();
            } else {
              this.$message.error(res.message || '导入失败');
            }
          })
          .catch((e) => {
            this.$message.error('导入失败');
          })
          .finally((e) => {
            this.templateFile = [];
          });
      }
    },
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          // 值为空隐藏
          if (!this.isEdit && this.$util.isEmpty(item.reView) && this.$util.isEmpty(item.keyNameValue)) {
            item.inputType = 'hidden';
          }
          // 隐藏签名
          if (['companyLegalPersonSign'].includes(item.keyName)) {
            item.inputType = 'hidden';
          }
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
          let hiddenList = [];
          switch (this.serviceInfo.modelingDrawType) {
            case 1:
            case 3:
              // 1仅建模，3建模绘图，隐藏建模和绘图
              hiddenList = ['modelingFile', 'drawingFile'];
              break;
            case 2:
              // 仅绘图，隐藏绘图
              hiddenList = ['drawingFile'];
              break;
            default:
              // 0:无建模绘图，隐藏建模、产品保护部分
              hiddenList = ['modelingFile', 'productProtection'];
              break;
          }
          if (hiddenList.includes(item.keyName)) {
            item.inputType = 'hidden';
          }
        });
      });
      return this.moduleList;
    },
    isModelingComplete() {
      // 完成建模绘图
      if (this.serviceInfo.modelingDrawType === 0 || this.modelingDrawWorkOrder.cureentNodeCode === 'NODE0085') {
        return true;
      }
      return false;
    },
    isOaComplete() {
      if (this.info.oaWorkOrders && this.info.oaWorkOrders.length) {
        return this.info.oaWorkOrders.every((item) => {
          // 需要处理且状态不为已答复、已取消
          if (item.processing === 2 && !['NODE104-006', 'NODE104-007'].includes(item.cureentNodeCode)) {
            return false;
          }
          return true;
        });
      }
      return true;
    },
    isAuthComplete() {
      // 未完成授权
      if (this.info.authorizationWorkOrder && this.info.authorizationWorkOrder.cureentNodeCode && this.info.authorizationWorkOrder.cureentNodeCode !== 'NODE105-005') {
        return false;
      }
      return true;
    },
    // 建模绘图进度
    modelingDrawProgress() {
      if (this.info.modelingDrawWorkOrder && this.info.modelingDrawWorkOrder.cureentNodeCode) {
        let temp = modelingDrawProgressBarList.find((item) => item.value === this.info.modelingDrawWorkOrder.cureentNodeCode);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
    // OA进度
    oaProgress() {
      if (this.info.oaWorkOrders && this.info.oaWorkOrders.length) {
        let temp = oaProgressBarList.find((item) => item.value === this.info.oaWorkOrders[0].cureentNodeCode);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
    // 授权书进度
    authorizationProgress() {
      if (this.info.authorizationWorkOrder && this.info.authorizationWorkOrder.cureentNodeCode) {
        let temp = authorizationProgressBarList.find((item) => item.value === this.info.authorizationWorkOrder.cureentNodeCode);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      patentInfo(this.serviceId).then((res) => {
        this.info = res.data;
        try {
          res.data.serviceInfo.remark = JSON.parse(res.data.serviceInfo.remark).creator.remark;
        } catch (error) {}
        this.serviceInfo = res.data.serviceInfo;
        this.userInfo = res.data.userInfo;
        this.designPatentWorkOrder = res.data.designPatentWorkOrder;
        this.modelingDrawWorkOrder = res.data.modelingDrawWorkOrder;
        this.countryCode = res.data.serviceInfo.countryCode;
        this.isEdit = res.data.serviceInfo.cureentNodeCode === progressBarObj.WAIT_UPLOAD;
        this.ifCancel(res.data.serviceInfo.status);
        this.getFileList();
        if (res.data.dataReview && res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        }
        // this._getRejectCode();
        this.getOperationLog(this.serviceInfo.serviceNo, 2);
      });
    },
    _getRejectCode() {
      getRejectCode({
        nodeCodeName: this.info.nodeCodeName,
        nodeId: this.info.nodeId,
        workFlowId: this.serviceInfo.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    getFileList() {
      let list = [
        {
          name: '建模文件',
          url: this.replaceHttps(this.modelingDrawWorkOrder.modelingFile),
          type: this.designPatentWorkOrder.modelingType,
          time: this.modelingDrawWorkOrder.modelingFileCreateTime,
          typeName: '建模绘图文件',
        },
        {
          name: '绘图文件',
          url: this.replaceHttps(this.modelingDrawWorkOrder.drawingFile),
          type: this.designPatentWorkOrder.drawingType,
          time: this.modelingDrawWorkOrder.drawingFileCreateTime,
          typeName: '建模绘图文件',
        },
        {
          name: '授权书',
          url: this.replaceHttps(this.info.authorizationWorkOrder.officialFile),
          type: 1,
          time: this.info.authorizationWorkOrder.createTime,
          typeName: '授权书',
        },
        {
          name: '律师审核回执',
          url: this.replaceHttps(this.designPatentWorkOrder.attorneyReceipt),
          type: 1,
          time: this.designPatentWorkOrder.attorneyReceiptTime,
          typeName: '受理回执',
        },
        {
          name: '授权书回执',
          url: this.replaceHttps(this.info.authorizationWorkOrder.receiptOfficialFile),
          type: 1,
          time: this.info.authorizationWorkOrder.receiptOfficialCreateTime,
          typeName: '受理回执',
        },
        {
          name: '外观专利证书',
          url: this.replaceHttps(this.designPatentWorkOrder.patentCertificate),
          type: 1,
          time: this.designPatentWorkOrder.patentCertificateTime,
          typeName: '外观专利证书',
        },
        {
          name: '授权书翻译文件',
          url: this.replaceHttps(this.info.authorizationWorkOrder.interpretFile),
          type: 1,
          time: this.info.authorizationWorkOrder.interpretDate,
          typeName: '授权书翻译文件',
        },
      ];

      let oaFile = [
        {
          name: '客户OA答复',
          url: this.replaceHttps(this.designPatentWorkOrder.customerOaReplyData),
          type: 1,
          time: this.designPatentWorkOrder.customerOaReplyDataTime,
          typeName: 'OA答复材料',
        },
        {
          name: '客户注册资料',
          url: this.replaceHttps(this.designPatentWorkOrder.customerRegisterData),
          type: 1,
          time: this.designPatentWorkOrder.customerRegisterDataTime,
          typeName: '注册资料',
        },
      ];
      this.info.oaWorkOrders.forEach((item) => {
        oaFile = oaFile.concat([
          {
            name: '答复OA帮助文档',
            url: this.replaceHttps(item.interpretFile),
            type: 1,
            time: item.interpretDate,
            typeName: '审查意见翻译文件',
          },
          {
            name: '审查意见OA官方文件',
            url: this.replaceHttps(item.officialFile),
            type: 1,
            time: item.createTime,
            typeName: '审查意见OA',
          },
          {
            name: '审查意见答复材料',
            url: this.replaceHttps(item.answerFile),
            type: 2,
            time: item.answerDate,
            typeName: '答复审查意见',
          },
        ]);
      });

      list = list
        .concat(oaFile)
        .filter((i) => i.url)
        .sort((a, b) => {
          return +new Date(b.time) - +new Date(a.time);
        });

      this.officialFile = list.filter((item) => item.type === 1);
      this.uploadFile = list.filter((item) => item.type === 2);
    },
    // 提交
    formSubmit(materialData) {
      submitPatent({
        materialData,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.isEdit = false;
          this.getInfo();
        }
      });
    },
    // 保存
    formSave(materialData) {
      savePatent({
        materialData,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
          if (this.serviceInfo.cureentNodeCode === progressBarObj.PRE_REVIEW) {
            this.isEdit = false;
          }
          this.getInfo();
        }
      });
    },
    sendMessage() {
      patentAttorneyMessage(this.serviceId).then((res) => {
        if (res.code === 0) {
          this.$message.success('发送成功！');
        }
      });
    },
    download() {
      // patentAttorneyDownload(this.serviceId).then(res => {
      //   this.$util.exportFile(res)
      // });
      window.location.href = this.baseUrl + '/workorder/management/design_patent/download/' + this.serviceId;
    },
    cancelFunc() {
      this.isHandleLawyer = false;
      this.getInfo();
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/intellectualProperty/appearancePatent/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.import-template-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
}
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
      position: relative;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
      }
      .fold {
        position: absolute;
        z-index: 1;
        right: 30px;
        top: 30px;
        font-size: 14px;
        cursor: pointer;
      }
      .el-form-wrapper {
        height: calc(100vh - 280px);
        overflow-y: auto;
      }
    }
  }
  .info-block {
    max-height: calc(100vh - 255px);
  }
}
.titleStyle {
  display: inline-flex;
  font-size: 14px;
  color: #666;
  font-weight: normal;
  .talkbubble {
    height: 30px;
    background-color: #eaeaea;
    padding: 0 15px;
    line-height: 30px;
  }
  .triangle {
    width: 15px;
    border: 15px solid transparent;
    border-left: 10px solid #eaeaea;
  }
}
</style>
