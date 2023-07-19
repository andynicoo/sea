<template>
  <el-dialog :title="editHYFile ? '修改海牙编号' : '上传海牙文件'" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" inline ref="form">
      <el-form-item label="海牙文件" prop="apostilleFile" v-if="!editHYFile">
        <UploadFile ref="uploadImageRef" :fileList.sync="form.apostilleFile"> </UploadFile>
      </el-form-item>
      <el-form-item label="海牙编号" prop="apostilleNo">
        <el-input v-model="form.apostilleNo" placeholder="请输入海牙编号"></el-input>
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
import { apostilleUpload } from '@/api/newApi/workOrder/hyCertification';
export default {
  props: {
    uploadHYFileDialog: Boolean,
    workId: [String, Number],
    editHYFile: Boolean,
    fEncode: String,
  },
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        apostilleFile: [],
        apostilleNo: '',
      },
      rules: {
        apostilleFile: [{ type: 'array', required: true, message: '请上传海牙文件', trigger: 'blur' }],
        apostilleNo: [
          { required: true, message: '请输入海牙编号', trigger: 'blur' },
          { max: 50, message: '长度小于50个字符', trigger: 'blur' },
        ],
      },
    };
  },
  components: {
    UploadFile,
  },
  computed: {
    dialogvisible: {
      get() {
        if (this.editHYFile) this.form.apostilleNo = this.fEncode;
        return this.uploadHYFileDialog;
      },
      set(val) {
        this.$emit('update:uploadHYFileDialog', val);
      },
    },
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
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
      apostilleUpload({
        apostilleFile: this.form.apostilleFile.map((item) => item.url).join(','),
        apostilleNo: this.form.apostilleNo,
        workId: this.workId,
        isUpdate: this.editHYFile,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: this.editHYFile ? '修改成功' : '上传成功',
            duration: 2000,
          });
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 237px;
}
</style>
