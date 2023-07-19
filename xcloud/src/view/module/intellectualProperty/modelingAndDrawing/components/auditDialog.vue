<template>
  <el-dialog
    title="审核"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="85px"
    >
      <el-form-item label="审核结果" prop="auditResult">
        <el-radio-group v-model="form.auditResult">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回原因" prop="rejectReason" v-if="form.auditResult === 2">
        <el-input
          v-model="form.rejectReason"
          placeholder="输入驳回原因"
          clearable
          type="textarea"
          style="width: 300px"
          size="small"
          maxlength="200"
        />
      </el-form-item>
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
import {progressBarObj} from "../enumObj"
import {modelAudit} from "@/api/newApi/intellectualProperty/modelingAndDrawing"
export default {
  props: {
    auditDialog: Boolean,
    rejectNodeName: String,
    serviceId: String,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        auditResult: 1,
        rejectReason: "",
      },
      rules: {
        rejectReason: [{required: true, message: '请输入驳回原因', trigger: 'blur'}],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDialog;
      },
      set(val) {
        this.$emit("update:auditDialog", val);
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
      modelAudit({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
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
