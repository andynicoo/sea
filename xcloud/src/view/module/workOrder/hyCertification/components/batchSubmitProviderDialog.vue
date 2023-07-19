<template>
  <el-dialog :visible.sync="dialogvisible" width="450px" center>
    <span slot="title" class="dialog-header">
      <p>批量提交服务商</p>
      <span class="diag-head-title">仅支持同一国家同一服务商批量操作</span>
    </span>

    <p>以下资料清单邮寄给服务商：</p>
    <p>1、海牙授权书</p>
    <p>2、资质证明</p>
    <p>3、营业执照扫描件与翻译件</p>
    <p>4、法人身份证扫描件与翻译件</p>
    <el-form :model="form" :rules="rules" ref="form" style="margin-top: 10px">
      <el-form-item label="物流公司：" prop="company">
        <el-select style="width: 260px" v-model="form.company" size="small" filterable>
          <!-- <el-option v-for="item in supplierList" :key="item.supplierId" :value="item.supplierId" :label="item.shortName"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号：" prop="num">
        <el-input style="width: 260px" v-model="form.num" placeholder="请输入寄出海牙文件的快读单号"></el-input>
      </el-form-item>
    </el-form>
    <p class="text-danger">注意：请确认勾选的工单是同一个快递单寄送给服务商；</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchDownloadVat } from '@/api/newApi/common';
export default {
  props: {
    batchSubmitProviderDialog: Boolean,
    checkIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchSubmitProviderDialog;
      },
      set(val) {
        this.$emit('update:batchSubmitProviderDialog', val);
      },
    },
  },
  data() {
    return {
      form: {
        company: '',
        num: '',
      },
      rules: {
        company: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
        num: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          batchDownloadVat({
            idType: 'WORK_ID',
            ids: this.checkIds,
          }).then((res) => {
            this.dialogvisible = false;
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.dialog-content {
  text-align: center;
}
.dialog-footer {
  text-align: center;
}
</style>
