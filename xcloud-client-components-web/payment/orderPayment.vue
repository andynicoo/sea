<template>
  <div>
    <div class="paymentpage">
      <div class="headContent">
        <img :src="payLogo" alt="" class="logo" />
        <div class="tit">
          <p>官网：{{ payWebsit }}</p>
          <p v-if="payMobile">客服热线：{{ payMobile }}</p>
        </div>
        <div class="ordertit">
          <p class="order">订单确认</p>
          <p>Confirm Order</p>
        </div>
      </div>
      <!-- 意向注册新增start -->
      <template v-if="fromEvidence">
        <div class="ev-links">
          <span @click="() => linkJump()">商标注册</span>> <span @click="() => linkJump(2)">填写使用证据</span>>
          <span>确认订单</span>
        </div>
        <div class="ev-tips">
          <Icon
            type="ios-information-circle"
          />美国商标意向申请，在公告后需要进行缴纳费用提交证据进行宣誓才可正式核准注册
        </div>
      </template>
      <!-- 意向注册新增end -->
      <div class="orderinfo">
        <h2>
          订单信息
        </h2>
        <div class="info">
          <div class="line">
            <a-space>
              <div class="box">
                手机号
                <p>{{ orderDetail.userMobile }}</p>
              </div>
              <div class="box">
                订单编号
                <p>{{ orderDetail.orderNo }}</p>
              </div>
              <div class="box">
                订单金额
                <p class="momey">￥{{ orderDetail.orderPaymentMoney.toLocaleString('en-US') }}</p>
              </div>
            </a-space>
          </div>
          <a-space class="infoline">
            <div class="box">
              客户经理
              <p>{{ orderDetail.attributionName }}</p>
            </div>
            <div class="box">
              创建日期
              <p>{{ createTimeHandler }}</p>
            </div>
            <div class="box">
            </div>
            <!-- <div class="box">
              是否开票
              <p>{{ orderDetail.invoiceStatus ? '是' : '否' }}</p>
            </div> -->
          </a-space>
        </div>
        <!-- <div class="invoice" v-if="orderDetail.invoiceStatus">
          <div class="title">
            <h3>
              发票信息
            </h3>
            <div class="button">
              {{ invoiceTypeMap[orderDetail.invoiceType] ? invoiceTypeMap[orderDetail.invoiceType] : '不开票' }}
              <span v-if="orderDetail.subjectType"
                >({{ invoiceTypeMap[orderDetail.subjectType] }})
              </span>
            </div>
          </div>
          <template v-if="orderDetail.subjectType === 'PERSON'">
            <div class="box">
              <h3>
                姓名
              </h3>
              <p class="bt15">{{ invoiceDetail.name }}</p>
            </div>
            <div class="box">
              <h3>
                身份证号
              </h3>
              <p class="bt15">{{ invoiceDetail.idOrTaxNumber }}</p>
            </div>
          </template>
          <template v-else-if="orderDetail.invoiceType === 'GENERAL'">
            <div class="box">
              <h3>
                公司名称
              </h3>
              <p class="bt15">{{ invoiceDetail.name }}</p>
            </div>
            <div class="box">
              <h3>
                纳税识别号
              </h3>
              <p class="bt15">{{ invoiceDetail.idOrTaxNumber }}</p>
            </div>
          </template>
          <template v-else>
            <div class="box">
              <h3>
                公司名称
              </h3>
              <p class="bt15">{{ invoiceDetail.name }}</p>
              <h3>
                纳税识别号
              </h3>
              <p>{{ invoiceDetail.idOrTaxNumber }}</p>
            </div>
            <div class="box">
              <h3>
                公司地址
              </h3>
              <p class="bt15">{{ invoiceDetail.companyAddress }}</p>
              <h3>
                公司电话
              </h3>
              <p>{{ invoiceDetail.companyTel }}</p>
            </div>
            <div class="box">
              <h3>
                开户银行
              </h3>
              <p class="bt15">{{ invoiceDetail.openingBank }}</p>
              <h3>
                开户卡号
              </h3>
              <p>{{ invoiceDetail.bankAccount }}</p>
            </div>
          </template>
        </div> -->
      </div>

      <div class="serviceinfo">
        <h2>服务明细</h2>
        <PaymentTable :serviceList="serviceList" />
      </div>

      <div class="paymethod">
        <h2 v-if="internationalPay">国际支付</h2>
        <h2 v-else>支付方式</h2>
        <div class="box">
          <div class="paytype">
            <h3 v-if="internationalPay">支付方式:</h3>
            <div
              class="fl typeBox"
              v-for="(item, index) in payListComputed"
              :key="index"
              :class="{ 'pay-item': true, active: item.active }"
              @click="changeMethod(index)"
            >
              <img :src="getPayImg(item)" alt />
              {{ item.payWayName }}
            </div>
          </div>
          <div class="moneytype" v-if="internationalPay">
            <h3>币种:</h3>
            <a-select
              :value="moneytypeVal"
              style="width: 120px"
              @change="moneytypeChange"
              :disabled="['AIRWALLEX_ALIPAYCN', 'AIRWALLEX_WECHATPAY'].includes(selectMethodCode)"
            >
              <a-select-option v-for="item in moneytypeMap" :value="item.value" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span v-if="currentLabel !== '人民币' && afterCurrency !== 'CNY'"
              >1{{ currentLabel }} ≈ {{ exchangeRate }}人民币
              <a-tooltip>
                <template slot="title">
                  实时参考汇率，最终支付以各大银行结算汇率为准！
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </span>
          </div>
        </div>
      </div>

      <!-- 支付金额总览 & 支付 -->
      <div class="paycount">
        <a-button class="paybutton" @click="goPay()" type="primary" :loading="loadComfirm">立即支付</a-button>
        <a-space :class="{ 'pay-Infomation': !internationalPay }">
          <span>小计：¥ {{ orderDetail.curPaymentMoney }}</span>
          <span v-if="paymentType !== 'PART'"
            >税率：{{
              internationalPay ? '免税' : floatMultiply(invoiceDetail.taxPoint ? invoiceDetail.taxPoint : 0, 100) + '%'
            }}</span
          >
          <span v-if="paymentType !== 'PART'">税额：¥ {{ orderDetail.invoiceMoney }}</span>
          <span class="line">已付金额：¥ {{ orderDetail.orderPaidMoney }}</span>
          <div class="count">
            <a-space>
              合计:
              <div v-if="internationalPay">
                <p class="count1 momey">
                  {{ currentSymbol }}
                  {{ currentLabel !== '人民币' && afterCurrency == 'CNY' ? '--' : exchangeRatePaymentMoney }}
                </p>
                <p>¥ {{ orderDetail.curPaymentMoney }}</p>
              </div>
              <div v-else>
                <p class="count1 momey">¥ {{ orderDetail.curPaymentMoney }}</p>
              </div>
            </a-space>
          </div>
        </a-space>
      </div>
      <div class="content clearfix">
        <template v-if="enterpriseId && $route.query.paymentSource == 'ORDER'">
          <div class="fr" v-if="[29, 40, 42, 47, 48, 51].includes(enterpriseId)">
            <span v-if="!productCategoryIds.includes('1607561055083282434') || productCategoryIds.length != 1"
              >支付订单则表示您同意</span
            >
            <span
              v-if="productCategoryIds.includes('1588492025906933762')"
              @click="
                showAgreement = true;
                agreementType = 'VAT';
              "
              class="blue-font"
              >{{ enterpriseId == '29' ? '《跨税云用户协议-VAT》' : '《卖家成长用户协议-VAT》' }}</span
            >
            <span
              v-if="productCategoryIds.includes('1588492024187269121')"
              @click="
                showAgreement = true;
                agreementType = 'compliance';
              "
              class="blue-font"
              >{{ enterpriseId == '29' ? '《跨税云用户协议-合规认证》' : '《卖家成长用户协议-合规认证》' }}</span
            >
            <span
              v-if="[40, 42, 47, 48].includes(enterpriseId) && productCategoryIds.includes('1588492021536468993')"
              @click="
                showAgreement = true;
                agreementType = 'brand';
              "
              class="blue-font"
              >《卖家成长用户协议》</span
            >

            <!-- <span
              v-if="productCategoryIds.includes('1607561055083282434')"
              @click="
                showAgreement = true;
                agreementType = 'compliance';
              "
              style="cursor: pointer"
              >《跨企云(海外工商)用户协议》</span
            > -->
          </div>
          <div v-else class="fr">
            支付订单则表示您同意
            <span class="blue-font" @click="showAgreement = true">{{
              userAgreementTxt[enterpriseId] || userAgreementTxt[28]
            }}</span>
          </div>
        </template>
      </div>
      <p class="pay-tip" v-if="internationalPay">
        汇率实时更新，请尽快支付，付款时会以最新汇率进行换算
      </p>
      <p class="pay-tip" v-if="$route.query.paymentSource == 'INVOICE'">
        注：根据税务规定，开具发票只能主体一致，如果是个人开票就用个人银行卡付款，公司开票就用公司对公账户付款，暂只支持网银对公支付
      </p>

      <Modal
        v-model="isShowModel"
        :width="600"
        footer-hide
        :title="selectMethodCode == 'ALIPAY_SCAN_CODE' ? '支付宝支付' : '微信支付'"
        class="pay-wrap"
      >
        <div id="qrcode" class="qrcode">
          <div class="qrcode-container">
            <div class="qrcode-img">
              <div id="qrcode-content">
                <img :src="imgUrl" />
              </div>
              <div class="qrcode-content-text">
                <img style="margin-bottom: -3px; margin-right: 3px" src="../images/sureOrder/sao.png" alt />
                <span v-if="selectMethodCode == 'WECHAT_SCAN_CODE'">使用【微信扫一扫】即可付款</span>
                <span v-if="selectMethodCode == 'ALIPAY_SCAN_CODE'">使用【支付宝扫一扫】即可付款</span>
              </div>
              <div class="price-name" v-if="paySubject">收款方：{{ paySubject }}</div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal v-model="isShowAccoutModal" :width="600" footer-hide title="请向以下账号进行打款" class="account-wrap">
        <p class="pay-money-title">
          打款金额：￥
          {{ $route.query.paymentSource == 'INVOICE' ? invoiceDetail.makeInvoiceMoney : orderDetail.curPaymentMoney }}
        </p>
        <div class="pay-account">
          <Form>
            <FormItem label="收款公司：">
              {{ userTransferAccountInfo.companyName }}
            </FormItem>
            <FormItem label="收款账号：">
              {{ userTransferAccountInfo.accountNumber }}
            </FormItem>
            <FormItem label="开户行名称：">
              {{ userTransferAccountInfo.bankName }}
            </FormItem>

            <FormItem label="联行行号：">
              {{ userTransferAccountInfo.bankNumber }}
            </FormItem>
          </Form>
        </div>
        <div class="btn-wrap">
          <Button type="primary" :loading="loadComfirm" @click="goPay(true)">
            <span v-if="!loadComfirm">已完成打款</span>
            <span v-else>确认中..</span>
          </Button>
        </div>

        <div class="warn-wrap">
          <p class="tip-font">温馨提示</p>
          <p class="tip-font">1，请按照以上指定收款账户打款，完成转帐后点击已完成打款</p>
          <p class="tip-font">2，节假日打款部分银行会有延时，请已实际到账时间为准</p>
          <p class="tip-font">3，如遇到支付问题可联系客户经理或在线客服</p>
        </div>
      </Modal>
      <!-- <user-agreement @changeState="changeStates" v-if="agreementModal" :enterpriseId="enterpriseId"></user-agreement> -->
      <div id="box"></div>
      <userAgreement49 @changeState="changeModalStates" v-if="showAgreement && enterpriseId == 49"></userAgreement49>

      <userAgreementDefault
        :enterpriseId="enterpriseId"
        @changeState="showAgreement = false"
        v-if="showAgreement && [30].includes(enterpriseId)"
      ></userAgreementDefault>

      <userAgreement28
        @changeState="showAgreement = false"
        v-if="showAgreement && (enterpriseId == 28 || !userAgreementTxt[enterpriseId])"
      ></userAgreement28>

      <userAgreement29
        @changeState="changeModalStates"
        v-if="showAgreement && enterpriseId == 29"
        :agreementType="agreementType"
      ></userAgreement29>

      <userAgreement40
        @changeState="changeModalStates"
        v-if="showAgreement && [40, 42, 47, 48].includes(enterpriseId)"
        :agreementType="agreementType"
      ></userAgreement40>

      <userAgreement51
        @changeState="changeModalStates"
        v-if="showAgreement && enterpriseId == 51"
        :agreementType="agreementType"
      ></userAgreement51>
    </div>
    <PaymentFooter :enterpriseId="enterpriseId" :userId="userId" :userMobile="orderDetail.userMobile" />
    <a-modal
      wrapClassName="payment-iframe-wrap"
      v-model="paymentVisible"
      title="确认付款"
      @ok="paymentOk"
      @cancel="paymentOk"
      width="735px"
      destroyOnClose
      centered
      :maskClosable="false"
    >
      <a-spin :spinning="spinning" tip="加载中...">
        <iframe ref="paymentIframe" class="payment-iframe" :src="`${httpsPay}/client/cashieret${payParams}`"></iframe>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import '../styles/common.less';
import unionPay from '../module/components/unionPay/unionPay';
import SureOrderContract from '../sureOrder/components/invoice/index.vue';
import { orderPayDetail, getPayMethod, toPay, paymentResult, exchangeRate } from '../api/payment/index';
import UserAgreement from '../module/components/userAgreements.vue';
import { totalShoppingCart } from '../api/shoppingCar/index';
import userAgreementDefault from '../sureOrder/components/userAgreement';
import userAgreement28 from '../sureOrder/components/userAgreement28';
import userAgreement29 from '../sureOrder/components/userAgreement29';
import userAgreement51 from '../sureOrder/components/userAgreement51';
import userAgreement40 from '../sureOrder/components/userAgreement40.vue';
import userAgreement49 from '../sureOrder/components/userAgreement49.vue';
import PaymentTable from './components/PaymentTable.vue';
import PaymentFooter from './components/PaymentFooter.vue';
import config from './config';
import { Base64 } from 'js-base64';
import qs from 'qs';

import componentsMixin from './../mixin/componentsMixin';
const USERAGREEMENTTXT = {
  28: '《卖家成长用户协议》',
  30: '《跨标云用户协议》',
  42: '《卖旺云用户协议》',
  49: '《辰知云-用户服务协议》',
  '29vat': '《跨税云用户协议-VAT》',
  '29hg': '《跨税云用户协议-合规认证》',
  '40vat': '《卖家成长用户协议-VAT》',
  '40hg': '《卖家成长用户协议-合规认证》',
};
const agreementUrlList = {
  28: 'https://file.itaxs.com/pro/20230110/8bf60c9300c944d1a146fb0711726a21.pdf',
  30: 'https://file.itaxs.com/pro/20230110/62bef15d1aa04de997a168c59cf9adcc.pdf',
  42: '',
  49: 'https://file.itaxs.com/pro/20230111/295a8adc4adc4892a1a7fbe9892ccac7.pdf',
  '29vat': 'https://file.itaxs.com/pro/20230110/11627435e07741a3824a6f970e421bdd.pdf',
  '29hg': 'https://file.itaxs.com/pro/20230110/18ab233c92bc4627b8ecc348d80ed6c2.pdf',
  '40vat': 'https://file.itaxs.com/pro/20230110/259e865f302743a29e9e7e5905d2ceba.pdf',
  '40hg': 'https://file.itaxs.com/pro/20230110/f303349841694c96ab67794e7887cd88.pdf',
};

export default {
  mixins: [componentsMixin],
  data() {
    const that = this;
    return {
      config: config,
      // logoUrl: require(`../images/payment/${enterpriseId}.png`),
      serviceList: [], // 代付款的服务列表
      orderDetail: {
        orderPaymentMoney: 0,
        orderPaidMoney: 0,
      },
      createTimeHandler: '',
      invoiceDetail: {},
      agreementModal: false,
      showAgreement: false, // 是否展示服务条款

      loadComfirm: false,
      userTransferAccountInfo: {},
      payMethodList: [],
      userAgreementTxt: USERAGREEMENTTXT,
      productCategoryIds: [],
      isShowAccoutModal: false,
      imgUrl: '',
      isShowModel: false,
      submitLoading: false,
      userId: '',
      enterpriseId: '',
      selectMethod: {
        name: '微信',
        src: require('../images/sureOrder/wx-pay.png'),
        active: true,
        current: 1,
      },
      selectMethodId: '',
      selectMethodCode: '',
      pcPayList: ['PERSONAL_EBANK', 'ENTERPRISE_EBANK', 'WECHAT_SCAN_CODE', 'ALIPAY_SCAN_CODE'],
      timeId: '',
      internationalPay: true,
      exchangeRate: '--',
      exchangeRatePaymentMoney: '--',
      currentSymbol: '$',
      currentLabel: '美元',
      moneytypeVal: 'USD',
      paymentVisible: false,
      payHttp: '',
      payParams: '',
      spinning: false,
      moneytypeMap: [
        {
          label: '人民币',
          value: 'CNY',
          symbol: '¥',
        },
        {
          label: '美元',
          value: 'USD',
          symbol: '$',
        },
        {
          label: '欧元',
          value: 'EUR',
          symbol: '€',
        },
        {
          label: '澳元',
          value: 'AUD',
          symbol: 'A$',
        },
        {
          label: '英镑',
          value: 'GBP',
          symbol: '￡',
        },
        {
          label: '日元',
          value: 'JPY',
          symbol: 'Ұ',
        },
        {
          label: '港元',
          value: 'HKD',
          symbol: 'HK$',
        },
      ],
      invoiceTypeMap: {
        PERSON: '个人',
        ENTERPRISE: '公司',
        GENERAL: '增值税普通发票',
        SPECIAL: '增值税专用发票',
      },
      payLogo: '',
      payMobile: '',
      payWebsit: '',
      afterCurrency: '',
      httpsPay: 'https://www.chenhaicloud.hk',
      paymentType: '',
    };
  },
  watch: {},
  components: {
    unionPay,
    SureOrderContract,
    UserAgreement,
    userAgreementDefault,
    userAgreement28,
    userAgreement29,
    userAgreement40,
    userAgreement49,
    userAgreement51,
    PaymentTable,
    PaymentFooter,
  },
  computed: {
    //检测浏览器是否是手机端
    isMobile() {
      return Boolean(navigator.userAgent.match(/AppleWebKit.*Mobile.*/));
    },
    fromEvidence() {
      const str = this.$route.query.fromEvidence || '';
      return str;
    },
    /** 支付方式 */
    payListComputed() {
      // let isENTERPRISE = false;
      // let isSPECIAL = false;
      // // 增值税专用

      // if (this.$route.query.paymentSource == 'INVOICE') {
      //   isENTERPRISE = this.invoiceDetail.subjectType === 'ENTERPRISE';
      //   isSPECIAL = this.invoiceDetail.invoiceType === 'SPECIAL';
      // } else {
      //   isENTERPRISE = this.orderDetail.subjectType === 'ENTERPRISE';
      //   isSPECIAL = this.orderDetail.invoiceType === 'SPECIAL';
      // }
      let result = [];
      // if (isENTERPRISE && !isSPECIAL && !this.internationalPay) {
      //   // 如果是公司和普通增值税发票/国内支付，只能用支付宝、微信、个人网银、企业银联
      //   const filterPayKeys = [
      //     'ALIPAY_SCAN_CODE',
      //     'WECHAT_SCAN_CODE',
      //     'PERSONAL_EBANK',
      //     'OFFLINE_PAYMENT',
      //     'ENTERPRISE_EBANK',
      //   ];

      //   result = this.payMethodList.filter((item) => filterPayKeys.includes(item.payWayKey));
      // } else if (isSPECIAL && !this.internationalPay) {
      //   const filterPayKeys = ['OFFLINE_PAYMENT', 'ENTERPRISE_EBANK'];

      //   result = this.payMethodList.filter((item) => filterPayKeys.includes(item.payWayKey));
      // } else {
      result = this.payMethodList;
      // }
      if (!(this.userTransferAccountInfo && this.userTransferAccountInfo.accountNumber)) {
        result = result.filter((item) => item.payWayKey != 'OFFLINE_PAYMENT');
      }
      console.log(result);
      if (this.internationalPay) {
        result = result.filter((item) => item.channelType === 'INTL_PAY');
      } else {
        result = result.filter((item) => item.channelType === 'CHN_PAY');
      }
      return result;
    },
    // 支付主体
    paySubject() {
      const { enterpriseId } = this.$data;
      let subject = '';
      switch (enterpriseId) {
        case 29:
          subject = '跨税云';
          break;
        case 30:
          subject = '跨标云';
          break;
        case 40:
          subject = '辰海云';
          break;
        case 28:
          subject = '辰海云';
          break;
        case 47:
          subject = '金华麦问信息科技有限公司';
          break;
        case 49:
          subject = '盛骁科技';
          break;
        case 51:
          subject = '跨企云';
          break;
        case 48:
          subject = '卖旺信息';
          break;
        case 42:
          subject = '卖旺云';
          break;
        default:
          break;
      }
      return subject;
    },
    // 主体配置项
    configs() {
      if (this.config) {
        return this.config;
      } else {
        return '';
      }
    },
  },
  created() {
    if (['production'].includes(process.env.NODE_ENV) || ['prod'].includes(process.env.CH_ENV)) {
      this.httpsPay = 'https://www.chenhaicloud.hk';
    } else if (['staging', 'uatenvironment2'].includes(process.env.NODE_ENV) || ['uat2'].includes(process.env.CH_ENV)) {
      this.httpsPay = 'https://uathk.chenhaicloud.com';
    } else {
      this.httpsPay = 'https://sithk.chenhaicloud.com';
    }
  },
  mounted() {
    this.getCarList();
    document.title = '支付中心';
    this.$Modal.remove();
  },
  methods: {
    getPayMethodList(enterpriseId) {
      getPayMethod({ enterpriseId, applyPort: 'ZT' })
        .then((res) => {
          if (res.code === 0) {
            this.payMethodList = res.data;
          }
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    changeStates(val) {
      this.agreementModal = val;
    },
    //用户协议
    changeModalStates(val) {
      this.showAgreement = val;
    },
    //获取用户协议链接
    getAgreementUrl() {
      if ([29, 40].includes(this.enterpriseId)) {
        if (this.productCategoryIds.includes('1588492025906933762')) {
          this.agreementUrl.push(agreementUrlList[this.enterpriseId + 'vat']);
          this.agreementName.push(USERAGREEMENTTXT[this.enterpriseId + 'vat']);
        }
        if (this.productCategoryIds.includes('1588492024187269121')) {
          this.agreementUrl.push(agreementUrlList[this.enterpriseId + 'hg']);
          this.agreementName.push(USERAGREEMENTTXT[this.enterpriseId + 'hg']);
        }
      } else {
        this.agreementUrl.push(agreementUrlList[this.enterpriseId]);
        this.agreementName.push(USERAGREEMENTTXT[this.enterpriseId]);
      }
    },
    getPayImg({ payWayKey }) {
      const imgList = [
        'ALIPAY_SCAN_CODE',
        'PERSONAL_EBANK',
        'ENTERPRISE_EBANK',
        'OFFLINE_PAYMENT',
        'AIRWALLEX_ALIPAYCN',
        'AIRWALLEX_CARD',
        'AIRWALLEX_AIRWALLEX_PAY',
      ];
      if (imgList.includes(payWayKey)) {
        if (payWayKey === 'AIRWALLEX_CARD') {
          return require('../images/sureOrder/yl-pay.png');
        } else {
          return require('../images/sureOrder/' + payWayKey + '.svg');
        }
      }
      return require('../images/sureOrder/wx-pay.svg');
    },
    payResultApi() {
      this.timeId && clearInterval(this.timeId);
      this.timeId = setInterval(async () => {
        const orderNo = this.orderDetail.orderNo || this.invoiceDetail.orderNo;
        let { code, data } = await paymentResult(orderNo);
        if (code == 0 && data == 'PAID') {
          clearInterval(this.timeId);
          this.$Message.success('付款成功');

          // 支付成功后刷新购物车数据
          // totalShoppingCart().then((res) => {
          //   this.$store.commit('saveCarNumStatue', res.data);
          // });

          // this.$util.getUserInegralMessage(this, '登录');
          this.changeStatePay(true);
        } else if (code == 0 && (data == 'CANCEL' || data == 'WAIT_CONFIRM' || data == 'REJECT')) {
          clearInterval(this.timeId);

          this.changeStatePay(false);
        }
      }, 1500);
    },
    // 生成二维码
    qrcode(url) {
      this.isShowModel = true;
      this.imgUrl = url;
    },
    //对象转拼接字符串
    serialize(obj) {
      var ary = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
      return ary.join('&');
    },
    //获取配置信息
    getConfig() {
      let enterpriseIdInfo = this.config[this.enterpriseId];
      if (enterpriseIdInfo) {
        this.payLogo = enterpriseIdInfo.logo ? enterpriseIdInfo.logo : '';
        this.payMobile = enterpriseIdInfo.mobile ? enterpriseIdInfo.mobile : '';
        this.payWebsit = enterpriseIdInfo.websit ? enterpriseIdInfo.websit : '';
      } else {
        this.payLogo = require(`../images/payment/logo28.png`);
        this.payMobile = '400-837-8660';
        this.payWebsit = 'www.sellergrowth.com';
      }
    },
    getCarList() {
      orderPayDetail({
        encryptOrderNo: this.$route.query.encryptOrderNo,
        paymentSource: this.$route.query.paymentSource,
      })
        .then((res) => {
          if (res.code === 0) {
            this.enterpriseId = Number(res.data.enterpriseId);
            this.getConfig();
            this.userId = res.data.userId;
            console.log(this.enterpriseId, typeof this.enterpriseId);
            this.internationalPay = res.data.payMethod === 'INTL_PAY' ? true : false;
            this.paymentType = res.data.paymentType;
            if (this.$route.query.paymentSource == 'INVOICE') {
              this.invoiceDetail = res.data.invoiceDetail;
            } else {
              this.orderDetail = res.data.orderDetail;
              this.createTimeHandler = res.data.orderDetail.createTime.slice(0, 10);
              this.serviceList = res.data.orderDetail.orderProductDetailList;
              this.invoiceDetail = res.data.invoiceDetail;
              this.productCategoryIds = this.serviceList.map((item) => item.productCategoryId);
            }
            if (this.$route.query.paymentSource == 'INVOICE' && this.invoiceDetail.invoiceType === 'SPECIAL') {
              this.pcPayList = ['PERSONAL_EBANK'];
            }
            if (this.internationalPay) {
              this.moneytypeChange('USD');
            }
            this.getPayMethodList(this.enterpriseId);
            this.userTransferAccountInfo = res.data.userTransferAccountInfo;
          }
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    async goPay(flag) {
      if (this.isMobile) {
        return this.$Modal.warning({
          title: '提示',
          content: '跨境支付不支持手机访问，请使用电脑浏览器访问并支付，谢谢支持！',
          okText: '知道了',
        });
      }
      if (!this.selectMethodId) {
        this.$Message.error('请选择支付方式');
        return;
      }
      if (this.selectMethodCode == 'OFFLINE_PAYMENT' && !flag) {
        this.isShowAccoutModal = true;
        return;
      }

      this.loadComfirm = true;
      if (this.$route.query.paymentSource === 'ORDER') {
        var params = {
          amount: this.orderDetail.curPaymentMoney,
          applyPort: 'ZT',
          enterpriseId: this.enterpriseId,
          sessionId: 'agsaga',
          businessNo: this.orderDetail.orderNo,
          // mobile: "13476897516",
          payWayId: this.selectMethodId,
          payWayKey: this.selectMethodCode,
          actNo: this.selectMethodCode == 'OFFLINE_PAYMENT' ? this.userTransferAccountInfo.accountNumber : '',
          productName:
            this.serviceList && this.serviceList.length
              ? this.serviceList.map((item) => item.productName).join(',')
              : '',
        };
      } else {
        var params = {
          amount: this.invoiceDetail.makeInvoiceMoney,
          payWayKey: this.selectMethodCode,
          sessionId: 'agsaga',
          applyPort: 'ZT',
          businessNo: this.invoiceDetail.orderNo,
          enterpriseId: this.enterpriseId,
          payWayId: this.selectMethodId,
          actNo: this.selectMethodCode == 'OFFLINE_PAYMENT' ? this.userTransferAccountInfo.accountNumber : '',
          productName: '发票',
        };
      }
      let resPeonse = undefined;
      //国际支付
      if (this.internationalPay) {
        let payParamsObj = {
          currency: this.currentSymbol,
          currencyCode: this.currencyCode,
          enterpriseId: this.enterpriseId,
          payWayId: this.selectMethodId,
          encryptOrderNo: this.$route.query.encryptOrderNo,
          backUrl: '123',
          layoutHeader: false,
          layoutFooter: false,
        };
        this.payParams = '?' + this.serialize(payParamsObj);
        this.paymentVisible = true;
        this.spinning = true;
        let _this = this;
        setTimeout(() => {
          _this.$refs.paymentIframe.onload = function() {
            _this.spinning = false;
          };
        }, 0);
        setTimeout(() => {
          this.payResultApi();
        }, 5000);
      } else {
        try {
          resPeonse = await toPay(params);
        } catch (error) {
          resPeonse = error;
        }
        this.loadComfirm = false;
        if (this.selectMethodCode == 'WECHAT_SCAN_CODE' || this.selectMethodCode == 'ALIPAY_SCAN_CODE') {
          this.qrcode(resPeonse);
          setTimeout(() => {
            this.payResultApi();
          }, 5000);
          return;
        }
        if (this.selectMethodCode == 'OFFLINE_PAYMENT') {
          if (resPeonse == 'SUCCESS') {
            if (this.fromEvidence === 'iipto') {
              this.$router.push({
                path: '/paymentSucceeded',
                query: {
                  orderNo: this.orderDetail.orderNo,
                  from: 'evidence',
                },
              });
            } else {
              this.$router.push('/paymentSuccess');
            }
          }
          return;
        }

        if (this.selectMethodCode == 'ENTERPRISE_EBANK' || this.selectMethodCode == 'PERSONAL_EBANK') {
          let document1 = document.getElementById('box');
          document1.innerHTML = resPeonse; // form 字符串
          document.querySelector("form[name ='pay_form']").submit();
        } else {
          // resPeonse && callBack({ orderNo, payWayKey, data: resPeonse });
          window.open(resPeonse, `_self`);
        }
      }
    },
    changeStatePay(flag) {
      this.dialog = false;
      setTimeout(() => {
        if (flag) {
          if (this.fromEvidence === 'iipto') {
            this.$router.push({
              path: '/paymentSucceeded',
              query: {
                orderNo: this.orderDetail.orderNo,
                from: 'evidence',
              },
            });
          } else {
            this.$router.push('/paymentSuccess');
          }
        } else {
          this.$router.push('/paymentReject');
        }

        this.$destroy();
      }, 1500);

      setTimeout(() => {
        this.timeId && clearInterval(this.timeId);
      }, 5000);
    },

    changeMethod(index) {
      this.payListComputed.forEach((element, idx) => {
        if (index == idx) {
          element.active = true;
          this.selectMethodId = element.payWayId;
          this.selectMethodCode = element.payWayKey;
          if (['AIRWALLEX_ALIPAYCN', 'AIRWALLEX_WECHATPAY'].includes(element.payWayKey)) {
            this.moneytypeChange('CNY');
          } else {
            this.moneytypeChange('USD');
          }
        } else {
          element.active = false;
        }
      });
    },
    //切换币种
    moneytypeChange(value) {
      this.moneytypeVal = value;
      // console.log(value, this.moneytypeVal);
      if (value === 'CNY') {
        this.currencyCode = value;
        this.exchangeRatePaymentMoney = this.orderDetail.curPaymentMoney;
        this.exchangeRate = 1;
        this.currentSymbol = '¥';
        this.currentLabel = '人民币';
      } else {
        exchangeRate({
          afterCurrency: value,
          amount: this.orderDetail.curPaymentMoney,
          beforeCurrency: 'CNY',
          enterpriseId: this.enterpriseId,
        }).then((res) => {
          this.currencyCode = value;
          this.exchangeRatePaymentMoney = res.data.afterAmount;
          this.exchangeRate = res.data.exchangeRate;
          this.afterCurrency = res.data.afterCurrency;
          this.moneytypeMap.forEach((item) => {
            if (value === item.value) {
              this.currentSymbol = item.symbol;
              this.currentLabel = item.label;
            }
          });
        });
      }
    },
    //关闭国际支付弹窗
    paymentOk() {
      this.paymentVisible = false;
      this.loadComfirm = false;
      setTimeout(() => {
        this.timeId && clearInterval(this.timeId);
      }, 4000);
    },
    // 意向注册面包屑跳转 1：商标注册 2：填写使用证据
    linkJump(type = 1) {
      if (+type === 1) {
        this.$router.push('/myBrand');
      } else {
        const query = this.$route.query;
        const params = {
          id: query.id,
          progressBar: query.progressBar,
          nodeCode: query.nodeCode,
          code: query.code,
          countryNameZh: decodeURI(query.countryNameZh),
        };
        this.$router.push({
          path: '/fillEvidence',
          query: params,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url(./index.less);
.refund-type {
  font-size: 12px !important;
  color: #666;
  border-radius: 8px;
  background-color: #d0effb;
  padding: 1px 7px;
  margin-left: 5px;
}
.purchaseInformation {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  float: right;
  margin-right: 60px;
  margin-top: 20px;

  span {
    color: #16ade9;
    cursor: pointer;
  }
}
/deep/ .ivu-table .ivu-table-header table tr th {
  background: rgba(22, 173, 233, 0.2) !important;
}
.payment-iframe {
  width: 100%;
  min-height: 370px;
  border: none;
  margin: 0;
  vertical-align: top;
}
.ev {
  &-links {
    margin-bottom: 12px;
    font-size: 14px;
    color: #000;
    line-height: 22px;
    span {
      display: inline-block;
      margin: 0 6px 0 5px;
      cursor: pointer;
      &:last-child {
        color: #00a3ff;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &-tips {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    color: #303132;
    font-size: 14px;
    i {
      font-size: 18px;
      margin-right: 8px;
      margin-bottom: -2px;
      color: #faad14;
    }
  }
}
</style>
<style>
.payment-iframe-wrap .ant-modal-body {
  /* padding: 0; */
}
</style>
