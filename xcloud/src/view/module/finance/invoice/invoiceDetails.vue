<template>
  <div class="app-container">
    <div class="header-container">
      <div class="header">
        <div class="back" @click="goBack()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <div class="btn-group">
          <el-button type="primary" size="small" v-if="detail.status === 'WAIT_INFO'" @click="showInvoiceInfoModel(false)" v-show="hasAuthority('B2_9')"> 填写开票信息 </el-button>

          <el-button type="primary" size="small" v-if="detail.status === 'PAY_WAIT_CONFIRM'" @click="showConfirmPayment" v-show="hasAuthority('B2_19')"> 确认到账 </el-button>

          <el-button type="primary" size="small" v-if="detail.status === 'WAIT_PAY'" @click="showInvoiceInfoModel(true)" v-show="hasAuthority('B2_10')"> 修改开票信息 </el-button>
          <el-button type="primary" size="small" v-if="detail.status === 'WAIT_INVOICE'" @click="uploaInvoiced = true" v-show="hasAuthority('B2_6')">
            上传发票
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <!-- 申请退款按钮显示： 判断 发票对应销售订单状态；如果订单不等于已付款或申请退款，则不显示【申请退款】按钮, 后端新加 orderStatus字段 -->
          <el-button v-if="['WAIT_INFO', 'WAIT_INVOICE', 'INVOICED', 'APPLY_REFUND'].includes(detail.status) && detail.makeInvoiceMoney > 0 && (detail.orderStatus === 'PAID' || detail.orderStatus === 'APPLY_REFUND') && detail.status!=='APPLY_REFUND'" type="primary" size="small" @click="showRefundDialog" v-show="hasAuthority('B2_11')"> 申请退款 </el-button>

          <!-- <el-button type="primary" size="small" v-if="detail.status == 'WAIT_PAY'" @click="changeInvoiceDialog = true" v-show="hasAuthority('B2_12')">
            修改
          </el-button> -->
          <el-button size="small" v-if="showCancelBtn" @click="handleClickCancel" v-show="hasAuthority('B2_13')">取消</el-button>
        </div>
      </div>

      <div class="status-title-wrap">
        <span>当前订单状态：</span><span> {{ detail.status | filterInvoiceStatus }}</span>
        <span class="fr">
          <el-button size="mini" data-clipboard-action="copy" class="cp-btn" v-if="detail.invoicePayUrl" :data-clipboard-text="detail.invoicePayUrl" @click="copyLink('.cp-btn')">付款链接（点击复制）</el-button>
          <el-button size="mini" v-show="hasAuthority('B2_20') && detail.status == 'WAIT_PAY' && detail.repairInvoiceStatus" @click="showOffLinePayDialog = true">编辑线下付款信息</el-button>
        </span>
      </div>

      <div class="invoiceInfo border-box" style="margin: 20px 0">
        <el-form>
          <div class="tittle">
            <el-divider direction="vertical"></el-divider>
            <span class="text-info">开票信息</span>
          </div>
          <el-descriptions :colon="false" :column="4" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
            <el-descriptions-item label="开票金额："> ￥{{ detail.makeInvoiceMoney | formatQianFenWei }} </el-descriptions-item>
            <el-descriptions-item label="开票类型：">
              {{ detail.invoiceType === 'GENERAL' ? '增值税普通发票' : detail.invoiceType === 'SPECIAL' ? '增值税专用发票' : '不开票' }}
              <span v-if="detail.subjectType">({{ detail.subjectType === 'PERSON' ? '个人' : detail.subjectType === 'ENTERPRISE' ? '公司' : '' }}) </span>
            </el-descriptions-item>
            <el-descriptions-item label="公司名称：" v-if="detail.invoiceType == 'SPECIAL' || detail.subjectType == 'ENTERPRISE'">
              {{ detail.name }}
            </el-descriptions-item>
            <el-descriptions-item label="纳税识别号：" v-if="detail.invoiceType == 'SPECIAL' || detail.subjectType == 'ENTERPRISE'">
              {{ detail.idOrTaxNumber }}
            </el-descriptions-item>

            <el-descriptions-item label="姓名：" v-if="detail.subjectType === 'PERSON'">
              {{ detail.name }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号：" v-if="detail.subjectType === 'PERSON'">
              {{ detail.idOrTaxNumber }}
            </el-descriptions-item>

            <el-descriptions-item label="公司地址：" v-if="detail.invoiceType === 'SPECIAL'">
              {{ detail.companyAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="公司电话：" v-if="detail.invoiceType === 'SPECIAL'">
              {{ detail.companyTel }}
            </el-descriptions-item>
            <el-descriptions-item label="开户银行：" v-if="detail.invoiceType === 'SPECIAL'">
              {{ detail.openingBank }}
            </el-descriptions-item>
            <el-descriptions-item label="开户卡号：" v-if="detail.invoiceType === 'SPECIAL'">
              {{ detail.bankAccount }}
            </el-descriptions-item>

            <el-descriptions-item label="开票税率：">
              <span>{{ $util.floatMultiply(detail.taxPoint, 100) }}%</span>
            </el-descriptions-item>
            <el-descriptions-item label="合同状态：">
              <span>{{ setContractStatus(detail.contractStatus) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="合同链接：">
              <Button v-if="detail.contractSignLink" label="small" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="detail.contractSignLink" @click="copyLink('.cobyOrderSn')">复制链接</Button>
              <span v-else>暂无 </span>
            </el-descriptions-item>

            <el-descriptions-item label="合同名称：">
              <el-link style="color: cornflowerblue" :href="detail.contractUrl.replace('http://', 'https://')" target="_blank" v-if="detail.contractFileName">
                {{ detail.contractFileName }}
              </el-link>
              <span class="text-info" v-else>暂无</span>
            </el-descriptions-item>

            <el-descriptions-item label="下载发票：">
              <div class="demo-image__preview" v-if="detail.invoiceFile">
                <el-image style="width: 60px; height: 60px; margin: 0 5px 5px 0" :src="detail.invoiceFile" :preview-src-list="[detail.invoiceFile]"></el-image>
              </div>
              <span class="text-info" v-else>暂无</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
      </div>

      <div class="orderInfo border-box" style="margin: 20px 0" v-if="detail.orderPaymentList && detail.orderPaymentList.length">
        <el-form>
          <div class="tittle">
            <el-divider direction="vertical"></el-divider>
            <span class="text-info">付款信息</span>
          </div>
          <el-descriptions :colon="false" :column="4" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
            <el-descriptions-item label="支付方式：">
              {{ detail.orderPaymentList[0].paymentChannel | filterPaymentChannel(paymentChannelList) }}
            </el-descriptions-item>
            <el-descriptions-item label="付款方：">
              {{ detail.orderPaymentList[0].payer }}
            </el-descriptions-item>

            <el-descriptions-item label="收款账号："> {{ detail.orderPaymentList[0].acceptAccountName }}</el-descriptions-item>
            <el-descriptions-item label="付款凭证：">
              <template v-if="detail.orderPaymentList[0].paymentFile">
                <el-image v-for="(img, i) in detail.orderPaymentList[0].paymentFile.split(',')" :key="i" style="width: 85px; height: 50px" :src="img" :preview-src-list="detail.orderPaymentList[0].paymentFile.split(',')"></el-image>
              </template>
              <template v-else>暂无</template>
            </el-descriptions-item>

            <el-descriptions-item label="付款时间：">
              {{ detail.orderPaymentList[0].paymentTime }}
            </el-descriptions-item>

            <el-descriptions-item label="交易流水：">
              {{ detail.orderPaymentList[0].platformTradeNo }}
            </el-descriptions-item>

            <el-descriptions-item label="备注说明：">
              {{ detail.orderPaymentList[0].remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
      </div>

      <div class="orderInfo border-box" style="margin: 20px 0">
        <el-form>
          <div class="tittle">
            <el-divider direction="vertical"></el-divider>
            <span class="text-info">订单信息</span>
          </div>
          <el-descriptions :colon="false" :column="4" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
            <el-descriptions-item label="订单号：">
              {{ detail.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item label="客户手机号：">
              {{ detail.userMobile }}
            </el-descriptions-item>

            <el-descriptions-item label="实付金额："> ￥{{ detail.orderPaidMoney | formatQianFenWei }} </el-descriptions-item>
            <el-descriptions-item label="订单归属人：">
              {{ detail.attributionName }}
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
      </div>
      <div class="otherInfo border-box" style="margin: 20px 0">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          操作记录
        </div>
        <OrderRecord :activities="activities" />
      </div>
    </div>
    <!-- 驳回 -->

    <el-drawer title="发票退款" :visible.sync="refundDialog">
      <div slot="title" class="drawer-title-wrapper">
        <div class="drawer-title">发票退款</div>
        <div class="drawer-title-btn-group">
          <el-button @click="refundDialog = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="refundConfirm">确 认</el-button>
        </div>
      </div>
      <el-row class="title bold">
        <span>订单号：{{ detail.orderNo }}</span>
        <span style="margin-left: 20px">订单金额：￥{{ detail.orderPaidMoney | formatQianFenWei }}</span>
        <span style="margin-left: 20px">开票金额：￥{{ detail.makeInvoiceMoney | formatQianFenWei }}</span>
      </el-row>
      <el-form :model="refundForm" label-width="130px" :rules="refundFormRules" ref="refundForm">
        <el-form-item label="退款手续费" prop="refundPoundage">
          <el-input v-model="refundForm.refundPoundage" placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" />
          <div class="item-tip"><i class="icon icon-tip"></i>退款手续费为平台需要扣除的服务费，全额退款时输入为0</div>
        </el-form-item>
        <el-form-item label="不扣除手续费原因" prop="noPoundageReason">
          <el-input v-model="refundForm.noPoundageReason" placeholder="请输入不扣除手续费原因" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="退款金额" prop="refundMoney">
          <el-input v-model="refundForm.refundMoney" placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" />
          <div class="item-tip"><i class="icon icon-tip"></i>退款金额不能超过已付开票金额</div>
        </el-form-item>
        <el-form-item label="退款路径" prop="refundMethod">
          <el-radio-group v-model="refundForm.refundMethod">
            <el-radio label="RETURN_TO_SOURCE" v-if="detail.supportReturnSourceFlag">原路返回</el-radio>
            <el-radio label="RETURN_TO_BANK">退回到银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="第三方平台手续费" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input :value="1" disabled placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="退款账户类型" prop="bankCountType" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-radio-group v-model="refundForm.bankCountType">
            <el-radio label="PERSONAL">个人</el-radio>
            <el-radio label="ENTERPRISE">企业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款银行" prop="refundBank" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="退款账户" prop="refundAccount" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="收款人姓名" prop="refundPayee" v-if="refundForm.bankCountType == 'PERSONAL' && refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="收款公司名称：" prop="refundPayee" v-if="refundForm.bankCountType == 'ENTERPRISE' && refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="开户支行：" prop="bankBranch" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-input v-model="refundForm.bankBranch" placeholder="请输入" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="省市：" prop="provincesCities">
          <el-select style="width: 145px; margin-right: 10px" v-model="refundForm.province" placeholder="省" filterable @change="provinceChange">
            <el-option :value="province.name" :label="province.name" v-for="province in provinceList" :key="province.id"></el-option>
          </el-select>
          <el-select style="width: 145px" v-model="refundForm.city" placeholder="市" filterable>
            <el-option :value="city.name" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款原因分类：" prop="refundReasonType">
          <el-select style="width: 145px; margin-right: 10px" v-model="refundForm.refundReasonType" placeholder="请选择">
            <el-option :value="item.dataCode" :label="item.dataValue" v-for="item in refundReasonTypeList" :key="item.baseDataId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款原因" prop="refundReason">
          <el-input
            type="textarea"
            :rows="6"
            style="width: 300px"
            v-model="refundForm.refundReason"
            placeholder="1、付款时间：
2、退款具体原因：
3、直属主管是否协助挽留：
4、客户是否有其他业务办理：
5、客户历史消费："
          />
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 上传发票 -->
    <el-dialog title="上传发票" :visible.sync="uploaInvoiced" width="500px">
      <el-form label-width="80px" :model="upload" :rules="rules" ref="ruleForm">
        <el-form-item label="发票：" prop="invoiceFile">
          <UploadImages :imageUrl="upload.invoiceFile" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove" :num="1"></UploadImages>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="primary" @click="handleUpload">保存</el-button>
        <el-button size="small" style="width: 65px" type="default" @click="uploaInvoiced = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 填写开票信息 -->
    <!-- 发票类型,invoiceType:(GENERAL:增值税普通发票 SPECIAL:增值税专用发票)
    主体类型,subjectType:(PERSON:个人 ENTERPRISE:公司)      -->
    <el-dialog title="填写开票信息" :visible.sync="invoiceInfoModel" width="600px" @close="resetChangeInvoiceInfo">
      <el-form label-width="110px" :model="invoiceInfo" :rules="invoiceFormRules" ref="invoiceForm">
        <el-form-item label="开票类型：" prop="invoiceFile">
          <!-- 原显示逻辑 -->
          <!-- {{ detail.invoiceType === 'GENERAL' ? '增值税普通发票' : detail.invoiceType === 'SPECIAL' ? '增值税专用发票' : '不开票' }}
          <span v-if="detail.subjectType">({{ detail.subjectType === 'PERSON' ? '个人' : detail.subjectType === 'ENTERPRISE' ? '公司' : '' }}) </span>
          <br /> -->
          <el-select placeholder="请选择" style="width: 300px" v-model="invoiceInfo.invoiceTypeSelect" @change="clearInvoice">
            <el-option label="增值税专用发票" :value="1"></el-option>
            <el-option label="增值税普通发票（个人）" :value="2"></el-option>
            <el-option label="增值税普通发票（公司）" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="(detail.status === 'WAIT_PAY' ? '待' : '已') + '付税额：'" prop="invoiceFile"> ￥{{ detail.makeInvoiceMoney | formatQianFenWei }} </el-form-item>
        <el-form-item
          label="公司名称："
          prop="name"
          v-if="invoiceInfo.invoiceType == 'SPECIAL' || invoiceInfo.subjectType == 'ENTERPRISE'"
          :rules="{
            required: true,
            message: '请输入公司名称',
            trigger: 'blur',
          }"
        >
          <el-input v-model="invoiceInfo.name" placeholder="请输入公司名称" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item
          label="公司税号："
          prop="idOrTaxNumber"
          v-if="invoiceInfo.invoiceType == 'SPECIAL' || invoiceInfo.subjectType == 'ENTERPRISE'"
          :rules="{
            required: true,
            message: '请输入公司税号',
            trigger: 'blur',
          }"
        >
          <el-input v-model="invoiceInfo.idOrTaxNumber" placeholder="请输入公司税号" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item
          label="姓名："
          prop="name"
          v-if="invoiceInfo.subjectType === 'PERSON'"
          :rules="{
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          }"
        >
          <el-input v-model="invoiceInfo.name" placeholder="请输入姓名" clearable style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item
          label="身份证号码："
          prop="idOrTaxNumber"
          v-if="invoiceInfo.subjectType === 'PERSON'"
          :rules="{
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur',
          }"
        >
          <el-input v-model="invoiceInfo.idOrTaxNumber" placeholder="请输入身份证号码" clearable style="width: 300px" size="small" />
        </el-form-item>
        <template v-if="invoiceInfo.invoiceType === 'SPECIAL'">
          <el-form-item label="公司地址：" prop="companyAddress">
            <el-input v-model="invoiceInfo.companyAddress" placeholder="请输入公司地址" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="公司电话：" prop="companyTel">
            <el-input v-model="invoiceInfo.companyTel" placeholder="请输入公司电话" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="开户银行：" prop="openingBank">
            <el-input v-model="invoiceInfo.openingBank" placeholder="请输入开户银行" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="开户账号：" prop="bankAccount">
            <el-input v-model="invoiceInfo.bankAccount" placeholder="请输入开户账号" clearable style="width: 300px" size="small" />
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer">
        <span class="fl red">注：只有公对公付款才能开“增值税专用发票”！</span>
        <el-button size="small" style="width: 65px" type="primary" @click="_modifyInvoice">保存</el-button>
        <el-button size="small" style="width: 65px" type="default" @click="invoiceInfoModel = false">取消</el-button>
      </div>
    </el-dialog>
    <OfflinePayDialog :showOffLinePayDialog.sync="showOffLinePayDialog" :detailInfo="detail" @refresh="getDetailsData" />
  </div>
</template>
<script>
import Steps from './components/Steps.vue';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog.vue'; // 操作记录
import activities from '@/view/module/workOrder/mixin/operationLog';
import { getDetail, upload, cancelInvoice, reFundInvoice, modifyInvoice, fillMaterial, payConfirm } from '@/api/newApi/finance/invoice.js';
import { applyOrderRefund, getReject, confirmPayment } from '@/api/newApi/orderManage/salesorder.js';
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
import OrderRecord from '@/components/OrderRecord'; // 操作记录
import { mapMutations } from 'vuex';
import UploadImages from '@/components/UploadImages/index';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { getBaseDataByDataType } from '@/api/newApi/common';

import OfflinePayDialog from './components/offlinePayDialog.vue';

export default {
  filters: {
    //开票状态
    filterInvoiceStatus(val) {
      switch (val) {
        case 'WAIT_PAY':
          return '待付款';
        case 'WAIT_INFO':
          return '待补充信息';
        case 'WAIT_INVOICE':
          return ' 待开票';
        case 'INVOICED':
          return ' 已开票';
        case 'APPLY_REFUND':
          return '申请退款';
        case 'CANCEL':
          return '已取消';
        case 'PAY_WAIT_CONFIRM':
          return '付款待确认';
      }
    },
  },
  components: { UploadImages, Steps, OperationLog, OrderRecord, UploadImages, UploadFileUrl, OfflinePayDialog },
  mixins: [activities],
  data() {
    var validateReason = (rule, value, callback) => {
      if (this.refundForm.refundPoundage === '0' && value === '') {
        callback(new Error('请输入不扣除手续费原因'));
      } else {
        callback();
      }
    };
    return {
      detailObj: {
        img: 'http://file.itaxs.com/dev/20210819/461cf5659ffc49e3adab0b4666835f7c.webp',
      },
      invoiceInfoModel: false,
      invoiceObj: {},
      paymentChannelList: [],
      invoiceInfo: {
        invoiceTypeSelect: null, // 选择的开票类型, 1,2,3 对应专用发票，普通发票个人，普通发票公司
        invoiceType: '', // 发票类型
        subjectType: '', // 主体类型
        name: '',
        idOrTaxNumber: '',
        companyAddress: '',
        companyTel: '',
        openingBank: '',
        bankAccount: '',
      },
      showOffLinePayDialog: false,
      orderObj: {},
      orderPayment: {},
      uploaInvoiced: false, //发票弹窗
      upload: {
        id: '',
        invoiceFile: '',
      },
      remark: '',
      enterpriseName: '',
      refundDialog: false,
      changeInvoiceDialog: false,
      refundForm: {
        refundMoney: '',
        refundBank: '',
        refundAccount: '',
        refundPayee: '',
        refundReason: '',
        refundType: 'INVOICE', // 发票
        refundReasonType: '',
        noPoundageReason: '',
        province: '',
        city: '',
      },
      isEdit: false,
      refundFormRules: {
        refundPoundage: [{ required: true, message: '请输入退款手续费', trigger: 'blur' }],
        refundMoney: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
        refundBank: [{ required: true, message: '请输入退款银行', trigger: 'blur' }],
        refundAccount: [{ required: true, message: '请输入退款账户', trigger: 'blur' }],
        refundPayee: [{ required: true, message: '请输入收款人/公司', trigger: 'blur' }],
        refundReason: [{ required: true, message: '请输入退款原因', trigger: 'blur' }],
        refundMethod: [{ required: true, message: '请选择退款路径', trigger: 'change' }],
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        auditFile: [{ required: true, message: '请上传审核凭证', trigger: 'change' }],
        noPoundageReason: [{ validator: validateReason, trigger: 'change' }],
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        refundReasonType: [
          {
            required: true,
            message: '请选择退款原因分类',
            trigger: 'change',
          },
        ],
      },
      invoiceFormRules: {
        companyAddress: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
        companyTel: [{ required: true, message: '请输入公司电话', trigger: 'blur' }],
        openingBank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入开户卡号', trigger: 'blur' }],
      },
      rules: {
        invoiceFile: [{ required: true, message: '请上传发票', trigger: 'change' }],
      },
      //驳回
      rejectDialog: false,
      rejectForm: {
        remark: '',
      },
      rulesFormReject: {
        remark: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
      },
      // 确认到账
      payModel: false,
      payForm: {
        gatheringTime: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      payRules: {
        gatheringTime: [
          {
            required: true,
            message: '请选择到账时间',
            trigger: 'blur',
          },
        ],
      },
      provinceList: [],
      cityList: [],
      refundReasonTypeList: [],
      detail: {},
    };
  },
  computed: {
    showCancelBtn() {
      if ((this.detail.status == 'WAIT_PAY' || this.detail.status == 'PAY_WAIT_CONFIRM') && this.detail.makeInvoiceMoney > 0) {
        return true;
      } else if ((this.detail.status == 'PAY_WAIT_CONFIRM' || this.detail.status == 'WAIT_PAY' || this.detail.status == 'WAIT_INFO' || this.detail.status == 'WAIT_INVOICE') && this.detail.makeInvoiceMoney == 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    'refundForm.refundMoney'(newVal) {
      if (newVal) {
        this.refundForm.refundMoney = this.$util.formatPrice(newVal);
      }
    },
    'refundForm.refundPoundage'(newVal) {
      if (newVal) {
        this.refundForm.refundPoundage = this.$util.formatPrice(newVal);
      }
    },
    'invoiceInfo.invoiceTypeSelect'(newVal) {
      if (newVal === 1) {
        this.invoiceInfo.invoiceType = 'SPECIAL';
        this.invoiceInfo.subjectType = '';
      }
      if (newVal === 2) {
        this.invoiceInfo.invoiceType = 'GENERAL';
        this.invoiceInfo.subjectType = 'PERSON';
      }
      if (newVal === 3) {
        this.invoiceInfo.invoiceType = 'GENERAL';
        this.invoiceInfo.subjectType = 'ENTERPRISE';
      }
    },
  },
  created() {
    this.upload.id = this.$route.query.id;
    this.enterpriseName = this.$util.getLocalStorage('enterpriseName');
    this.getDetailsData();
    this.getProvinceOrCityList(1, 'province');
    this.getRefundReasonTypeList();
    this.getOptionList();
  },
  methods: {
    clearInvoice() {
      this.invoiceInfo.name = '';
      this.invoiceInfo.idOrTaxNumber = '';
      this.invoiceInfo.companyAddress = '';
      this.invoiceInfo.companyTel = '';
      this.invoiceInfo.openingBank = '';
      this.invoiceInfo.bankAccount = '';
    },
    //复制链接
    copyLink(className) {
      let _this = this;
      let clipboard = new this.clipboard(className);
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
    getOptionList() {
      getBaseDataByDataType({
        dataType: 'PAYMENT_CHANNEL_TYPE',
      }).then((res) => {
        if (res.code == 0) {
          this.paymentChannelList = res.data;
        }
      });
    },
    showConfirmPayment() {
      this.$Modal.confirm({
        title: '确认到账',
        content: '确认是否到账?',
        onOk: () => {
          payConfirm({
            orderId: this.detail.orderId,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              });
              this.getDetailsData();
            } else {
              this.$message({
                type: 'error',
                message: '操作失败',
              });
            }
          });
        },
        onCancel: () => {},
      });
    },
    showInvoiceInfoModel(flag) {
      this.isEdit = flag;
      this.invoiceInfoModel = true;
      if (flag) {
        this.invoiceInfo = JSON.parse(JSON.stringify(this.detail));
      }
    },
    // 获取业务类型
    getRefundReasonTypeList() {
      getBaseDataByDataType({
        dataType: 'REFUND_REASON_TYPE',
      }).then((res) => {
        this.refundReasonTypeList = res.data;
      });
    },
    setContractStatus(key) {
      let val = '';
      switch (key) {
        case 'UNSIGNED':
          val = '未签署';
          break;
        case 'SENDING':
          val = '发送中';
          break;
        case 'SIGNING':
          val = '签署中';
          break;
        case 'SIGNED':
          val = '已签署';
          break;
        case 'SPECIAL_NO_SIGN':
          val = '特批不签';
          break;
        case 'OFFLINE_SIGNED':
          val = '线下签订';
          break;
        case 'REVOKED':
          val = '已撤销';
          break;
        case 'INVALIDING':
          val = '作废中';
          break;
        case 'INVALID':
          val = '已作废';
          break;
        default:
          val = '';
          break;
      }
      return val;
    },
    /** 获取详情 */
    getDetailsData() {
      getDetail({
        id: this.$route.query.id,
      }).then((res) => {
        if (res.code == 0) {
          this.invoiceObj = res.data.invoice;
          this.detail = res.data;
          this.invoiceInfo.invoiceType = this.detail.invoiceType;
          this.invoiceInfo.subjectType = this.detail.subjectType;
          if (this.invoiceInfo.invoiceType === 'SPECIAL') {
            this.invoiceInfo.invoiceTypeSelect = 1;
          } else {
            this.invoiceInfo.subjectType === 'PERSON' ? 2 : 3;
          }
          console.log(this.detail);
          this.orderObj = res.data.orders;
          this.orderPayment = res.data.orderPayment;
          this.getOperationLog(this.detail.orderNo, 1);
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**提示 */
    handleClickCancelMessage() {
      let val = this.invoiceObj.contractStatus;
      return val == 1 || val == 2 ? '取消发票会撤销或者作废合同' : '确定取消该发票吗？';
    },
    /** 取消 */
    handleClickCancel() {
      this.$confirm('确认取消申请发票吗？', '取消提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        cancelInvoice({ id: this.upload.id }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '发票取消成功',
            });
            this.getDetailsData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    showRefundDialog() {
      // 如果有退款中的订单

      this.refundDialog = true;
    },
    /** 确认退票 */
    refundInvoice() {
      this.$confirm('确定退票吗？', '取消提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        reFundInvoice(this.invoiceObj.id).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '退票成功',
            });
            this.getDetailsData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    reset() {
      if (this.$refs.rejectConfirm) {
        this.$refs.rejectConfirm.resetFields();
      }
    },
    /**
     *  订单驳回
     */
    rejectApply() {
      this.$refs.rejectConfirm.validate((valid) => {
        if (valid) {
          getReject({
            ...this.rejectForm,
            id: this.orderObj.id,
            orderPaymentId: this.orderPayment.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('订单驳回成功');
              this.rejectDialog = false;
              this.getDetailsData();
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              });
            }
          });
        }
      });
    },
    //确认到账提交
    submitPayBtn() {
      this.$refs.ruletimeForm.validate((valid) => {
        if (valid) {
          confirmPayment({
            ...this.payForm,
            id: this.orderPayment.id,
            enterpriseId: this.$util.getLocalStorage('enterpriseId'),
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('确认到账成功');
                this.payModel = false;
                this.getDetailsData();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    /** 上传发票 */
    changeUploadInvoice(row) {
      this.uploaInvoiced = true;
    },
    handleUpload() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          upload(this.upload).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '发票上传成功',
              });
              this.uploaInvoiced = false;
              this.getDetailsData();
            } else {
              this.$message({ type: 'error', message: res.message });
            }
          });
        }
      });
    },
    /**
     * 申请退款
     */
    refundConfirm() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          applyOrderRefund({
            ...this.refundForm,
            refundApplyType: 'ONLY_REFUND', // 仅退款
            refundType: 'INVOICE',
            invoiceId: this.$route.query.id,
            orderId: this.detail.orderId,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('申请成功');
                this.refundDialog = false;
                this.getDetailsData();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    // 修改开票信息
    _modifyInvoice() {
      const fnName = this.isEdit ? modifyInvoice : fillMaterial;
      this.$refs.invoiceForm.validate((valid) => {
        if (valid) {
          console.log({
            orderNo: this.detail.orderNo,
            orderInvoiceId: this.$route.query.id,
            ...this.invoiceInfo,
          });
          fnName({
            orderNo: this.detail.orderNo,
            orderInvoiceId: this.$route.query.id,
            ...this.invoiceInfo,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.invoiceInfoModel = false;
              this.getDetailsData();
            }
          });
        }
      });
    },
    // 获取省市列表
    getProvinceOrCityList(pid, type) {
      getWorldCountryListByPid({
        pid,
      }).then((res) => {
        if (type === 'province') {
          this.provinceList = res.data;
        } else if (type === 'city') {
          this.cityList = res.data;
        }
      });
    },
    // 更改省
    provinceChange(name) {
      // 根据名称获取id
      let id = this.provinceList.find((item) => item.name == name).id;
      this.getProvinceOrCityList(id, 'city');
      this.refundForm.city = '';
    },
    //返回列表页
    ...mapMutations(['closeTag']),
    goBack() {
      this.closeTag(this.$route);
      this.$router.push('/finance/invoice/index');
    },
    // 重置修改开票信息
    resetChangeInvoiceInfo() {
      if (this.$refs.invoiceForm) {
        this.$refs.invoiceForm.resetFields();
      }
    },
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.upload.invoiceFile = file;
    },
    // 上传失败
    onUploadError(file) {
      console.log(file);
    },
    // 上传移除
    onUploadRemove(file) {
      this.upload.invoiceFile = file;
    },
  },
};
</script>
<style scoped lang="scss">
.back {
  float: left;
  cursor: pointer;
}
.header-container {
  padding: 20px;
  background-color: #fff;
  .tittle {
    display: flex;
    align-items: center;
    margin: 15px 0 15px -20px;
    font-size: 14px;
  }
  .border-box {
    margin: 30px 0;
    padding: 0px 30px;
    overflow: hidden;
    .order {
      font-size: 14px;
      margin: 20px 0;
    }
  }
  .btn-group {
    float: right;
  }
  .left {
    float: left;
    width: 60%;
  }
  .right {
    float: right;
    width: 40%;
  }
}
.dis-flex li {
  padding: 0;
}
.tittleStyle {
  display: inline-flex;
  margin-bottom: 20px;
  .talkbubble {
    background-color: #fff;
    border: 1px solid #666666;
    padding: 0 12px;
  }
  .triangle {
    width: 15px;
    border: 15px solid transparent;
    border-right: 10px solid #666666;
    position: relative;
    &::after {
      position: absolute;
      content: '';
      width: 15px;
      border: 15px solid transparent;
      border-right: 10px solid #fff;
      left: -14px;
      top: -15px;
    }
  }
}
// .app-container {
//   height: 100%;
// }
.header {
  width: 100%;
  height: 30px;
  .btn-group {
    float: right;
  }
}

.header-container {
  padding-left: 24px;
  height: 100%;
  .statusInfo {
    .state {
      padding: 0 5px;
      color: #666666;
      text-align: center;
      border-radius: 5px;
      height: 30px;
      line-height: 30px;
      // margin-top: 5px;
      border: 1px #666666 solid;
      ::v-deep .el-form-item__content {
        line-height: 30px;
      }
    }
    // .priceinfo {
    //   display: flex;
    //   flex-wrap: nowrap;
    //   justify-content: space-between;
    // }
  }
  .creatinfo {
    padding-top: 20px;
    .el-avatar {
      float: left;
      margin-top: 10px;
    }
    .creatbox {
      float: left;
      width: 300px;
      margin-left: 10px;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
// .el-drawer-wrapper {
::v-deep .el-drawer {
  width: auto !important;
}
// }
::v-deep .el-drawer__header {
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}
::v-deep .el-drawer__body {
  padding: 0 60px;
}
.drawer-title-wrapper {
  height: 60px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .drawer-title {
    font-size: 14px;
    color: #333;
  }
}
.item-tip {
  padding: 0 10px;
  line-height: 18px;
  box-shadow: 0px 2px 3px 0px rgba(57, 61, 70, 0.06), 0px -2px 3px 0px rgba(57, 61, 70, 0.06);
  color: #999;
  padding: 0 20px;
  margin-top: 10px;
  display: flex;
  .icon-tip {
    margin-top: 2px;
  }
}
.title {
  margin: 0 20px 10px 20px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 30px;
  }
}
::v-deep .el-descriptions-item__label {
  white-space: nowrap !important;
}
/deep/ .orderlist {
  padding: 0;
}

.status-title-wrap {
  background: #e4e4e4;
  height: 36px;
  line-height: 36px;
  margin: 20px 0 10px 10px;
  padding: 0 10px;
}
.fr {
  float: right;
}
</style>
