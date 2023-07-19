<template>
  <el-dialog title="上传回执" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="135px">
      <el-form-item label="申报回执：" prop="declareReceipt">
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
import { eprDeclareReceipt } from '@/api/newApi/taxServices/taxNumDeclare.js';

import { preDeclareupload } from '@/api/newApi/workOrder/preDeclare';

export default {
  props: {
    uploadReceiptDialog: Boolean,
    eprDeclare: Object,
    getInfo: Function,
    declareReceipt: String,
    eprUploadType: {
      type: String,
      default: 'eprDeclare',
    },
  },
  data() {
    return {
      formLabelWidth: '120px',
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
      const fn = this.eprUploadType == 'preEprDeclare' ? preDeclareupload : eprDeclareReceipt;
      console.log(fn);
      fn({
        ...this.eprDeclare,
        declareReceipt: this.form.declareReceipt.map((item) => item.url).join(','),
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getInfo();
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
