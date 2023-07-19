<template>
  <el-dialog title="录入UIN号" :visible.sync="dialogvisible" width="660px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="UIN号：" prop="uinStr">
        <el-input v-model="form.uinStr" placeholder="请输入" style="width: 248px" clearable />
      </el-form-item>

      <el-form-item label="证书：" prop="certificates">
        <UploadFileUrl :fileList.sync="form.certificates" :showTip="false" :limit="10" fileClass></UploadFileUrl>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { inputEprRegisterInfoApi } from '@/api/newApi/workOrder/EPRManage';
export default {
  props: {
    UINCertificateVisible: Boolean,
    serviceId: String,
    certificates: Array,
    uinStr: String,
  },
  data() {
    return {
      form: {
        uinStr: '',
        certificates: '',
      },
      rules: {
        // certificates: [{required: true, message: '请上传证书', trigger: 'blur'}],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.UINCertificateVisible;
      },
      set(val) {
        this.$emit('update:UINCertificateVisible', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.form.uinStr = this.uinStr;
      }
    },
    certificates(val) {
      this.form.certificates = val.join(',');
    },
  },
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      console.log(this.form);
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
      let certificatesUrl = this.form.certificates.split(',');
      let data = {
        serviceId: this.serviceId,
        certificates: certificatesUrl,
        uinStr: this.form.uinStr,
      };
      inputEprRegisterInfoApi(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('录入成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.warn-title {
  color: #444;
  font-weight: 800;
  margin-right: 50px;
}
.warn-font {
  color: #ffd2b3;
}

.mb-15 {
  margin-bottom: 15px;
}
</style>
