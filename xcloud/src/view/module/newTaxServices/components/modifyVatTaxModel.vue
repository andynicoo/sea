<template>
  <!-- 修改税号 -->
  <el-dialog title="修改税号" :visible.sync="dialogvisible" width="600px" @close="closeModal">
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item label="税号：" prop="vatTaxNumber">
        <el-input v-model="form.vatTaxNumber" placeholder="请输入税号" />
      </el-form-item>
      <el-form-item label="税号文件：" prop="vatTaxNumberFileList">
        <UploadFile :fileClass="true" :showTip="true" :fileList.sync="form.vatTaxNumberFileList"></UploadFile>
      </el-form-item>

      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :maxSize="30" :accept="'.jpg,.png,.jpge,.gif'" :fileList.sync="form.approvalFileList"></UploadFile>
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
    modifyVatTaxDialog: Boolean,
    workId: [String, Number],
    vatTaxNumber: String,
    vatTaxNumberFile: String,
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        vatTaxNumber: '',
        vatTaxNumberFileList: [],
        approvalFileList: [],
      },
      rules: {
        vatTaxNumber: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        vatTaxNumberFileList: [{ required: true, message: '请上传税号文件', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        this.form.vatTaxNumber = this.vatTaxNumber;
        if (this.vatTaxNumberFile) {
          this.form.vatTaxNumberFileList = [{ url: this.vatTaxNumberFile, name: this.vatTaxNumberFile.substr(this.vatTaxNumberFile.lastIndexOf('/') + 1) }];
        }
        return this.modifyVatTaxDialog;
      },
      set(val) {
        this.$emit('update:modifyVatTaxDialog', val);
      },
    },
  },
  created() {},
  methods: {
    closeModal() {
      this.form.vatTaxNumberFileList = [];
      this.form.approvalFileList = [];
      this.form.vatTaxNumber = '';
      this.$refs['form'].resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changeVatInfo({
            isUpdate: true,
            workId: this.workId,
            vatTaxNumber: this.form.vatTaxNumber.trim(),
            vatTaxNumberFile: this.form.vatTaxNumberFileList.map((v) => v.url).join(','),
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
