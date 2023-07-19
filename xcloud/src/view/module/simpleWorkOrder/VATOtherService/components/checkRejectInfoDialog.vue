<template>
  <el-dialog title="驳回详情" :visible.sync="dialogvisible" width="478px" center>
    <el-timeline class="ope-wrapper">
      <div class="ope-block">
        <span class="text-red">驳回原因：</span>
        {{ rejectInfo }}
      </div>
    </el-timeline>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    checkRejectInfoDialog: Boolean,
    rejectInfo: String
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkRejectInfoDialog;
      },
      set(val) {
        this.$emit("update:checkRejectInfoDialog", val);
      }
    }
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.ope-wrapper {
  max-height: 300px;
  overflow-y: auto;
  padding: 0 35px;
  font-size: 12px;
  .ope-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666 !important;
  }
  .ope-block {
    margin-bottom: 6px;
    color: #666 !important;
  }
}
</style>
