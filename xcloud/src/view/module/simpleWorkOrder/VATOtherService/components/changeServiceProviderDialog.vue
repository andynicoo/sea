<template>
  <el-dialog title="修改服务商/律师" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="changeServiceProviderDialog" label-width="100px">
      <el-form-item label="国家" prop="countryName">
        {{ countryName }}
      </el-form-item>
      <el-form-item label="服务商/律师" prop="supplierId">
        <el-select style="width: 310px" v-model="form.supplierId" size="small" filterable>
          <el-option-group>
            <div class="option_title" style="background: #f6f8fa">
              <!-- <span>全称</span> -->
              <span>简称</span>
              <span>服务商类型</span>
            </div>
            <el-option v-for="item in userList" :key="item.code" :label="item.shortName" :value="item.id" class="option_title">
              <!-- <span>{{ item.supplierName }} </span>&nbsp; -->
              <span>{{ item.shortName }}</span>
              &nbsp;
              <span>{{ item.supplierType | filterType }}</span>
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
import { getSimpleWorkOrderSupplier, changeSimpleWorkOrderSupplier } from '@/api/newApi/simpleWorkOrder/otherService.js';
import { getSupplierList } from '@/api/newApi/common';
export default {
  props: {
    changeServiceProviderDialog: Boolean,
    ids: Array,
    countryName: String,
    countryCode: String,
  },
  data() {
    return {
      form: {
        supplierId: '',
      },
      userList: [],
      rules: {
        supplierId: [{ required: true, message: '请选择服务商/律师', trigger: 'blur' }],
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
        case '1':
          return '服务商';
        case '2':
          return '律师';
      }
    },
  },
  // mounted() {
  //   this.getUserList();
  // },
  watch: {
    // id() {
    //   if (this.dialogvisible) {
    //     this.getUserList();
    //   }
    // },
    countryCode: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getUserList();
        }
      },
    },
  },
  methods: {
    getUserList() {
      getSupplierList({
        functionCode: this.$constant.SIMPLE_WORK_ORDER,
        countryCodeList: [this.countryCode],
        // supplierType: 1,
        flow: false,
      }).then((res) => {
        this.userList = res.data;
      });
    },
    reset() {
      if (this.$refs.changeServiceProviderDialog) {
        this.$refs.changeServiceProviderDialog.resetFields();
      }
    },
    submit() {
      this.$refs['changeServiceProviderDialog'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      changeSimpleWorkOrderSupplier({
        ids: this.ids,
        ...this.form,
        supplierName: this.userList.find((item) => item.id === this.form.supplierId).shortName,
        type: this.userList.find((item) => item.id === this.form.supplierId).supplierType - 1,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
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
  span {
    flex: 3;
  }
}
</style>
