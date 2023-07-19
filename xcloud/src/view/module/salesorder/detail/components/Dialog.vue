<template>
  <div>
    <!-- 发起付款 -->
    <el-dialog title="发起付款" :visible.sync="dialogShowObj.initiatePayDialog" width="450px" @close="resetForm('initiatePayForm')" :close-on-click-modal="false">
      <el-form ref="initiatePayForm" :rules="rulesInitiatePay" :model="initiatePayForm" label-width="120px">
        <el-form-item label="应付金额：">
          <el-tooltip class="item" effect="dark" content="应付金额=订单总应付金额+税额" placement="top">
            <span>￥{{ $util.accAdd(detailInfo.orderPaymentMoney, detailInfo.invoiceMoney) | formatQianFenWei }}</span>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="已付金额：">
          <span>￥{{ detailInfo.orderPaidMoney | formatQianFenWei }}</span>
        </el-form-item>

        <el-form-item label="未付金额：">
          <el-tooltip class="item" effect="dark" content="未付金额=应付金额-已付金额" placement="top">
            <span>￥{{ $util.accSub($util.accAdd(detailInfo.orderPaymentMoney, detailInfo.invoiceMoney), detailInfo.orderPaidMoney) | formatQianFenWei }}</span>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="本次付款金额：" prop="amount">
          <!-- 只能输入小于等于“未付金额”的数值 -->
          <div><el-input-number size="small" v-model="initiatePayForm.curPaymentMoney" controls-position="right" :min="0" :max="Number($util.accSub($util.accAdd(detailInfo.orderPaymentMoney, detailInfo.invoiceMoney), detailInfo.orderPaidMoney))"></el-input-number></div>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <span class="dialog-footer">
          <el-button size="small" @click="dialogShowObj.initiatePayDialog = false">取 消</el-button>

          <el-button size="mini" class="cp-btn" @click="createPayLink('.cp-btn')" :loading="paymentLoading">生成付款链接</el-button>

          <el-button size="mini" class="cp-btn" data-clipboard-action="copy" v-if="info" :data-clipboard-text="info" @click="copyLink2('.cp-btn')">付款链接（点击复制）</el-button>
        </span>
      </div>
    </el-dialog>

    <!--开票弹窗 -->
    <el-dialog title="申请开票" :visible.sync="dialogShowObj.applyInvoiceDialog" width="750px" @close="resetForm('refinvoiceFrom')" :close-on-click-modal="false">
      <el-row class="title bold">
        <el-col :span="8">订单号：{{ detailInfo.orderNo }}</el-col>
        <el-col :span="8">实付金额：{{ detailInfo.orderPaidMoney | formatQianFenWei }}元</el-col>
        <el-col :span="8">
          未开票金额：
          {{ notInvoicePrice }}
          元
        </el-col>
      </el-row>

      <el-row class="title">
        <el-col :span="4"><span>开票信息：</span></el-col>
        <el-col :span="20">
          <el-radio-group v-model="invoiceFrom.invoiceType" @change="getInvoice">
            <el-radio :label="4">增值税专用发票</el-radio>
            <el-radio :label="2">增值税普通发票(个人)</el-radio>
            <el-radio :label="3">增值税普通发票(公司)</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-form ref="refinvoiceFrom" label-width="120px" :model="invoiceFrom" :rules="rulesInvoice">
        <div v-if="invoiceFrom.invoiceType == 4">
          <el-form-item label="公司名称：" prop="name">
            <el-input v-model="invoiceFrom.name" placeholder="公司名称" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="纳税识别号：" prop="idOrTaxNumber">
            <el-input v-model="invoiceFrom.idOrTaxNumber" placeholder="纳税识别号" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="公司地址：" prop="companyAddress">
            <el-input v-model="invoiceFrom.companyAddress" placeholder="公司地址" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="公司电话：" prop="companyTel">
            <el-input v-model="invoiceFrom.companyTel" placeholder="公司电话" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="开户银行：" prop="openingBank">
            <el-input v-model="invoiceFrom.openingBank" placeholder="开户银行" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="开户卡号：" prop="bankAccount">
            <el-input v-model="invoiceFrom.bankAccount" placeholder="开户卡号" clearable style="width: 300px" size="small" />
          </el-form-item>
        </div>

        <div v-if="invoiceFrom.invoiceType == 2">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="invoiceFrom.name" placeholder="姓名" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="身份证号码：" prop="idOrTaxNumber">
            <el-input v-model="invoiceFrom.idOrTaxNumber" placeholder="身份证号码" clearable style="width: 300px" size="small" />
          </el-form-item>
        </div>

        <div v-if="invoiceFrom.invoiceType == 3">
          <el-form-item label="公司名称：" prop="name">
            <el-input v-model="invoiceFrom.name" placeholder="公司名称" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="纳税识别号：" prop="idOrTaxNumber">
            <el-input v-model="invoiceFrom.idOrTaxNumber" placeholder="纳税识别号" clearable style="width: 300px" size="small" />
          </el-form-item>
        </div>

        <el-form-item label="税率：">{{ detailInfo.payMethod === 'INTL_PAY' ? '0' : taxRate }}%</el-form-item>
        <el-form-item label="应付税额：">
          <span style="color: red">{{ detailInfo.payMethod === 'INTL_PAY' ? '0' : makeInvoiceMoney }}元</span>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div style="overflow: hidden">
        <span style="float: left; color: #ec808d">
          <p>注：1. 申请开票需要加收增值税金额，税点为{{ taxRate }}%,国际支付税点为0%；</p>
          <p>2. 建议消费满1000元开具发票</p>
        </span>

        <span class="dialog-footer" style="float: right">
          <el-button @click="dialogShowObj.applyInvoiceDialog = false" size="small">取 消</el-button>
          <el-button v-if="taxRate === 0 || detailInfo.payMethod === 'INTL_PAY'" type="primary" size="small" @click="submitInvoice">提交申请</el-button>
          <el-button v-else type="primary" size="small" @click="submitInvoice">生成付款链接</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 登记款项 -->

    <el-dialog class="el-dialog-del" title="取消订单" :visible.sync="dialogShowObj.cancelOrderDialog" width="504px" :close-on-click-modal="false">
      <!-- 有生成服务信息,取消订单则提示 -->
      <div v-if="isShowFilter(detailInfo)" style="margin-bottom: 10px">该订单已生成服务，取消订单后将同步取消服务</div>
      <div class="text-tip">
        <i class="icon icon-tip"></i>
        <!-- 付款被驳回 -->
        <span v-if="detailInfo.status === 11">该订单对应的服务项目已经生成了服务工单，取消订单会同步取消服务工单，要提前与交付沟通再取消</span>
        <!-- 订单驳回 -->
        <span>确认要取消该订单吗？</span>
      </div>
      <el-form :model="cancelOrderForm" ref="cancelOrderFormRef" label-width="80px">
        <el-form-item label="取消说明" prop="cancelReason" :rules="[{ required: true, message: '请输入取消说明' }]">
          <el-input type="textarea" :rows="4" v-model="cancelOrderForm.cancelReason" placeholder="请输入" style="width: 300px" :maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowObj.cancelOrderDialog = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="cancelOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 订单审核 -->
    <el-dialog title="审核" :visible.sync="dialogShowObj.confirmOrderDialog" width="460px">
      <el-form ref="refconfirm" :rules="rulesForm" :model="confirm" label-width="120px">
        <el-form-item label="选项" required prop="auditResult">
          <el-radio v-model="confirm.auditResult" label="AUDIT_SUCCESS">审核通过</el-radio>
          <el-radio v-model="confirm.auditResult" label="AUDIT_FAIL">审核不通过</el-radio>
        </el-form-item>

        <el-form-item label="备注说明" prop="remark">
          <el-input type="textarea" :rows="4" placeholder="备注说明" v-model="confirm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowObj.confirmOrderDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitShenHe" :loading="auditLoading" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 归属人 -->
    <el-dialog title="修改归属人" :visible.sync="dialogShowObj.changeBelongDialog" width="460px" :close-on-click-modal="false">
      <el-form ref="follw" label-width="100px" :model="follwForm" :rules="registerFundFormRule">
        <el-form-item label="当前归属人">
          <span style="color: red">{{ detailInfo.attributionName }}</span>
        </el-form-item>
        <el-form-item label="归属人" prop="attributionId">
          <el-select style="width: 100%" clearable placeholder="跟进人" size="small" filterable v-model="follwForm.attributionId">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowObj.changeBelongDialog = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="updatefollowFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单备注 -->

    <!-- 订单变更手机号 -->
    <el-dialog title="修改用户手机号" :visible.sync="dialogShowObj.updateUserMobileDialog" width="460px" :close-on-click-modal="false">
      <el-form ref="rejectUserUpdateMoblie" :model="userMoblie">
        <el-form-item label="新手机号：" prop="phone">
          <el-input v-model="userMoblie.phone" style="width: 300px" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShowObj.updateUserMobileDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateUserMoblie" size="small">提 交</el-button>
      </span>
    </el-dialog>
    <div ref="copy" class="copy" data-clipboard-action="copy" :data-clipboard-text="copyLinkUrl" @click="$util.copyLink('.copy', '已复制付款链接')"></div>

    <!-- 线下付款提示 -->
    <el-dialog title="线下付款提示" :visible.sync="dialogShowObj.offlinePayDialog" width="550px">
      <p style="padding: 0 25px 10px">该客户已开通线下收款账户，可按照以下收款信息进行打款，付款后进入订单的付款链接，选择线下付款操作“完成打款”系统自动确认到账，无需财务审核</p>

      <el-form label-width="110px" ref="userInfo">
        <el-form-item label="开通状态："> {{ (newUserInfo || {}).status | filterOpenStatus }} </el-form-item>

        <el-form-item label="收款公司：">
          {{ (newUserInfo || {}).companyName }}
        </el-form-item>
        <el-form-item label="收款账号：">
          {{ (newUserInfo || {}).accountNumber }}
        </el-form-item>
        <el-form-item label="开户行名称：">
          {{ (newUserInfo || {}).bankName }}
        </el-form-item>

        <el-form-item label="联行行号：">
          {{ (newUserInfo || {}).bankNumber }}
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <span class="dialog-footer">
          <el-button size="mini" data-clipboard-action="copy" class="cp-offline-pay-btn" v-if="detailInfo.orderPayUrl" :data-clipboard-text="detailInfo.orderPayUrl" @click="copyLink2('.cp-offline-pay-btn')">付款链接（点击复制）</el-button>

          <el-button
            size="mini"
            @click="
              dialogShowObj.offlinePayDialog = false;
              dialogShowObj.manConfirmPayDialog = true;
            "
            >选择人工确认到账</el-button
          >
        </span>
      </div>
    </el-dialog>

    <!-- 未开通线下付款提示 -->
    <el-dialog title="线下付款提示" :visible.sync="dialogShowObj.offlineUnopenDialog" width="550px" :close-on-click-modal="false">
      <p style="padding: 0 25px 10px">该客户未开通线下收款账户，可提交以下信息进行开通，开通后可复制打款账户让客户进行打款</p>

      <el-form label-width="110px" ref="unopen">
        <el-form-item label="开通状态："> 未开通 </el-form-item>

        <el-form-item label="开户类型：">
          <el-select style="width: 300px" v-model="unopenForm.accountType" placeholder="开户类型">
            <el-option value="ENTERPRISE" label="企业"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称：">
          <el-input v-model="unopenForm.userName" style="width: 300px" clearable placeholder="请输入客户全程"></el-input>
        </el-form-item>
        <el-form-item label="证件类型：">
          <el-select style="width: 300px" v-model="unopenForm.documentType" placeholder="证件类型">
            <el-option value="CREDIT_CODE" label="统一社会信用代码"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码：">
          <el-input v-model="unopenForm.documentNumber" style="width: 300px" clearable placeholder="请输入证件号码"></el-input>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <span class="dialog-footer">
          <el-button type="primary" @click="openConfirm" :loading="openConfirmlaoding">确认开通</el-button>

          <el-button
            size="mini"
            @click="
              dialogShowObj.offlinePayDialog = false;
              dialogShowObj.manConfirmPayDialog = true;
            "
            >选择人工确认到账</el-button
          >
        </span>
      </div>
    </el-dialog>

    <!-- 线下付款提示 -->
    <el-dialog :title="isEditVoucher ? '修改付款凭证' : '登记凭证-人工确认到账'" :visible.sync="dialogShowObj.manConfirmPayDialog" width="650px" class="man-confirm-dialog" :close-on-click-modal="false">
      <!-- {{confrimAccount}} -->
      <div class="tip-box" v-if="detailInfo.paymentTypeEn === 'PART'">提示：分期订单凭证审核通过后可继续登记凭证</div>
      <div class="tip-box" v-if="detailInfo.paymentTypeEn !== 'PART' && detailInfo.payMethod !== 'INTL_PAY'">
        <p>提示</p>
        <p v-if="!isEditVoucher">1，如客户无法通过线上开通的美的收款账号公对公打款，或在公司老收款账户打款，可在此提交线下收款信息；</p>
        <p v-if="isEditVoucher">1，如客户要求线下公对公打款，在公司老收款账户打款，可在此提交线下收款信息；</p>
        <p>2，提交后需要财务进行人工审核，确认到账后会生成服务工单</p>
        <p>3，请仔细核对应付金额和打款凭证金额是否匹配</p>
        <p v-if="!isEditVoucher">4，如客户需要马上进行服务的交付，建议开通线下打款账户进行打款，系统自动确认</p>
      </div>
      <el-form label-width="130px" ref="confrimAccountForm" :rules="rulesconfrimAccountForm" :model="confrimAccount">
        <el-form-item label="商品金额(元)：">
          <el-input v-model="detailInfo.orderPaymentMoney" style="width: 300px" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="税额(元)：">
          <el-input v-model="detailInfo.invoiceMoney" style="width: 300px" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="总应付金额：">
          <el-input v-model="confrimAccount.paymentAmount" style="width: 300px" clearable disabled></el-input>
        </el-form-item>
        <template v-if="detailInfo.paymentTypeEn === 'PART'">
          <el-form-item label="未付金额：">
            <el-input v-model="detailInfo.unPaidMoney" style="width: 300px" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="本次付款金额：" prop="currentPaymentAmount">
            <el-input v-model="confrimAccount.currentPaymentAmount" :max="detailInfo.unPaidMoney" style="width: 300px" clearable v-positiveNumber="{ fixedNum: 2, maxNum: detailInfo.unPaidMoney, minNum: 0 }"></el-input>
            <div>本次付款金额不能大于未付金额</div>
          </el-form-item>
        </template>

        <el-form-item prop="paymentChannel" label="支付方式：">
          <el-select style="width: 300px" v-model="confrimAccount.paymentChannel" placeholder="支付方式" clearable>
            <el-option v-for="item in paymentChannelList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="currencyPayAmount" label="币种/金额：" v-if="detailInfo.payMethod === 'INTL_PAY'">
          <!-- 币种&金额 联合组件 -->
          <CurrencyAmount v-model="confrimAccount" />
        </el-form-item>
        <el-form-item prop="exRate" label="汇率：" v-if="detailInfo.payMethod === 'INTL_PAY'">
          <div class="exratenum">
            <el-input-number v-model="confrimAccount.exRate" label="描述文字" placeholder="请输入汇率" :min="0.000001" :max="999999999" controls-position="right" :precision="6"></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="付款方：" prop="payer">
          <el-input v-model="confrimAccount.payer" style="width: 300px" clearable></el-input>
        </el-form-item>

        <el-form-item label="收款账号：" prop="acceptAccountNo">
          <el-select v-model="confrimAccount.acceptAccountNo" placeholder="请选择" size="small" style="width: 300px" clearable filterable>
            <el-option-group style="width: 450px">
              <div class="option_title" style="background: #f6f8fa">
                <span>银行账号</span>
                <span>账户名称</span>
                <span>开户银行</span>
              </div>

              <el-option v-for="(item, index) in collectionList" :key="index" :label="item.accountName" :value="item.bankAccount" class="option_title">
                <span>{{ item.bankAccount }}</span>
                &nbsp;
                <span>{{ item.accountName }}</span>
                &nbsp;
                <span>{{ item.bankName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="付款凭证：" prop="paymentFile">
          <UploadImages ref="uploadImageRef" :num="3" :imageUrl="confrimAccount.paymentFile" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove"></UploadImages>
        </el-form-item>
        <el-form-item label="付款时间：" prop="paymentTime" style="width: 300px">
          <el-date-picker :picker-options="pickerOptions" v-model="confrimAccount.paymentTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"> </el-date-picker>
        </el-form-item>

        <el-form-item label="交易流水：">
          <el-input v-model="confrimAccount.platformTradeNo" style="width: 300px" clearable></el-input>
        </el-form-item>

        <el-form-item label="备注说明：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="confrimAccount.remark"
            :placeholder="`1、请输入线下付款原因
2、可备注特别说明`"
            style="width: 300px"
            :maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitConfirmPay">{{ isEditVoucher ? '重新提交' : '提交' }}</el-button>

          <el-button size="mini" @click="dialogShowObj.manConfirmPayDialog = false">取消</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- <el-dialog title="提示" :visible.sync="sss" width="350px">
      <div style="text-align: right">
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitConfirmPay">提交</el-button>

          <el-button size="mini">取消</el-button>
        </span>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import UploadImages from '@/components/UploadImages/index'; //发票上传组件
import { taxRate } from '@/api/newApi/manuelorder/addOrder.js';
import { getBankAccountList, userList } from '@/api/newApi/common.js';
import { orderCancel, orderCancelAudit, ocrPayVoucher } from '@/api/newApi/orderManage/salesorder.js';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { newThrottle } from '@/libs/throttle';
import { getBaseDataByDataType } from '@/api/newApi/common';
import { updateUserAccount, addUserAccount, getUserAccount } from '@/api/newApi/customer/customerInfo.js';
import { ShenHe, applyInvoice, managementOrder, updateAttribution, sendPayment, getReject, updateOrderByUserMobile, uploadCertificate, orderOcrPayVoucher } from '@/api/newApi/orderManage/salesorder.js';
import CurrencyAmount from './CurrencyAmount.vue';
import currency from '@/utils/currency.js';
export default {
  components: { UploadImages, UploadFileUrl, CurrencyAmount },
  props: {
    dialogShowObj: { type: Object },
    detailInfo: { type: Object },
    userInfo: { type: Object, default: () => {} },
    balancePrice: { type: Number },
    isEditVoucher: { type: Boolean },
    orderPayments: { type: Array },
    offlineStatus: String,
    checkItem: Object,
  },
  inject: ['parentFn'],
  filters: {
    filterOpenStatus(status) {
      switch (status) {
        case 'INIT':
          return '申请中';
        case 'NORMAL':
          return '开通成功';
        case 'FAIL':
          return '开通失败';
        case 'UNOPEN':
          return '未开通';
      }
    },
  },
  data() {
    var validateReason = (rule, value, callback) => {
      if (this.confirm.auditResult !== 'AUDIT_SUCCESS' && value === '') {
        callback(new Error('请输入备注'));
      } else {
        callback();
      }
    };
    return {
      paymentLoading: false,
      signedLoad: false,
      auditLoading: false,
      info: '',
      enterpriseId: '',
      type: 'SPECIAL', //默认专用增值税
      taxPoint: '',
      collectionList: [], //收款账户列表
      paymentFile: '', //转账凭证
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      //开票信息
      invoiceFrom: {
        invoiceType: 4, //默认专用发票
        orderId: this.detailInfo.id,
        companyName: '',
        taxIdentificationNumber: '',
        companyAddress: '',
        companyTel: '',
        openingBank: '',
        bankAccount: '',
        name: '',
        idNumber: '',
      },

      confrimAccount: {
        acceptAccountNo: '',
        paymentFile: '',
        paymentTime: '',
        platformTradeNo: '',
        remark: '',
        paymentAmount: '',
        paymentChannel: '',
        payer: '',
        currentPaymentAmount: '',
        // exRate: '', // 汇率
        // currencyPayAmount: null, // 外币支付金额
        currency: 'USD', // 币种，形如：cny/usd
      },
      currency: currency,
      //收款账户列表
      collectionList: [],
      //修改付款信息/登记款项

      //订单确认
      confirm: {
        auditResult: '',
        remark: '',
      },

      //归属人列表
      followList: [],
      paymentChannelList: [],
      follwForm: {
        orderIds: [this.detailInfo.orderId],
        attributionId: '',
      },
      rejectForm: {
        id: this.detailInfo.id,
        remark: '',
      },

      //订单审核
      rulesForm: {
        remark: [{ validator: validateReason, trigger: 'blur' }],
        auditResult: [{ required: true, message: '请选择审核是否通过', trigger: 'change' }],
      },
      //订单驳回
      rulesFormReject: {
        remark: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
      },

      rulesconfrimAccountForm: {
        currentPaymentAmount: [{ required: true, message: '请输入本次付款金额', trigger: 'blur' }],
        payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
        acceptAccountNo: [{ required: true, message: '请选择收款账号', trigger: 'change' }],
        paymentChannel: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        acceptAccountNo: [{ required: true, message: '请输入收款账号', trigger: 'blur' }],
        paymentFile: [{ required: true, message: '请上传付款凭证', trigger: 'change' }],
        paymentTime: [{ required: true, message: '请选择付款时间', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注说明', trigger: 'blur' }],
        exRate: [{ required: true, message: '请输入汇率', trigger: 'blur' }],
        currencyPayAmount: [{ required: true, message: '请输入外币金额', trigger: 'blur' }],
      },

      // 手机号验证
      userMoblierelesForm: {
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            //pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码',
          },
        ],
      },
      // 取消订单
      cancelOrderForm: {
        cancelReason: '',
        auditFile: '',
      },
      cancelOrderFormRule: {
        cancelReason: [{ required: true, message: '请输入取消说明', trigger: 'blur' }],
        auditFile: [{ required: true, message: '请上传审核凭证', trigger: 'blur' }],
      },
      initiatePayForm: {
        curPaymentMoney: '',
      },
      // 取消订单审核
      cancelOrderAuditForm: {
        auditType: '',
        remark: '',
      },

      //开票信息校验
      rulesInvoice: {
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        taxIdentificationNumber: [{ required: true, message: '请输入纳税识别号', trigger: 'blur' }],
        companyAddress: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
        companyTel: [{ required: true, message: '请输入公司电话', trigger: 'blur' }],
        openingBank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入开户卡号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
      },
      //登记款项校验
      rulesRegisterFund: {
        payer: [{ required: true, message: '请输入付款方', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入付款金额', trigger: 'blur' }],
        acceptAccountNum: [{ required: true, message: '请选择收款账户', trigger: 'change' }],
        currentPaymentAmount: [{ required: true, message: '请输入本次付款金额', trigger: 'blur' }],
        paymentTime: [{ required: true, message: '请选择付款时间', trigger: 'change' }],
        paymentFile: [{ required: true, message: '请上传转账凭证', trigger: 'change' }],
        paymentChannel: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
      },
      rulesInitiatePay: {
        curPaymentMoney: [{ required: true, message: '请输入付款金额', trigger: 'blur' }],
      },
      //归属人
      registerFundFormRule: {
        attributionId: [
          {
            required: true,
            message: '请选择需修改的归属人',
            trigger: 'change',
          },
        ],
      },
      // 用户手机号
      userMoblie: {
        phone: '',
      },
      // curTransferVoucher: '',
      copyLinkUrl: '',
      // 未开通线下打款
      offlineUnopenDialog: false,
      unopenForm: {
        enterpriseId: localStorage.getItem('enterpriseId'),
        userId: '',
        userMobile: '',
        accountType: 'ENTERPRISE',
        userName: '',
        documentNumber: '',
        documentType: 'CREDIT_CODE',
      },
      openConfirmlaoding: false,
      newUserInfo: this.userInfo,
    };
  },
  watch: {
    userInfo(val) {
      this.newUserInfo = val;
    },
    'dialogShowObj.applyInvoiceDialog': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getTaxRate(); //获取税率
        }
      },
    },

    'dialogShowObj.changeBelongDialog': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getUserList(); //归属人列表
          this.follwForm.attributionId = this.detailInfo.attributionId;
        }
      },
    },
    'dialogShowObj.initiatePayDialog': {
      handler(newVal) {
        if (newVal) {
          // 发起付款，本次付款金额为应付-已付+税额
          this.initiatePayForm.curPaymentMoney = this.$util.accAdd(this.$util.accSub(this.detailInfo.orderPaymentMoney, this.detailInfo.orderPaidMoney),this.detailInfo.invoiceMoney);
        }
      },
    },

    'dialogShowObj.manConfirmPayDialog': {
      handler(newVal) {
        if (newVal) {
          this.getPayChannel();
          this.getBankList();
          this.confrimAccount.paymentAmount = this.$util.accSub(this.$util.accAdd(this.detailInfo.orderPaymentMoney, this.detailInfo.invoiceMoney), this.detailInfo.orderPaidMoney);

          if (this.isEditVoucher) {
            if (this.isItem) {
              this.confrimAccount = JSON.parse(JSON.stringify(this.checkItem));
              if (this.detailInfo.paymentTypeEn === 'PART') {
                this.$set(this.confrimAccount, 'currentPaymentAmount', this.checkItem.paymentAmount);
              }
            } else {
              this.confrimAccount = JSON.parse(JSON.stringify(this.orderPayments[0]));
              if (this.detailInfo.paymentTypeEn === 'PART') {
                this.$set(this.confrimAccount, 'currentPaymentAmount', this.detailInfo.unPaidMoney);
              }
            }
          }
        }
      },
    },
    'confrimAccount.currentPaymentAmount'() {
      if (this.confrimAccount.currentPaymentAmount > this.detailInfo.unPaidMoney) {
        this.confrimAccount.currentPaymentAmount = this.detailInfo.unPaidMoney;
      }
    },
  },
  computed: {
    notInvoicePrice() {
      return this.$options.filters['subStringNum'](this.$util.accSub(this.detailInfo.orderPaymentMoney, this.detailInfo.refundMoney));
      //未开票进额= 实付金额-已退款商品金额
    },
    //应付开票金额（实付金额/产品总价 -已开票金额）*税点
    //实付金额和产品总价谁小取谁
    makeInvoiceMoney() {
      return this.$options.filters['subStringNum'](this.$util.accMul(this.notInvoicePrice, this.taxPoint));
    },

    taxRate() {
      return this.$util.floatMultiply(this.taxPoint, 100);
    },
    showOcrOther() {
      if (Array.isArray(this.RegisterFundForm.paymentFile)) {
        return this.RegisterFundForm.paymentFile.length > 0;
      } else if (typeof this.RegisterFundForm.paymentFile == 'string') {
        return this.RegisterFundForm.paymentFile != '';
      } else {
        return false;
      }
    },
    isItem() {
      return this.checkItem && this.checkItem.orderPaymentId;
    },
  },
  created() {
    this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
    this.setUserMoblie();
  },
  methods: {
    //判断 是否有生成服务信息 (orderProductSpecsList-》orderProductDetail-》serviceNo（服务号）  服务号不为空就是已生成服务)
    isShowFilter(record = {}) {
      let flag = false;
      for (const li of record.orderProductSpecsList || []) {
        for (const sub of li.orderProductDetail || []) {
          if (sub.serviceNo) {
            flag = true;
            break;
          }
        }
      }
      return flag;
    },
    // 确认开通
    openConfirm() {
      this.openConfirmlaoding = true;
      let method = this.offlineStatus ? updateUserAccount : addUserAccount;
      method({
        ...this.unopenForm,
        userId: this.detailInfo.userId,
        userMobile: this.detailInfo.userMobile,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('开通成功');

            this.getUserInfo();
          }
        })
        .catch(() => {
          this.$message.closeAll();
          this.$message.warning('开通失败');
        })
        .finally(() => {
          this.openConfirmlaoding = false;
        });
    },
    getUserInfo() {
      getUserAccount({
        userId: this.detailInfo.userId,
      }).then((res) => {
        if (res.code == 0) {
          if (res.data.status == 'NORMAL') {
            this.dialogShowObj.offlineUnopenDialog = false;
            this.newUserInfo = res.data;
            this.dialogShowObj.offlinePayDialog = true;
          }
        }
      });
    },
    // 初始化设置用户手机号
    setUserMoblie() {
      this.userMoblie.phone = this.detailInfo.userMobile;
    },
    submitConfirmPay() {
      this.$refs.confrimAccountForm.validate((valid) => {
        if (valid) {
          this.$confirm('请仔细核对应付金额和打款凭证金额是否一致，提交后需人工审核', '提示', {
            customClass: 'custom-confirm',
            confirmButtonText: '提交',
            cancelButtonText: '取消',
          }).then(() => {
            this.uploadCertificateFn();
          });
        }
      });
    },

    uploadCertificateFn() {
      let data = {
        orderId: this.detailInfo.orderId,
        ...this.confrimAccount,
        acceptAccountName: this.collectionList.find((item) => this.confrimAccount.acceptAccountNo === item.bankAccount).accountName,
        currencySymbol: this.detailInfo.payMethod === 'INTL_PAY' ? this.currency[this.confrimAccount.currency] : '', // 境外支付，参数加货币符号如$
      };
      if (this.detailInfo.paymentTypeEn === 'PART') {
        data.paymentAmount = this.confrimAccount.currentPaymentAmount;
      }
      if (this.isItem) {
        data.orderPaymentId = this.checkItem.orderPaymentId;
      }
      // 国内支付不传国际的几个参数
      if (this.detailInfo.payMethod !== 'INTL_PAY') {
        (data.exRate = null),
          (data.currencyPayAmount = null), // 外币支付金额
          (data.currency = '');
      }
      uploadCertificate(data).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.dialogShowObj.manConfirmPayDialog = false;
          this.parentFn.getDeatilData();
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    getPayChannel() {
      const payList = ['WEIXIN', 'ALIPAY', 'UNIONPAY', 'AIR_WALLEX_CODE', 'LIAN_LIAN_PAY_CODE', 'WAN_LI_CODE', 'PAYPAL_CODE', 'eBay', 'Payoneer'];
      getBaseDataByDataType({
        dataType: 'PAYMENT_CHANNEL_TYPE',
      }).then((res) => {
        if (res.code == 0) {
          this.paymentChannelList = res.data.filter((item) => payList.includes(item.dataCode));
        }
      });
    },
    //复制链接
    copyLink2(className) {
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

    //复制链接
    copyLink(className) {
      let _this = this;
      let clipboard = new this.clipboard(className, {
        text: function () {
          return _this.info;
        },
      });
      console.log(this.info, clipboard);

      setTimeout(() => {
        clipboard.on('success', function (e) {
          _this.$Message.success('复制成功');
        });
        clipboard.on('error', function () {
          _this.$Message.info('复制失败');
        });
      }, 1000);
    },
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.confrimAccount.paymentFile = file;
      const list = file.split(',');
      orderOcrPayVoucher({
        uri: list[list.length - 1],
      }).then((res) => {
        if (res && res.data) {
          this.confrimAccount.paymentTime = res.data.payTime; //付款时间
          this.confrimAccount.platformTradeNo = res.data.serialNumber; //流水号
        }
      });
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file, uploadFiles) {
      this.confrimAccount.paymentFile = file;
    },
    updateUserMoblie: newThrottle('updateUserMoblieFun'),
    //修改用户手机号
    async updateUserMoblieFun() {
      let parm = {
        newMobile: this.userMoblie.phone,
        orderId: this.detailInfo.orderId,
      };
      try {
        let { data, code, message } = await updateOrderByUserMobile(parm);
        if (code == 0) {
          this.$message({
            type: 'success',
            message: data != '' && data ? data : '修改手机号成功',
          });
          this.parentFn.getDeatilData();
          this.dialogShowObj.updateUserMobileDialog = false;
        }
      } catch (error) {
        console.warn(error);
      }
    },
    reset() {
      if (this.$refs.rejectConfirm) {
        this.$refs.rejectConfirm.resetFields();
      }
    },

    /*** */
    getInvoice() {
      switch (this.invoiceFrom.invoiceType) {
        case 4:
          this.type = 'SPECIAL';
          break;
        case 3:
        case 2:
          this.type = 'GENERAL';
          break;
        default:
          this.type = 'NONE';
          break;
      }
      this.getTaxRate(); //获取税率
    },
    /** 获取税率 */
    getTaxRate() {
      return new Promise((resolve) => {
        taxRate({
          enterpriseId: this.enterpriseId,
          status: 0,
          type: this.type,
        }).then((res) => {
          if (res.data.records.length > 0) {
            if (res.data.records[0].taxRate == 1) {
              this.taxPoint = 0;
            } else {
              this.taxPoint = res.data.records[0].taxRate;
            }
          } else {
            if (this.type != 'NONE') {
              this.$message({
                type: 'warning',
                message: '该开票类型下暂无税点，请先添加',
              });
            }
            this.taxPoint = 0;
          }
          console.log(this.taxPoint);
          resolve();
        });
      });
    },
    /**获取收款账户数据  */
    getBankList() {
      getBankAccountList({
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.collectionList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    //每次打开弹窗先重置下
    resetForm(name) {
      this.$refs[name].resetFields();
      this.info = '';
      // this.RegisterFundForm = { ...this.copyRegisterFundForm };
      // this.newPaymen = null;
    },
    /**
     * 申请开票
     */
    submitInvoice() {
      this.$refs.refinvoiceFrom.validate((valid) => {
        if (valid) {
          this.invoiceFrom.enterpriseId = this.enterpriseId;
          if (this.invoiceFrom.invoiceType == 4) {
            this.invoiceFrom.invoiceType = 'SPECIAL';
          } else if (this.invoiceFrom.invoiceType == 2) {
            this.invoiceFrom.invoiceType = 'GENERAL';
            this.invoiceFrom.subjectType = 'PERSON';
          } else {
            this.invoiceFrom.invoiceType = 'GENERAL';
            this.invoiceFrom.subjectType = 'ENTERPRISE';
          }
          applyInvoice({
            ...this.invoiceFrom,
            orderId: this.detailInfo.orderId,
          })
            .then(async (res) => {
              if (res.code == 0) {
                if (this.taxRate == 0) {
                  this.$message.success('申请成功');
                } else {
                  this.copyLinkUrl = res.data;
                  await this.$nextTick();
                  this.copyLink();
                }
                this.dialogShowObj.applyInvoiceDialog = false;
                this.parentFn.getDeatilData();
              }
            })
            .catch(() => {
              this.dialogShowObj.applyInvoiceDialog = false;
              this.parentFn.getDeatilData();
            });
        }
      });
    },
    //复制链接
    copyLink() {
      this.$refs.copy.click();
    },
    /**
     * 订单审核
     */
    submitShenHe() {
      this.$refs.refconfirm.validate((valid) => {
        if (valid) {
          this.auditLoading = true;
          ShenHe({
            orderId: this.detailInfo.orderId,
            ...this.confirm,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
                });
                this.dialogShowObj.confirmOrderDialog = false;
                this.parentFn.getDeatilData();
                this.auditLoading = false;
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              }
            })
            .finally(() => {
              this.auditLoading = false;
            });
        }
      });
    },

    createPayLink(className) {
      this.$refs.initiatePayForm.validate((valid) => {
        if (valid) {
          this.paymentLoading = true;
          sendPayment({
            ...this.initiatePayForm,
            orderId: this.detailInfo.orderId,
          })
            .then((res) => {
              if (res.code == 0 && res.message == 'success') {
                this.info = res.data;
                this.paymentLoading = false;
              }
            })
            .catch((err) => {
              this.paymentLoading = false;
              this.$message({
                type: 'warning',
                message: err.message,
              });
            });
        }
      });
    },

    /**
     *归属人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    /**获取跟进人名称 */
    selectName() {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === this.follwForm.attributionId; //筛选出匹配数据
      });
      return (obj || {}).nickName;
    },

    /**修改归属人保存 */
    updatefollowFun() {
      this.$refs.follw.validate((valid) => {
        if (valid) {
          this.follwForm.enterpriseId = this.enterpriseId;
          this.follwForm.attributionName = this.selectName();
          updateAttribution(this.follwForm).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              this.dialogShowObj.changeBelongDialog = false;
              this.parentFn.getDeatilData();
            }
          });
        }
      });
    },

    // 取消订单
    cancelOrderConfirm() {
      this.$refs.cancelOrderFormRef.validate((valid) => {
        if (valid) {
          orderCancel({
            orderId: this.detailInfo.orderId,
            ...this.cancelOrderForm,
          })
            .then((res) => {
              if (res.code === 0) {
                // let text = '取消订单成功';
                this.$message.success('取消订单成功');
                this.parentFn.getDeatilData();
              }
            })
            .catch((err) => {
              this.$message({
                type: 'warning',
                message: err.message,
              });
              this.parentFn.getDeatilData();
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 0 0px 10px 0px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 30px;
  }
}

.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
.el-dialog-del {
  padding: 0 60px;
  ::v-deep .el-dialog__body {
    padding: 25px 60px;
  }
}
.text-tip {
  display: flex;
  margin-bottom: 25px;
  .icon-tip {
    flex: 0 0 17px;
    margin-top: 3px;
  }
}

.man-confirm-dialog {
  ::v-deep .el-dialog__body {
    max-height: 600px;
    overflow: auto;
  }
}

.tip-box {
  background: #f2f2f2;
  margin: 0 20px 10px;
  padding: 10px;
}
</style>

<style lang="less">
.exratenum {
  .el-input-number--small {
    width: 170px;
  }
}
</style>
