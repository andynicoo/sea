<template>
  <div>
    <div class="pay-radio" style="height: 0px; overflow: hidden;">
      <!-- <span>支付方式</span> -->
      <div>
        <a-radio-group disabled v-model="payMethod" :options="payMethodOptions" @change="handleChangePayMethod" />
      </div>
    </div>
    <div class="payType clearfix">
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
    <div class="pay-radio">
      <div class="currency" v-if="payMethod === 'INTL_PAY'">
        <span class="currency-lable">选择币种</span>
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
        <span v-if="currencyInfo.value !== 'CNY' && afterCurrencyVal !== 'CNY'"
          >1{{ currencyInfo.label }} ≈ {{ exchangeRateVal }}人民币<a-tooltip>
            <template slot="title"> 实时参考汇率，最终支付以各大银行结算汇率为准！ </template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { getPayMethod } from '../../api/payment/index.js';
const PALYMODE = [
  {
    name: '微信',
    src: require('@/assets/images/sureOrder/wx-pay.png'),
    active: true,
    current: 1,
    imgkey: 'WECHAT',
  },
  {
    name: '支付宝',
    src: require('@/assets/images/sureOrder/zfb-pay.png'),
    active: false,
    current: 2,
    imgkey: 'ALIPAY',
  },
  {
    name: '银联',
    src: require('@/assets/images/sureOrder/yi_bank.svg'),
    active: false,
    current: 3,
    imgkey: 'EBANK',
  },
  {
    name: '银行卡',
    src: require('@/assets/images/sureOrder/yi_bank.svg'),
    active: false,
    current: 3,
    imgkey: 'WECHAT',
  },
  {
    name: '银联国际',
    src: require('@comp/images/sureOrder/yl-pay.png'),
    active: false,
    current: 3,
    imgkey: 'AIRWALLEX_CARD',
  },
  {
    name: '空中云汇',
    src: require('@comp/images/sureOrder/AIRWALLEX_AIRWALLEX_PAY.svg'),
    active: false,
    current: 3,
    imgkey: 'AIRWALLEX_AIRWALLEX_PAY',
  },
];
const OFFLINEPAY = {
  applyPort: 'PC',
  payWayId: '',
  channelType: 'INTL_PAY',
  payWayKey: 'OFFLINE_PAYMENT',
  payWayName: '线下打款',
};
export default {
  name: 'PayModeCom',
  props: ['invoiceType', 'orderPaidMoney', 'size', 'exchangeRate', 'afterCurrency', 'payMethodParams'], //small  medium
  data() {
    return {
      list: [],
      active: 0,
      payKey: this.list ? this.list[0] : {},
      payModeList: [],
      payMethodOptions: [
        { label: '国内支付', value: 'CHN_PAY' },
        { label: '国际支付', value: 'INTL_PAY' },
      ],
      payMethod: 'CHN_PAY',
      currency: 'USD',
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
      currencyInfo: {},
      exchangeRateVal: '',
      afterCurrencyVal: '',
    };
  },
  computed: {
    sizeStyle() {
      return !this.size ? 'medium' : this.size;
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
    invoiceType(val) {
      this.inviocePay(val);
    },
    exchangeRate: {
      handler: function(val) {
        this.exchangeRateVal = val;
      },
    },
    afterCurrency: {
      handler: function(val) {
        this.afterCurrencyVal = val;
      },
    },
  },
  methods: {
    setModeImg(val) {
      let result = this.getPayModeItem(val);
      console.log(result, val, '999');
      if (val === 'OFFLINE_PAYMENT' && this.payMethod === 'INTL_PAY') {
        return require('@comp/assets/images/pay/INTL_OFF_PAYMENT.svg');
      }
      return result ? result.src : require('@/assets/images/sureOrder/yi_bank.svg');
    },

    getPayModeItem(val) {
      return PALYMODE.find((item) => val.includes(item.imgkey));
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
    inviocePay(val) {
      if (val == 3 || val == 4) {
        this.list = this.payModeList.filter((item) => item.payWayKey.includes('ENTERPRISE_EBANK'));
      } else {
        this.list = this.payModeList.filter((item) => item.channelType === 'CHN_PAY');
      }
    },
    // 改版支付方式
    handleChangePayMethod(e, value) {
      let val = e ? e.target.value : value;
      this.active = 0;
      this.payMethod = val;
      this.$emit('getPayMethod', val);
      let tempList = this.payModeList;
      this.list = tempList.filter((item) => item.channelType === val);
      // 是国际支付时，自动计算一次金额
      if (val === 'INTL_PAY') {
        this.currencyInfo = this.currencyList.find((o) => o.value === this.currency);
        this.$emit('calculate', this.currencyInfo);
      }
    },
    // 改变币种
    handleChangeCurrency(val) {
      this.currency = val;
      this.currencyInfo = this.currencyList.find((o) => o.value === val);
      this.$emit('calculate', this.currencyInfo);
    },
  },
  render(h) {
    let dom = this.list.map((item, index) => {
      return h(
        'div',
        {
          class: `typeBox pay-item ${this.sizeStyle} ${index == this.active ? 'active' : ''} ${
            this.sizeStyle == 'small' ? 'active-small' : ''
          } `,
          on: {
            click: (e) => this.changeMethod(index),
          },
        },
        [
          h('img', {
            domProps: {
              src: this.setModeImg(item.payWayKey),
            },
          }),
          item.payWayName,
        ]
      );
    });
    let template = h('div', { class: `payType clearfix ` }, [
      h('span', { class: 'fl' }, '支付方式'),
      h('div', { class: 'pay-list' }, dom),
      h('div', { class: 'tips' }, this.invoiceType == 3 || this.invoiceType == 4 ? TIPS : ''),
    ]);
    return template;
  },

  async created() {
    let { data } = await getPayMethod(29);
    let filterPayKeys = ['WECHAT_MINI_PROGRAM', 'WECHAT_H5', 'WECHAT_OFFICIAL_ACCT'];
    this.payModeList = data.filter((item) => item.applyPort.includes('PC') && !filterPayKeys.includes(item.payWayKey));
    this.payModeList.push(OFFLINEPAY);
    this.inviocePay(this.invoiceType);
    this.list = this.payModeList.filter((item) => item.channelType === 'CHN_PAY');
    this.handleChangePayMethod('', this.payMethodParams);
  },
};
</script>

<style lang="less">
span.fl {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-right: 16px;
  display: inline-block;
  height: 58px;
  line-height: 58px;
}
.currency-lable {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-right: 16px;
  display: inline-block;
}

.payType {
  // display: grid;
  // grid-template-columns: ;
  .typeBox {
    background: rgba(153, 153, 153, 0.14);
    border-radius: 4px;
    margin-right: 12px;

    font-family: PingFangSC;
    color: #333333;
    text-align: center;
    cursor: pointer;

    & img {
      vertical-align: middle;
      margin-right: 6px;
    }
  }
  & .active {
    background: url('../../assets/images/sureOrder/check.png') no-repeat;
    background-position: right bottom;
    background-color: #ffffff;
    border-radius: 4px;
    border: 1px solid #00a3ff;
    color: #00a3ff;
  }
  .active-small {
    background-size: 20px !important;
  }
}
.payType.intl {
  padding-left: 85px;
  .fl {
    font-size: 14px;
  }
}
.pay-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
}

.small {
  padding: 3px;
}
.tips {
  margin-top: 5px;
  color: #7f7f7f;
}
.pay-item {
  margin-top: 8px;
  min-width: 110px;
}
.medium {
  padding: 10px;
  font-size: 13px;
}
.pay-radio {
  font-size: 14px;
  display: flex;
  > :first-child {
    margin-right: 30px;
  }
  > div {
    margin-bottom: 15px;
  }
  .currency {
    margin-top: 10px;
    padding: 10px 0 0;
    > span {
      // margin-right: 12px;
    }
    .select {
      width: 138px;
    }
  }
}
</style>
