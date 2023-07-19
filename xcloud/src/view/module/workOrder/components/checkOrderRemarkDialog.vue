<template>
  <el-dialog
    title="备注信息"
    :visible.sync="dialogvisible"
    width="494px"
    center
  >
    <div class="content">{{orderRemark}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">关闭</el-button>
      <!-- <el-button @click="dialogvisible = false" size="small">取消</el-button> -->
    </span>
  </el-dialog>
</template>

<script>

export default {
  props: {
    checkOrderRemarkDialog: Boolean,
    orderRemark: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.checkOrderRemarkDialog;
      },
      set(val) {
        this.$emit("update:checkOrderRemarkDialog", val);
      },
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  word-break: break-all;
}
</style>
