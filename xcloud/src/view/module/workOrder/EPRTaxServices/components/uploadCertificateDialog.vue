<template>
  <el-dialog
    :title="isReplace ? '替换协议证书' : '上传协议证书'"
    :visible.sync="dialogvisible"
    width="600px"
    center
    @close="reset"
  >
    <DynamicForm
      ref="dynamicForm"
      :moduleList="authorizeFileInfo"
      :showBtn="false"
      @formSave="formSave"
      @formCancel="isEdit = false"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="formSave">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DynamicForm from "@/components/DynamicForm/dynamicForm";
import { submitEpr, saveEpr } from "@/api/newApi/workOrder/EPRManage";
export default {
  props: {
    uploadCertificateDialog: Boolean,
    serviceId: String,
    authorizeFileInfo: Array,
    isReplace: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DynamicForm
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadCertificateDialog;
      },
      set(val) {
        this.$emit("update:uploadCertificateDialog", val);
      }
    },
    form() {
      return this.fileObj;
    }
  },
  data() {
    return {
      rules: {}
    };
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    cancel() {
      this.dialogvisible = false;
      this.$emit("refresh");
    },
    formSave() {
      this.$refs.dynamicForm.onSubmit().then(materialData => {
        let data = {
          materialData,
          serviceId: this.serviceId
        };
        if (this.isReplace) {
          saveEpr(data).then(res => {
            if (res.code === 0) {
              this.dialogvisible = false;
              this.$message.success("提交成功");
              this.$emit("refresh");
            }
          });
        } else {
          submitEpr(data).then(res => {
            if (res.code === 0) {
              this.dialogvisible = false;
              this.$message.success("提交成功");
              this.$emit("refresh");
            }
          });
        }
      });
    }
  }
};
</script>

<style></style>
