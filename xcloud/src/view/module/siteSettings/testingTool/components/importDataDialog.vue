<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>VAT</p>
      <div class="diag-head-title">请按照说明操作</div>
    </span>
    <template>
      <el-form :model="form" :rules="rules" ref="form">
        <h3 class="step-title">步骤1：下载模板，按照模版填写信息</h3>
        <p class="text-danger">注意：</p>
        <p>请保证表格以下几个字段里的变量已配置</p>
        <p>【公司注册地】</p>
        <p>【目标市场】</p>
        <p>【仓储地】</p>
        <p>【售卖渠道】</p>
        <p>【商品类别】</p>
        <p>
          <el-button @click="downloadTemplate">下载模版</el-button>
        </p>
        <h3 class="step-title">步骤2：上传信息表</h3>
        <p class="text-danger">注意：</p>
        <p>文件大小&lt;100M；</p>
        <p>表格信息中如果已有重复数据，系统将自动覆盖历史数据信息；</p>
        <el-form-item prop="fileList">
          <ManualUploadFile v-model="form.fileList" :maxSize="100" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit" :loading="uploadLoading">确定导入</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import ManualUploadFile from '@/components/manualUploadFile/index.vue';
import { searchDownload } from '@/api/newApi/siteSettings/testingTool';
export default {
  props: {
    importDataDialog: Boolean,
    checkIds: Array,
    type: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.importDataDialog;
      },
      set(val) {
        this.$emit('update:importDataDialog', val);
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
    downloadTemplate() {
      searchDownload({
        type: 0,
      }).then((res) => {
        this.$util.exportExcel(res, '合规模板');
      });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append('file', this.form.fileList[0].raw);
          this.uploadLoading = true;
          this.$util
            .formDataRequest({
              url: '/information/management/search/upload?type=' + this.type,
              data: formData,
            })
            .then((res) => {
              this.uploadLoading = false;
              if (res.code && res.code !== 0) {
                this.$message.error(res.message || '导入失败');
                return;
              }
              this.$message.success('导入成功');
              this.$emit('refresh');
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
