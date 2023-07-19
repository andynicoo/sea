import { taxRate } from '../../api/shoppingCar/shoppingCar';
import util from '@/utils/util';
export default {
  name: 'TaxCom',
  props: ['contractTypeEM', 'orderPaidMoney', 'payMethodParams'],
  data() {
    return {
      rateList: [],
    };
  },
  computed: {
    taxes() {
      let { rateList } = this;
      let item = rateList && rateList.find((item) => item.type == this.contractTypeEM);
      let taxRate = (item && item.taxRate) || 0;
      let num = util.formatDecimal(util.floatMultiply(taxRate, this.orderPaidMoney), 2) || '0';
      console.log(num, taxRate, this.orderPaidMoney, '999');
      //国际支付单税率是0：this.payMethodParams !== 'INTL_PAY'
      return this.contractTypeEM !== 'NONE' && this.payMethodParams !== 'INTL_PAY' ? num : '0';
    },
  },
  watch: {
    taxes: function(val) {
      this.$emit('change', val);
    },
  },
  render(h) {
    return h('span', {}, this.taxes);
  },

  async created() {
    let { data: rateList } = await taxRate();
    console.log(rateList);
    this.rateList = rateList;
  },
};
