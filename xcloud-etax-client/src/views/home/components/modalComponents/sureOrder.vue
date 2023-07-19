<template>
  <div class="sure-order-box">
    <Modal
      v-model="modalShow"
      :title="titleType"
      :mask-closable="false"
      @on-visible-change="changeState"
      width="800"
      class="clearfix sure-modal"
      footer-hide
    >
      <div class="clearfix" v-if="!isShowQrCode">
        <div class="formContent">
          <div class="stepTwo">
            <p class="littleStip">
              <img src="@/assets/images/common/complate.png" alt="" />
              添加完成，购买后即可开始报税
            </p>
            <div class="priceContent clearfix">
              <div
                class="priceBox fl"
                v-for="(item, index) in productBoxList"
                :key="index"
                v-bind:class="item.ischeck === true ? 'blue' : ''"
              >
                <div class="price">
                  <span>￥</span>
                  {{ item.price }}
                  <!-- <span>/年</span> -->
                </div>
                <div class="productName">{{ item.productName }}</div>
              </div>

              <div class="priceBox fl">
                <div class="price">
                  <span>￥</span>
                  {{ orderInfo.invoiceMoney }}
                </div>
                <div class="productName">
                  税额
                  <!-- {{
                    orderInfo.invoiceVO.invoiceType === 'GENERAL'
                      ? '增值税普通发票'
                      : orderInfo.invoiceVO.invoiceType === 'SPECIAL'
                      ? '增值税专用发票'
                      : '不开票'
                  }}
                  <span v-if="orderInfo.invoiceVO.subjectType"
                    >({{
                      orderInfo.invoiceVO.subjectType === 'PERSON'
                        ? '个人'
                        : orderInfo.invoiceVO.subjectType === 'ENTERPRISE'
                        ? '公司'
                        : ''
                    }})
                  </span> -->
                </div>
              </div>
            </div>

            <!-- <div class="payType clearfix">
              <span class="fl">支付方式：</span>
              <div
                class="fl typeBox"
                v-for="(item, index) in payMethodArr"
                :key="index"
                :class="{ 'pay-item': true, active: item.active }"
                @click="changeMethod(index)"
              >
                <img :src="item.src" alt />
                {{ item.name }}
              </div>
            </div> -->
            <PayModeCom
              ref="payModeCom"
              class="payType clearfix"
              size="small"
              :invoiceType="getInvoiceType(orderInfo.invoiceVO)"
              :exchangeRate="exchangeRate"
              :afterCurrency="afterCurrency"
              :payMethodParams="orderInfo.payMethod"
              @calculate="handleCalculate"
              @getPayMethod="(val) => (payMethod = val)"
              @getPayMode="(val) => (payMode = val)"
            />

            <div class="payBox clearfix">
              <!-- <span class="yellow payPrice">￥{{ totalPrice }}</span> -->
              <div class="payBox clearfix">
                <span>应付：</span>
                <span v-if="payMethod === 'INTL_PAY'" class="foreign"
                  ><strong class="yellow"
                    >{{ currency.symbol }}
                    {{ currency.value !== 'CNY' && afterCurrency === 'CNY' ? '--' : foreignCurrencyAmount }}</strong
                  ><em>¥ {{this.$util.accSub(totalPrice, orderInfo.invoiceMoney),  }} </em></span
                >
                <span v-else
                  ><span class="yellow yang">¥</span> <span class="yellow payPrice">{{ totalPrice }}</span></span
                >
              </div>
              <div class="buttoms">
                <Button class="footerBt2" type="primary" @click="goPay('yes')">去付款</Button>
              </div>
            </div>

            <div class="coupon">
              <CheckboxGroup v-model="interest">
                <Checkbox class="checkBoxs" label="1">
                  同意并接受
                  <template v-if="envpla === 'ksy'">
                    <span
                      @click="
                        agreementModal = true;
                        agreementType = 'VAT';
                      "
                      v-if="isVAT()"
                      >《跨税云用户协议-VAT》</span
                    >
                    <span
                      @click="
                        agreementModal = true;
                        agreementType = 'compliance';
                      "
                      v-if="isCompliance()"
                      >《跨税云用户协议-合规认证》</span
                    >
                  </template>
                  <template v-if="envpla === 'kqy'">
                    <span @click="agreementModalKqy = true">《跨企云用户协议》</span>
                  </template>
                </Checkbox>
              </CheckboxGroup>
              <p v-if="payMethod === 'INTL_PAY'" class="sure-order-tips">
                汇率实时更新，请尽快支付，付款时会以最新汇率进行换算
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <div id="qrcode" class="qrcode" v-if="isShowQrCode">
      <div class="qrcode-container">
        <div class="qrcode-title">
          商品详情： {{ productName }}
          <div class="close" @click="toClose">返回</div>
        </div>
        <div class="price">
          待支付:
          <span>{{ totalPrice }}</span>
          元
        </div>
        <div class="price-name">收款方：跨税云（深圳）科技有限公司</div>
        <div class="qrcode-img">
          <div id="qrcode-content"></div>
          <div class="qrcode-content-text">
            <img style="margin-bottom: -3px; margin-right: 3px" src="@/assets/images/sureOrder/sao.png" alt />
            使用【微信扫一扫】即可付款
          </div>
        </div>
      </div>
    </div>
    <userAgreement @changeState="changeStates" v-if="agreementModal" :agreementType="agreementType"></userAgreement>
    <userAgreementKqy @changeState2="changeStates2" v-if="agreementModalKqy" />
    <unionPay
      :orderInfo="orderInfo"
      :orderId="productId"
      :orderNo="orderNo"
      @changeState="changeStateUp"
      v-if="unionType"
    ></unionPay>

    <!-- 国际支付线下打款弹窗 -->
    <IntlOfflinePay
      v-if="showIntlOffline"
      :visible.sync="showIntlOffline"
      @cancel="showIntlOffline = false"
      @ok="handleOfflineOk"
      :payInfo="payInfo"
    />

    <!-- 国际支付第三方弹窗 -->
    <IntlPay
      v-if="showIntlVisible"
      :visible.sync="showIntlVisible"
      :payParams="payParams"
      @cancel="handleCancelIntlPay"
      @ok="handleConfirmIntlPay"
    />
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import { getChannelId, pay, pay1, payOrderReturn, rateCalculateAmount } from '@/api/sureOrder/sureOrder';
import userAgreement from '@/views/common/userAgreement';
import userAgreementKqy from '@/views/common/userAgreementKqy';
import unionPay from './unionPay';
import PayModeCom from '@/components/payMode/payMode.vue';
import { userPay } from '@/utils/orderPlayConfig';
import IntlOfflinePay from '@comp/module/components/intlOfflinePay';
import IntlPay from '@comp/module/components/intlPay';
import { getPayresultStatus } from '@comp/api/shoppingCar';
let Base64 = require('js-base64').Base64;
export default {
  components: {
    userAgreement,
    unionPay,
    PayModeCom,
    userAgreementKqy,
    IntlOfflinePay,
    IntlPay,
  },
  props: {
    orderInfo: {},
  },
  data() {
    return {
      agreementModal: false,
      agreementModalKqy: false,
      agreementType: '',
      unionType: false,
      titleType: '确认订单',
      modalShow: true,
      isShowQrCode: false,
      addCompanyFrom: {
        companyName: '',
      },
      ruleAddFrom: [],
      checkindex: '',
      productBoxList: [],
      countryList: [],
      checkedCountry: [],
      totalPrice: 0,
      interest: ['1'],
      productId: '',
      orderNo: '',
      productName: '',
      payMethodArr: [
        // 支付方式
        {
          name: '微信支付',
          src: require('@/assets/images/sureOrder/wx-pay.svg'),
          active: true,
          current: 1,
        },
        {
          name: '支付宝',
          src: require('@/assets/images/sureOrder/zfb-pay.svg'),
          active: false,
          current: 2,
        },
        {
          name: '银联',
          src: require('@/assets/images/sureOrder/yl-pay.svg'),
          active: false,
          current: 3,
        },
      ],

      paysParams: [],
      mchIdNow: '1515011212',
      showUser: false,
      unionType: false,
      titleType: '确认订单',
      modalShow: true,
      isShowQrCode: false,
      productBoxList: [],
      totalPrice: 0,
      interest: ['1'],
      paysParams: [],
      fromType: undefined,
      backPath: this.orderInfo.productType !== 2 ? '/myOrder' : '/myPatent',
      payMentInfo: {},
      payMode: null,
      payMethod: 'CHN_PAY',
      showIntlOffline: false,
      foreignCurrencyAmount: '',
      currency: {},
      showIntlVisible: false,
      payParams: '',
      payInfo: {},
      exchangeRate: '',
      afterCurrency: '',
    };
  },
  computed: {
    selectMethod() {
      return this.payMethodArr.filter((item) => item.active)[0];
    },
  },
  watch: {
    showIntlVisible: {
      handler(val) {
        if (!val) {
          clearInterval(this.intlPayTimer);
        }
      },
    },
  },
  methods: {
    getPayId() {
      let self = this;
      getChannelId()
        .then(
          (res) => {
            // console.log(res);/
            if (res.code == 0) {
              self.paysParams = res.data.records;
            } else {
              this.$Message.warning(res.message);
            }
          },
          (err) => {
            this.$Message.warning(err.message);
          }
        )
        .catch((e) => {});
    },
    getInvoiceType(invoice = {}) {
      if (invoice.invoiceType == 'SPECIAL') {
        return '4';
      } else if (invoice.invoiceType == 'GENERAL') {
        if (invoice.subjectType == 'PERSON') {
          return '2';
        } else {
          return '3';
        }
      } else {
        return '1';
      }
    },
    changeState(val) {
      let obj = {
        state: val,
      };
      this.$emit('changeState', obj);
    },
    changeStateUp(val) {
      this.unionType = val.state;
      if (val.type) {
        this.changeState(false);
      }
    },
    changeCountry(item) {
      this.checkedCountry = item;
    },
    tatol(item) {
      if (item.status == 1) {
        this.$Message.info('持续开发中，敬请期待！');
      }
    },
    // 改变支付方式的回调
    changeMethod(index) {
      let self = this;
      self.payMethodArr.forEach((element, idx) => {
        if (index == idx) {
          element.active = true;
        } else {
          element.active = false;
        }
      });
    },
    // goPay() {
    //   if (this.selectMethod.current == 3) {
    //     if (this.interest.length < 1) {
    //       this.$Message.info("请勾选服务条款");
    //       return;
    //     }
    //     this.unionType = true;
    //   } else {
    //     if (this.totalPrice == 0) {
    //       this.changeState(false);
    //     } else {
    //       this.payHandler();
    //     }
    //   }
    // },

    async goPay() {
      if (this.interest.length < 1) {
        this.$Message.warning('请勾选用户协议!');
        return;
      }
      let { orderPaymentMoney, clientOrderProductVOList, orderNo } = this.orderInfo;
      let payInfo = { amount: orderPaymentMoney, ...this.payMode, orderNo, goPaymentSucceeded: true };
      if (this.payMethod === 'INTL_PAY') {
        this.intlPay(payInfo);
      } else {
        userPay('PC', clientOrderProductVOList, payInfo, (payResponse) => {
          this.modalShow = false;
          this.$payMentDialogDom(payResponse, this);
        });
      }
    },

    // 立即支付按钮的回调
    payHandler() {
      let self = this;
      if (this.interest.length < 1) {
        this.$Message.info('请勾选服务条款');
        return;
      }
      //选定支付商户号
      self.paysParams.map((i, k) => {
        if (self.selectMethod.current == 2 && i.channelCode == 'ALIPAY_PC') {
          self.mchIdNow = i.mchId;
        }
        if (self.selectMethod.current == 1 && i.channelCode == 'WX_NATIVE') {
          self.mchIdNow = i.mchId;
        }
      });
      let directUrl = this.orderInfo.marketingActivityId ? '/orderList?from=pay' : '/work';
      if (self.selectMethod.current != 3) {
        let params = {
          // amount:1,
          amount: Math.round(self.totalPrice * 100 * 100) / 100,
          body: self.productName,
          channelCode: self.selectMethod.current == 2 ? 'ALIPAY_PC' : 'WX_NATIVE',
          mchId: self.mchIdNow,
          mchOrderNo: self.orderNo,
          subject: self.productName,
          productId: self.productId,
          notifyUrl: self.backUrl + '/order/client/pay/order/notify',
          returnUrl:
            window.location.href
              .split('/')
              .slice(0, 3)
              .join('/') + `${directUrl}`,
        };
        if (this.orderInfo.marketingActivityId) {
          params.param2 = this.orderInfo.marketingActivityId;
          params.param1 = JSON.parse(localStorage.getItem('objInfo')).enterpriseId;
        }
        pay(params).then((res) => {
          if (res.code == 0) {
            // 微信支付获取二维码,支付宝直接做跳转
            self.selectMethod.current == 2 ? self.aliPay(res) : self.getQrcode(self.orderNo, res, self.mchIdNow);
          }
        });
      } else {
        // debugger
        let params = {
          // amount:1,
          amount: Math.round(self.totalPrice * 100 * 100) / 100,
          body: self.productName,
          channelCode: 'YOP_PC',
          // mchId: 10033308763,
          mchId: self.mchIdNow,
          mchOrderNo: self.orderNo,
          subject: self.productName,
          productId: self.productId,
          notifyUrl: self.backUrl + '/etax/receive/orderPayResultNotify',
          returnUrl:
            window.location.href
              .split('/')
              .slice(0, 3)
              .join('/') + `${directUrl}`,
        };
        pay1(params).then((res) => {
          if (res.code == 0) {
            self.bankPay(res.data);
          } else {
            self.$Message.warning(res.message);
          }
        });
      }
    },
    // 生成二维码
    qrcode(url) {
      let qrcode = new QRCode('qrcode-content', {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: url, // 设置二维码内容或跳转地址
      });
    },
    // 支付宝支付
    aliPay(res) {
      // console.log(res.data.payUrl)
      let payForm = Base64.decode(res.data.payUrl);
      //   console.log(payForm)
      let div = document.createElement('div'); // 创建div
      div.innerHTML = payForm; // 将返回的form 放入div
      document.body.appendChild(div);
      document.getElementsByName('punchout_form')[0].submit();
    },
    // 银联宝支付
    bankPay(res) {
      let payForm = Base64.decode(res.payUrl);
      window.location.href = payForm;
    },
    // 微信二维码
    async getQrcode(orderNo, res, mcid) {
      // console.log(orderNo)
      this.time = 60;
      clearInterval(this.timer);
      this.isShowQrCode = true;
      let code_url = res.data.codeUrl,
        payOrderId = res.data.payOrderId;
      await this.$nextTick(() => {
        // console.log(document.getElementById("qrcode-content"))
        document.getElementById('qrcode-content').innerHTML = '';
        this.qrcode(code_url);
      });
      document.getElementsByClassName('sure-modal')[0].style.display = 'none';
      document.getElementsByClassName('ivu-modal-wrap')[1].style.display = 'none';
      document.getElementsByClassName('ivu-modal-mask')[1].style.display = 'none';

      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          this.getQrcode(orderNo, res);
        }
        // 判断是否支付
        let params = {
          mchOrderNo: orderNo,
          payOrderId: payOrderId,
          mchId: mcid,
          sign: '',
        };
        payOrderReturn(params)
          .then((result) => {
            if (result.data.status > 1) {
              this.isShowQrCode = false;
              clearInterval(this.timer);
              setTimeout(() => {
                this.$Message.success('支付成功');
                this.$util.getUserInegralMessage(this, '消费');
                let obj = {
                  state: false,
                };
                this.$emit('changeState', obj);
                // this.$router.push({
                //   path: "/paySuccess",
                // });
                if (this.orderInfo.marketingActivityId) {
                  this.$router.push({ path: '/orderList?from=pay' });
                } else {
                  this.$router.push({ path: '/' });
                }
              }, 1500);
            }
          })
          .catch((err) => {
            clearInterval(this.timer);
          });
      }, 3000);
    },
    toClose() {
      this.isShowQrCode = false;
      clearInterval(this.timer);
      this.$router.push({
        path: '/orderList',
      });
      let obj = {
        state: false,
      };
      this.$emit('changeState', obj);
    },
    changeStates(val) {
      this.agreementModal = val;
    },
    changeStates2(val) {
      this.agreementModalKqy = val;
    },
    getPayMethods(supportPayType) {
      let payMethodArr = [
        // 支付方式
        {
          name: '微信支付',
          src: require('@/assets/images/sureOrder/wx-pay.svg'),
          active: true,
          current: 1,
        },
        {
          name: '支付宝',
          src: require('@/assets/images/sureOrder/zfb-pay.svg'),
          active: false,
          current: 2,
        },
        {
          name: '银联',
          src: require('@/assets/images/sureOrder/yl-pay.svg'),
          active: false,
          current: 3,
        },
      ];
      let list = [];
      supportPayType.map((item) => {
        payMethodArr.map((itt) => {
          if (Number(item) == itt.current) {
            list.push(itt);
          }
        });
      });
      this.payMethodArr = list;
    },
    // 判断是否包含VAT服务 新增1
    isVAT() {
      let flag = false;
      this.orderInfo.clientOrderProductVOList.forEach((o) => {
        if ([1, 2, 5, 6, 7, 13, 17, 23, 24].includes(o.functionCode)) {
          flag = true;
        }
      });
      return flag;
    },
    // 判断是否为合规服务(含EPR/授权代表)
    isCompliance() {
      let flag = false;
      this.orderInfo.clientOrderProductVOList.forEach((o) => {
        if ([16, 31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 32, 106, 107].includes(o.functionCode)) {
          flag = true;
        }
      });
      return flag;
    },
    // 国际支付
    intlPay(payInfo) {
      // 是否是线下打款
      if (this.payMode.payWayKey == 'OFFLINE_PAYMENT') {
        this.showIntlOffline = true;
        this.payInfo = {
          ...payInfo,
          ...this.orderInfo,
          paymentChannel: this.orderInfo.clientOrderPaymentVOList[0].paymentChannel,
        };
        return;
      }
      // 唤起收银台
      let payParamsObj = {
        currency: this.currency.symbol,
        currencyCode: this.currency.value,
        enterpriseId: 29,
        payWayId: this.payMode.payWayId,
        encryptOrderNo: this.orderInfo.encryptOrderNo,
        backUrl: 'backUrl',
        layoutHeader: false,
        layoutFooter: false,
      };
      console.log(payParamsObj, 'payParamsObj');
      this.payParams = this.serialize(payParamsObj);
      this.showIntlVisible = true;
      this.queryIntlPayStatus(payInfo);
    },
    // 查询国际支付状态
    queryIntlPayStatus(payInfo) {
      this.intlPayTimer = setInterval(() => {
        getPayresultStatus(payInfo.orderNo).then((res) => {
          if (res.code === 0) {
            if (res.data === 'PAID') {
              clearInterval(this.intlPayTimer);
              location.reload();
            }
          }
        });
      }, 2000);
    },
    // 计算金额
    handleCalculate(currency) {
      this.currency = currency;
      rateCalculateAmount({
        afterCurrency: currency.value,
        amount: this.$util.accSub(this.orderInfo.orderPaymentMoney, this.orderInfo.invoiceMoney),
        beforeCurrency: 'CNY',
        enterpriseId: 29,
      }).then((res) => {
        if (res.code === 0) {
          this.foreignCurrencyAmount = res.data.afterAmount;
          this.exchangeRate = res.data.exchangeRate;
          this.afterCurrency = res.data.afterCurrency;
        }
      });
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
    // 取消国际支付
    handleCancelIntlPay() {
      this.showIntlVisible = false;
      clearInterval(this.intlPayTimer);
    },
    // 确认国际支付
    handleConfirmIntlPay() {
      this.showIntlVisible = false;
      clearInterval(this.intlPayTimer);
      // location.reload();
      this.changeState(false);
    },
    // 线下打款提交成功
    handleOfflineOk() {
      location.reload();
      this.changeState(false);
    },
  },
  mounted() {
    // this.getPayId();
    let self = this;
    if (this.orderInfo != undefined) {
      console.log(this.orderInfo);
      this.productName = '跨税云VAT 税务服务-' + this.orderInfo.orderNo;
      this.totalPrice = this.orderInfo.orderPaymentMoney;
      this.orderNo = this.orderInfo.orderNo;
      this.productId = this.orderInfo.marketingActivityId
        ? this.orderInfo.clientOrderProductVOList[0].productId
        : this.orderInfo.id;
      this.orderInfo.clientOrderProductVOList.map((v, i) => {
        let obj = {
          productName: v.productName,
          price: v.orderProductMoney,
          ischeck: true,
          id: this.orderInfo.id,
        };
        this.productBoxList.push(obj);
      });
    }
    if (this.orderInfo.invoiceType === 1 || this.orderInfo.invoiceType === 2) {
      this.payMethodArr = [
        {
          name: '银联',
          src: require('@/assets/images/sureOrder/yl-pay.svg'),
          active: false,
          current: 3,
        },
      ];
      this.changeMethod(0);
    } else {
      this.payMethodArr = [
        {
          name: '微信支付',
          src: require('@/assets/images/sureOrder/wx-pay.svg'),
          active: true,
          current: 1,
        },
        {
          name: '支付宝',
          src: require('@/assets/images/sureOrder/zfb-pay.svg'),
          active: false,
          current: 2,
        },

        {
          name: '银联',
          src: require('@/assets/images/sureOrder/yl-pay.svg'),
          active: false,
          current: 3,
        },
      ];
      this.changeMethod(0);
    }
    if (this.orderInfo.supportPayType && this.orderInfo.supportPayType.length) {
      this.getPayMethods(this.orderInfo.supportPayType);
    }
    if (this.orderInfo.invoiceMoney > 0) {
      this.payMethodArr = [
        {
          name: '银联',
          src: require('@/assets/images/sureOrder/yl-pay.svg'),
          active: true,
          current: 3,
        },
      ];
    }
  },
};
</script>
<style lang="less" scoped>
.footerBt1 {
  width: 90px;
  margin: 0 0 58px 80px;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner > .ivu-steps-icon {
  color: #2d8cf0 !important;
}

.stepTwo {
  .littleStip {
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    line-height: 17px;
  }
  .priceContent {
    margin-top: 20px;
    color: #939399;
    .priceBox {
      // width: 176px;
      height: 83px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #16ade9;
      text-align: center;
      padding: 15px 12px;
      cursor: pointer;
      margin: 0 10px 10px 0;
      .price {
        font-size: 22px;
        font-family: PingFangSC;
        color: #16ade9;
        line-height: 30px;
        span {
          font-size: 12px;
        }
      }
      .productName {
        font-size: 14px;
        font-family: PingFangSC;
        color: #16ade9;
        line-height: 20px;
      }
    }
    .blue {
      border-color: #16ade9;
      color: #16ade9;
    }
  }
  .coupon {
    margin-top: 14px;
    float: left;
    width: 100%;
    text-align: right;
    .checkBoxs {
      display: block;
      font-size: 14px;
    }
    :nth-child(1) {
      color: #666;
    }
    :nth-child(2),
    :nth-child(3) {
      color: #3a7fff;
      margin-top: 10px;
      padding-bottom: 16px;
      span {
        color: #16ade9;
        cursor: pointer;
      }
    }
  }
  .payType {
    font-size: 12px;
    line-height: 32px;
    margin: 20px 0px 24px;
    // display: flex;
    align-items: center;
    .typeBox {
      width: 119px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid rgba(153, 153, 153, 0.14);
      margin-left: 10px;
      display: flex;
      justify-content: center;
      cursor: pointer;
      line-height: 40px;
      background: rgba(153, 153, 153, 0.14);
      font-size: 14px;
      font-family: PingFangSC;
      color: #333333;
      & img {
        margin-bottom: -3px;
        padding-right: 3px;
      }
    }
    & .active {
      border: 1px solid #16ade9;
      background: url('../../../../assets/images/sureOrder/check.svg') no-repeat;
      background-position: right bottom;
    }
  }
  .payBox {
    font-size: 12px;
    color: #626266;
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 14px;
    float: right;
    .yellow {
      color: #fb7616;
      font-size: 24px;
      font-weight: 400;
    }
    em {
      font-style: normal;
    }
    .payPrice {
      font-size: 24px;
    }
    .yang {
      font-size: 14px;
    }
    .footerBt2 {
      margin: 7px 15px 0;
      background-color: #3a7fff;
      border-color: #3a7fff;
      border-radius: 0;
    }
    .foreign {
      display: flex;
      flex-direction: column;
    }
  }
}
& #qrcode {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: #f5f6f7;
  z-index: 999;
}
.qrcode-container {
  position: relative;
  background: #fff;
  width: 49%;
  height: 72%;
  max-height: 550px;
  margin: 0 auto;
  margin-top: 59px;
  min-height: 548px;
  .qrcode-title {
    color: #313233;
    font-size: 16px;
    padding: 20px;
    border-bottom: 5px solid #d8c7a1;
    & .close {
      float: right;
      width: 60px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #626466;
      font-size: 14px;
      background: #fff;
      cursor: pointer;
    }
  }
  & .price {
    margin-top: 99px;
    text-align: center;
    & span {
      color: #ff6652;
      font-size: 26px;
    }
  }
  & .price-name {
    color: #626466;
    font-size: 14px;
    text-align: center;
  }
  & .qrcode-img {
    text-align: center;
    width: 210px;
    padding: 5px;
    border: 1px solid rgba(221, 221, 221, 1);
    margin: 0 auto;
    margin-top: 25px;
  }
  & .qrcode-content-text {
    text-align: center;
    padding: 10px 0px 5px 0px;
  }
}
& .copy {
  color: #6e6e6e;
  font-size: 12px;
  text-align: center;
  margin-top: 80px;
}
&/deep/.ivu-checkbox-group-item {
  min-width: 80px;
}
&/deep/ .ivu-form-item {
  max-width: 358px !important;
}
&/deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
  border-color: #fc9153;
  background-color: #fc9153;
}
&/deep/.ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
  color: #fc9153;
}
&/deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner > .ivu-steps-icon {
  color: #fc9153 !important;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
  border-color: #fc9153;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail > i:after {
  background: #fc9153;
}
&/deep/.ivu-steps .ivu-steps-title {
  font-size: 12px;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-title {
  color: #fc9153;
}

/deep/ .ivu-modal-body {
  padding: 24px !important;
}
.formContent {
  max-height: 600px;
  overflow: auto;
}
.sure-order-tips {
  color: #919498 !important;
  font-size: 14px !important;
}

.coupon {
  /deep/ .ivu-checkbox {
    position: relative;
    top: -1px;
  }
  /deep/.ivu-checkbox-checked .ivu-checkbox-inner {
    background-color: #3a7fff !important;
    border-color: #3a7fff !important;
  }
}
</style>
