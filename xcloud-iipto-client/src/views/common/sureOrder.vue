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
      <div class="clearfix">
        <div class=" formContent">
          <div class="stepTwo">
            <p class="littleStip" v-if="orderInfo.productType !== 2">
              <img src="@/assets/images/common/complate.png" alt="" />付款后，请去【我的商标】填写商标信息
            </p>
            <div class="priceContent clearfix">
              <div class="priceBox fl blue" v-for="(item, index) in orderInfo.clientOrderProductVOList" :key="index">
                <div class="price">
                  <span>￥</span> {{ item.productMoney }}
                  <!-- <span>/{{ item.unit == 1 ? '年' : item.unit == 2 ? '个' : item.unit == 3 ? '次' : item.unit == 4 ? '类' : '类' }}</span> -->
                </div>
                <div class="productName">{{ item.productName }}</div>
              </div>

              <div class="priceBox fl blue" v-if="payMethod !== 'INTL_PAY'">
                <div class="price"><span>￥</span> {{ orderInfo.invoiceMoney }}</div>
                <div class="productName">税额</div>
              </div>
            </div>

            <!-- pay model -->
            <PayModeCom
              class="payType clearfix"
              size="small"
              :orderInfo="orderInfo"
              :invoiceType="invoiceType"
              :foreignInfo="foreignInfo"
              @calculate="handleCalculate"
              @getPayMethod="(val) => (payMethod = val)"
              @getPayMode="(val) => (payMode = val)"
            />
            <div class="payBox">
              <span>应付：</span>
              <span v-if="orderInfo.payMethod === 'INTL_PAY'" class="foreign"
                ><strong>{{ currency.symbol }} {{ isQuota ? '--' : foreignInfo.afterAmount }}</strong
                ><em>¥ {{ orderInfo.orderPaymentMoney }} </em></span
              >
              <span v-else class="local"
                ><em>¥</em> <strong>{{ orderInfo.orderPaymentMoney }}</strong></span
              >
              <Button type="primary" @click="goPay()">去付款</Button>
            </div>
            <div class="coupon">
              <CheckboxGroup v-model="interest">
                <Checkbox class="checkBoxs" label="1">
                  <template v-if="PROCESS_ENV.NODE_PLA === 'kby'">
                    同意并接受
                    <span class="blue" @click="checkAgreement">《服务条款》</span>
                  </template>
                  <template v-if="PROCESS_ENV.NODE_PLA === 'wg'">
                    同意并接受
                    <span class="blue" @click="checkAgreement">《盛骁科技用户协议》</span>
                  </template>
                </Checkbox>
              </CheckboxGroup>
            </div>
            <p class="tips">汇率实时更新，请尽快支付，付款时会以最新汇率进行换算</p>
          </div>
        </div>
      </div>
    </Modal>
    <userAgreement @changeState="showUser = false" v-if="showUser"></userAgreement>

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
import PayModeCom from '../../components/payMode/payMode.vue';
import userAgreement from '@/views/common/userAgreement';
import { userPay } from '../../utils/orderPlayConfig';
import { rateCalculateAmount, getPayresultStatus } from '../../api/sureOrder/sureOrder';
import IntlOfflinePay from '../../../xcloud-client-components-web/module/components/intlOfflinePay';
import IntlPay from '../../../xcloud-client-components-web/module/components/intlPay';
export default {
  components: {
    userAgreement,
    PayModeCom,
    IntlOfflinePay,
    IntlPay,
  },
  props: {
    orderInfo: {},
  },
  data() {
    return {
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
      foreignInfo: {},
      currency: {},
      showIntlVisible: false,
      payParams: '',
      payInfo: {},
    };
  },
  computed: {
    selectMethod() {
      return this.payMethodArr.filter((item) => item.active)[0];
    },
    invoiceType() {
      const {
        invoiceVO: { invoiceType, subjectType },
      } = this.orderInfo;

      if (subjectType == 'PERSON') {
        return 2;
      } else if (subjectType == 'ENTERPRISE') {
        return invoiceType == 'GENERAL' ? 3 : 4;
      } else {
        return 1;
      }
    },
    enterpriseid() {
      return (localStorage.getItem('objInfo') && JSON.parse(localStorage.getItem('objInfo')).enterpriseId) || void 0;
    },
    // 是否有限额，汇率无法换算
    isQuota() {
      return this.currency.value !== this.foreignInfo.afterCurrency && this.foreignInfo.afterCurrency === 'CNY';
    },
  },

  methods: {
    changeState(val) {
      let obj = {
        state: val,
      };
      clearInterval(this.timer);
      this.$emit('changeState', obj);
    },
    changeStateUp(val) {
      this.unionType = val.state;
      if (val.type) {
        this.changeState(false);
      }
    },

    async goPay() {
      let { orderPaymentMoney, clientOrderProductVOList, orderNo } = this.orderInfo;
      let payInfo = { amount: orderPaymentMoney, ...this.payMode, orderNo, goPaymentSucceeded: true };
      // 国际支付
      if (this.orderInfo.payMethod === 'INTL_PAY') {
        this.intlPay(payInfo);
      } else {
        // 国内支付
        userPay('PC', clientOrderProductVOList, payInfo, (payResponse) => {
          this.modalShow = false;
          this.$payMentDialogDom(payResponse);
        });
      }
    },

    // 国际支付
    intlPay(payInfo) {
      // 是否是线下打款
      if (this.payMode.payWayKey == 'INTL_OFF_PAYMENT') {
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
        enterpriseId: this.enterpriseid,
        payWayId: this.payMode.payWayId,
        encryptOrderNo: this.orderInfo.encryptOrderNo,
        backUrl: 'backUrl',
        layoutHeader: false,
        layoutFooter: false,
      };
      this.payParams = this.serialize(payParamsObj);
      this.showIntlVisible = true;
      this.queryIntlPayStatus();
    },
    // 查询国际支付状态
    queryIntlPayStatus() {
      this.intlPayTimer = setInterval(() => {
        getPayresultStatus(this.orderInfo.orderNo).then((res) => {
          if (res.code === 0) {
            if (res.data === 'PAID') {
              this.changeState(false);
              this.intlPayTimer = null;
              window.clearInterval(this.intlPayTimer);
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
        amount: this.orderInfo.orderPaymentMoney,
        beforeCurrency: 'CNY',
        enterpriseId: this.enterpriseid,
      }).then((res) => {
        if (res.code === 0) {
          this.foreignInfo = res.data;
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
      this.$router.push({ path: '/myOrder' });
    },
    // 确认国际支付
    handleConfirmIntlPay() {
      this.showIntlVisible = false;
      this.changeState(false);
    },
    // 线下打款提交成功
    handleOfflineOk() {
      this.changeState(false);
    },

    checkAgreement() {
      this.interest.pop();
      this.showUser = true;
    },
  },
};
</script>
<style lang="less" scoped>
.blue {
  border-color: #00a3ff;
  color: #00a3ff;
}
.footerBt1 {
  width: 90px;
  margin: 0 0 58px 80px;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner > .ivu-steps-icon {
  color: #2d8cf0 !important;
}

.stepTwo {
  margin-left: 15px;

  margin-bottom: 20px;
  .littleStip {
    font-size: 12px;
    font-family: 'MicrosoftYaHei';
    color: rgba(171, 171, 179, 1);
    line-height: 12px;
  }
  .priceContent {
    margin-top: 20px;
    color: #939399;
    .priceBox {
      height: 112px;
      border-radius: 4px;
      border: 1px solid rgba(212, 212, 212, 1);
      text-align: center;
      padding: 22px 12px;
      cursor: pointer;
      margin: 0 10px 10px 0;
      .price {
        font-size: 24px;
        font-family: 'PingFangSC-Medium,PingFang SC';
        font-weight: 500;
        span {
          font-size: 12px;
        }
      }
      .productName {
        margin-top: 10px;
        font-size: 12px;
      }
    }
  }
  .coupon {
    margin: 10px 0;
    text-align: right;
    .checkBoxs {
      display: block;
      font-size: 12px;
    }
    :nth-child(1) {
      color: #ababb3;
    }
    :nth-child(2) {
      color: #626266;
      margin-top: 10px;
      padding-bottom: 16px;
      span {
        color: #00a3ff;
        cursor: pointer;
      }
    }
  }
  .tips {
    text-align: right;
    font-size: 12px;
  }
  .payType {
    font-size: 12px;
    line-height: 32px;
  }
  .payBox {
    font-size: 12px;
    color: #626266;
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 14px;
    justify-content: end;
    em {
      font-style: normal;
    }
    strong {
      font-size: 24px;
      color: #fb7616;
    }
    .foreign,
    .local {
      margin: 0 10px;
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
  .qrcode-container {
    position: relative;
    background: #fff;
    width: 49%;
    height: 72%;
    max-height: 550px;
    margin: 0 auto;
    margin-top: 59px;
    min-height: 548px;
  }
  .qrcode-title {
    color: #313233;
    font-size: 16px;
    padding: 20px;
    border-bottom: 5px solid #d5f0ff;
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

&/deep/.ivu-checkbox-group-item {
  min-width: 80px;
}
// &/deep/ .ivu-modal-content {
//   width: 510px;
// }
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
</style>
