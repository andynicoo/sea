<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量上传证书文件</p>
      <div class="diag-head-title">请按照说明操作</div>
    </span>
    <template>
      <el-form :model="form" :rules="rules" ref="form">
        <h3 class="step-title">步骤1：准备批量上传的证书信息</h3>
        <p>
          <span>下载模板，按照模版填写信息</span>
        </p>
        <p>
          <el-button @click="downloadTemplate">下载证书信息模版</el-button>
        </p>
        <p class="text-danger">注意：</p>
        <p>表格内<strong>标星</strong>信息必填；</p>
        <p>模板中的表头名称不可更改，表头行不能删除；</p>
        <p>不得修改信息表命名；</p>
        <p>表格内所有字段必须是文本格式；</p>
        <h3 class="step-title">步骤2：准备批量上传的证书文件</h3>
        <p>
          <span>每个证书文件按要求命名</span>
        </p>
        <p>
          <span>证书文件命名格式：</span>
          <span class="text-primary">公司中文名称</span>
        </p>
        <h3 class="step-title">步骤3：压缩以上步骤准备的文件，上传</h3>
        <p>
          <span>将编辑好的信息表和证书文件全选，生成1个压缩文件包上传</span>
        </p>
        <p class="text-danger">注意：</p>
        <p>压缩包仅限zip格式；</p>
        <p>压缩包内不能有文件夹；</p>
        <p>压缩包小于100M；</p>
        <el-form-item prop="fileList">
          <ManualUploadFile v-model="form.fileList" accept=".zip" />
        </el-form-item>
        <el-form-item label="是否完成注册" prop="complete">
          <el-radio-group v-model="form.complete">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit" :loading="uploadLoading">批量上传</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import ManualUploadFile from '@/components/manualUploadFile/index.vue';
export default {
  props: {
    batchUploadCertificatesDialog: Boolean,
    checkIds: Array,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchUploadCertificatesDialog;
      },
      set(val) {
        this.$emit('update:batchUploadCertificatesDialog', val);
      },
    },
  },
  components: {
    ManualUploadFile,
  },
  data() {
    return {
      form: {
        fileList: [],
        complete: false,
      },
      rules: {
        fileList: [{ type: 'array', required: true, message: '请上传回执文件', trigger: 'blur' }],
      },
      uploadLoading: false,
    };
  },
  methods: {
    downloadTemplate() {
      window.open(this.baseUrl + `/workorder/management/vat/epr/serviceCompanyTemplate`);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append('file', this.form.fileList[0].raw);
          this.uploadLoading = true;
          this.$util
            .formDataRequest({
              url: '/workorder/management/vat/epr/certificate/batch',
              data: formData,
              params: { complete: this.form.complete },
            })
            .then((res) => {
              this.uploadLoading = false;
              if (res.code && res.code !== 0) {
                this.$message.error(res.message || '上传失败');
                return;
              }
              this.$message.success('请到上传/下载中心查看上传结果');
              this.dialogvisible = false;
            })
            .catch((e) => {
              this.uploadLoading = false;
              this.$message.error('服务器错误');
            });
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

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}
/deep/ .dialog-header p {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}
/deep/ .dialog-header .diag-head-title {
  color: #e6a23c;
}
/deep/ .el-dialog__header {
  height: auto;
}
::v-deep {
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      flex: 0 0 200px;
      width: 200px;
    }
  }
}
.dialog-content {
  text-align: center;
}
.upload-result {
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: rgba($color: #000000, $alpha: 0.1);
}
.dialog-footer {
  text-align: center;
}
.step-title {
  color: #333;
  margin: 10px 0;
}
::v-deep {
  .el-upload-dragger {
    margin-top: 10px;
    width: 300px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
