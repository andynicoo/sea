<template>
  <el-dialog title="处理完成" :visible.sync="dialogvisible" width="460px">
    <el-form :model="form" ref="ruleForm" label-width="130px" class="demo-dynamic">
      <el-form-item
        prop="disposeResult"
        label="请输入EORI号："
        :rules="[{ required: true, message: '请输入EORI号', trigger: 'blur' }]"
      >
        <el-input v-model="form.disposeResult" placeholder="请输入EORI号" clearable size="small"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { materialFinishAPI } from "@/api/newApi/workOrder/valueAddedServices.js";
export default {
  props: {
    completeDialog: Boolean,
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
        return this.completeDialog;
      },
      set(val) {
        this.$emit("update:completeDialog", val);
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
      materialFinishAPI({
        ...this.form,
        id: this.id,
        eoriNumber:this.form.disposeResult
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "操作成功",
            duration: 2000,
          });
          this.$emit("goBack");
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
