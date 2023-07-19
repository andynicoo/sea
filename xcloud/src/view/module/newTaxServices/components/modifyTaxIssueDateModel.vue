<template>
  <!-- 修改税号下发日期 -->
  <el-dialog title="修改税号下发日期" :visible.sync="dialogvisible" width="600px" @close="closeModal">
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item label="税号下发日期：" prop="taxIssueDate">
        <el-date-picker v-model="form.taxIssueDate" type="date" placeholder="请选择税号下发日期" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>

      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :accept="'.jpg,.png,.jpge,.gif'" :maxSize="30" :fileList.sync="form.approvalFileList"></UploadFile>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeVatInfo } from '@/api/newApi/taxServices/serviceManage.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
export default {
  props: {
    modifyTaxIssueDateDialog: Boolean,
    workId: [String, Number],
    taxIssueDate: String,
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        taxIssueDate: '',
        approvalFileList: [],
      },
      rules: {
        taxIssueDate: [{ required: true, message: '请选择税号下发日期', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        this.form.taxIssueDate = this.taxIssueDate;
        return this.modifyTaxIssueDateDialog;
      },
      set(val) {
        this.$emit('update:modifyTaxIssueDateDialog', val);
      },
    },
  },
  created() {},
  methods: {
    closeModal() {
      this.form.approvalFileList = [];
      this.form.taxIssueDate = '';
      this.$refs['form'].resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changeVatInfo({
            isUpdate: true,
            workId: this.workId,
            taxIssueDate: this.form.taxIssueDate,
            approvalFile: this.form.approvalFileList.length ? this.form.approvalFileList[0].url : '',
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('修改成功');
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
