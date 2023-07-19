<template>
  <el-dialog
    title="上传零申报凭证"
    :visible.sync="dialogvisible"
    width="460px"
    center
  >
    <el-form
      :model="form"
      ref="ruleForm"
    >
      <el-form-item prop="file">
        <UploadFile
          :fileList.sync="form.file"
          :showTip="false"
        >
        </UploadFile>
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
import UploadFile from "@/components/UploadFile/index";
export default {
  props: {
    uploadZeroDeclareVoucherDialog: Boolean,
    id: String,
  },
  data() {
    return {
      formLabelWidth: "120px",
      form: {
        num: "",
        file: [],
      },
    };
  },
  components: {
    UploadFile
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadZeroDeclareVoucherDialog;
      },
      set(val) {
        this.$emit("update:uploadZeroDeclareVoucherDialog", val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      // refundAudit({
      //   ...this.form,
      //   id: this.id,
      // }).then((res) => {
      //   if (res.code === 0) {
      //     this.$message({
      //       type: "success",
      //       message: "审核成功",
      //       duration: 2000,
      //     });
      //     this.$emit("refresh");
      //   } else {
      //     this.$message({
      //       type: "fail",
      //       message: "审核失败",
      //       duration: 2000,
      //     });
      //   }
      // });
    },
  },
};
</script>

<style></style>
