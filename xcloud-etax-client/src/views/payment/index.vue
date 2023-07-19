<template>
  <div class="container">
    <div class="headContent" v-if="$route.query.paymentSource == 'ORDER'">
      <div class="bottom">确认订单</div>
      <div class="order-wrap">
        <span class="gray">订单号: </span> <span>{{ orderDetail.orderNo }}</span>
      </div>
    </div>

    <div class="headContent" v-if="$route.query.paymentSource == 'INVOICE'">
      <div class="bottom">申请开票</div>
    </div>

    <div class="content clearfix">
      <Table border :columns="columns" :data="serviceList" max-height="220">
        <template slot-scope="{ row }" slot="productName">
          <div>
            {{ row.productName }}
            <span class="refund-type" v-if="orderDetail.orderType === 'EXCHANGE'">退换货</span>
          </div>
        </template>
      </Table>
      <div class="footer" v-if="$route.query.paymentSource == 'ORDER'">
        <div class="relative">
          <div class="left flex">
            <div class="item">
              <div class="couponTitle invoiceTitle flex-center">
                <Form ref="invoiceForm" :label-width="120" inline>
                  <div>
                    <Row>
                      <FormItem prop="invoiceType" label="开票类型：">
                        {{
                          orderDetail.invoiceType === 'GENERAL'
                            ? '增值税普通发票'
                            : orderDetail.invoiceType === 'SPECIAL'
                            ? '增值税专用发票'
                            : '不开票'
                        }}
                        <span v-if="orderDetail.subjectType"
                          >({{
                            orderDetail.subjectType === 'PERSON'
                              ? '个人'
                              : orderDetail.subjectType === 'ENTERPRISE'
                              ? '公司'
                              : ''
                          }})
                        </span>
                      </FormItem>
                    </Row>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div class="right">
            <p>
              订单金额: &nbsp;
              <span>¥{{ orderDetail.orderIncludeMoney }}</span>
            </p>
            <p>
              税额: &nbsp;
              <span>¥{{ orderDetail.invoiceMoney }}</span>
            </p>
            <p>
              应付金额: &nbsp;
              <span class="red">¥{{ orderDetail.orderPaymentMoney }}</span>
            </p>
            <p>
              已付金额: &nbsp;
              <span class="red">¥{{ orderDetail.orderPaidMoney }}</span>
            </p>
            <p>
              未付金额: &nbsp;
              <span class="red">¥{{ $util.accSub(orderDetail.orderPaymentMoney, orderDetail.orderPaidMoney) }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="footer" v-if="$route.query.paymentSource == 'INVOICE'">
        <div class="relative">
          <div>
            <div>
              <p class="order-title">订单信息</p>
              <div class="couponTitle invoiceTitle">
                <Form ref="invoiceForm" :label-width="120" inline>
                  <div>
                    <Row>
                      <Col span="12">
                        <FormItem prop="invoiceType" label="订单号：">
                          {{ invoiceDetail.orderNo }}
                        </FormItem>
                      </Col>

                      <Col span="12">
                        <FormItem prop="invoiceType" label="实付金额：">
                          {{ invoiceDetail.orderPaidMoney }}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>

              <p class="order-title">发票信息</p>
              <div class="couponTitle invoiceTitle">
                <Form ref="invoiceForm" :label-width="120">
                  <FormItem prop="invoiceType" label="开票类型：">
                    {{
                      invoiceDetail.invoiceType === 'GENERAL'
                        ? '增值税普通发票'
                        : invoiceDetail.invoiceType === 'SPECIAL'
                        ? '增值税专用发票'
                        : ''
                    }}
                    <span v-if="invoiceDetail.subjectType"
                      >({{
                        invoiceDetail.subjectType === 'PERSON'
                          ? '个人'
                          : invoiceDetail.subjectType === 'ENTERPRISE'
                          ? '公司'
                          : ''
                      }})
                    </span>
                  </FormItem>

                  <FormItem
                    prop="invoiceType"
                    label="公司名称："
                    v-if="invoiceDetail.invoiceType == 'SPECIAL' || invoiceDetail.subjectType == 'ENTERPRISE'"
                  >
                    {{ invoiceDetail.name }}
                  </FormItem>

                  <FormItem
                    prop="invoiceType"
                    label="公司税号："
                    v-if="invoiceDetail.invoiceType == 'SPECIAL' || invoiceDetail.subjectType == 'ENTERPRISE'"
                  >
                    {{ invoiceDetail.idOrTaxNumber }}
                  </FormItem>

                  <FormItem prop="invoiceType" label="姓名：" v-if="invoiceDetail.subjectType === 'PERSON'">
                    {{ invoiceDetail.name }}
                  </FormItem>

                  <FormItem prop="invoiceType" label="身份证号：" v-if="invoiceDetail.subjectType === 'PERSON'">
                    {{ invoiceDetail.idOrTaxNumber }}
                  </FormItem>
                  <FormItem prop="invoiceType" label="公司地址：" v-if="invoiceDetail.invoiceType === 'SPECIAL'">
                    {{ invoiceDetail.companyAddress }}
                  </FormItem>

                  <FormItem prop="invoiceType" label="公司电话：" v-if="invoiceDetail.invoiceType === 'SPECIAL'">
                    {{ invoiceDetail.companyTel }}
                  </FormItem>

                  <FormItem prop="invoiceType" label="开户银行：" v-if="invoiceDetail.invoiceType === 'SPECIAL'">
                    {{ invoiceDetail.openingBank }}
                  </FormItem>

                  <FormItem prop="invoiceType" label="开户卡号：" v-if="invoiceDetail.invoiceType === 'SPECIAL'">
                    {{ invoiceDetail.bankAccount }}
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="zhifu">
          <div class="payType">
            <span class="payMethod">支付方式: </span>
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
          <p class="pay-tip" v-if="$route.query.paymentSource == 'INVOICE'">
            注：根据税务规定，开具发票只能主体一致，如果是个人开票就用个人银行卡付款，公司开票就用公司对公账户付款，暂只支持网银对公支付
          </p>
        </div>

        <p class="fukuan" v-if="$route.query.paymentSource == 'ORDER'">
          本次付款金额: &nbsp;
          <span class="red">¥{{ orderDetail.curPaymentMoney }}</span>
        </p>

        <p class="fukuan" v-if="$route.query.paymentSource == 'INVOICE'">
          税额: &nbsp;
          <span class="red">¥{{ invoiceDetail.makeInvoiceMoney }}</span>
        </p>
        <div class="play-useragreement-style">
          <Button class="settlement fr" @click="goPay()" :loading="submitLoading">去支付</Button>
        </div>

        <div class="purchaseInformation" v-if="[28, 29, 30, 42, 40].includes(enterpriseId)">
          支付订单则表示您同意
          <span @click="agreementModal = true">
            <span v-if="enterpriseId == 29">《跨税云用户协议》</span>
            <span v-if="enterpriseId == 40">《辰海云-vat用户协议》</span>
            <span v-if="enterpriseId == 28">《辰海云-商标用户协议》</span>
            <span v-if="enterpriseId == 30">《跨标云用户协议》</span>
            <span v-if="enterpriseId == 42">《卖旺用户协议》</span>
          </span>
        </div>
      </div>
    </div>

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
              <img style="margin-bottom: -3px; margin-right: 3px" src="@/assets/images/sureOrder/sao.png" alt />
              <span v-if="selectMethodCode == 'WECHAT_SCAN_CODE'">使用【微信扫一扫】即可付款</span>
              <span v-if="selectMethodCode == 'ALIPAY_SCAN_CODE'">使用【支付宝扫一扫】即可付款</span>
            </div>
            <div class="price-name">收款方：{{ paySubject }}</div>
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
    <user-agreement @changeState="changeStates" v-if="agreementModal" :enterpriseId="enterpriseId"></user-agreement>

    <div id="box"></div>
  </div>
</template>

<script>
import '@/styles/common.less';
import unionPay from '@/views/home/components/modalComponents/unionPayNew';
import SureOrderContract from '../shoppingCart/sureOrder/components/invoice/index.vue';
import { payResult } from '@/api/shoppingCar/shoppingCar';
import { orderPayDetail, getPayMethod, toPay } from '@/api/payment/index';
import UserAgreement from '@/views/common/userAgreements';
import { totalShoppingCart } from '@/api/shoppingCar/shoppingCar';

export default {
  data() {
    const that = this;
    return {
      serviceList: [], // 代付款的服务列表
      orderDetail: {
        orderPaymentMoney: 0,
        orderPaidMoney: 0,
      },
      invoiceDetail: {},
      agreementModal: false,
      columns: [
        {
          title: '商品名称',
          key: 'productName',
          slot: 'productName',
        },
        {
          title: '国家',
          key: 'countryName',
        },
        {
          title: '商品售价',
          key: 'productPaymentMoney',
          render(h, params) {
            let sellStr = `${params.row.productPaymentMoney}/${
              params.row.unit === 1
                ? '年'
                : params.row.unit === 2
                ? '个'
                : params.row.unit === 3
                ? '次'
                : params.row.unit === 4
                ? '类'
                : '个'
            }`;
            return h(
              'span',
              {
                style: {
                  color: '#999999',
                },
              },
              sellStr
            );
          },
        },
        {
          title: '数量',
          key: 'quantity',
        },
        {
          title: '小计',
          key: 'productPaymentMoney',
          render(h, params) {
            let moneyStr = `￥${that.$util.toDecimalRound(
              Number(params.row.productPaymentMoney) * Number(params.row.quantity)
            )}元`;
            return h(
              'span',
              {
                style: {
                  color: '#999999',
                },
              },
              moneyStr
            );
          },
        },
      ],

      loadComfirm: false,
      userTransferAccountInfo: {},
      payMethodList: [],
      isShowAccoutModal: false,
      imgUrl: '',
      isShowModel: false,
      submitLoading: false,
      enterpriseId: '',
      selectMethod: {
        name: '微信',
        src: require('@/assets/images/sureOrder/wx-pay.png'),
        active: true,
        current: 1,
      },
      selectMethodId: '',
      selectMethodCode: '',
      pcPayList: ['PERSONAL_EBANK', 'ENTERPRISE_EBANK', 'WECHAT_SCAN_CODE', 'ALIPAY_SCAN_CODE'],
      timeId: '',
    };
  },
  watch: {},
  components: {
    unionPay,
    SureOrderContract,
    UserAgreement,
  },
  computed: {
    /** 支付方式 */
    payListComputed() {
      let isENTERPRISE = false;
      let isSPECIAL = false;
      // 增值税专用

      if (this.$route.query.paymentSource == 'INVOICE') {
        isENTERPRISE = this.invoiceDetail.subjectType === 'ENTERPRISE';
        isSPECIAL = this.invoiceDetail.invoiceType === 'SPECIAL';
      } else {
        isENTERPRISE = this.orderDetail.subjectType === 'ENTERPRISE';
        isSPECIAL = this.orderDetail.invoiceType === 'SPECIAL';
      }
      let result = [];
      if (isENTERPRISE || isSPECIAL) {
        // 如果是公司和普通增值税发票，只能用支付宝、微信、个人网银、企业银联
        const filterPayKeys = [
          'ALIPAY_SCAN_CODE',
          'WECHAT_SCAN_CODE',
          'PERSONAL_EBANK',
          'OFFLINE_PAYMENT',
          'ENTERPRISE_EBANK',
        ];

        result = this.payMethodList.filter((item) => filterPayKeys.includes(item.payWayKey));
      } else {
        result = this.payMethodList;
      }
      if (!(this.userTransferAccountInfo && this.userTransferAccountInfo.accountNumber)) {
        result = result.filter((item) => item.payWayKey != 'OFFLINE_PAYMENT');
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
        default:
          break;
      }
      return subject;
    },
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
    getPayImg({ payWayKey }) {
      const imgList = ['ALIPAY_SCAN_CODE', 'PERSONAL_EBANK', 'ENTERPRISE_EBANK', 'OFFLINE_PAYMENT'];
      if (imgList.includes(payWayKey)) {
        return require('@/assets/images/sureOrder/' + payWayKey + '.svg');
      }
      return require('@/assets/images/sureOrder/wx-pay.svg');
    },
    payResultApi() {
      this.timeId && clearInterval(this.timeId);
      this.timeId = setInterval(async () => {
        const orderNo = this.orderDetail.orderNo || this.invoiceDetail.orderNo;
        let { code, data } = await payResult(orderNo);
        if (code == 0 && data == true) {
          clearInterval(this.timeId);
          this.$Message.success('付款成功');

          // 支付成功后刷新购物车数据
          totalShoppingCart().then((res) => {
            this.$store.commit('saveCarNumStatue', res.data);
          });

          this.$util.getUserInegralMessage(this, '登录');
          this.changeStatePay();
        }
      }, 1500);
    },
    // 生成二维码
    qrcode(url) {
      this.isShowModel = true;
      this.imgUrl = url;
    },

    getCarList() {
      orderPayDetail({
        encryptOrderNo: this.$route.query.encryptOrderNo,
        paymentSource: this.$route.query.paymentSource,
      })
        .then((res) => {
          if (res.code === 0) {
            this.enterpriseId = res.data.enterpriseId;
            if (this.$route.query.paymentSource == 'INVOICE') {
              this.invoiceDetail = res.data.invoiceDetail;
            } else {
              this.orderDetail = res.data.orderDetail;
              this.serviceList = res.data.orderDetail.orderProductDetailList;
            }
            if (this.$route.query.paymentSource == 'INVOICE' && this.invoiceDetail.invoiceType === 'SPECIAL') {
              this.pcPayList = ['PERSONAL_EBANK'];
            }

            this.getPayMethodList(this.enterpriseId);
            this.userTransferAccountInfo = res.data.userTransferAccountInfo;
          }
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },

    // fjids() {
    //   let document1 = document.getElementById('box');
    //   let res = ''
    //   document1.innerHTML = res; // form 字符串
    //   document1.forms[0].submit();
    // },
    goPay(flag) {
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

      toPay(params)
        .then((res) => {
          this.loadComfirm = false;
          if (this.selectMethodCode == 'WECHAT_SCAN_CODE' || this.selectMethodCode == 'ALIPAY_SCAN_CODE') {
            this.qrcode(res);
            setTimeout(() => {
              this.payResultApi();
            }, 5000);
            return;
          }
          if (this.selectMethodCode == 'OFFLINE_PAYMENT') {
            if (res == 'SUCCESS') {
              this.$router.push('/paymentSuccess');
            }
            return;
          }
          if (/^(http:|https:)/.test(res)) {
            window.open(res, `_self`);
          } else {
            let document1 = document.getElementById('box');
            document1.innerHTML = res; // form 字符串
            document.querySelector("form[name ='pay_form']").submit();
          }
        })
        .catch((err) => {
          this.loadComfirm = false;
          this.$Message.error(err.message);
        });
    },
    changeStateWXpay(val) {},
    changeStatePay(val) {
      this.dialog = false;
      setTimeout(() => {
        this.$router.push('/paymentSuccess');
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
        } else {
          element.active = false;
        }
      });
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
</style>
