<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量上传海牙文件</p>
      <div class="diag-head-title">请按照说明操作</div>
    </span>
    <template>
      <el-form :model="form" :rules="rules" ref="form">
        <h3 class="step-title">步骤1：准备批量上传的海牙文件</h3>
        <p>
          <span>每个海牙文件按要求命名</span>
        </p>
        <p>
          <span>海牙文件命名格式：</span>
          <span class="text-primary">公司中文名称_海牙编码</span>
        </p>
        <h3 class="step-title">步骤2：压缩以上步骤准备的文件，上传</h3>
        <p>
          <span>将编辑好的海牙文件全选，生成1个压缩文件包上传</span>
        </p>
        <p class="text-danger">注意：</p>
        <p>压缩包仅限zip格式；</p>
        <p>压缩包内不能有文件夹；</p>
        <p>压缩包小于100M;</p>
        <el-form-item prop="fileList">
          <ManualUploadFile v-model="form.fileList" accept=".zip" />
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
    batchUploadHYFileDialog: Boolean,
    checkIds: Array,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchUploadHYFileDialog;
      },
      set(val) {
        this.$emit('update:batchUploadHYFileDialog', val);
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
      },
      rules: {
        fileList: [{ type: 'array', required: true, message: '请上传回执文件', trigger: 'blur' }],
      },
      uploadLoading: false,
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append('file', this.form.fileList[0].raw);
          this.uploadLoading = true;
          this.$util
            .formDataRequest({
              url: '/workorder/management/declare/work_order/batch/receipt',
              data: formData,
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
