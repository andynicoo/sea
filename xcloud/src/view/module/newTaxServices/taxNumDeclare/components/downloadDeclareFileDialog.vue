<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量下载</p>
      <span class="diag-head-title">下载结果请到【上传/下载中心】查询</span>
    </span>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="报税时间：" prop="month">
        <el-date-picker v-model="form.month" value-format="yyyy-MM" type="monthrange" align="right" size="small" clearable unlink-panels placeholder="选择月份" style="width: 200px"> </el-date-picker>
      </el-form-item>
      <el-form-item label="下载选项：" prop="material">
        <el-checkbox-group v-model="form.material">
          <el-checkbox :label="item.value" v-for="item in optionsList" :key="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { declareDownloadItems, batchDeclareDownload } from '@/api/newApi/taxServices/taxNumDeclare';
export default {
  props: {
    serviceId: String,
    downloadDeclareFileDialog: Boolean,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.downloadDeclareFileDialog;
      },
      set(val) {
        this.$emit('update:downloadDeclareFileDialog', val);
      },
    },
  },
  data() {
    return {
      rules: {
        month: [{ required: true, message: '请选择申报周期', trigger: 'blur' }],
        material: [{ required: true, message: '请选择下载选项', trigger: 'blur' }],
      },
      form: {
        month: [],
        material: [],
      },
      optionsList: [],
    };
  },
  created() {
    this.getDownloadItems();
  },
  methods: {
    getDownloadItems() {
      declareDownloadItems().then((res) => {
        this.optionsList = Object.keys(res.data).map((value) => ({
          label: res.data[value],
          value,
        }));
      });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          batchDeclareDownload({
            serviceIds: [this.serviceId],
            material: this.form.material,
            beginTime: this.form.month[0] + '-01 00:00:00',
            endTime: this.form.month[1] + '-01 00:00:00',
          }).then((res) => {
            this.dialogvisible = false;
            this.$message.success('请到上传/下载中心查看下载结果');
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
  height: 82px;
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
.dialog-footer {
  text-align: center;
}
</style>
