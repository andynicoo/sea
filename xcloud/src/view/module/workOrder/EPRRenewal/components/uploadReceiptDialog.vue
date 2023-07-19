<template>
  <el-dialog title="上传缴费凭证" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="135px">
      <el-form-item label="缴费凭证：" prop="declareReceipt">
        <UploadFile :fileList.sync="form.declareReceipt" :showTip="false" fileClass :limit="5"> </UploadFile>
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

import { renewUpload } from '@/api/newApi/workOrder/eprRenewal';

export default {
  props: {
    uploadReceiptDialog: Boolean,
    serviceId: String,
  },
  data() {
    return {
      form: {
        declareReceipt: [],
      },
      rules: {
        declareReceipt: [{ required: true, message: '请上传申报回执', trigger: 'change' }],
        // deductionReceipt: [{required: true, message: '请上传扣款回执', trigger: 'change'}]
      },
    };
  },
  components: {
    UploadFile,
  },
  watch: {
    declareReceipt(value) {
      if (value) {
        this.form.declareReceipt = value.split(',').map((item) => ({ url: item, name: item }));
      } else {
        this.form.declareReceipt = [];
      }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadReceiptDialog;
      },
      set(val) {
        this.$emit('update:uploadReceiptDialog', val);
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
      renewUpload({
        serviceId: this.serviceId,
        voucherFiles: this.form.declareReceipt.map((item) => item.url),
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.$emit('refresh');
          }
        })
        .catch((err) => {
          this.$message(err.message);
        });
    },
    reset() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
  },
};
</script>

<style></style>
