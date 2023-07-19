<template>
  <!-- 修改服务商地址 -->
  <el-dialog title="修改服务商地址" :visible.sync="dialogvisible" center width="400px" @close="reset">
    <el-form ref="form" label-width="160px" :rules="rules" :model="form">
      <el-form-item label="选择注册地址：" prop="registrarAddress">
        <el-select style="width: 168px" v-model="form.registrarAddress" placeholder="国家" filterable>
          <el-option v-for="(item, index) in addressList" :key="index" :label="item.registerAddress" :value="item.registerAddress"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false"> 取消 </el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplierById } from '@/api/newApi/supplyChain/serviceproviderManage.js';
import { saveRegistrarAddress } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    changeSupplierAddressDialog: Boolean,
    workId: [String, Number],
    supplierId: String,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeSupplierAddressDialog;
      },
      set(val) {
        this.$emit('update:changeSupplierAddressDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getAddress();
      }
    },
  },
  data() {
    return {
      form: {
        registrarAddress: '',
      },
      rules: {
        registrarAddress: [{ required: true, message: '地址不能为空', trigger: 'change' }],
      },
      addressList: [],
    };
  },
  methods: {
    getAddress() {
      getSupplierById({
        id: this.supplierId,
      }).then((res) => {
        if (res.data.registerAddress != '') {
          try {
            this.addressList = JSON.parse(res.data.registerAddress);
          } catch {
            this.addressList = res.data.registerAddress;
          }
        }
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
      saveRegistrarAddress({
        ...this.form,
        workId: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          this.dialogvisible = false;
          this.$message.success('操作成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
