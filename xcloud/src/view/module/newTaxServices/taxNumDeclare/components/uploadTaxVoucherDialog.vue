<template>
  <el-dialog title="上传缴税凭证" :visible.sync="dialogvisible" width="460px" center>
    <el-form :model="form" ref="ruleForm" :rules="rules" label-width="110px">
      <el-form-item label="附件" prop="taxCertificate">
        <UploadFile :fileList.sync="form.taxCertificate" :showTip="false"> </UploadFile>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import { certificate } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    uploadTaxVoucherDialog: Boolean,
    id: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      form: {
        taxCertificate: [],
      },
      rules: {
        taxCertificate: [{ required: true, message: '请上传缴税凭证', trigger: 'change' }],
      },
    };
  },
  components: {
    UploadFile,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadTaxVoucherDialog;
      },
      set(val) {
        this.$emit('update:uploadTaxVoucherDialog', val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      certificate({
        taxCertificate: this.form.taxCertificate.map((item) => item.url).join(','),
        id: this.id,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getserviceDetail();
          }
        })
        .catch((err) => {
          this.$message(err.message);
        });
    },
  },
};
</script>

<style></style>
