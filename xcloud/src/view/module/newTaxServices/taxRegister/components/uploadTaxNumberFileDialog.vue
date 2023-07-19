<template>
  <el-dialog title="录入税号申请书" :visible.sync="dialogvisible" width="560px" @close="reset">
    <el-form ref="form" :rules="formRules" :model="form" label-width="130px">
      <el-form-item label="国家："> 日本 </el-form-item>
      <el-form-item label="税号申请书文件：">
        <UploadFileUrl fileClass :fileList.sync="form.taxNumberApply" accept=".pdf,.jpg,.jpeg,.png,.zip" :maxSize="100" initTip="支持PDF、JPG、JPEG、PNG、ZIP格式上传"> </UploadFileUrl>
      </el-form-item>
      <div class="text-tips">*该文件表示注册材料已提交给税局，税号正在注册中。文件仅供内部查询使用。</div>
    </el-form>

    <div slot="footer" style="text-align: right">
      <el-button type="default" @click="dialogvisible = false">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { applyTaxNumber } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    uploadTaxNumberFileDialog: Boolean,
    workOrderId: String,
    taxNumberApply: String,
  },

  data() {
    return {
      form: {
        taxNumberApply: '',
      },
      formRules: {
        taxNumberApply: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  watch: {
    uploadTaxNumberFileDialog(val) {
      if (val) {
        this.form.taxNumberApply = this.taxNumberApply;
      }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadTaxNumberFileDialog;
      },
      set(val) {
        this.$emit('update:uploadTaxNumberFileDialog', val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirm();
        }
      });
    },
    confirm() {
      applyTaxNumber({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('添加成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },

    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style></style>
