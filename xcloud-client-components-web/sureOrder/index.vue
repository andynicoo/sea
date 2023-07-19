<template>
  <div class="mainContent" ref="box">
    <div class="top-contnet" v-if="!paySuccess">
      <div class="title">
        <img class="settingIcon" src="./../images/setting/settingIcon.svg" alt="" /><img
          class="settingIconOrange"
          src="./../images/orangeTheme/settingIcon.png"
          alt=""
        />
        确认订单
      </div>
      <div class="content clearfix">
        <dl class="serviceList-table">
          <dt>
            <span class="product-name-title">{{ isRenewal ? '续费商品' : '商品名称' }}</span>
            <span>{{ isRenewal ? '续费服务' : '国家' }}</span>
            <span>{{ isRenewal ? '续费优惠价' : '商品售价' }}</span>
            <span>{{ isRenewal ? '续费服务期' : '数量' }}</span>
            <span>小计</span>
          </dt>
          <template v-for="(item, index) in serviceList">
            <dd class="serviceList-goods" :key="index">
              <div class="serviceName">
                <img :src="item.productImagePc || item.pcProductImgUrl" />
                <div class="right">
                  <p>{{ item.productName }}</p>
                  <!-- <p v-if="item.packageSelected == 1">服务项目：套装购买</p> -->
                  <p v-if="isRenewal">
                    <span>国家：{{ item.countryNameZh }} </span><br />
                    <span v-if="eprCode.includes(item.productFunctionCode) && item.renewLastTime">
                      续费年份：{{ item.renewLastTime.substr(0, 4) }}年
                    </span>
                    <EPRPreProduct :item="item" />
                  </p>
                  <p v-else-if="item.groupProducts && !item.groupProducts.length">
                    服务项目：{{ item.productSpecs.map((spec) => spec.productSpecName || spec.specsName).join() }}
                  </p>

                  <template v-if="routerFrom == 'buyNow'">
                    <div v-for="(spec, index) in item.productSpecsDTOList" :key="index">
                      <template
                        v-if="
                          spec.additionalSpecCurr && spec.additionalSpecCurr.length && spec.additionalSpecCurr[0].type
                        "
                      >
                        <span>附加规格：</span>
                        <p v-for="(addSpec, index) in spec.additionalSpecCurr" :key="index">
                          {{ addSpec.specName }} * {{ addSpec.num }}
                        </p>
                      </template>
                    </div>
                  </template>
                  <template v-else-if="!isRenewal">
                    <div v-for="(spec, index) in item.productSpecs" :key="index" class="product-addition-spec">
                      <span
                        v-if="
                          spec.productAdditionSpecs.productAdditionSpecCalcType &&
                            spec.productAdditionSpecs.productAdditionSpecCalcType == 'QUANTITY'
                        "
                        >附加服务：</span
                      >
                      <p
                        class="c999"
                        v-for="(addiSpec, index) in spec.productAdditionSpecs.productAdditionSpecDetail"
                        :key="index"
                      >
                        {{ addiSpec.productAdditionSpecName }} *
                        {{ addiSpec.productAdditionSpecQuantity }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>
              <div>
                <span v-if="isRenewal">{{ item.productSpecName }}</span>
                <span v-else>
                  {{
                    item.groupProducts && item.groupProducts.length
                      ? item.groupProducts.map((goods) => goods.countryName || goods.countryCodeName).join()
                      : item.countryName || item.countryCodeName
                  }}
                </span>
              </div>
              <div>
                <span v-if="isRenewal"
                  >{{ item.currency || '￥' }}{{ item.price }} x {{ item.quantity
                  }}<b class="activityContent" v-if="item.activityType === 1"
                    >已优惠{{ $util.accMul(item.activityContent, 10) }}折</b
                  ></span
                ><span v-else>{{ item.currency }}{{ item.price }}</span>
              </div>
              <div>
                <span v-if="isRenewal" v-html="renewalInterval(item)"></span><span v-else>{{ item.quantity }}</span>
              </div>
              <div>
                <span class="red"> {{ item.currency || '￥' }}{{ floatMultiply(item.price, item.quantity) }} </span>
              </div>
            </dd>
            <template v-if="item.groupProducts && item.groupProducts.length && item.packageSelected != 1">
              <dd v-for="(goods, index) in item.groupProducts" :key="goods.id">
                <div
                  class="product-name-sourOrder"
                  v-if="
                    (goods.productSpecs && goods.productSpecs.length) ||
                      (goods.productSpecsDTOList && goods.productSpecsDTOList.length)
                  "
                >
                  <span>服务{{ index + 1 }}：</span>
                  <div class="product-info-sourOrder">
                    <p>{{ goods.productName }}</p>
                    <p class="c999">
                      服务项目：{{
                        (goods.productSpecs || goods.productSpecsDTOList)
                          .map((spec) => spec.productSpecName || spec.specsName)
                          .join()
                      }}
                    </p>
                    <!-- 附加规格立即下单和购物车下单数据结构不一样 -->
                    <template v-if="routerFrom == 'buyNow'">
                      <div class="c999" v-if="goods.productSpecsDTOList.length">
                        <div v-for="(spec, index) in goods.productSpecsDTOList" :key="index">
                          <template
                            v-if="
                              spec.additionalSpecCurr &&
                                spec.additionalSpecCurr.length &&
                                spec.additionalSpecCurr[0].type
                            "
                          >
                            <span>附加服务：</span>
                            <p v-for="(addSpec, index) in spec.additionalSpecCurr" :key="index">
                              {{ addSpec.specName }} * {{ addSpec.num }}
                            </p>
                          </template>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div v-for="(spec, index) in goods.productSpecs" :key="index" class="product-addition-spec">
                        <span
                          v-if="
                            spec.productAdditionSpecs.productAdditionSpecCalcType &&
                              spec.productAdditionSpecs.productAdditionSpecCalcType == 'QUANTITY'
                          "
                          >附加服务：</span
                        >
                        <p
                          class="c999"
                          v-for="(addiSpec, index) in spec.productAdditionSpecs.productAdditionSpecDetail"
                          :key="index"
                        >
                          {{ addiSpec.productAdditionSpecName }} *
                          {{ addiSpec.productAdditionSpecQuantity }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
                <div></div>
                <div>
                  <!-- {{ item.currency }}{{ item.quantity }} -->
                </div>
                <div>
                  <!-- {{ item.quantity }} -->
                </div>
                <div>
                  <!-- 小计 <span class="red"> {{ item.currency }}{{ item.price }} </span> -->
                </div>
              </dd>
            </template>
          </template>
        </dl>

        <div class="footer">
          <div class="relative">
            <div class="left flex">
              <div class="item">
                <div class="couponTitle invoiceTitle flex-center" v-show="$route.query.type != 'oa'">
                  <Form ref="invoiceForm" :label-width="120" :model="invoiceForm" inline>
                    <Row v-if="couponList.length > 0 && !isMarketingActivityId">
                      <FormItem prop="couponNum" label="优惠券：">
                        <Select
                          v-model="couponNum"
                          style="width: 266px"
                          @on-change="getDiscountAmountAPI"
                          placeholder="请选择优惠券"
                          clearable
                        >
                          <Option v-for="(v, i) in couponList" :key="i" :value="v.couponCode">{{
                            v.couponContent
                          }}</Option>
                        </Select>
                      </FormItem>
                    </Row>
                    <!-- 暂时注释发票，手动开发票 -->
                    <!-- <Row v-if="payMethod !== 'INTL_PAY'">
                      <FormItem prop="invoiceType" label="发票：">
                        <RadioGroup v-model="invoiceForm.invoiceType">
                          <Radio label="1">不开发票</Radio>
                          <Radio label="2" :disabled="payAmount == 0 || $route.query.type == 'oa' ? true : false"
                            >增值税普通发票(个人)</Radio
                          >
                          <Radio label="3" :disabled="payAmount == 0 || $route.query.type == 'oa' ? true : false"
                            >增值税普通发票(公司)</Radio
                          >
                          <Radio label="4" :disabled="payAmount == 0 || $route.query.type == 'oa' ? true : false"
                            >增值税专用发票</Radio
                          >
                        </RadioGroup>
                      </FormItem>
                    </Row> -->
                  </Form>
                </div>
              </div>
            </div>
            <div class="right">
              <p>
                订单金额: &nbsp;
                <span class="red">¥{{ serviceMoney }}</span>
              </p>
              <p v-if="couponList.length > 0 && $route.query.type != 'oa'">
                优惠金额: &nbsp;
                <span class="red"> ¥{{ discAmountMoney }}</span>
              </p>
              <!-- <p v-show="invoiceForm.invoiceType != 1">
                税额: &nbsp;
                <span class="red"
                  >¥<TaxRate
                    ref="taxRate"
                    @change="(val) => (this.invoiceMoney = val)"
                    :contractTypeEM="setInvoiceType(invoiceForm.invoiceType).invoiceType"
                    :discAmountMoney="discAmountMoney"
                    :orderPaidMoney="serviceMoney"
                /></span>
              </p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="free-mask" v-if="getFree">
        <div class="invite-banner">
          <img @click="getFree = false" class="close" src="./../images/activity/cancelCircle.png" alt="" />
          <span class="free-mount"
            >￥
            <span>{{ freeMount }}</span>
          </span>
          <div class="inviteBox">
            <img class="bg" src="./../images/activity/pc-free.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-content clearfix" v-if="!paySuccess">
      <PayModeCom
        class="zhifu"
        :invoiceType="invoiceForm.invoiceType"
        :showChanaPay="enterpriseid == 42 ? true : false"
        source="buy"
        :foreignInfo="foreignInfo"
        @calculate="handleCalculate"
        @getPayMethod="(val) => handleGetPayMethod(val)"
        @getPayMode="(val) => (payMode = val)"
      />
      <div class="settlement fr">
        <div class="fukuan">
          <span>订单金额: ¥{{ serviceMoney }}</span>
          <span>优惠金额: ¥{{ discAmountMoney }}</span>
          <span>税率: {{ payMethod === 'INTL_PAY' ? '免税' : floatMultiply(taxRateVal, 100) + '%' }}</span>
          <span v-if="payMethod === 'INTL_PAY'">税额: ¥0</span>
          <span v-else
            >税额: ¥<TaxRate
              ref="taxRate"
              @change="(val) => (this.invoiceMoney = val)"
              :contractTypeEM="setInvoiceType(invoiceForm.invoiceType).invoiceType"
              :discAmountMoney="discAmountMoney"
              :orderPaidMoney="serviceMoney"
              @getTaxRate="getTaxRate"
          /></span>

          <span class="sum">
            <span>合计</span>
            <span v-if="payMethod === 'INTL_PAY'" class="foreign"
              ><strong>{{ currency.symbol }} {{ isQuota ? '--' : foreignInfo.afterAmount }}</strong
              ><em>¥{{ payAmount }} </em></span
            >
            <span v-else
              ><strong>¥ {{ payAmount }}</strong></span
            >
          </span>
          <Button class="btn" @click="clickCreateOrder" :loading="payLoading">立即购买</Button>
        </div>
        <div class="fl userAgreement-box" v-if="[29, 40, 51].includes(enterpriseid)">
          <Checkbox v-model="userAgreementFlag">提交订单则表示您同意</Checkbox>
          <span
            v-if="productCategoryIds.includes('1588492025906933762')"
            @click="
              showAgreement = true;
              agreementType = 'VAT';
            "
            style="cursor: pointer"
            >{{ enterpriseid == '29' ? '《跨税云用户协议-VAT》' : '《卖家成长用户协议-VAT》' }}</span
          >
          <span
            v-if="productCategoryIds.includes('1588492024187269121')"
            @click="
              showAgreement = true;
              agreementType = 'compliance';
            "
            style="cursor: pointer"
            >{{ enterpriseid == '29' ? '《跨税云用户协议-合规认证》' : '《卖家成长用户协议-合规认证》' }}</span
          >
          <span
            v-if="productCategoryIds.includes('1607561055083282434')"
            @click="
              showAgreement = true;
              agreementType = 'compliance';
            "
            style="cursor: pointer"
            >《跨企云(海外工商)用户协议》</span
          >
        </div>
        <div v-else class="fl userAgreement-box">
          <Checkbox v-model="userAgreementFlag">提交订单则表示您同意</Checkbox>
          <span @click="agreementModal = true">{{ userAgreementTxt[enterpriseid] }}</span>
        </div>
      </div>
      <div v-if="payMethod === 'INTL_PAY'" class="exchange-rate-tips">
        汇率实时更新，请尽快支付，付款时会以最新汇率进行换算
      </div>
    </div>
    <paySuccess v-if="paySuccess"></paySuccess>
    <userAgreement
      :enterpriseid="enterpriseid"
      @changeState="agreementModal = false"
      v-if="agreementModal && [30, 49].includes(enterpriseid)"
    ></userAgreement>
    <userAgreement28
      @changeState="agreementModal = false"
      v-if="agreementModal && enterpriseid == 28"
    ></userAgreement28>
    <BarklyUserAgreement @changeState="agreementModal = false" v-else-if="agreementModal && enterpriseid == 42" />
    <OffinePay
      @off="() => setTimeout(() => (modalShow = val), 100)"
      :visible.sync="showOffine"
      :orderInfo="offineOrderinfo"
      :payMode="payMode"
      v-if="enterpriseid == 42 && showOffine"
    />
    <userAgreement29
      @changeState="changeStates"
      v-if="showAgreement && enterpriseid == 29"
      :agreementType="agreementType"
    ></userAgreement29>
    <userAgreement40
      @changeState="changeStates"
      v-if="showAgreement && enterpriseid == 40"
      :agreementType="agreementType"
    ></userAgreement40>
    <userAgreement51
      @changeState="changeStates"
      v-if="showAgreement && enterpriseid == 51"
      :agreementType="agreementType"
    ></userAgreement51>
    <Spin fix v-if="showSpin">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>亲 商品太火爆，您正在排队中</div>
    </Spin>

    <!-- 国际支付线下打款弹窗 -->
    <IntlOfflinePay
      v-if="showIntlOffline"
      :visible.sync="showIntlOffline"
      @cancel="handleOfflineCancel"
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
import EPRPreProduct from './components/EPRPreProduct';
const USERAGREEMENTTXT = {
  28: '《卖家成长商标注册协议》',
  30: '《商标及专利服务用户协议》',
  42: '《卖旺云用户协议》',
  49: '《盛骁科技用户协议》',
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
import moment from 'moment';
export default {
  mixins: [componentsMixin],
  data() {
    let { type, id: oaOrderId, from: routerFrom } = this.$route.query;
    return {
      agreementUrl: [],
      agreementName: [],
      userAgreementFlag: false,
      userAgreementTxt: USERAGREEMENTTXT,
      userAgreementType: '', //vat,合规,空
      productCategoryIds: [], //分类id
      agreementType: '',
      showAgreement: false, // 是否展示服务条款
      serviceList: [], // 待付款的服务列表
      productName: '', // 产品名称
      couponNum: '', // 优惠券码
      discAmountMoney: 0, // 优惠金额
      invoiceMoney: 0, // 开票金额
      invoiceForm: {
        invoiceType: '4', //固定增值税专用发票
      },
      getFree: false,
      freeMount: 0,
      agreementModal: false,
      paySuccess: false,
      couponList: [],
      showSpin: false,
      // 判断商品是商标还是外观专利
      ...{ type, oaOrderId, routerFrom },
      payMode: null,
      pageFrom: this.$route.query.pageFrom || 'index',
      isMarketingActivityId: '', //是否是活动商品
      showOffine: false,
      payLoading: false,
      offineOrderinfo: {
        orderNo: '',
      },
      oaOrderInfo: {},
      //erp服务
      eprCode: [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108],
      payMethod: 'CHN_PAY',
      showIntlOffline: false,
      foreignInfo: {},
      currency: {},
      showIntlVisible: false,
      payParams: '',
      payInfo: {},
      orderListPath: localStorage.orderListPath,
      taxRateVal: 0,
    };
  },
  created() {
    this.isMarketingActivityId =
      (JSON.parse(localStorage.getItem('selectedList')) &&
        JSON.parse(localStorage.getItem('selectedList')).marketingActivityId) ||
      void 0;
    this.init();
  },
  mounted() {
    const observer = new MutationObserver(this.handleMutation);
    observer.observe(this.$refs.box, { attributes: true, childList: true, subtree: true });
  },
  computed: {
    // 支付金额
    payAmount() {
      let num = this.countSum([
        this.countSum([Number(this.serviceMoney), -Number(this.discAmountMoney)]),
        this.payMethod === 'INTL_PAY' ? 0 : Number(this.invoiceMoney),
      ]);
      num = this.formatDecimal(num, 2);
      num = num < 0 ? 0 : num;
      // if (num == 0) {
      //   this.invoiceForm.invoiceType = '1';
      // }
      return num;
    },
    /** 订单    serviceMoney: , // 未使用优惠券之前的价格 */
    serviceMoney() {
      let numArr = [];
      this.serviceList.length > 0 &&
        this.serviceList.forEach((item) => {
          let { quantity, price } = item;
          numArr.push(this.floatMultiply(quantity, price));
        });
      return this.formatDecimal(this.countSum(numArr), 2);
    },
    pcProductImgUrl() {
      return (val) => {
        return val != '' ? JSON.parse(val)[0].imgUrl : '';
      };
    },
    isRenewal() {
      return this.routerFrom === 'renewal';
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
    handleMutation(mutationsList, observer) {
      this.$emit('height-change', this.$refs.box.offsetHeight);
    },
    //获取税率
    getTaxRate(val) {
      this.taxRateVal = val || 0;
    },
    //用户协议
    changeStates(val) {
      this.showAgreement = val;
    },
    /**获取优惠金额 */
    async getDiscountAmountAPI(val) {
      if (val) {
        let param = {
          couponNum: this.couponNum,
          orderSource: 1,
          isCustom: 0,
          products: this.serviceList.map((p) => ({
            count: p.quantity,
            productInfoId: p.productId || p.id,
            price: p.price || 0,
            productName: p.productName || '',
          })),
          activityGoodsFlag: this.isMarketingActivityId ? true : false,
        };
        let { data } = await getDiscountAmount(param);
        this.discAmountMoney = data || 0;
      } else {
        this.discAmountMoney = 0;
      }
      this.handleCalculate(this.currency);
    },
    //获取用户协议链接
    getAgreementUrl() {
      if ([29, 40].includes(this.enterpriseid)) {
        if (this.productCategoryIds.includes('1588492025906933762')) {
          this.agreementUrl.push(agreementUrlList[this.enterpriseid + 'vat']);
          this.agreementName.push(USERAGREEMENTTXT[this.enterpriseid + 'vat']);
        }
        if (this.productCategoryIds.includes('1588492024187269121')) {
          this.agreementUrl.push(agreementUrlList[this.enterpriseid + 'hg']);
          this.agreementName.push(USERAGREEMENTTXT[this.enterpriseid + 'hg']);
        }
      } else {
        this.agreementUrl.push(agreementUrlList[this.enterpriseid]);
        this.agreementName.push(USERAGREEMENTTXT[this.enterpriseid]);
      }
    },
    async init() {
      if (this.$route.query.type && this.$route.query.type == 'oa') {
        let { data } = await orderDetailApi({ orderId: this.oaOrderId });
        this.serviceList = data.orderProductDetails.map((item) => ({
          ...item,
          price: item.productMoney,
        }));
        this.oaOrderInfo = data;
      } else {
        let initial = JSON.parse(localStorage.getItem('selectedList'));
        let list = Array.isArray(initial) ? initial : [initial];
        if (this.routerFrom == 'buyNow') {
          //立即购买
          this.serviceList = list.map((item) => {
            item.price = this.division(item.servicePriceSum, item.quantity);
            console.log(this.division(item.servicePriceSum, item.quantity));
            item.productSpecs = item.productSpecsDTOList;
            item.groupProducts = item.productInfoDTOList;
            return item;
          });
        } else if (this.isRenewal) {
          this.serviceList = list.map((item) => ({
            ...item,
            price: item.productPrice,
            quantity: 1,
            productSpecs: [],
            groupProducts: [],
            productName: item.serviceName,
          }));
        } else {
          this.serviceList =
            (list &&
              list.map((item) => {
                item.price = item.productPaymentMoney;
                return item;
              })) ||
            [];
        }
      }
      this.productCategoryIds = this.serviceList.map((item) => item.productCategoryId);
      this.getAgreementUrl();
      console.log(this.productCategoryIds, 'this.productCategoryIds');
      this.getCouponList();
    },

    createRenewalParams() {
      let coupon = this.couponList.find((item) => item.couponCode === this.couponNum);
      return {
        containsRenewalDiscountGoodsFlag: this.serviceList.some((item) => item.activityType !== 0),
        amountMoney: this.payAmount,
        couponNum: this.couponNum,
        invoiceDTO: this.setInvoiceType(this.invoiceForm.invoiceType),
        orderSource: 'PC',
        paymentType: 'NORMAL',
        userMobile: JSON.parse(localStorage.getItem('objInfo')).userMobile,
        productDTO: this.serviceList.map((item) => ({
          quantity: 1,
          productPaymentMoney: item.productPrice,
          discAmountMoney: this.discAmountMoney,
          productId: item.productId,
          productName: item.serviceName,
          serviceCompanyName: item.companyNameZh,
          productSpecs: [
            {
              productSpecId: item.productSpecId,
            },
          ],
          serviceId: item.serviceId,
        })),
      };
    },

    createParam() {
      let { payAmount: copeMoney, couponNum } = this,
        userMobile = JSON.parse(localStorage.getItem('objInfo')).userMobile,
        invoiceDTO = this.setInvoiceType(this.invoiceForm.invoiceType),
        orderSource = this.enterpriseid == 42 ? 'CS' : 'PC',
        paymentType = 'NORMAL',
        shopingCartStatus = this.routerFrom == 'car' ? true : false;
      let productDTO = [];
      invoiceDTO.invoiceType = '';

      this.serviceList.map((item) => {
        let itemObj = {
          groupStatus: false,
          quantity: item.quantity,
          productId: item.productId || item.id,
          productUniqueKey: item.productUniqueKey,
          serviceCompanyName: '',
          serviceCompanyId: '',
          productMoney: item.productMoney || item.price,
          discAmountMoney: this.discAmountMoney,
          productName: item.productName,
          productSpecs: [],
          groupProducts: [],
        };
        if (item.groupProducts && item.groupProducts.length) {
          itemObj.groupStatus = true;
          item.groupProducts.forEach((goods) => {
            let goodsObj = {
              quantity: goods.quantity,
              productId: goods.productId || goods.id,
              productMoney: goods.productMoney || goods.servicePrice,
              productName: goods.productName,
              productSpecs: [],
            };
            this.specsHanler(goods.productSpecs || goods.productSpecsDTOList, goodsObj);
            if (goodsObj.productSpecs.length) {
              itemObj.groupProducts.push(goodsObj);
            }
          });
        } else {
          this.specsHanler(item.productSpecs || item.productSpecsDTOList, itemObj);
        }
        productDTO.push(itemObj);
      });
      var orderServiceRelDTO = null;
      if (
        this.serviceList[0].productName.indexOf('德国WEEE注册') != '-1' ||
        this.serviceList[0].productName.indexOf('德国电池法注册') != '-1'
      ) {
        orderServiceRelDTO = {
          serviceId: this.serviceList[0].eprServiceId,
          serviceType: 'EPR',
        };
      }
      // const eprDeclareList = ['德国WEEE申报补缴费', '德国电池法申报补缴费', '德国包装法申报补缴费用'];
      if (this.serviceList[0].wordType == 'epr') {
        orderServiceRelDTO = {
          serviceId: this.serviceList[0].serviceId,
          serviceType: 'EPR_DECLARE',
          workNo: this.serviceList[0].workNo,
        };
        productDTO[0].productSpecs = [
          {
            productSpecId: this.serviceList[0].productSkuId,
            productSpecMoney: this.serviceList[0].productPaymentMoney,
          },
        ];
      }
      return {
        shopingCartStatus,
        copeMoney,
        couponNum,
        productDTO,
        orderSource,
        paymentType,
        userMobile,
        invoiceDTO,
        orderServiceRelDTO,
        marketingActivityId: this.isMarketingActivityId,
        ...(this.enterpriseid == 42 && {
          reqSrc: 'cs',
          settlementCycle: this.payMode.payWayKey == 'CYCLE' ? 'MONTH_SETTLEMENT' : void 0,
        }),
      };
    },
    //规格参数处理
    specsHanler(productSpecsDTOList, itemObj) {
      console.log(productSpecsDTOList, itemObj);
      productSpecsDTOList &&
        productSpecsDTOList.length &&
        productSpecsDTOList.forEach((spec) => {
          let additionHD = {
            productSpecId: spec.productSpecId || spec.id,
            productSpecMoney: spec.productSpecMoney || spec.servicePrice,
          };
          if (spec.additionalSpecCurr && spec.additionalSpecCurr[0].type) {
            additionHD.productAdditionSpecs = {
              productAdditionSpecId: spec.additionSpecDTO.id,
              productAdditionSpecCalcType: spec.additionSpecDTO.calcType,
              productAdditionSpecDetail:
                spec.additionalSpecCurr &&
                spec.additionalSpecCurr.map((item) => {
                  return {
                    productAdditionSpecQuantity: item.num,
                    productAdditionSpecDetailId: item.type,
                  };
                }),
            };
          } else if (spec.additionSpecId && spec.additionSpecDTO.calcType == 'LADDER') {
            additionHD.productAdditionSpecs = {
              productAdditionSpecId: spec.additionSpecDTO.id,
              productAdditionSpecCalcType: spec.additionSpecDTO.calcType,
            };
          }
          //购物车下单
          if (spec.productAdditionSpecs && spec.productAdditionSpecs.productAdditionSpecCalcType) {
            additionHD.productAdditionSpecs = {
              productAdditionSpecId: spec.productAdditionSpecs.productAdditionSpecId,
              productAdditionSpecCalcType: spec.productAdditionSpecs.productAdditionSpecCalcType,
            };
            if (spec.productAdditionSpecs.productAdditionSpecDetail.length) {
              additionHD.productAdditionSpecs.productAdditionSpecDetail = spec.productAdditionSpecs.productAdditionSpecDetail.map(
                (item) => {
                  return {
                    productAdditionSpecQuantity: item.productAdditionSpecQuantity,
                    productAdditionSpecDetailId: item.productAdditionSpecDetailId,
                  };
                }
              );
            }
          }
          itemObj.productSpecs.push(additionHD);
        });
    },

    /**
     * goods order pay
     */
    async clickCreateOrder() {
      console.log(this.agreementUrl);
      if (!this.userAgreementFlag) {
        return this.$Message.warning('请勾选用户协议！');
      }
      this.payLoading = true;
      const { orderPaymentMoney, orderNo, invoiceDTO, orderPaymentTotal } = this.oaOrderInfo;
      const isOA = this.$route.query.type == 'oa';
      let payData = null,
        payInfo = null,
        createOrderParam = null;
      try {
        if (!isOA) {
          //Other goods need to create an order
          createOrderParam = this.isRenewal ? this.createRenewalParams() : this.createParam();
          createOrderParam.agreementUrl = this.agreementUrl.join();
          createOrderParam.agreementName = this.agreementName.join();
          createOrderParam.payMethod = this.payMethod;
          if (this.isRenewal) {
            payData = await renewalPay(createOrderParam);
          } else if (this.isMarketingActivityId) {
            payData = await activityCreateApi(createOrderParam);
          } else {
            payData = await createOrderApi(createOrderParam);
          }
          const { data: response, code } = payData;
          if (code == 0) {
            let amount = this.isRenewal ? this.payAmount : response.orderMoney;
            let goPaymentSucceeded = this.isRenewal ? false : true;
            payInfo = {
              amount,
              ...response,
              ...this.payMode,
              goPaymentSucceeded,
            };
          }
        } else {
          payInfo = { amount: orderPaymentTotal, orderNo, goPaymentSucceeded: true, isOa: true, ...this.payMode };
        }

        // 统计专属链接与下单数据
        if (sessionStorage.getItem('promteCode')) {
          addOrderPromteCodeLink(orderNo || payInfo.orderNo, sessionStorage.getItem('promteCode'));
        }

        //oa Order Direct Payment
        if (isOA || (payData && payData.code == 0)) {
          // 国际支付
          if (this.payMethod === 'INTL_PAY') {
            this.intlPay(payInfo);
          } else {
            // 国内支付
            this.orderPay(
              isOA,
              invoiceDTO,
              payInfo,
              (createOrderParam && createOrderParam) || {},
              (payData && payData.response) || {}
            );
          }
        }
      } catch (error) {
        console.log(error);
        this.payLoading = false;
      }
    },

    orderPay(isOA, oaInvoiceDTO, payInfo, createOrderParam, payData) {
      if (this.payMode.payWayKey == 'CYCLE') {
        cyclePay(payInfo.orderNo);
      } else if (this.payMode.payWayKey == 'OFFLINE_PAYMENT') {
        let { orderMoney: orderPaymentMoney, orderNo } = payData;
        this.offineOrderinfo = {
          orderPaymentMoney,
          clientOrderProductVOList: this.serviceList,
          orderNo,
        };
        this.showOffine = true;
        this.payLoading = false;
      } else {
        let invoiceDTO = isOA ? oaInvoiceDTO : createOrderParam.invoiceDTO;
        userPay(
          'PC',
          this.serviceList,
          payInfo,
          (payResponse) => {
            this.$payMentDialogDom({ invoiceDTO, ...payResponse });
            totalShoppingCart().then((res) => {
              this.$store.commit('saveCarNumStatue', res.data);
            });
          },
          invoiceDTO
        );
      }
    },
    // 优惠券
    getCouponList() {
      let productInfoList = this.serviceList.map((item, index) => ({
        num: item.quantity || 1,
        productInfoId: item.productId || item.id || this.$route.query.skuId,
        price: item.price,
      }));
      let obj = {
        containsRenewalDiscountGoodsFlag: this.isRenewal
          ? this.serviceList.some((item) => item.activityType !== 0)
          : false,
        enterpriseId: this.enterpriseid,
        orderOldMoney: this.payAmount,
        productInfoList,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
        activityGoodsFlag: this.isMarketingActivityId ? true : false,
      };
      applyCoupponList(obj).then((res) => {
        if (res.code === 0) {
          this.couponList = res.data;
        }
      });
    },

    changeState(val) {
      let obj = {
        state: val,
        refresh: true,
      };
      this.$emit('changeState', obj);
    },
    changeStateUp(val) {
      this.unionType = val.state;
      val.type && this.changeState(false);
    },

    setInvoiceType(type) {
      //GENERAL:增值税普通发票 SPECIAL:增值税专用发票 NONE：不开票)
      const arr = ['NONE', 'SPECIAL', 'GENERAL'];
      return {
        invoiceType: type == 1 ? arr[0] : type == 4 ? arr[1] : arr[2],
        subjectType: type == 4 ? 'ENTERPRISE' : type == 2 ? 'PERSON' : type == '3' ? 'ENTERPRISE' : '',
      };
    },
    //续费服务区间处理
    renewalInterval(item) {
      let html = '';
      if (this.eprCode.includes(item.productFunctionCode)) {
        let years = item.renewLastTime.substr(0, 4);
        html = `${years}-01-01至${years}-12-31`;
      } else {
        html = `${moment(item.expirationTime).format('YYYY-MM-DD')}至${moment(item.expirationTime)
          .add(1, 'years')
          .format('YYYY-MM-DD')}`;
      }
      return html;
    },
    // 切换支付方式
    handleGetPayMethod(val) {
      this.payMethod = val;
      // if (val === 'INTL_PAY') {
      //   this.invoiceForm.invoiceType = '1';
      // }
    },
    // 国际支付
    intlPay(payInfo) {
      // 是否是线下打款
      if (this.payMode.payWayKey == 'INTL_OFF_PAYMENT') {
        this.showIntlOffline = true;
        this.payInfo = {
          ...payInfo,
          paymentChannel: this.payMode.payWayKey,
        };
        return;
      }
      // 唤起收银台
      let payParamsObj = {
        currency: this.currency.symbol,
        currencyCode: this.currency.value,
        enterpriseId: this.enterpriseid,
        payWayId: this.payMode.payWayId,
        encryptOrderNo: payInfo.encryptOrderNo,
        backUrl: 'backUrl',
        layoutHeader: false,
        layoutFooter: false,
      };
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
              window.clearInterval(this.intlPayTimer);
              this.$router.push({ path: this.orderListPath });
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
        amount: this.payAmount,
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
      clearInterval(this.intlPayTimer);
      this.intlPayTimer = null;
      this.showIntlVisible = false;
      this.$router.push({ path: this.orderListPath });
    },
    // 确认国际支付
    handleConfirmIntlPay() {
      clearInterval(this.intlPayTimer);
      this.intlPayTimer = null;
      this.showIntlVisible = false;
      this.$router.push({ path: this.orderListPath });
    },
    // 线下打款提交成功
    handleOfflineOk() {
      this.$router.push({ path: this.orderListPath });
    },
    // 线下打款取消
    handleOfflineCancel() {
      this.showIntlOffline = false;
      this.$router.push({ path: this.orderListPath });
    },
  },
  components: {
    paySuccess,
    userAgreement,
    TaxRate,
    PayModeCom,
    ItaxsUserAgreements,
    BarklyUserAgreement,
    OffinePay,
    userAgreement28,
    userAgreement29,
    userAgreement40,
    userAgreement51,
    EPRPreProduct,
    IntlOfflinePay,
    IntlPay,
  },
};
import userAgreement from './components/userAgreement';
import userAgreement28 from './components/userAgreement28';
import userAgreement29 from './components/userAgreement29';
import userAgreement51 from './components/userAgreement51';
import userAgreement40 from './components/userAgreement40.vue';
import BarklyUserAgreement from './components/agreement/sellBrskly/userAgreement.vue';
import ItaxsUserAgreements from './components/itaxsUserAgreements';
import paySuccess from './components/paySuccess';
import TaxRate from './../mixin/taxRate.js';
import PayModeCom from './components/payMode.vue';
import OffinePay from '../module/components/offinePay/offinePay.vue';
import {
  orderDetailApi,
  getDiscountAmount,
  createOrderApi,
  activityCreateApi,
  applyCoupponList,
  renewalPay,
  totalShoppingCart,
  rateCalculateAmount,
  getPayresultStatus,
} from './../api/shoppingCar';
import componentsMixin from './../mixin/componentsMixin';
import { userPay, cyclePay } from './../utils/orderPlayConfig';
import { addOrderPromteCodeLink } from './../api/common';
import IntlOfflinePay from '../module/components/intlOfflinePay';
import IntlPay from '../module/components/intlPay';
</script>

<style lang="less" scoped>
@import url('./index.less');

.primary-color {
  color: #00a3ff;
}
.serviceList-table {
  dt,
  dd {
    display: flex;
    width: 100%;
    text-align: center;
    align-items: center;
    > div {
      flex-grow: 2;
      width: 200px;
    }
    > span {
      flex-grow: 2;
      width: 200px;
    }
  }
  dt {
    height: 48px;
    background: #f0f0f0;
    color: #333;
    font-size: 14px;
  }
}
.product-name-sourOrder {
  width: 300px !important;
  margin-bottom: 10px;
  color: #333333;
  > span {
    float: left;
    text-align: right;
    padding-left: 10px;
    width: 113px;
    padding-right: 5px;
  }
  .product-info-sourOrder {
    float: left;
    width: 50%;
  }
}
.product-name-title {
  width: 300px !important;
}
.serviceName {
  width: 300px !important;
  padding: 20px 0px 20px 10px;
  display: flex;
  color: #333;
  .right {
    text-align: left;
    width: 138px;
    margin-left: 20px;

    p:nth-child(1) {
      color: #333333;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 13px;
      margin-top: -3px;
    }

    p:nth-child(2) {
      color: #999999;
      font-size: 12px;
      line-height: 18px;
    }
  }

  img {
    width: 84px;
    height: 73px;
  }
}
.product-info-sourOrder {
  text-align: left;
  .c999 {
    color: #999;
  }
}
.product-addition-spec {
  color: #999;
  > p {
    margin: 5px 0 0 0;
  }
}
.serviceList-goods {
  border-top: 1px solid #eee;
}

.etax-sureOrder {
  .top-contnet {
    .title {
      display: none;
    }
  }
}
.activityContent {
  font-size: 14px;
  color: #ff5f61;
  display: block;
  font-weight: normal;
}

//其它主题
.settingIconOrange {
  display: none;
}
.OrangeTheme {
  .settingIcon {
    display: none;
  }
  .settingIconOrange {
    display: inline-block;
  }
  .serviceList-table {
    dt {
      background: #ffdc87;
    }
  }
  .mainContent {
    ::v-deep .ivu-radio-inner:after {
      background-color: #f6b417 !important;
    }
    .settlement button {
      background: #f6b417;
      border-color: #f6b417;
    }
    .bottom-content .fl span {
      color: #f6b417;
    }
  }
}
.continued-years {
  font-weight: normal;
  padding: 2px 6px;
  background: #e3f1ff;
  border-radius: 2px;
  color: #3a7fff;
  margin-left: 5px;
}

.exchange-rate-tips {
  width: 90%;
  float: right;
  text-align: right;
  margin-right: 8px;
  font-size: 14px;
  color: #919498;
  margin-top: 8px;
}
</style>
