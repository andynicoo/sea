<template>
  <el-dialog :visible.sync="dialogvisible" width="450px" center>
    <span slot="title" class="dialog-header">
      <p>批量提交服务商</p>
      <span class="diag-head-title">仅支持同一国家同一服务商批量操作</span>
    </span>
    <div class="dialog-content">
      <h3>确认批量提交吗？</h3>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchSubmitSupplier } from '@/api/newApi/common';
export default {
  props: {
    batchSubmitProviderDialog: Boolean,
    checkIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchSubmitProviderDialog;
      },
      set(val) {
        this.$emit('update:batchSubmitProviderDialog', val);
      },
    },
  },

  methods: {
    submit() {
      batchSubmitSupplier({
        ids: this.checkIds,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
