<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="reset">
    <span slot="title" class="dialog-header">
      <p>批量下载</p>
      <span class="diag-head-title">下载结果请到【上传/下载中心】查询</span>
    </span>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="报税时间：" prop="month">
        <el-date-picker v-model="form.month" value-format="yyyy-MM-dd HH:mm:ss" type="month" align="right" size="small" clearable unlink-panels placeholder="选择月份" style="width: 200px"> </el-date-picker>
        <el-tooltip class="item" effect="dark" content="国家：IOSS的国家表示其注册的国家" placement="top-start" style="margin-left: 10px">
          <div slot="content">
            <p>报税日期举例说明：</p>
            <p>月报2022年3月1日-2022年3月31日的报税日期为2022年4月；</p>
            <p>季报2022年2月1日-2022年4月30的报税日期为2022年5月；</p>
          </div>
          <i class="el-icon-question text-warning"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="下载选项：" prop="material">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="form.material" @change="handleCheckChange">
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
    selectList: Array,
    batchDownloadDialog: Boolean,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchDownloadDialog;
      },
      set(val) {
        this.$emit('update:batchDownloadDialog', val);
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
        month: '',
        material: [],
      },
      optionsList: [],
      isIndeterminate: false,
      checkAll: false,
    };
  },
  created() {
    this.getDownloadItems();
  },
  methods: {
    handleCheckAllChange(val) {
      this.form.material = val ? this.optionsList.map((item) => item.value) : [];
      this.isIndeterminate = false;
    },
    handleCheckChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.optionsList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionsList.length;
    },
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
            serviceIds: this.selectList.map((item) => item.serviceId),
            material: this.form.material,
            beginTime: this.form.month,
            endTime: this.form.month,
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
      this.isIndeterminate = false;
      this.checkAll = false;
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
