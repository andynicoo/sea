<template>
  <div>
    <a-select
      class="countries-select"
      :value="countriesCode"
      style="width: 180px"
      @change="countriesChange"
      show-search
      option-filter-prop="children"
      :filter-option="filterOption"
    >
      <a-select-option v-for="item in globalRoaming" :value="item.short" :key="item.short">
        {{ item.name }}
      </a-select-option> </a-select
    ><a-input
      :value="companyPhoneVal"
      class="company-phone"
      :addon-before="'+' + countriesTel"
      :placeholder="formItem.placeHolder"
      style="width: 310px"
      @change="companyPhoneChange"
      @blur="blurHandle"
    />
  </div>
</template>

<script>
import { globalRoaming } from '@comp/utils/globalRoaming.js';
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      globalRoaming,
      companyPhoneVal: '',
      countriesCode: 'CN',
      countriesTel: '86',
    };
  },
  mounted() {
    this.companyPhoneVal = this.value;
    let vorwahlNational = this.fApi.getValue('vorwahlNational');
    if (vorwahlNational && vorwahlNational.length) {
      this.countriesTel = vorwahlNational;
      this.countriesCode = this.globalRoaming.filter((item) => item.tel === vorwahlNational)[0].short;
      this.countriesChange(this.countriesCode);
      this.fApi.setValue({
        vorwahlNational: this.fApi.getValue('vorwahlNational'),
      });
    } else {
      this.fApi.setValue({
        vorwahlNational: this.countriesTel,
      });
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    //切换国家
    countriesChange(val) {
      this.countriesCode = val;
      this.countriesTel = this.globalRoaming.filter((item) => item.short === val)[0].tel;
      //设置国际区号
      this.fApi.setValue({
        vorwahlNational: this.countriesTel,
      });
      if (this.countriesTel === '86') {
        console.log(this.countriesTel);
        this.fApi.updateValidate('companyTel', [
          {
            type: 'string',
            required: this.formItem.isNeed,
            message: this.formItem.keyLabel + '不能为空',
            trigger: 'blur',
          },
          {
            type: 'string',
            message: '只能输入数字，请重新输入',
            pattern: /^\d+$/,
            trigger: 'blur',
          },
          {
            type: 'string',
            message: '您填写的联系电话少于11位/超出11位，请重新填写',
            pattern: /^\d{11}$/,
            trigger: 'blur',
          },
        ]);
      } else {
        console.log(this.countriesTel);
        this.fApi.updateValidate('companyTel', [
          {
            type: 'string',
            required: this.formItem.isNeed,
            message: this.formItem.keyLabel + '不能为空',
            trigger: 'blur',
          },
          {
            type: 'string',
            message: '只能输入数字，请重新输入',
            pattern: /^\d+$/,
            trigger: 'blur',
          },
        ]);
      }
      this.$nextTick(() => {
        this.fApi.validateField('companyTel');
      });
    },
    //输入电话
    companyPhoneChange(e) {
      this.companyPhoneVal = e.target.value;
      this.$emit('input', this.companyPhoneVal);
    },
    //失去焦点触发校验
    blurHandle() {
      this.fApi.validateField('companyTel');
    },
  },
};
</script>

<style lang="less" scoped>
.company-phone {
  margin-left: 16px;
}
.countries-select {
  /deep/.ant-select-selection {
    width: auto !important;
  }
}
</style>
