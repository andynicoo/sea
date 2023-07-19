<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <el-button>
          <a @click="seeHistoryBuyInfo">查看历史购买信息</a>
        </el-button>
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="showEdit && !isEdit && hasAuthority('J2_7')">编辑</el-button>
        <template v-if="isEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave" v-show="hasAuthority('J2_8')">保存</el-button>
        </template>
        <!-- 待上传资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD">
          <!-- <el-button size="small" type="primary" @click="changeServiceProviderDialog = true"">修改服务商</el-button> -->
          <el-button size="small" type="primary" @click="submit" v-show="hasAuthority('J2_9')" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel">提交</el-button>
          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('J2_10')">发送提醒</el-button>
        </template>
        <!-- 待审核资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_REVIEW">
          <!-- <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('J2_11')">修改服务商</el-button> -->
          <el-button size="small" type="primary" @click="audit" :disabled="isEdit || isCancel" v-show="hasAuthority('J2_12')">审核</el-button>
        </template>
        <!-- 驳回按钮 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="rejectNodeName" v-show="hasAuthority('J2_13')">驳回</el-button>
        <!-- 已审核 -->
        <template v-if="info.nodeCode === progressBarObj.REVIEWED">
          <!-- <el-button
            :disabled="isCancel"
            size="small"
            type="primary"
            @click="
              uploadCertificateDialog = true;
              isReplace = false;
            "
            v-show="hasAuthority('J2_26')"
            >替换授权书</el-button
          > -->
          <el-button size="small" type="primary" @click="audit" :disabled="isCancel" v-show="hasAuthority('J2_27')">审核通过</el-button>
        </template>
        <!-- 待授权 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_AUTHORIZE">
          <el-button :disabled="isCancel" size="small" type="primary" @click="sendRemind" v-show="hasAuthority('J2_10')">发送提醒</el-button>
        </template>
        <!-- 授权待确认 -->
        <template v-if="info.nodeCode === progressBarObj.AUTHORIZE_WAIT_CONFIRM">
          <!-- <el-button size="small" type="primary" @click="rejectAuthorizationFunc" :disabled="isEdit">授权驳回</el-button> -->
          <el-button size="small" type="primary" @click="commitSupplierFunc" :disabled="isEdit || isCancel" v-show="hasAuthority('J2_15')">提交服务商</el-button>
        </template>
        <!-- 下载资料 -->
        <el-button v-if="info.nodeCode && info.nodeCode !== progressBarObj.WAIT_UPLOAD && hasAuthority('J2_16')">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>
        <!-- 注册中 -->
        <template v-if="info.nodeCode === progressBarObj.REGISTERING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="recordDialog = true" v-show="hasAuthority('J2_25')">录入注册结果</el-button>
          <el-button :disabled="isCancel" size="small" type="primary" @click="completeDialog = true" v-if="eprBaseInfo.registrationReceipt.length > 0 && (orderServices.countryCode != 'FR' || (eprBaseInfo.uinStr && orderServices.countryCode == 'FR'))" v-show="hasAuthority('J2_18')"
            >完成注册</el-button
          >
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
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" :showBtn="false" @formSave="formSave" :countryCode="info.orderServices ? info.orderServices.countryCode : ''" @formCancel="isEdit = false" :workInfo="info" />

            <div class="el-table el-table--border category-table">
              <div class="el-table__header-wrapper basic-table">
                <table class="el-table__header">
                  <tr>
                    <th class="el-table__cell w-300">
                      <div class="cell">已购类别</div>
                    </th>
                    <th class="el-table__cell">
                      <div class="cell">{{ eprBaseInfo.categoryStatisticsVO.historyCategory }}</div>
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td class="el-table__cell"><div class="cell">已购品牌</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprBaseInfo.categoryStatisticsVO.historyLogo }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">新增类别</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprBaseInfo.categoryStatisticsVO.category }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">新增品牌</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprBaseInfo.categoryStatisticsVO.logo }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
              <span class="info-block-title">注册服务号：</span>
              <span>{{ eprBaseInfo.parentServiceNo }}</span>
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
            <div class="info-block-item" v-if="info.nodeCode != progressBarObj.WAIT_UPLOAD && info.nodeCode != progressBarObj.WAIT_REVIEW && info.nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">合同：</span>
              <span v-if="eprBaseInfo.contract && eprBaseInfo.contract != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.contract)" :key="i" :href="img" type="primary" target="_blank"> 合同 </el-link>
                <!-- <el-button
                  type="primary"
                  style="margin-left: 8px"
                  size="mini"
                  @click="(uploadCertificateDialog = true), (isReplace = true)"
                  v-show="hasAuthority('J2_19')"
                  >替换合同</el-button
                > -->
              </span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode != progressBarObj.WAIT_UPLOAD && info.nodeCode != progressBarObj.WAIT_REVIEW && info.nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">授权书：</span>
              <span v-if="eprBaseInfo.authCertificate && eprBaseInfo.authCertificate != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.authCertificate)" :key="i" :href="img" type="primary" target="_blank"> 授权书 </el-link>
                <!-- <el-button
                  type="primary"
                  style="margin-left: 8px"
                  size="mini"
                  @click="(uploadCertificateDialog = true), (isReplace = true)"
                  v-show="hasAuthority('J2_20')"
                  >替换授权书</el-button
                > -->
              </span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode == progressBarObj.REGISTERING || info.nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">证书：</span>
              <span v-for="(item, i) in eprBaseInfo.registrationReceipt" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">证书</el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="(info.nodeCode === progressBarObj.REGISTERING || info.nodeCode === progressBarObj.REGISTER_COMPLETE) && eprBaseInfo.uinStr">
              <span class="info-block-title">UIN号：</span>
              <span>{{ eprBaseInfo.uinStr }}</span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode == progressBarObj.REGISTERING || info.nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">账单：</span>
              <span v-for="(item, i) in eprBaseInfo.billFiles" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">账单</el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="info.nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">服务截止时间：</span>
              <span>{{ eprBaseInfo.expirationTime }}</span>
            </div>
          </template>
          <template v-if="JSON.stringify(userInfo) != '{}' && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ userInfo.userLogin.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ orderServices.companyNameZh }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <!-- <AuditDialog :auditDialog.sync="auditDialog" :serviceId="serviceId" :nodeCode="info.nodeCode" @refresh="getInfo"></AuditDialog> -->
      <RecordDialog :recordDialog.sync="recordDialog" :serviceId="serviceId" :certificates="eprBaseInfo.registrationReceipt" :uinStr="eprBaseInfo.uinStr" :countryCode="orderServices.countryCode" :billFiles="eprBaseInfo.billFiles" @refresh="getInfo"></RecordDialog>
      <!-- <UINDialog :UINDialog.sync="UINDialog" :isEditUIN="isEditUIN" :serviceId="serviceId" @refresh="getInfo"></UINDialog> -->
      <ChangeContractAndPower :changeContract.sync="changeContractAndPower" :fileObj="fileObj" :replace="replace" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false"></ChangeContractAndPower>
      <!-- <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :serviceId="serviceId" :countryCode="orderServices.countryCode" @refresh="getInfo"></ChangeServiceProviderDialog> -->
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="serviceId" :nodeCodeName="info.nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo"></RejectDialog>
      <UploadCertificateDialog :uploadCertificateDialog.sync="uploadCertificateDialog" :authorizeFileInfo="authorizeFileInfo" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false" :isReplace="isReplace"></UploadCertificateDialog>
      <CompleteDialog :completeDialog.sync="completeDialog" :serviceId="serviceId" :showTip="false" @refresh="getInfo"></CompleteDialog>
      <HistoryBuyInfoDialog :historyBuyInfoDialog.sync="historyBuyInfoDialog" :historyBuyInfoList="historyBuyInfoList" :functionCode="orderServices.productFunctionCode"></HistoryBuyInfoDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import moment from 'moment';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import CompleteDialog from '@/view/module/workOrder/components/completeDialog';
import HistoryBuyInfoDialog from './components/historyBuyInfoDialog';
import * as comps from '../EPRManage/components/index';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getAuthAgentInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import { saveEpr, submitEpr, eprCheck, eprRejectAuthorization, eprCommitSupplier, getEprHistoryInfo, eprCertificate, eprNotice, queryHistoryList, queryBatHistoryList } from '@/api/newApi/workOrder/EPRManage';
import { getRejectCode } from '@/api/newApi/common';
// import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      isEdit: false,
      info: {},
      eprBaseInfo: {
        categoryStatisticsVO: {},
      },
      completeDialog: false,
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
      // changeServiceProviderDialog: false,
      // UINDialog: false,
      rejectDialog: false,
      historyBuyInfoDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      userInfo: {},
      authorizeFileInfo: [],
      historyBuyInfoList: [],
      isReplace: false,
      // isEditUIN: false,
      fold: false,
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    CompleteDialog,
    HistoryBuyInfoDialog,
  },
  computed: {
    showEdit() {
      return this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.info.nodeCode === this.progressBarObj.WAIT_REVIEW;
    },
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          let disabled = false;
          if ((this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.info.nodeCode === this.progressBarObj.WAIT_REVIEW) && ['weeeInfos', 'batteryInfos'].includes(item.keyName)) {
            disabled = false || !this.isEdit;
          } else {
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
        nodeCode: this.$route.query.nodeCode,
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
    seeHistoryBuyInfo() {
      let fnName = this.orderServices.productFunctionCode == this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE ? queryHistoryList : queryBatHistoryList;
      if (this.orderServices.productFunctionCode == this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE && this.orderServices.countryCode === 'DE' && this.info.orderServicesVO.parentProductFunctionCode === 3108) {
        fnName = getEprHistoryInfo;
      }
      fnName({
        serviceId: this.info.eprWorkOrder.serviceId,
        year: moment(this.info.eprWorkOrder.eprEffectiveDate || this.info.orderServicesVO.createTime).format('YYYY'),
        serviceNo: this.$route.query.serviceNo,
        checkPassTime: this.eprBaseInfo.checkPassTime || moment().format('YYYY-MM-DD HH:mm:ss'),
      }).then((res) => {
        if (res.code === 0) {
          if (res.data && res.data.length) {
            this.historyBuyInfoDialog = true;
            this.historyBuyInfoList = res.data;
          } else {
            this.$message.warning('暂无历史购买信息');
          }
        }
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
    // 完成注册
    completeRegister() {
      // 未录入证书不能完成注册
      // this.$confirm('确认完成注册吗？', '提示', {
      //   customClass: 'custom-confirm',
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true,
      // }).then(() => {
      //   let data= {
      //     serviceId: this.serviceId,
      //     date: ''
      //   };
      //   eprComplete(data).then((res) => {
      //     if (res.code === 0) {
      //       this.$message.success('操作成功');
      //       this.getInfo();
      //     }
      //   });
      // });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/addCategoryBrand/index',
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

.category-table {
  .el-table__header {
    width: 100%;

    .el-table__cell {
      height: 48px;
    }
  }

  /deep/ .el-table__header th {
    background: #fff !important;
  }

  /deep/ .el-table__cell {
    background: #fff !important;
  }

  .w-300 {
    width: 300px;
  }
}
</style>
