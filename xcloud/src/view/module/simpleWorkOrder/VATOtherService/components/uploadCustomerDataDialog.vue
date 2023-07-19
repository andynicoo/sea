<template>
  <el-dialog title="上传客户资料" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="uploadCustomerDataDialog">
      <el-form-item label="上传资料：" prop="materialFile" label-width="120px">
        <UploadFile
          :fileList.sync="form.materialFile"
          :limit="10"
          :maxSize="-1"
          :showTip="false"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.cvs,.txt,.zip,.rar"
        >
          <div slot="content" class="text-info" style="font-size: 12px">
            <div>支持：jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx,cvs,txt,zip,rar</div>
          </div>
        </UploadFile>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
export default {
  components: {
    UploadFile
  },
  props: {
    uploadCustomerDataDialog: Boolean,
    fileList: Array
  },
  data() {
    return {
      form: {
        materialFile: []
      },
      rules: {
        materialFile: [{ required: true, message: "请上传资料清", trigger: "blur" }]
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadCustomerDataDialog;
      },
      set(val) {
        this.$emit("update:uploadCustomerDataDialog", val);
      }
    }
  },
  watch: {
    fileList() {
      this.form.materialFile = this.fileList;
    }
  },
  mounted() {},
  methods: {
    reset() {
      if (this.$refs.uploadCustomerDataDialog) {
        this.$refs.uploadCustomerDataDialog.resetFields();
      }
    },
    submit() {
      this.$refs["uploadCustomerDataDialog"].validate(valid => {
        if (valid) {
          this.$emit("customerFile", this.form.materialFile);
          this.dialogvisible = false;
        }
      });
    }
  }
};
</script>

<style></style>
