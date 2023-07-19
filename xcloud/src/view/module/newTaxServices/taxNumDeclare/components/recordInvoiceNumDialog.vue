<template>
  <el-dialog title="录入发票号" :visible.sync="dialogvisible" width="460px" center>
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="发票号：" prop="invoiceNumber">
        <el-input v-model="form.invoiceNumber" placeholder="请输入发票号" clearable size="small" style="width: 400px" />
      </el-form-item>
      <el-form-item label="发票号文件(选填)：">
        <UploadFile :fileList.sync="form.invoiceUrl" :showTip="false"> </UploadFile>
      </el-form-item>
      <el-form-item label="参考号：" prop="refNo">
        <el-input v-model="form.refNo" placeholder="请输入参考号" clearable size="small" style="width: 400px" />
      </el-form-item>
      <el-form-item label="参考号文件(选填)：">
        <UploadFile :fileList.sync="form.refNoUrl" :maxSize="100" accept=".xls,.xlsx,.doc,.docx,.zip,.pdf,.png,.rar" :showTip="false"> </UploadFile>
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
import { taxesInvoice } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    recordInvoiceNumDialog: Boolean,
    id: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        invoiceNumber: '',
        invoiceUrl: [],
        refNo: '',
        refNoUrl: [],
      },
      rules: {
        invoiceNumber: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
        refNo: [
          { required: true, message: '请输入参考号', trigger: 'blur' },
          { len: 6, message: '请填写六位数', trigger: 'blur' },
        ],
        // invoiceUrl: [{required: true, message: '请上传发票文件', trigger: 'change'}]
      },
    };
  },
  components: {
    UploadFile,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.recordInvoiceNumDialog;
      },
      set(val) {
        this.$emit('update:recordInvoiceNumDialog', val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      taxesInvoice({
        invoiceNumber: this.form.invoiceNumber,
        invoiceUrl: this.form.invoiceUrl.map((item) => item.url).join(','),
        refNo: this.form.refNo,
        refNoUrl: this.form.refNoUrl.map((item) => item.url).join(','),
        id: this.id,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('录入成功');
            this.getserviceDetail();
            this.dialogvisible = false;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
};
</script>

<style></style>
