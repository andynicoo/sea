<template>
  <el-dialog :title="'代客户确认' + fileType" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <p style="margin-bottom: 10px">客户不方便登录客户端确认时，可代替客户确认</p>
      <el-form-item label="确认结果" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio :label="1">没问题</el-radio>
          <el-radio :label="2">有问题，需要修改</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="suggest" v-if="form.result === 2">
        <el-input v-model="form.suggest" placeholder="输入修改建议" clearable type="textarea" style="width: 300px" size="small" maxlength="200" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { confirmFile } from '@/api/newApi/intellectualProperty/modelingAndDrawing';
export default {
  props: {
    insteadConfirmDialog: Boolean,
    fileType: String,
    workOrderId: String,
  },
  data() {
    return {
      form: {
        reqType: 2, // 1客户端 2后台
        result: 1,
        suggest: '',
      },
      rules: {
        suggest: [{ required: true, message: '请输入修改建议', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.insteadConfirmDialog;
      },
      set(val) {
        this.$emit('update:insteadConfirmDialog', val);
      },
    },
  },
  methods: {
    submit() {
      this.form.suggest = this.form.suggest.trim();
      if (this.form.result === 2 && this.form.suggest === '') {
        this.$message.warning('请输入修改建议');
        return;
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      confirmFile({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
          this.$emit('refresh');
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

<style></style>
