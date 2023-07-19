<template>
  <div>
    <div class="remark-wrapper">
      <div v-for="(item, index) in remindMessageArr" class="remark" :key="index">{{ item }}</div>
    </div>
    <Button class="btn" type="success" @click="confirm" v-show="isReject && !fApi.model()[keyName].props.confirmSuccess"
      >确认无误</Button
    >
  </div>
</template>

<script>
export default {
  props: {
    fApi: Object,
    keyName: String,
    isReject: Boolean,
    moduleCode: String,
    remindMessage: String,
  },
  data() {
    return {
      remindMessageArr: [],
    };
  },
  created() {
    if (this.remindMessage) {
      this.remindMessageArr = this.remindMessage.split('；');
    }
    if (this.keyName === 'ifSubmitLastYearAnnualReturn') {
      let iValue = this.fApi.getValue('ifSubmitLastYearAnnualReturn');
      let title =
        iValue === '1'
          ? '由于您已完成上一年的年报/年度汇总申报，我司将不再为您开放上一年的年度汇总申报端口，请在下方文件框上传您的年报回执'
          : '为合规履行申报义务，建议联系前代理获取并保存好您的历史预申报回执（月度或季度），以便转入后完成上一年的年度汇总年报。请在下方文件框上传您的历史申报回执。';
      this.remindMessageArr = [title];
    }
  },
  mounted() {
    //在dynamicForm.vue中触发
    this.$bus.$on('ifSubmitLastYearAnnualReturnChange', (text) => {
      if (this.keyName === 'ifSubmitLastYearAnnualReturn') {
        this.remindMessageArr = [text];
      }
    });
  },
  methods: {
    confirm() {
      this.fApi.validateField(this.keyName, (valid) => {
        if (!valid) {
          this.fApi.mergeRule(this.keyName, {
            props: {
              confirmSuccess: true,
            },
          });
          this.$util.addClass(this.fApi.el(this.keyName).$parent.$el, 'confirm-success');
          this.$store.commit('changeTodoNum', this.moduleCode);
        }
      });
      this.$bus.$emit('rejectedProcessed', this.keyName);
    },
  },
};
</script>

<style lang="less" scoped>
.remark-wrapper {
  margin: 12px 0 16px;
  .remark {
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.btn {
  margin-left: 16px;
  border-radius: 2px !important;
  vertical-align: middle;
  position: absolute;
  left: 650px;
  z-index: 1;
}
</style>
