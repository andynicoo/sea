<template>
  <el-dialog title="录入转代理结果" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="UIN号：" prop="uinStr" v-if="countryCode !== 'DE'">
        <el-input v-model="form.uinStr" placeholder="请输入" style="width: 248px" clearable />
      </el-form-item>
      <el-form-item label="账单：" prop="billFiles" v-if="countryCode !== 'DE'">
        <UploadFileUrl :fileList.sync="form.billFiles" :showTip="false" :limit="10" fileClass></UploadFileUrl>
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
    recordDialog: Boolean,
    serviceId: String,
    certificates: Array,
    billFiles: Array,
    uinStr: String,
    countryCode: String,
  },
  data() {
    return {
      form: {
        uinStr: '',
        billFiles: '',
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
        return this.recordDialog;
      },
      set(val) {
        this.$emit('update:recordDialog', val);
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
    billFiles(val) {
      this.form.billFiles = val.join(',');
    },
  },
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
      let billUrl = this.form.billFiles.split(',').filter((item) => item);
      let certificatesUrl = this.form.certificates.split(',').filter((item) => item);
      let data = {
        serviceId: this.serviceId,
        certificates: certificatesUrl,
        billFiles: billUrl,
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

<style></style>
