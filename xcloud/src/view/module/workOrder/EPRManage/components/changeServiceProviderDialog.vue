<template>
  <el-dialog title="修改服务商" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="supplierId">
        <el-select style="width: 410px" v-model="form.supplierId" size="small" filterable>
          <el-option-group>
            <div class="option_title" style="background: #f6f8fa">
              <!-- <span>全称</span> -->
              <span>简称</span>
              <span>服务商类型</span>
            </div>
            <el-option v-for="item in userList" :key="item.id" :label="item.shortName" :value="item.id" class="option_title">
              <!-- <span>{{ item.supplierName }} </span>&nbsp; -->
              <span>{{ item.shortName }} </span>&nbsp;
              <span>服务商</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">继续</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { authAgentChange } from '@/api/newApi/workOrder/authorizedRepresent';

import { getSupplierList } from '@/api/newApi/common';

export default {
  props: {
    changeServiceProviderDialog: Boolean,
    serviceId: String,
    countryCode: String,
    productFunctionCode: String | Number,
  },
  data() {
    return {
      form: {
        supplierId: '',
      },
      userList: [],
      rules: {
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeServiceProviderDialog;
      },
      set(val) {
        this.$emit('update:changeServiceProviderDialog', val);
      },
    },
  },
  filters: {
    filterType(type) {
      switch (type) {
        case 1:
          return '服务商';
        case 2:
          return '律师';
      }
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getSuppliers();
      }
    },
  },
  methods: {
    getSuppliers() {
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: this.productFunctionCode,
        countryCode: this.countryCode,
        flow: true,
      }).then((res) => {
        this.userList = res.data;
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
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      authAgentChange({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}
</style>
>
