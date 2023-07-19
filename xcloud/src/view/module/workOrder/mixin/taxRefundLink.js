import { taxCustUserVatNumber } from '@/api/newApi/common';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
export default {
  data() {
    return {
      countryList: [],
    };
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          // 退税金额加后缀
          // if(item.keyName === 'refundMoney') {
          //   item.children = [{
          //     type:'template',
          //     slot: 'append',
          //     children: ['英镑']
          //   }]
          // }
          let company = this.countryList.find((c) => c.vatNumberServicesId === item.keyNameValue);
          // 公司中文名、公司英文名、VAT税号联动
          if (item.keyName === 'companyNameZh') {
            if (item.inputType === 5) {
              item.inputType = 'autoComplete';
              if (company) {
                item.keyNameValue = company.companyNameZh;
              }
              item.propData = this.countryList.map((c) => ({ value: c.companyNameZh }));
            }
            // item.options = this.countryList.map(i => ({
            //   label: i.companyNameZh,
            //   value: i.vatNumberServicesId,
            // }))
            item.update = (val, rule, fApi) => {
              let option = this.countryList.find((i) => i.companyNameZh === val);
              if (option) {
                fApi.setValue({
                  companyNameEn: option.companyNameEn,
                });
              }
            };
          }
          if (item.keyName === 'companyNameEn') {
            if (item.inputType === 5) {
              item.inputType = 'autoComplete';
              if (company) {
                item.keyNameValue = company.companyNameEn;
              }
              item.propData = this.countryList.map((c) => ({ value: c.companyNameEn }));
            }
            // item.options = this.countryList.map(i => ({
            //   label: i.companyNameEn,
            //   value: i.vatNumberServicesId,
            // }))
            item.update = (val, rule, fApi) => {
              let option = this.countryList.find((i) => i.companyNameEn === val);
              if (option) {
                fApi.setValue({
                  companyNameZh: option.companyNameZh,
                });
              }
            };
          }
          if (item.keyName === 'vatTaxNumber') {
            // item.disabled = true
            item.link = ['companyNameZh', 'companyNameEn'];
            item.update = (val, rule, fApi) => {
              let companyNameZh = fApi.getValue('companyNameZh');
              let country = this.countryList.find((i) => i.companyNameZh === companyNameZh);
              rule.value = country ? country.vatTaxNumber : val;
            };
          }
          // if(item.keyName !== 'vatTaxNumber') {
          // 切换禁用启用
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', this.info.currentNodeCode !== currentCodeEnum.NODE2 && this.info.currentNodeCode !== currentCodeEnum.NODE5);
          } else {
            item.disabled = this.info.currentNodeCode !== currentCodeEnum.NODE2 && this.info.currentNodeCode !== currentCodeEnum.NODE5;
          }
          // }
        });
      });
      return this.moduleList;
    },
    firstReviewData() {
      this.firstReview.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', this.info.currentNodeCode !== currentCodeEnum.NODE2);
          } else {
            item.disabled = this.info.currentNodeCode !== currentCodeEnum.NODE2;
          }
        });
      });
      return this.firstReview;
    },
  },
  methods: {
    // 获取国家信息
    getCountryList() {
      return new Promise((resolve) => {
        taxCustUserVatNumber({
          countryCode: this.countryCode,
          userId: this.userId,
        })
          .then((res) => {
            this.countryList = res.data;
          })
          .finally(() => {
            resolve();
          });
      });
    },
    translateReviewIntoSourceFileUrl(dataReview) {
      let temp = JSON.parse(JSON.stringify(dataReview));
      temp.forEach((item) => {
        item.columns.forEach((column) => {
          if (column.reView && JSON.stringify(column.reView) !== '{}') {
            column.sourceFileUrl = column.reView;
          }
          column.reView = '';
        });
      });
      return temp;
    },
  },
};
