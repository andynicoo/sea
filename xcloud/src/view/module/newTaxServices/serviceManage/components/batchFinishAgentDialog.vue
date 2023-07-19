<template>
  <el-dialog :visible.sync="dialogvisible" width="450px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量完成转代理</p>
      <span class="diag-head-title">仅支持同一国家同一服务商批量操作</span>
    </span>
    <div class="dialog-content">
      <h3>确认批量完成转代理吗？</h3>
    </div>
    <el-form :model="form" :rules="rules" ref="form" style="margin-top: 10px">
      <el-form-item label="是否短信通知客户：" prop="operation">
        <el-radio-group v-model="form.operation">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchDownloadVat } from '@/api/newApi/common';
export default {
  props: {
    batchFinishAgentDialog: Boolean,
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
        return this.batchFinishAgentDialog;
      },
      set(val) {
        this.$emit('update:batchFinishAgentDialog', val);
      },
    },
  },
  data() {
    return {
      form: {
        operation: '',
      },
      rules: {
        operation: [{ required: true, message: '请选择是否短信通知客户', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          batchDownloadVat({
            idType: 'WORK_ID',
            ids: this.checkIds,
          }).then((res) => {
            this.dialogvisible = false;
          });
        }
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
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
