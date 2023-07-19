<template>
  <el-dialog
    title="修改公司"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="changeCompanyDialog"
    >
      <el-form-item prop="materialId">
        <el-select
          style="width: 410px"
          v-model="form.materialId"
          size="small"
          filterable
        >
          <el-option-group>
            <el-option
              v-for="item in companyList"
              :key="item.code"
              :label="item.companyName"
              :value="item.id"
            >
            </el-option>
          </el-option-group>
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
        >继续</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {getUserCompanyMaterial} from '@/api/newApi/workOrder/hyCertification.js'
import {changeSimpleWorkOrderCompany} from '@/api/newApi/simpleWorkOrder/otherService.js'
export default {
  props: {
    changeCompanyDialog: Boolean,
    id: String,
    userId: String
  },
  data() {
    return {
      form: {
        materialId: '',
      },
      companyList: [],
      rules: {
        materialId: [{required: true, message: '请选择公司', trigger: 'blur'}]
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeCompanyDialog;
      },
      set(val) {
        this.$emit("update:changeCompanyDialog", val);
      },
    },
  },
  filters: {
    filterType(type) {
      switch (type) {
        case 0:
          return '服务商'
        case 1:
          return '律师'
      }
    }
  },
  watch: {
    id() {
      if(this.dialogvisible) {
        this.getCompany()
      }
    }
  },
  methods: {
    getCompany() {
      getUserCompanyMaterial({
        userId: this.userId,
        page: 1,
        limit: 9999,
        enterPriseId: localStorage.getItem('enterpriseId')
      }).then(res => {
        this.companyList = res.data
      })
    },
    reset() {
      if(this.$refs.changeCompanyDialog) {
        this.$refs.changeCompanyDialog.resetFields()
      }
    },
    submit() {
      this.$refs["changeCompanyDialog"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      changeSimpleWorkOrderCompany({
        id: this.id,
        ...this.form
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功')
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
