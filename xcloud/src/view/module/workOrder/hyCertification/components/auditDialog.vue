<template>
  <el-dialog
    title="审核资料"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="审核：" prop="type">
        <el-radio :label="1" :value="1">审核通过</el-radio>
      </el-form-item>
      <el-form-item label="选择海牙服务商：" prop="supplierId">
        <el-select
          style="width: 260px"
          v-model="form.supplierId"
          size="small"
          filterable
        >
          <el-option v-for="item in supplierList" :key="item.supplierId" :value="item.supplierId" :label="item.shortName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {apostilleCheck} from '@/api/newApi/workOrder/hyCertification'
import {findSuppliers} from '@/api/newApi/processFields/processConfig.js'
export default {
  props: {
    auditDialog: Boolean,
    serviceId: String,
    supplierId: String
  },
  data() {
    return {
      form: {
        supplierId: ""
      },
      rules: {
        supplierId: [{required: true, message: '请选择海牙服务商', trigger: 'blur'}]
      },
      supplierList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDialog;
      },
      set(val) {
        this.$emit("update:auditDialog", val);
      },
    },
  },
  watch: {
    supplierId(val) {
      if(val) {
        this.form.supplierId = val
      }
    }
  },
  mounted() {
    this.getSuppliers()
  },
  methods: {
    // 获取服务商列表
    getSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.HYCERTIFICATION_FUNCTION_CODE
      }).then(res => {
        this.supplierList = res.data.records
      })
    },
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      apostilleCheck({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "审核成功",
            duration: 2000,
          });
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style></style>
