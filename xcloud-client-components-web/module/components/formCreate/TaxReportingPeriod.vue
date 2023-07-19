<template>
  <div>
    <!-- v-show="(item.value === '1' && quarterlyReport) || (item.value === '2' && annualReport)" -->
    <a-select
      :value="currentVal"
      @change="changeValue"
      style="width:300px"
      @focus="periodFocus"
      :placeholder="formItem.placeHolder"
    >
      <a-select-option
        :value="item.value"
        v-for="item in formItem.infoJson.groups"
        :key="item.value"
        :class="{ selectOptionNone: (item.value === '1' && quarterlyReport) || (item.value === '2' && annualReport) }"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      currentVal: undefined,
      annualReport: false,
      quarterlyReport: false,
      isOpen: false,
    };
  },
  mounted() {},
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        if (val) {
          this.currentVal = val;
        } else {
          this.currentVal = undefined;
        }
      },
    },
  },
  methods: {
    changeValue(val) {
      this.currentVal = val;
      this.isOpen = false;
      this.$emit('input', this.currentVal);
      if (this.formItem.keyName === 'declarePeriod') {
        this.fApi.setValue({ currentDeclarePeriod: val });
      }
      if (this.formItem.keyName === 'currentDeclarePeriod') {
        let dateString = this.fApi.getValue('lastDeclarePeriod')[1];
        if (dateString) {
          if (val === '1') {
            let startNextDateString = moment(dateString)
              .add(1, 'M')
              .format('YYYY-MM');
            let endNextDateString = moment(dateString)
              .add(3, 'M')
              .format('YYYY-MM');
            this.fApi.setValue({
              nextDeclarePeriod: [],
            });
          } else if (val === '2') {
            let startNextDateString = moment(dateString)
              .add(1, 'M')
              .format('YYYY-MM');
            let endNextDateString = moment(dateString)
              .add(12, 'M')
              .format('YYYY-MM');
            this.fApi.setValue({
              nextDeclarePeriod: [],
            });
          } else {
            let nextDateString = moment(dateString)
              .add(1, 'M')
              .format('YYYY-MM');
            this.fApi.setValue({
              nextDeclarePeriod: [],
            });
          }
        }
      } else {
        this.fApi.setValue({ lastDeclarePeriod: [], nextDeclarePeriod: [] });
      }
      this.fApi.validateField('declarePeriod');
      this.fApi.validateField('currentDeclarePeriod');
    },
    //获得焦点
    periodFocus() {
      if (this.formItem.keyName === 'currentDeclarePeriod') {
        this.quarterlyReport = false;
        this.annualReport = false;
        let dateString = this.fApi.getValue('lastDeclarePeriod')[1];
        console.log(dateString, 'dateString');
        if (dateString) {
          let month = moment(dateString).month() + 1;
          if (![3, 6, 9, 12].includes(month)) {
            this.quarterlyReport = true;
          }
          if (![12].includes(month)) {
            this.annualReport = true;
          }
        }
      }
    },
  },
};
</script>

<style lang="less">
.selectOptionNone {
  // display: none;
}
</style>
