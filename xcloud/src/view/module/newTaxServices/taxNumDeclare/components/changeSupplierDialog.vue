<template>
  <!-- 修改服务商 -->
  <el-dialog title="修改服务商" :visible.sync="dialogvisible" width="400px" @close="reset">
    <el-form ref="form" label-width="160px" :rules="rules" :model="form">
      <el-form-item label="国家：">{{ countryNameZh }}</el-form-item>
      <el-form-item label="选择服务商：" prop="supplierId">
        <el-select v-model="form.supplierId" clearable filterable style="width: 168px">
          <el-option v-for="(item, key) in supplierList" :key="key" :value="item.id" :label="item.shortName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplierList } from '@/api/newApi/common';
import { changeDeclareSupplier } from '@/api/newApi/taxServices/taxNumDeclare.js';
export default {
  props: {
    changeSupplierDialog: Boolean,
    countryCode: String,
    countryNameZh: String,
    workId: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeSupplierDialog;
      },
      set(val) {
        this.$emit('update:changeSupplierDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getSuppliers();
      }
    },
  },
  data() {
    return {
      form: {
        supplierId: '',
      },
      rules: {
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      supplierList: [],
    };
  },
  methods: {
    getSuppliers() {
      getSupplierList({
        supplierType: 1,
        functionCodeColl: ['2', '5', '23'],
        countryCode: this.countryCode,
        countryCodeList: [this.countryCode],
        flow: true,
      }).then((res) => {
        this.supplierList = res.data;
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirm();
        }
      });
    },
    confirm() {
      changeDeclareSupplier({
        ...this.form,
        supplierName: this.supplierList.find((item) => item.id === this.form.supplierId).shortName,
        workId: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
