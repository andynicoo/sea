<template>
  <el-dialog
    title="提交授权书"
    :visible.sync="dialogvisible"
    width="500px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="交付授权指令发出时间" prop="submitTime">
        <el-date-picker
          v-model="form.submitTime"
          type="date"
          :clearable="false"
          placeholder="请选择提交时间"
          value-format="yyyy-MM-dd 00:00:00"
          style="width: 160px"
        ></el-date-picker>
      </el-form-item>
      <div class="text-desc">备注：此处填写的时间为交付通知律师授权，律师收到授权指令的时间</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {submitAuthorization} from '@/api/newApi/intellectualProperty/certificate'
export default {
  props: {
    submitCertificateDialog: Boolean,
    workOrderId: String,
  },
  data() {
    return {
      form: {
        submitTime: "",
      },
      rules: {
        submitTime: [{required: true, message: '请输入提交时间', trigger: 'blur'}],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.submitCertificateDialog;
      },
      set(val) {
        this.$emit("update:submitCertificateDialog", val);
      },
    },
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      submitAuthorization({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('上传成功');
          this.$emit("refresh");
        }
      });
    },
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
  },
};
</script>

<style></style>

