import { getUserCompanyMaterial } from '@/api/hagueInformation'
export default {
  data() {
    return {
      companyList: [],
      imageKeys: [
        // 公司营业执照
        'companyBusinessLicense',
        // 营业执照英文公证翻译件
        'companyBusinessLicenseTranslate',
        // 商业登记证BR扫描件
        'companyBusinessRegistrationBr',
        // 公司注册证明书CI扫描件
        'companyRegistrationCi',
        // 法团成立表格NNC1扫描件
        'companyCorporateFoundingNnc1',
        // 商业登记证/海外证书
        'brScanFileOrOverseasCertificate',
        // 营业执照中文和英文翻译件
        'companyBusinessLicenseTranslateEnAndCh',
        // 公司英文章程
        'companyConstitutionEn',
        // 法人身份证正面扫描件
        'companyLegalPersonCardFront',
        // 法人驾驶证
        'driverLicense',
        // 法人护照扫描件
        'companyLegalPersonCardPassport',
        // 后台店铺截图
        'shopAddressScreenshot',
      ]
    }
  },
  computed: {
    dataReview() {
      this.moduleList.forEach(pro => {
        pro.columns.forEach(item => {
          // 公司中文名、公司英文名、VAT税号联动
          if(item.keyName === 'companyNameZh') {
            if(item.inputType === 5) {
              item.options = this.companyList.map(i => ({
                label: i.companyNameZh,
                value: i.companyNameZh,
              }))
              item.allowCreate = true
              item.filterable = true
              item.clearable = true
            }
            item.update = (val, rule, fApi)=>{
              if(!fApi.form || JSON.stringify(fApi.form) === '{}') return
              let company = this.companyList.find(i => i.companyNameZh === val)
              if(!company) return
              if(this.companyList.length) {
                let keys = Object.keys(company)
                keys.forEach(key => {
                  if(key !== 'companyNameZh' && fApi.form.hasOwnProperty(key)) {
                    fApi.setValue({
                      [key]: ''
                    })
                  }
                })
              }
            }
          }
          if(item.keyName !== 'companyNameZh') {
            item.link = ['companyNameZh']
            item.update = (val, rule, fApi)=>{
              if(!fApi.form || JSON.stringify(fApi.form) === '{}') return
              let companyNameZh = fApi.getValue('companyNameZh')
              let company = this.companyList.find(i => i.companyNameZh === companyNameZh)
              if(!company) return
              let value = company ? company[item.keyName] : ''
              rule.value = val || value
              if(this.imageKeys.includes(item.keyName)) {
                rule.value = this.formatImage(rule.value)
              }
            }
          }
          if(!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit)
          } else {
            item.disabled = !this.isEdit
          }
        })
      })
      return this.moduleList
    }
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    // 获取公司列表
    getCompanyList() {
      getUserCompanyMaterial({
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
        page: 1,
        limit: 9999,
        enterPriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId
      }).then(res => {
        if(res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    formatImage(imageList) {
      let res = []
      if(typeof imageList === 'object') {
        res = imageList
      } else if(imageList){
        try {
          res = JSON.parse(imageList)
        } catch (error) {
          try {
            res = imageList.split(',')
          } catch (e) {}
        }
      }
      return res
    }
  }
}