<template>
  <el-dialog title="上传缴费凭证" :visible.sync="dialogvisible" width="460px" @close="closeModal">
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item label="缴费凭证：" prop="voucherFiles">
        <UploadFile :fileClass="true" :accept="'.jpg,.rar,.zip,.doc,.docx,.pdf,.png,.jpge,.gif'" :limit="1" :fileList.sync="form.voucherFiles"></UploadFile>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadPaymentVoucher } from '@/api/newApi/workOrder/EPRManage';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
// import moment from "moment";
export default {
  props: {
    uploadPayDialog: Boolean,
    serviceId: String,
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        voucherFiles: [],
      },
      declareList: [],
      rules: {
        voucherFiles: [{ required: true, message: '请上传缴费文件', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadPayDialog;
      },
      set(val) {
        this.$emit('update:uploadPayDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
      }
    },
  },
  created() {},
  methods: {
    closeModal() {
      this.form.voucherFiles = [];
      this.$refs['form'].resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          uploadPaymentVoucher({
            serviceId: this.serviceId,
            voucherFiles: this.form.voucherFiles.map((v) => v.url),
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('上传成功');
                this.dialogvisible = false;
                this.$emit('refresh');
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input {
  width: 250px;
}
</style>
