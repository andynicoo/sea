<template>
  <div>
    <div class="pay-radio">
      <span>支付方式</span>
      <div>
        <a-radio-group v-model="payMethod" :options="payMethodOptions" @change="handleChangePayMethod" />
      </div>
    </div>

    <div :class="`payType clearfix ${payMethod === 'INTL_PAY' ? 'intl' : ''}`">
      <span class="fl">支付方式</span>
      <div class="pay-list">
        <div
          :class="
            `typeBox pay-item ${sizeStyle} ${index == active ? 'active' : ''} ${
              sizeStyle == 'small' ? 'active-small' : ''
            } `
          "
          v-for="(item, index) in list"
          :key="index"
          @click="changeMethod(index, item.payWayKey)"
        >
          <img :src="setModeImg(item.payWayKey)" />
          {{ item.payWayName }}
        </div>
      </div>
      <!-- <div class="tips">
        {{
          invoiceType == 3 || invoiceType == 4
            ? '注：根据税务规定，开具发票只能主体一致，公司开票只能用企业网银支付'
            : ''
        }}
      </div> -->
    </div>
    <div class="pay-radio select-currency">
      <div>
        <div class="currency" v-if="payMethod === 'INTL_PAY'">
          <span>选择币种</span>
          <a-select
            @change="handleChangeCurrency"
            class="select"
            :value="currency"
            :disabled="['AIRWALLEX_ALIPAYCN', 'AIRWALLEX_WECHATPAY'].includes(selectMethodCode)"
          >
            <a-select-option v-for="(item, index) in currencyList" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
          <span v-if="!isQuota && currency !== 'CNY'"
            >1{{ currencyLabel }} ≈ {{ foreignInfo.exchangeRate }}人民币
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
  </div>
</template>
<script>
import { getPayMode, queryUserTransferAccountInfo } from '../../api/shoppingCar/index';
import { getInfo } from '../../api/user/index';
const PALYMODE = [
  {
    name: '微信',
    src: require('../../assets/images/pay/wx-pay.svg'),
    active: true,
    imgkey: 'WECHAT',
  },
  {
    name: '支付宝',
    src: require('../../assets/images/pay/zfb-pay.svg'),
    active: false,
    imgkey: 'ALIPAY',
  },
  {
    name: '银联',
    src: require('../../assets/images/pay/yI-bank.svg'),
    active: false,
    imgkey: 'EBANK',
  },
  {
    name: '银行卡',
    src: require('../../assets/images/pay/yI-bank.svg'),
    active: false,
    imgkey: 'WECHAT',
  },
  {
    name: '周期结算',
    src: require('../../assets/images/pay/yI-bank.svg'),
    active: false,
    imgkey: 'CYCLE',
  },
  {
    name: '转账支付',
    src: require('../../assets/images/pay/OFFLINE_PAYMENT.svg'),
    active: false,
    imgkey: 'OFFLINE',
  },
  {
    name: '银联国际',
    src: require('../../assets/images/pay/AIRWALLEX_CARD.svg'),
    active: false,
    imgkey: 'AIRWALLEX_CARD',
  },
  {
    name: '空中云汇',
    src: require('../../assets/images/pay/AIRWALLEX.svg'),
    active: false,
    imgkey: 'AIRWALLEX_AIRWALLEX_PAY',
  },
  {
    name: '线下打款',
    src: require('../../assets/images/pay/INTL_OFF_PAYMENT.svg'),
    active: false,
    imgkey: 'INTL_OFF_PAYMENT',
  },
];
const CHANNELPAY = {
  applyPort: 'PC',
  payWayId: '',
  payWayKey: 'CYCLE',
  payWayName: '周期结算',
};
const OFFLINEPAY = {
  applyPort: 'PC',
  payWayId: '',
  channelType: 'INTL_PAY',
  payWayKey: 'INTL_OFF_PAYMENT',
  payWayName: '线下打款',
};
export default {
  name: 'PayModeCom',
  props: {
    invoiceType: [String, Number], //发票类型
    size: {
      type: String,
      default: 'medium',
    },
    orderSource: Boolean, //订单来源
    showChanaPay: Boolean, // 是否展示渠道周期支付
    source: String, //组件引用在哪里 , source 不准确, 应该使用 quote
    foreignInfo: Object,
  },
  data() {
    return {
      list: [],
      active: 0,
      payKey: this.list ? this.list[0] : {},
      payModeList: [],
      channelUserType: 0,
      userInfo: {},
      payMethodOptions: [{ label: '国内支付', value: 'CHN_PAY' }],
      payMethod: 'CHN_PAY',
      currency: 'USD',
      currencyLabel: '美元',
      selectMethodCode: '',
      currencyList: [
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
    };
  },
  computed: {
    sizeStyle() {
      return !this.size ? 'medium' : this.size;
    },

    isCyacle() {
      if (this.userInfo) {
        let { settlementCycle, userChannel } = this.userInfo;
        return (
          (userChannel == 2 || userChannel == 3) &&
          (settlementCycle == 'MONTH_SETTLEMENT' || settlementCycle == 'WEEK_SETTLEMENT')
        );
      } else {
        this.$router.push({ path: `/login` });
      }
    },
    // 是否有限额，汇率无法换算
    isQuota() {
      return this.currency !== this.foreignInfo.afterCurrency && this.foreignInfo.afterCurrency === 'CNY';
    },
  },

  watch: {
    payKey: {
      handler: function(val) {
        this.$emit('getPayMode', val);
      },
      deep: true,
      immediate: true,
    },

    list(val) {
      this.payKey = val[0];
    },

    /**切换发票类型时做一些改变 */
    invoiceType(val) {
      let cycle = this.payModeList.findIndex((item) => item.payWayKey == 'CYCLE');
      this.isCyacle && cycle == -1 && this.userInfo.enterpriseId == 42 && this.payModeList.push(CHANNELPAY);
      if (val == 3 || val == 4) {
        // 如果是公司和普通增值税发票，只能用支付宝、微信、个人网银、企业银联
        const filterPayKeys3 = [
          'ALIPAY_SCAN_CODE',
          'WECHAT_SCAN_CODE',
          'PERSONAL_EBANK',
          'OFFLINE_PAYMENT',
          'ENTERPRISE_EBANK',
        ];
        const filterPayKeys4 = ['ENTERPRISE_EBANK', 'OFFLINE_PAYMENT'];
        let keys = val == 3 ? filterPayKeys3 : filterPayKeys4;
        let arr = this.payModeList.filter((item) => keys.includes(item.payWayKey));
        this.isCyacle && arr.push(CHANNELPAY);
        this.list = arr;
      } else {
        this.list = this.payModeList;
      }
    },

    foreignInfo: {
      handler: function(val) {
        this.currencyLabel = this.currencyList.find((o) => o.value === val.afterCurrency).label;
      },
      deep: true,
    },
  },
  methods: {
    /** 设置不同付款方式的图标*/
    setModeImg(val) {
      let result = PALYMODE.find((item) => val.includes(item.imgkey));
      return result ? result.src : '@/assets/images/sureOrder/wx-pay.png';
    },

    /**选择付款方式 */
    changeMethod(idx, payWayKey) {
      this.active = idx;
      this.payKey = this.list[idx];
      this.selectMethodCode = payWayKey;
      if (['AIRWALLEX_ALIPAYCN', 'AIRWALLEX_WECHATPAY'].includes(payWayKey)) {
        this.handleChangeCurrency('CNY');
      } else {
        this.handleChangeCurrency('USD');
      }
    },

    /** 初始化添加周期支付*/
    addChannelPay() {
      if (this.source == 'buy') {
        this.isCyacle && this.list.push(CHANNELPAY);
      } else {
        if (this.isCyacle && this.showChanaPay && this.orderSource) {
          this.list.push(CHANNELPAY);
        }
      }
    },

    inviocePay() {
      if (this.invoiceType == 3 || this.invoiceType == 4) {
        this.payModeList = this.payModeList.filter((item) => {
          if (this.userInfo.enterpriseId == 42) {
            return item.payWayKey.includes('ENTERPRISE_EBANK') || item.payWayKey.includes('OFFLINE_PAYMENT');
          } else {
            return item.payWayKey.includes('ENTERPRISE_EBANK');
          }
        });
      }
    },
    async chennelPay() {
      const accountInfo = await queryUserTransferAccountInfo(this.userInfo.userId);
      if (Object.keys(accountInfo.data).length == 0) {
        this.payModeList = this.payModeList.filter((item) => item.payWayKey != 'OFFLINE_PAYMENT');
      }
    },
    // 改变支付方式
    handleChangePayMethod(e) {
      this.active = 0
      let val = e.target.value;
      this.payMethod = val;
      this.$emit('getPayMethod', val);
      let tempList = this.payModeList;
      this.list = tempList.filter((item) => item.channelType === val);
      // 是国际支付时，自动计算一次金额
      if (val === 'INTL_PAY') {
        let currencyInfo = this.currencyList.find((o) => o.value === this.currency);
        this.$emit('calculate', currencyInfo);
      }
    },
    // 改变币种
    handleChangeCurrency(val) {
      this.currency = val;
      let currencyInfo = this.currencyList.find((o) => o.value === val);
      this.$emit('calculate', currencyInfo);
    },

    // 把银联国际支付方式放首位
    changePayModeList() {
      let index = this.payModeList.findIndex((o) => o.payWayKey === 'AIRWALLEX_CARD');
      if (index !== -1) {
        let AIRWALLEX_CARD = this.payModeList.splice(index, 1);
        this.payModeList = [...AIRWALLEX_CARD, ...this.payModeList];
      }
    },
  },

  async created() {
    try {
      const userinfo = await getInfo();
      this.userInfo = userinfo.data;
      const payMode = await getPayMode();
      const filterPayKeys = ['WECHAT_MINI_PROGRAM', 'WECHAT_H5', 'WECHAT_OFFICIAL_ACCT'];
      this.payModeList = payMode.data.filter(
        (item) => item.applyPort.includes('PC') && !filterPayKeys.includes(item.payWayKey)
      );
      this.changePayModeList();
      this.payModeList.push(OFFLINEPAY);
      // this.inviocePay();
      this.userInfo.enterpriseId == 42 && this.chennelPay();
      this.list = this.payModeList.filter((item) => item.channelType === 'CHN_PAY');
    } catch (error) {
      console.log(error);
    }
    this.userInfo.enterpriseId == 42 && this.addChannelPay();
    if ([29, 30].includes(this.userInfo.enterpriseId) && this.$route.query.type !== 'oa') {
      this.payMethodOptions = [
        { label: '国内支付', value: 'CHN_PAY' },
        { label: '国际支付', value: 'INTL_PAY' },
      ];
    }
  },
};
</script>

<style lang="less">
@import url(./less/payMode.less);
</style>
