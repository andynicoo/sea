<template>
  <div>
    <div :class="`payType clearfix`">
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
          @click="changeMethod(index)"
        >
          <img :src="setModeImg(item.payWayKey)" />
          {{ item.payWayName }}
        </div>
      </div>
      <div class="tips">
        {{
          invoiceType == 3 || invoiceType == 4
            ? '注：根据税务规定，开具发票只能主体一致，公司开票只能用企业网银支付'
            : ''
        }}
      </div>
    </div>
    <div class="pay-radio">
      <div>
        <a-radio-group
          v-model="payMethod"
          :options="payMethodOptions"
          @change="handleChangePayMethod"
          class="radio-group"
        />
        <div class="currency" v-if="payMethod === 'INTL_PAY' && !isInvoice">
          <span>选择币种</span>
          <a-select @change="handleChangeCurrency" class="select" :value="currency" :disabled="disabled">
            <a-select-option v-for="(item, index) in currencyList" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
          <span v-if="!isQuota"
            >1{{ currencyLabel }} ≈ {{ foreignInfo.exchangeRate }}人民币
            <a-tooltip placement="top">
              <template slot="title">
                <span>实时参考汇率，最终支付以各大银行结算汇率为准！</span>
              </template>
              <a-icon type="question-circle" theme="filled" style="cursor: pointer;" />
            </a-tooltip>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPayMode } from '../../api/shoppingCar/shoppingCar';
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
    src: require('@/assets/images/sureOrder/yI-bank.svg'),
    active: false,
    current: 3,
    imgkey: 'EBANK',
  },
  {
    name: '银行卡',
    src: require('@/assets/images/sureOrder/yI-bank.svg'),
    active: false,
    current: 3,
    imgkey: 'WECHAT',
  },
  {
    name: '银联国际',
    src: require('@/assets/images/sureOrder/AIRWALLEX_CARD.svg'),
    active: false,
    imgkey: 'AIRWALLEX_CARD',
  },
  {
    name: '空中云汇',
    src: require('@/assets/images/sureOrder/AIRWALLEX.svg'),
    active: false,
    imgkey: 'AIRWALLEX_AIRWALLEX_PAY',
  },
  {
    name: '线下打款',
    src: require('@/assets/images/sureOrder/INTL_OFF_PAYMENT.svg'),
    active: false,
    imgkey: 'INTL_OFF_PAYMENT',
  },
];
const OFFLINEPAY = {
  applyPort: 'PC',
  payWayId: '',
  channelType: 'INTL_PAY',
  payWayKey: 'INTL_OFF_PAYMENT',
  payWayName: '线下打款',
};
export default {
  name: 'PayModeCom',
  props: ['invoiceType', 'orderPaidMoney', 'size', 'foreignInfo', 'orderInfo', 'isInvoice'], //small  medium
  data() {
    return {
      list: [],
      active: 0,
      payKey: this.list ? this.list[0] : {},
      payModeList: [],
      payMethodOptions: [{ label: '国内支付', value: 'CHN_PAY' }, { label: '国际支付', value: 'INTL_PAY' }],
      payMethod: (this.isInvoice ? 'CHN_PAY' : this.orderInfo.payMethod) || 'CHN_PAY',
      currency: 'USD',
      currencyLabel: '美元',
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
      disabled: false,
    };
  },
  computed: {
    cnyPayKeys() {
      return ['AIRWALLEX_ALIPAYCN', 'AIRWALLEX_WECHATPAY'];
    },
    sizeStyle() {
      return !this.size ? 'medium' : this.size;
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
    invoiceType(val) {
      this.inviocePay(val);
    },
    foreignInfo: {
      handler: function(val) {
        this.currencyLabel = this.currencyList.find((o) => o.value === val.afterCurrency).label;
      },
      deep: true,
    },
  },
  methods: {
    setModeImg(val) {
      let result = this.getPayModeItem(val);
      return result ? result.src : '@/assets/images/sureOrder/wx-pay.png';
    },

    getPayModeItem(val) {
      return PALYMODE.find((item) => val.includes(item.imgkey));
    },
    /**选择付款方式 */
    changeMethod(idx) {
      const cnyPayKeys = this.cnyPayKeys;
      this.active = idx;
      this.payKey = this.list[idx];
      if (cnyPayKeys.includes(this.payKey.payWayKey)) {
        this.handleChangeCurrency('CNY');
        this.disabled = true;
      } else {
        this.handleChangeCurrency('USD');
        this.disabled = false;
      }
    },
    inviocePay(val) {
      if (val == 3 || val == 4) {
        this.list = this.payModeList.filter((item) => item.payWayKey.includes('ENTERPRISE_EBANK'));
      } else {
        this.list = this.payModeList.filter((item) => item.channelType === 'CHN_PAY');
      }
    },
    // 改变支付方式
    handleChangePayMethod(e) {
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
  },

  async created() {
    let { data } = await getPayMode();
    let filterPayKeys = ['WECHAT_MINI_PROGRAM', 'WECHAT_H5', 'WECHAT_OFFICIAL_ACCT'];
    this.payModeList = data.filter((item) => item.applyPort.includes('PC') && !filterPayKeys.includes(item.payWayKey));
    this.payModeList.push(OFFLINEPAY);
    this.inviocePay(this.invoiceType);
    this.list = this.payModeList.filter((item) => item.channelType === this.payMethod);
    if (this.payMethod === 'INTL_PAY') {
      let currencyInfo = this.currencyList.find((o) => o.value === this.currency);
      this.$emit('calculate', currencyInfo);
    }
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

.payType {
  .fl {
    font-size: 14px;
  }
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
  .radio-group {
    height: 0;
    overflow: hidden;
    display: none;
  }
  > :first-child {
    margin-right: 30px;
  }
  > div {
    margin-bottom: 15px;
  }
  .currency {
    margin-top: 10px;
    padding: 10px 0 0;
    span {
      margin-right: 12px;
    }
    .select {
      width: 138px;
    }
  }
}
</style>
