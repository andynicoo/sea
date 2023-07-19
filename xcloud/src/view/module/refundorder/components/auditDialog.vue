<template>
  <el-dialog width="490px" title="订单确认" :visible.sync="dialogvisible">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      :label-width="formLabelWidth"
    >
      <el-form-item label="选项：">
        <el-radio v-model="form.auditStatus" :label="1">审核通过</el-radio>
        <el-radio v-model="form.auditStatus" :label="2">审核不通过</el-radio>
      </el-form-item>
      <el-form-item label="备注：" prop="auditReason">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.auditReason"
          autocomplete="off"
          style="width: 300px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="submit" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { refundAudit } from "@/api/newApi/orderManage/refundOrder";
export default {
  props: {
    auditDialogvisible: Boolean,
    id: String,
  },
  data() {
    var validateReason = (rule, value, callback) => {
      if (this.form.auditStatus !== 1 && value === "") {
        callback(new Error("请输入备注"));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: "100px",
      form: {
        auditReason: "",
        auditStatus: 1,
      },
      rules: {
        auditReason: [{ validator: validateReason, trigger: "blur" }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDialogvisible;
      },
      set(val) {
        this.$emit("update:auditDialogvisible", val);
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
      refundAudit({
        ...this.form,
        id: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "审核成功",
            duration: 2000,
          });
          this.$emit("refresh");
        } else {
          this.$message({
            type: "fail",
            message: "审核失败",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style></style>
