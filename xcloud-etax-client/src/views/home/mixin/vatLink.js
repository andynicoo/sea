import {taxCustUserVatNumber} from '@/api/taxInspection'
export default {
  data() {
    return {
      countryList: []
    }
  },
  computed: {
    dataReview() {
      this.moduleList.forEach(pro => {
        pro.columns.forEach(item => {
          // 退税金额加后缀
          // if(item.keyName === 'refundMoney') {
          //   item.children = [{
          //     type:'span',
          //     slot: 'append',
          //     children: ['英镑']
          //   }]
          // }
          // 公司中文名、公司英文名、VAT税号联动
          if(item.keyName === 'companyNameZh') {
            item.options = this.countryList.map(i => ({
              label: i.companyNameZh,
              value: i.vatNumberServicesId,
            }))
            item.update = (val, rule, fApi)=>{
              let option = item.options.find(i => i.value === val)
              if(option) {
                fApi.setValue({
                  companyNameEn: val
                })
              } else {
                fApi.set(rule.props, 'label', val)
                setTimeout(() => {
                  let vm = fApi.el(item.keyName)
                  vm.setQuery(val)
                  vm.visible = false
                })
              }
            }
          }
          if(item.keyName === 'companyNameEn') {
            item.options = this.countryList.map(i => ({
              label: i.companyNameEn,
              value: i.vatNumberServicesId,
            }))
            item.update = (val, rule, fApi)=>{
              let option = item.options.find(i => i.value === val)
              if(option) {
                fApi.setValue({
                  companyNameZh: val
                })
              } else {
                fApi.set(rule.props, 'label', val)
                setTimeout(() => {
                  let vm = fApi.el(item.keyName)
                  vm.setQuery(val)
                  vm.visible = false
                })
              }
            }
          }
          if(item.keyName === 'vatTaxNumber') {
            item.disabled = true
            item.link = ['companyNameZh', 'companyNameEn']
            item.update = (val, rule, fApi)=>{
              let vatNumberServicesId = fApi.getValue('companyNameZh')
              let country = this.countryList.find(i => i.vatNumberServicesId === vatNumberServicesId)
              rule.value = country ? country.vatTaxNumber : val
            }
          }
          if(item.keyName !== 'vatTaxNumber') {
            // 切换禁用启用
            if(!item.hasOwnProperty('disabled')) {
              this.$set(item, 'disabled', !this.isEdit)
            } else {
              item.disabled = !this.isEdit
            }
          }
        })
      })
      return this.moduleList
    }
  },
  methods: {
    // 获取国家信息
    getCountryList() {
      return new Promise(resolve => {
        taxCustUserVatNumber({
          countryCode: this.countryCode,
          userId: JSON.parse(localStorage.getItem('objInfo')).userId
        }).then(res => {
          this.countryList = res.data
          resolve()
        })
      })
    },
  }
}