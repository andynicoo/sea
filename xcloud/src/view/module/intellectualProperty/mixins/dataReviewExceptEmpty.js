export default {
  computed: {
    dataReview() {
      this.moduleList.forEach(pro => {
        pro.columns.forEach(item => {
          // 值为空隐藏
          if(!this.isEdit && this.$util.isEmpty(item.reView) && this.$util.isEmpty(item.keyNameValue)) {
            item.inputType = 'hidden'
          }
          // 隐藏签名
          if(['companyLegalPersonSign'].includes(item.keyName)) {
            item.inputType = 'hidden'
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
  }
}