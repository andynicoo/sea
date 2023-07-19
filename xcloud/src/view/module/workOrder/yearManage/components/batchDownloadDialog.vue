<template>
  <el-dialog :visible.sync="dialogvisible" width="450px" center>
    <span slot="title" class="dialog-header">
      <p>批量下载年报回执</p>
      <span class="diag-head-title">下载结果请到【上传/下载中心】查询</span>
    </span>
    <div class="dialog-content">
      <h3>下载内容：年报回执</h3>
      <h3>是否确定批量下载？</h3>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    batchDownloadDialog: Boolean,
    selectionList: Array,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchDownloadDialog;
      },
      set(val) {
        this.$emit('update:batchDownloadDialog', val);
      },
    },
  },

  methods: {
    submit() {},
  },
};
</script>

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}
/deep/ .dialog-header p {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}
/deep/ .dialog-header .diag-head-title {
  color: #e6a23c;
}
/deep/ .el-dialog__header {
  height: 82px;
}
.dialog-content {
  text-align: center;
}
.dialog-footer {
  text-align: center;
}
</style>
