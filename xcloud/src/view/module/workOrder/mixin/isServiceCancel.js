export default {
  data() {
    return {
      isCancel: false
    }
  },
  methods: {
    // 如果工单状态为取消中（11）或已取消（9），则禁用所有操作按钮，并给出提示
    ifCancel(status) {
      this.isCancel = (status === 9 || status === 11)
      if(status === 11) {
        this.$message.warning('此服务在取消中，暂时不能操作')
      } else if (status === 9) {
        this.$message.warning('该服务已取消')
      }
    }
  },
}