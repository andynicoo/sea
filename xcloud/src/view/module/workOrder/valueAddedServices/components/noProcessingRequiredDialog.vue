<template>
  <el-dialog title="无需处理" :visible.sync="dialogvisible" width="460px" center>
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="请输入原因（用户可见）：" prop="disposeResult">
        <el-input
          v-model="form.disposeResult"
          placeholder="请输入"
          clearable
          size="small"
          type="textarea"
          style="width: 400px"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确认</el-button>
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { materialOnDispenseAPI } from "@/api/newApi/workOrder/valueAddedServices.js";
export default {
  props: {
    noProcessingRequiredDialog: Boolean,
    id: [Number, String],
  },
  data() {
    return {
      form: {
        disposeResult: "",
        docUrl: "",
      },
      rules: {},
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.noProcessingRequiredDialog;
      },
      set(val) {
        this.$emit("update:noProcessingRequiredDialog", val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.auditConfirm();
        } else {
          return false;
        }
      });
    },
    auditConfirm() {
      materialOnDispenseAPI({
        ...this.form,
        id: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "操作成功",
            duration: 2000,
          });
          this.$emit("goBack");
          this.$emit("refresh");
        } else {
          this.$message({
            type: "fail",
            message: "操作失败",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style></style>
