<template>
  <el-dialog title="历史操作记录" :visible.sync="dialogvisible" width="600px">
    <OperationLog :activities="activities" :showTitle="false" />
  </el-dialog>
</template>

<script>
import OperationLog from './OperationLog.vue';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
export default {
  props: {
    showHistoryLogDialog: Boolean,
    chiefServiceNo: String,
  },
  components: {
    OperationLog,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showHistoryLogDialog;
      },
      set(val) {
        this.$emit('update:showHistoryLogDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val && this.chiefServiceNo) {
        this.getOperationLog(this.chiefServiceNo);
      }
    },
  },
  mixins: [operationLog],
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
