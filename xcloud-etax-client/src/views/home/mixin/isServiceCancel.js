export default {
  data() {
    return {
      isCancel: false,
    };
  },
  methods: {
    // 如果工单状态为取消中（11）或已取消（9），则禁用所有操作按钮，并给出提示
    ifCancel(status) {
      this.isCancel = status === 2 || status === 9 || status === 11;
      if (status === 11) {
        this.$Message.warning('此服务在取消中，暂时不能操作');
      } else if (status === 9) {
        this.$Message.warning('该服务已取消');
      } else if (status === 2) {
        this.$Message.warning('该服务待续费');
      }
    },
  },
};
