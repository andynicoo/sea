<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量上传申报回执</p>
      <div class="diag-head-title">请按照说明操作：</div>
      <span class="diag-head-title">上传结果请到【上传/下载中心】查询</span>
    </span>
    <template>
      <el-form :model="form" :rules="rules" ref="form">
        <h3 class="step-title">步骤1：准备批量上传的回执文件</h3>
        <p>
          <span>每个回执文件按要求命名</span>
          <el-tooltip class="item" effect="dark" content="国家：IOSS的国家表示其注册的国家" placement="top-start" style="margin-left: 10px">
            <div slot="content">
              <p>若同一税号同一申报周期有多个回执</p>
              <p>回执命名：</p>
              <p>税号_申报周期_1;</p>
              <p>税号_申报周期_2;</p>
              <p>税号_申报周期_3;</p>
            </div>
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
        </p>
        <p>
          <span>回执文件命名格式：</span>
          <span class="text-primary">税号_申报周期.pdf</span>
        </p>
        <p>如：税号_2021-01-01~2021-01-31.pdf</p>

        <h3 class="step-title">步骤2：压缩以上步骤准备的文件，上传</h3>
        <p>将编辑好的回执文件全选，生成1个压缩文件包上传</p>
        <p class="text-danger">注意：</p>
        <p>压缩包仅限zip格式；</p>
        <p>压缩包内不能有文件夹；</p>
        <p>压缩包小于100M;</p>
        <el-form-item prop="fileList">
          <el-upload ref="uploadRef" action="action" accept=".zip" :limit="1" :auto-upload="false" :file-list="form.fileList" :on-change="handleChange" :on-remove="handleRemove" drag>
            <div class="drag-wrapper">
              <i class="icon icon-file-upload"></i>
              <div class="el-upload__text" style="line-height: 1.5; margin-top: 10px; font-size: 12px">
                <div>点击或将文件拖拽到这里上传</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <h3 class="step-title">步骤3：选择报税日期</h3>
        <el-form-item label="报税日期：" prop="period">
          <el-date-picker v-model="form.period" type="month" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择月份" style="width: 200px"> </el-date-picker>
          <el-tooltip class="item" effect="dark" content="国家：IOSS的国家表示其注册的国家" placement="top-start" style="margin-left: 10px">
            <div slot="content">
              <p>报税日期举例说明：</p>
              <p>月报2022年3月1日-2022年3月31日的报税日期为2022年4月；</p>
              <p>季报2022年2月1日-2022年4月30的报税日期为2022年5月；</p>
            </div>
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
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
import { getToken } from '@/libs/util';
import axios from 'axios';
export default {
  props: {
    batchUploadReceiptDialog: Boolean,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchUploadReceiptDialog;
      },
      set(val) {
        this.$emit('update:batchUploadReceiptDialog', val);
      },
    },
  },
  data() {
    return {
      form: {
        fileList: [],
        period: '',
      },
      rules: {
        fileList: [{ type: 'array', required: true, message: '请上传回执文件', trigger: 'blur' }],
        period: [{ required: true, message: '请选择报税日期', trigger: 'blur' }],
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
          formData.append('period', this.form.period);
          this.uploadLoading = true;
          axios({
            url: this.baseUrl + '/workorder/management/declare/work_order/batch/receipt',
            headers: {
              Authorization: 'Bearer ' + getToken(),
              enterpriseId: localStorage.getItem('enterpriseId'),
              'Content-Type': 'multipart/form-data',
            },
            method: 'post',
            data: formData,
          })
            .then((res) => {
              this.uploadLoading = false;
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
    handleChange(file, fileList) {
      let fileType = this.$util.getFileSuffixName(file.name);
      const FILE_TYPE = ['zip'];
      const MAX_SIZE = file.size / 1024 / 1024 < 100;
      // 验证文件类型
      console.log(file, FILE_TYPE);
      if (!FILE_TYPE.includes(fileType)) {
        this.form.fileList = [];
        this.$message.warning('请选择zip格式的文件');
        return;
      }
      // 验证文件大小
      if (!MAX_SIZE) {
        this.form.fileList = [];
        this.$message.warning('文件不大于100M');
        return;
      }
      this.form.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
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
