<!-- 发票详情页 -->
<template>
  <div>
    <Modal v-model="dialog" :width="900" footer-hide title="计价规则" class="year-history-diag">
      <div class="container">
        <img v-if="type == 3" src="@/assets/images/survey/calcRule.jpg" />
        <img v-if="type == 2" src="@/assets/images/survey/calcRule2.png" />
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'calcRuleDialog',
  props: {
    calcRuleDialogVisible: Boolean,
    type: Number,
  },

  data() {
    return {};
  },

  computed: {
    dialog: {
      get() {
        return this.calcRuleDialogVisible;
      },
      set(val) {
        // this.$emit('input', val);
        this.$emit('update:calcRuleDialogVisible', val);
      },
    },
  },

  mounted() {},
  methods: {
    changeStatePay(val) {
      this.$emit('update:calcRuleDialogVisible', val);
    },
  },
};
</script>
<style lang="less" scoped>
.year-history-diag {
  /deep/ .ivu-table-body {
    height: auto !important;
  }

  /deep/ .ivu-modal-body {
    max-height: 500px;
    overflow: auto;
  }

  .ivu-table td,
  .ivu-table th {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .ivu-table-border td,
  .ivu-table-border th {
    border-right: 1px solid #e8eaec;
  }

  .ivu-table-column-center {
    text-align: center;
  }

  .first-cell {
    border-left: 1px solid #e8eaec;
  }

  .ivu-table-column-center .ivu-table-cell {
    text-align: center;
  }

  .time-tip {
    width: 100%;
    text-align: center;
    padding: 8px 0;
    background: rgba(22, 173, 233, 0.2);
    border: 1px solid #e8eaec;
    border-bottom: 0;
  }

  .w-123 {
    width: 123px;
  }

  .w-124 {
    width: 124px;
  }
}
</style>
