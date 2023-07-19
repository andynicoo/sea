<template>
  <!-- 修改SIRET号 -->
  <el-dialog title="修改SIRET号" :visible.sync="dialogvisible" width="600px" @close="closeModal">
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item label="SIRET号：" prop="siretNumber">
        <el-input v-model="form.siretNumber" placeholder="请输入SIRET号" />
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
import { changeSiret } from '@/api/newApi/taxServices/serviceManage.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
export default {
  props: {
    modifySiretDialog: Boolean,
    workId: [String, Number],
    siretNumber: String,
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        siretNumber: '',
        approvalFileList: [],
      },
      rules: {
        siretNumber: [{ required: true, message: '请输入SIRET号', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        this.form.siretNumber = this.siretNumber;
        return this.modifySiretDialog;
      },
      set(val) {
        this.$emit('update:modifySiretDialog', val);
      },
    },
  },
  created() {},
  methods: {
    closeModal() {
      this.form.approvalFileList = [];
      this.form.siretNumber = '';
      this.$refs['form'].resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changeSiret({
            isUpdate: true,
            workId: this.workId,
            siretNumber: this.form.siretNumber,
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
