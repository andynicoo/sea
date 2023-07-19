<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <template v-if="info.currentNodeCode === 'NODE0363'">
          <el-button size="small" type="primary" @click="audit" :disabled="isEdit || isCancel" v-show="hasAuthority('R3_1')">审核</el-button>

          <!-- <el-button size="small" type="primary" v-if="[3, 4, 5, 6, -1].includes(eprDeclare.status)" @click="formSubmit" v-show="hasAuthority('D2_4')">提交申报</el-button> -->
        </template>
        <el-button :disabled="isCancel" v-if="['NODE0363', 'NODE0365', 'NODE0366'].includes(info.currentNodeCode)" size="small" type="primary" @click="rejectNode" v-show="hasAuthority('R3_2')">驳回</el-button>
        <el-button :disabled="isCancel" size="small" type="primary" v-if="info.nextNodeCode === 'NODE0367'" @click="completeDialog = true" v-show="hasAuthority('R3_3')">完成续费</el-button>

        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="!isEdit && info.currentNodeCode === 'NODE0361'">编辑</el-button>
        <template v-if="isEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave">保存</el-button>
        </template>

        <el-button size="small" type="primary" @click="submit" v-if="!isEdit && info.currentNodeCode === 'NODE0361'">提交</el-button>

        <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProvider" v-if="!isEdit && ['NODE0361', 'NODE0362', 'NODE0363'].includes(info.currentNodeCode)" v-show="hasAuthority('R3_7')">修改服务商</el-button>

        <template v-if="info.currentNodeCode === 'NODE0364'">
          <el-button
            size="small"
            type="primary"
            :disabled="isCancel"
            @click="
              recordDialog = true;
              showBank = true;
            "
            v-show="hasAuthority('R3_4')"
            >录入续费结果</el-button
          >
          <!--  <el-button
            size="small"
            type="primary"
            @click="
              recordDialog = true;
              showBank = false;
            "
            v-show="hasAuthority('J2_12')"
            >录入注册结果（无需支付）</el-button
          > -->

          <!-- <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px; margin-right: 5px">
            <el-button type="primary">录入注册结果<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="needPayRecord" v-show="hasAuthority('D2_2')">需支付</el-dropdown-item>
              <el-dropdown-item command="noNeedPayRecord" v-show="hasAuthority('D2_2')">无需支付</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <!-- <el-button size="small" type="primary" @click="rejectDialog = true" v-show="hasAuthority('J2_12')">完成续费</el-button> -->
          <!-- <el-button size="small" type="primary" v-if="[3, 4, 5, 6, -1].includes(eprDeclare.status)" @click="formSubmit" v-show="hasAuthority('D2_4')">提交申报</el-button> -->
        </template>

        <el-button :disabled="isCancel" size="small" v-if="info.currentNodeCode === 'NODE0365'" type="primary" @click="uploadReceiptDialog = true" v-show="hasAuthority('R3_5')">上传缴费凭证</el-button>

        <!-- <el-button @click="uploadReceiptDialog = true" v-if="eprDeclare.status == 7" type="primary" v-show="hasAuthority('D2_7')"> 上传回执 </el-button> -->

        <!-- 待上传资料 -->
        <!-- <template v-if="eprDeclare.status == 1 || eprDeclare.status == 2">

          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('D2_8')">发送提醒</el-button>
        </template>
        <el-button @click="confirmFeeVisible = true" v-if="eprDeclare.status == 10" type="primary" v-show="hasAuthority('D2_11')"> 款项确认 </el-button>

        <el-button @click="finishDeclare" v-if="eprDeclare.status == 7" type="primary" v-show="hasAuthority('D2_9')"> 完成申报 </el-button>
 -->
        <!-- <el-button v-if="hasAuthority('R3_6') && !isEdit">
          <a @click="_downloadTemp">下载资料</a>
        </el-button> -->
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ info.nodeCodeName }}</div>
          </div>

          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :countryCode="info.countryCode" :moduleList="dataReview" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />
            <div style="width: 96%" v-if="isFRContribute">
              <div class="titleStyle" style="margin-bottom: 20px">
                <div class="talkbubble">回收费缴纳信息</div>
                <div class="triangle"></div>
              </div>
              <div>
                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>国际银行账号 IBAN：</span>
                    <span>{{ bankPayInfos.ban }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>银行识别码 BIC：</span>
                    <span>{{ bankPayInfos.bankIdentifierCode }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>银行名称 Dank Name：</span>
                    <span>{{ bankPayInfos.bankName }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>账户名称 Account Name：</span>
                    <span>{{ bankPayInfos.accountName }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>官费金额：</span>
                    <span>€{{ bankPayInfos.officialFee }}EUR</span>
                  </el-col>
                  <el-col :span="12">
                    <span>收款备注：</span>
                    <span> {{ orderServices.uinStr }} &nbsp;&nbsp; {{ bankPayInfos.invoiceNo }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>支付方式：</span>
                    <span>{{ orderServices.payChannel == 'LIANLIANGLOBAL' ? '连连国际' : '' }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>支付状态：</span>
                    <span>{{ orderServices.payStatus | filterStatus }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>缴费凭证：</span>

                    <el-link target="_blank" :href="item" type="primary" v-for="item in orderServices.voucherFiles" :key="item" :underline="false" style="margin-right: 10px"> 查看 </el-link>
                    <!-- <el-image style="width: 60px; height: 40px" :src="orderServices.voucherFiles[0]" :preview-src-list="orderServices.voucherFiles"></el-image> -->
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-block-wrapper">
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
              <span>{{ info.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备案：</span>
              <span>{{ info.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册服务号：</span>
              <span>{{ orderServices.parentServiceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ info.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span>{{ info.nodeCodeName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span v-if="info.serviceName">{{ info.serviceName + '(' + info.specName + ')' }} </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ info.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ info.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ info.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ info.auditPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ info.completeTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">合同：</span>
              <span v-if="orderServices.contract && orderServices.contract != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(orderServices.contract)" :key="i" :href="img" type="primary" target="_blank"> 合同 </el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">授权书：</span>
              <span v-if="orderServices.authCertificate && orderServices.authCertificate != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(orderServices.authCertificate)" :key="i" :href="img" type="primary" target="_blank"> 授权书 </el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">证书：</span>
              <span v-for="(item, i) in orderServices.registrationReceipt" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">证书</el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">UIN号：</span>
              <span>{{ orderServices.uinStr }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">账单：</span>
              <span v-for="(item, i) in orderServices.billFiles" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">账单</el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务截止时间：</span>
              <span>{{ orderServices.expirationTime }}</span>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ info.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ info.companyNameZh }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="serviceId" :nodeCodeName="info.nodeCodeName" :rejectNodeName="rejectNodeName" @rejectFn="reject"></RejectDialog>

      <RecordDialog
        :recordDialog.sync="recordDialog"
        :nextNodeCode="info.nextNodeCode"
        :eprWorkOrder="orderServices"
        :serviceName="orderServices.serviceName"
        :serviceId="serviceId"
        :certificates="orderServices.registrationReceipt"
        :uinStr="info.uinStr"
        :showBank="showBank"
        :eprEffectiveDate="orderServices.eprEffectiveDate"
        :countryCode="orderServices.countryCode"
        :billFiles="orderServices.billFiles"
        @refresh="getInfo"
      ></RecordDialog>
      <CompleteDialog :completeDialog.sync="completeDialog" :serviceId="serviceId" :eprEffectiveDate="orderServices.eprEffectiveDate" @refresh="getInfo"></CompleteDialog>

      <UploadReceiptDialog :uploadReceiptDialog.sync="uploadReceiptDialog" :serviceId="serviceId" :declareReceipt="info.declareReceipt" @refresh="getInfo"> </UploadReceiptDialog>

      <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :rowSupplierList="rowSupplierList" @changeProvider="changeProvider"></ChangeServiceProviderDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj, productFunctionCodeMap } from './enumObj';
import moment from 'moment';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import ShowReceiptDialog from '@/view/module/workOrder/yearManage/components/showReceiptDialog';
import ChangeServiceProviderDialog from './components/changeServiceProviderDialog';
import UploadReceiptDialog from './components/uploadReceiptDialog';
import RejectDialog from './components/rejectDialog';
import RecordDialog from './components/recordDialog';
import CompleteDialog from './components/completeDialog';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getEprRenewalDetailAPI, getBusinessLogListByBusinessNo, auditAPI, rejectEprAPI, modifyProvider } from '@/api/newApi/workOrder/eprRenewal';

import { getSupplierList } from '@/api/newApi/common.js';
import { submitDeclaration, saveRenew, commitRenew } from '@/api/newApi/workOrder/EPRManage';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
// import ConfirmFeeDialog from './components/confirmFeeDialog';

export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      workOrderId: this.$route.query.workOrderId,
      // workNo: this.$route.query.workNo,
      // workId: this.$route.query.workId,
      progressBarObj: progressBarObj,
      isEdit: false,
      info: {},
      infos: [],

      showReceiptImgModel: false,
      confirmFeeVisible: false,
      completeDialog: false,
      showBank: false,
      recordDialog: false,
      rejectDialog: false,

      orderServices: {},
      eprDeclare: {},
      orderServicesVO: {},
      moduleList: [],
      rowSupplierList: [],
      changeServiceProviderDialog: false,
      uploadReceiptDialog: false,
      // historyBuyInfoDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      bankPayInfos: {},
      userInfo: {},
      imglist: [],
      supplierCode: '',
      progressList: [],
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    // ...comps,
    DynamicForm,
    OperationLog,
    ShowReceiptDialog,
    UploadReceiptDialog,
    RejectDialog,
    RecordDialog,
    CompleteDialog,
    ChangeServiceProviderDialog,
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case '1':
          return '待付款';
        case '2':
          return '付款中';
        case '3':
          return '已付款';
        case '4':
          return '已取消';
        default:
          return '';
      }
    },
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', pro.moduleCode === 'productInfo' ? !this.isEdit : true);
            // 上一年的产品
          } else if (pro.moduleId === 'PRODUCT_INFO') {
            item.disabled = true;
            // 当前产品
          } else if (pro.moduleCode === 'productInfo') {
            item.disabled = !this.isEdit;
          } else {
            item.disabled = true;
          }
        });
      });
      return this.moduleList;
    },
    // 法国回收费缴纳信息展示
    isFRContribute() {
      const isFR = this.info.countryCode === 'FR';
      const isWEEE = this.info.functionCode === productFunctionCodeMap.weee;
      const isBatt = this.info.functionCode === productFunctionCodeMap.batt;
      const isWAIT_RECOVER = this.info.currentNodeCode === this.progressBarObj.WAIT_RECOVER;
      const isREGISTER_COMPLETE = this.info.currentNodeCode === this.progressBarObj.REGISTER_COMPLETE;
      const isAUTH_RECOVER = this.info.currentNodeCode === this.progressBarObj.AUTH_RECOVER;
      // 是法国, 并且是(weee或者电池法). 并且在节点(待缴纳回收费 || 待审核回收费 || 续费完成)
      return isFR && (isWEEE || isBatt) && (isWAIT_RECOVER || isREGISTER_COMPLETE || isAUTH_RECOVER);
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    needPayRecord() {
      this.recordDialog = true;
      this.showBank = true;
    },
    changeServiceProvider() {
      this.changeServiceProviderDialog = true;
      this.getRowSuppliers();
    },
    getRowSuppliers() {
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: this.info.functionCode,
        countryCode: this.info.countryCode,
        flow: true,
      }).then((res) => {
        this.rowSupplierList = res.data;
      });
    },
    changeProvider(val) {
      modifyProvider({
        supplierId: val.supplierId,
        workIdColl: [this.workOrderId],
      }).then((res) => {
        this.changeServiceProviderDialog = false;
        if (res.code === 0) {
          this.getInfo();
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
        }
      });
    },
    rejectNode() {
      this.rejectDialog = true;
      if (this.info.currentNodeCode == 'NODE0363') {
        this.rejectNodeName = '待开启续费通道';
      } else if (this.info.currentNodeCode == 'NODE0365') {
        this.rejectNodeName = '续费中';
      } else {
        this.rejectNodeName = '待缴纳回收费';
      }
    },
    noNeedPayRecord() {
      this.recordDialog = true;
      this.showBank = false;
    },
    _downloadTemp() {
      const fileUrl = this.baseUrl + '/workorder/management/epr/renew/downLoad/' + this.workOrderId;
      this.$util.downFile(fileUrl);
    },
    // 审核
    audit() {
      this.$confirm('确认审核通过？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        auditAPI(this.workOrderId).then((res) => {
          if (res.code === 0) {
            this.$message.success('审核成功');
            this.getInfo();
          }
        });
      });
    },
    reject(val) {
      rejectEprAPI({
        workOrderId: this.info.id,
        isPass: false,
        isSend: val.sendMsg,
        remark: val.remark,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('驳回成功');
          this.rejectDialog = false;
          this.getInfo();
        }
      });
    },

    getOperationLog(businessNo, businessType) {
      getBusinessLogListByBusinessNo({
        businessNo,
      }).then((res) => {
        if (res.code === 0) {
          this.activities = res.data;
        }
      });
    },

    showDeclareReceipt() {
      this.imglist = this.eprDeclare.declareReceipt.split(',');
      if (this.imglist.length == 1) {
        window.open(this.replaceHttps(this.eprDeclare.declareReceipt));
        return;
      }
      this.showReceiptImgModel = true;
    },

    getInfo() {
      return getEprRenewalDetailAPI(this.workOrderId).then((res) => {
        this.info = res.data;
        this.orderServices = res.data.eprWorkOrder;
        this.eprDeclare = res.data.eprDeclare;
        this.orderServicesVO = res.data.orderServicesVO;
        this.ifCancel(res.data.status);
        // this.supplierCode = res.data.supplierCode;
        // this.decalreStr = `（申报区间： ${this.eprDeclare.beginTime.split(' ')[0]} - ${this.eprDeclare.endTime.split(' ')[0]}）WEEE产品申报信息`;
        // this.userInfo = res.data.userInfoVo;
        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        } else if (res.data.firstReview.length) {
          this.moduleList = res.data.firstReview;
        }

        // 把除产品信息的所有信息的必填去掉
        this.moduleList.forEach((module) => {
          if (module.moduleCode === 'productInfo') return;
          module.columns.forEach((item) => {
            item.isNeed = false;
          });
        });

        //  德国weeee 加入当年的产品信息
        if (res.data.countryCode === 'DE' && res.data.functionCode === '3138') {
          const currentProductInfo = this.moduleList.find((item) => item.moduleCode === 'productInfo');
          const reView = currentProductInfo.columns[0].reView;
          // 处理已购买
          const productList = res.data.eprWorkOrder.productInfoList.map(({ effectDate, ...item }) => {
            const isBuy = Array.isArray(reView) && !!reView.find((reViewItem) => reViewItem.productCategory === item.productCategory);
            return {
              ...item,
              isBuy,
            };
          });
          const weeeObj = {
            moduleName: moment(res.data.eprWorkOrder.eprEffectiveDate).subtract(1, 'year').format('YYYY年') + '的产品信息',
            moduleId: 'PRODUCT_INFO',
            moduleCode: 'productInfo',
            moduleDesc: '产品信息',
            columns: [
              {
                createTime: '2023-04-21 17:06:48',
                updateTime: '2023-04-21 17:06:48',
                id: '1609894',
                workflowId: '1649335289283481600',
                nodeId: '1452483114965683370',
                columnId: '667',
                moduleId: '21',
                columnPid: '',
                columnOption: '',
                inputType: 10,
                info: '{"maxlength":"","regxtype":"","rows":4,"multiple":false,"filterable":false,"selecttype":"1","selectfixed":"","drag":false,"limit":1,"accepts":["jpg","jpeg","png","pdf"],"datetype":"","groups":[{"label":"","value":""}]}',
                isNeed: false,
                isDel: false,
                placeHolder: '',
                remindMessage: '',
                fileModelUrl: 'http://file.itaxs.com/pro/20220401/236ff3e9d23443e9b538a8ebdacd1ebd.jpg',
                sourceFileUrl: '',
                renameText: '',
                renamePre: 0,
                isSys: true,
                keyName: 'weeeInfos',
                keyLabel: 'WEEE产品信息',
                sort: 27,
                selected: 1,
                keyNameValue: {},
                reView: productList,
              },
            ],
          };

          this.moduleList = this.moduleList.concat(weeeObj);
        }

        if (res.data.eprWorkOrder.bankPayInfos) {
          this.bankPayInfos = JSON.parse(res.data.eprWorkOrder.bankPayInfos);
        }

        this.getOperationLog(this.info.workNo, 3);
      });
    },
    getData() {
      getNodeField({
        currentNodeCode: this.$route.query.currentNodeCode,
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
          commitRenew({
            material: info,
            workOrderId: this.info.workId,
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
      this.$refs.dynamicForm.onSave().then((material) => {
        // 把WEEE产品信息中的空值去掉
        const materialObj = JSON.parse(material);
        materialObj.weeeInfos = materialObj.weeeInfos.filter((item) => Object.values(item).every((v) => v !== ''));
        saveRenew({
          material: JSON.stringify(materialObj),
          workOrderId: this.info.workId,
        }).then(async (res) => {
          if (res.code === 0) {
            await this.getInfo();
            this.$message.success('保存成功');
            this.isEdit = false;
          }
        });
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/EPRRenewal/index',
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
    // initURL(obj = '') {
    //   let url = '';
    //   if (this.IsJsonString(obj)) {
    //     url = this.replaceHttps(JSON.parse(obj)[0] || '');
    //   } else {
    //     url = this.replaceHttps(obj);
    //   }
    //   return url;
    // },
    // // 判断是不是json
    // IsJsonString(str) {
    //   try {
    //     JSON.parse(str);
    //   } catch (e) {
    //     return false;
    //   }
    //   return true;
    // },
    formSubmit() {
      submitDeclaration({
        ...this.eprDeclare,
        supplierCode: this.info.supplierCode,
        counrtyCode: this.info.counrtyCode,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.isEdit = false;
          this.getInfo();
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
    .header-container {
      padding-left: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
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
.titleStyle {
  display: inline-flex;
  font-size: 14px;
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

.form-required::before {
  content: '*';
  color: #f5222d;
  margin-right: 4px;
}

.declare-info {
  background: #ebf5ff !important;
  color: #333333;
  text-align: center;
  height: 54px;
  line-height: 54px;
  border: 1px solid #ebeef5;
  border-bottom: none;
}

.table-row {
  height: 60px;
  .table-col {
    border: 1px solid #ebeef5;
    border-top: none;
    height: 60px;
    line-height: 60px;
    border-right: none;
    padding-left: 10px;
  }
}
.el-radio__label {
  font-size: 16px;
}
</style>
