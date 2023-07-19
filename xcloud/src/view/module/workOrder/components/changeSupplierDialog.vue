<template>
  <!-- 修改服务商 -->
  <el-dialog title="修改服务商" :visible.sync="dialogvisible" width="400px" @close="reset">
    <el-form ref="form" label-width="160px" :rules="rules" :model="form">
      <el-form-item label="国家：">{{ checkedRow.countryNameZh }}</el-form-item>
      <el-form-item label="选择服务商：" prop="supplierId">
        <el-select v-model="form.supplierId" clearable filterable style="width: 168px">
          <el-option v-for="(item, key) in supplierList" :key="key" :value="item.id" :label="item.shortName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <p v-if="checkedRow.currentNodeCode == currentCodeEnum.NODE2" class="warn-color">变更服务商后，服务流程会刷新为新服务商流程</p>
    <p v-if="checkedRow.currentNodeCode == currentCodeEnum.NODE3" class="warn-color">新服务商资料可能有变动，变更服务商后，请重新审核资料；</p>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplierList } from '@/api/newApi/common';
import { getHandlerUserList } from '@/api/newApi/supplyChain/allocationRules.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import { currentCodeEnum, currentCodeList } from '@/view/module/workOrder/map.js';
export default {
  props: {
    changeSupplierDialog: Boolean,
    functionCode: [String, Number],
    checkedRow: Object,
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
      currentCodeEnum,
    };
  },
  methods: {
    getSuppliers() {
      getSupplierList({
        functionCode: this.functionCode,
        countryCodeList: [this.checkedRow.countryCode],
        supplierType: 1,
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
      workOrderCommonOperator('changeSupplier', {
        ...this.form,
        workIdColl: [this.checkedRow.id],
      }).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
