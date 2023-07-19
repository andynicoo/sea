<template>
  <!-- 修改服务商 -->
  <el-dialog title="修改欧盟税号" :visible.sync="dialogvisible" width="400px" @close="reset">
    <el-form ref="form" label-width="160px" :rules="rules" :model="form">
      <el-form-item label="欧盟税号：" prop="taxNumberEu">
        <el-input v-model="form.taxNumberEu" placeholder="请输入欧盟税号" clearable style="width: 168px" />
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeTaxNumber } from '@/api/newApi/taxServices/taxRegister.js';
export default {
  props: {
    changeTaxNumberEuDialog: Boolean,
    functionCode: String,
    checkedRow: Object,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeTaxNumberEuDialog;
      },
      set(val) {
        this.$emit('update:changeTaxNumberEuDialog', val);
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
        taxNumberEu: '',
      },
      rules: {
        taxNumberEu: [{ required: true, message: '请输入欧盟税号', trigger: 'blur' }],
      },
      supplierList: [],
    };
  },
  methods: {
    getSuppliers() {
      this.form.taxNumberEu = this.checkedRow.taxQualityDTO.taxNumberEu;
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
      let params = {
        regId: this.checkedRow.id,
        taxNumberEu: this.form.taxNumberEu,
      };
      changeTaxNumber(params)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功');

            this.dialogvisible = false;
            this.$emit('refresh');
          }
        })
        .catch((e) => {
          this.exportLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
