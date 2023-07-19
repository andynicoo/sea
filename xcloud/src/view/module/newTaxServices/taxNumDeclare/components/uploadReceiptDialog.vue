<template>
  <el-dialog :title="(isChange ? '替换' : '上传') + '回执'" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="135px">
      <el-form-item label="申报回执：" prop="declareReceipt">
        <UploadFile :fileList.sync="form.declareReceipt" :showTip="false" fileClass :limit="5"> </UploadFile>
      </el-form-item>
      <el-form-item label="其他回执与通知(选填)：" prop="deductionReceipt">
        <UploadFile :fileList.sync="form.deductionReceipt" :showTip="false" fileClass :limit="5"> </UploadFile>
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
import { workReceipt, changeReceipt } from '@/api/newApi/taxServices/taxNumDeclare.js';

export default {
  props: {
    uploadReceiptDialog: Boolean,
    id: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
    isChange: Boolean, // 是否替换回执
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        declareReceipt: [],
        deductionReceipt: [],
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
      let method = this.isChange ? changeReceipt : workReceipt;
      method({
        deductionReceipt: this.form.deductionReceipt.map((item) => item.url).join(','),
        declareReceipt: this.form.declareReceipt.map((item) => item.url).join(','),
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
    reset() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
  },
};
</script>

<style></style>
