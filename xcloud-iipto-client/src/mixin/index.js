export default {
  computed: {
    dataReview () {
      this.moduleList.forEach(pro => {
        pro.columns.forEach(item => {
          if (!item.hasOwnProperty('disabled')) {
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
