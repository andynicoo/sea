import { invoiceTaxRateApi } from '../api/shoppingCar';
import componentsMixin from './componentsMixin';
export default {
  name: 'TaxCom',
  props: ['contractTypeEM', 'orderPaidMoney', 'discAmountMoney'],
  mixins: [componentsMixin],
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
      let discount = this.countSum([this.orderPaidMoney, -this.discAmountMoney]);
      let num = this.formatDecimal(this.floatMultiply(taxRate, discount < 0 ? 0 : discount), 2) || '0';
      this.$emit('getTaxRate', taxRate);
      return this.contractTypeEM != 'NONE' ? num : '0';
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
    let { data: rateList } = await invoiceTaxRateApi();
    this.rateList = rateList;
  },
};
