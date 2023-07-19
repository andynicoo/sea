import { getTaxCountry } from '@/api/taxService/common.js';
import * as extendsAPI from "@/api/extends/facilitatorAndTax";
export default {
  data() {
    return {
      selectList: [],
      countryList: [],
      taxManagerList: [],
      taxManagerModalList: [],
      facilitatorList: [],
    }
  },
  methods: {
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    // 获取税务经理下拉
    getTaxManagerList() {
      let self = this;
      extendsAPI.taxManagerList()
        .then((res) => {
          if (res.code == 0) {
            self.taxManagerModalList = res.data.map(el => {
              return {
                key: el.userId,
                id: el.userId,
                name: el.nickName,
              };
            });
            // 最前面放一个空的，用于筛选什么都没有的
            self.taxManagerList = res.data.map(el => {
              return {
                key: el.userId,
                id: el.userId,
                name: el.nickName,
              };
            });
            self.taxManagerList.unshift({
              key: '',
              id: '无',
              name: '空',
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 根据国家获取服务商下拉
    countryChange(countryCode) {
      let self = this;
      if (!!countryCode) {
        let params = {
          countryCode,
          supplierType: 1, //注册和转代理都是vat
        };
        extendsAPI.getSupplierCondition(params)
          .then((res) => {
            if (res.code == 0) {
              self.facilitatorList = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        self.facilitatorList = [];
        self.searchForm.supplierId = '';
      }
    },
    // 选择
    selectChange(val) {
      this.selectList = val
    },
    // 修改服务商
    extendsEditSupplier(params) {
      return extendsAPI.batchUpdateServicesSupplier(params);
    },
    // 修改税务经理(批量)
    extendsClaimTaxManager(params) {
      return extendsAPI.batchUpdateServicesTaxManager(params);
    },
    // 认领税务经理
    orderServiceClaimTaxManager(params){
      return extendsAPI.orderServiceClaimTaxManager(params);
    },
    // 认领税务经理(增值服务)
    applyServicesClaimTaxManager(params){
      return extendsAPI.applyServicesClaimTaxManager(params);
    },
  },
  created() {
    this.getTaxManagerList();
    this.getCountryList();
  },
}
