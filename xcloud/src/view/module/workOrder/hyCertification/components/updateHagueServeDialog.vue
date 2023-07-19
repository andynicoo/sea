<template>
  <el-dialog title="修改海牙服务商" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="esSupplierId">
        <el-select style="width: 410px" v-model="form.esSupplierId" size="small" filterable>
          <el-option-group>
            <div class="option_title" style="background: #f6f8fa">
              <!-- <span>全称</span> -->
              <span>简称</span>
              <span>服务商类型</span>
            </div>
            <el-option v-for="item in userList" :key="item.code" :label="item.shortName" :value="item.supplierId" class="option_title">
              <!-- <span>{{ item.supplierName }} </span>&nbsp; -->
              <span>{{ item.shortName }} </span>&nbsp;
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
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { updataSupplieres } from '@/api/newApi/workOrder/hyCertification';
export default {
  props: {
    isShow: Boolean,
    workId: [String, Number],
    countryCode: String,
  },
  data() {
    return {
      form: {
        esSupplierId: '',
      },
      userList: [],
      rules: {
        esSupplierId: [{ required: true, message: '请选择服务商', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit('update:isShow', val);
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
    /**
     * 获取接口数据
     */
    getSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.HYCERTIFICATION_FUNCTION_CODE,
        countryCode: this.countryCode,
      }).then((res) => {
        this.userList = res.data.records;
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    /**
     * 确认
     */
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    /**
     * 更改海牙服务商
     */
    confirm() {
      const findVal = this.userList.find((item) => item.supplierId == this.form.esSupplierId);
      // console.log(findVal);
      updataSupplieres({
        esSupplierName: findVal.shortName,
        esSupplierId: this.form.esSupplierId,
        serviceId: this.workId,
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
