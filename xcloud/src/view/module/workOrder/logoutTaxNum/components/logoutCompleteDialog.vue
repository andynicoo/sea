<template>
  <el-dialog title="完成注销" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="receiptFile">
        <UploadFile :fileList.sync="form.receiptFile" :showTip="false"> </UploadFile>
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
import { handleWorkOrder, updateReceiptFile } from '@/api/newApi/workOrder/logoutTaxNum';
export default {
  props: {
    logoutCompleteDialog: Boolean,
    workOrderId: String,
    changeFlag: Boolean,
    file: String,
  },
  components: {
    UploadFile,
  },
  data() {
    return {
      form: {
        receiptFile: [],
      },
      rules: {
        receiptFile: [{ type: 'array', required: true, message: '请上传文件', trigger: 'blur' }],
      },
    };
  },
  watch: {
    changeFlag(val) {
      if (val && this.file) {
        this.form.receiptFile = [
          {
            url: this.file,
            name: '注销文件',
          },
        ];
      }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.logoutCompleteDialog;
      },
      set(val) {
        this.$emit('update:logoutCompleteDialog', val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      let method = this.changeFlag ? updateReceiptFile : handleWorkOrder;
      method({
        receiptFile: this.form.receiptFile.map((item) => item.url).join(','),
        workId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: 2000,
          });
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
