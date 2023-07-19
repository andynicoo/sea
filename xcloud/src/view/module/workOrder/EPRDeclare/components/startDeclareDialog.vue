<template>
  <el-dialog :visible.sync="dialogvisible" width="650px" center @close="closeModel">
    <span slot="title" class="dialog-footer">
      <p>开始申报</p>
    </span>

    <el-form class="tax-form mt-10" :model="taxData" label-width="130px" ref="ruleForm" :rules="rules">
      <el-form-item label="业务分类">
        <el-select style="width: 250px" size="small" clearable v-model="taxData.type">
          <el-option :value="1" label="WEEE申报">WEEE申报</el-option>
          <el-option :value="2" label="包装法申报">包装法申报</el-option>
          <el-option :value="3" label="电池法申报">电池法申报</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上传表格" prop="declareReceiptList">
        <div class="import-template-block">
          <ManualUploadFile :limit="1" :maxSize="100" v-model="taxData.declareReceiptList" accept=".xls,.xlsx" />
        </div>
      </el-form-item>

      <p><span class="red-font">注意：</span>文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小<100M，只需上传服务号，数据全部放在第一列</p>
      <p @click="seeTemplate">
        <el-link type="primary" :underline="false">查看服务号模板</el-link>
      </p>

      <el-form-item label="申报截止日期：" prop="createTime">
        <el-date-picker v-model="taxData.createTime" align="right" size="small" clearable unlink-panels placeholder="申报截止日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 250px"> </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ManualUploadFile from '@/components/manualUploadFile/index.vue';
export default {
  props: {
    startDeclareDialog: Boolean,
    id: String,
    isYearManage: Boolean,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  components: { ManualUploadFile },
  data() {
    return {
      rules: {
        type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        createTime: [{ required: true, message: '请选择申报截止日期', trigger: 'change' }],
        declareReceiptList: [{ required: true, type: 'array', message: '请上传表格', trigger: 'change' }],
      },

      taxData: {
        declareReceiptList: [], // 申报回执
        createTime: '',
        type: '',
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.startDeclareDialog;
      },
      set(val) {
        this.$emit('update:startDeclareDialog', val);
      },
    },
  },

  watch: {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    seeTemplate() {
      window.open('https://file.itaxs.com/pro/20221019/7bed76542cc748be99a4359ed66cc3f1.xlsx');
    },
    closeModel() {
      (this.taxData.declareReceiptList = []), // 申报回执
        (this.taxData.createTime = '');
      this.taxData.type = '';
      this.$refs['ruleForm'].resetFields();
    },
    confirm() {
      let formData = new FormData();
      formData.append('file', this.taxData.declareReceiptList[0].raw);
      formData.append('due', this.taxData.createTime);
      formData.append('type', this.taxData.type);
      this.$util
        .formDataRequest({
          url: '/workorder/management/epr/declare/notify',
          data: formData,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('保存成功');
            this.dialogvisible = false;
            this.$emit('refresh');
          } else {
            this.$message.error(res.message);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}
/deep/ .dialog-footer p {
  font-size: 18px;
  font-weight: 800;
  color: #333;
}
/deep/ .dialog-footer .diag-head-title {
  color: #e6a23c;
}
/deep/ .el-dialog__header {
  height: 82px;
}
/deep/ .el-upload-dragger {
  height: auto;
}
.red-font {
  color: #d9001b;
}
</style>
