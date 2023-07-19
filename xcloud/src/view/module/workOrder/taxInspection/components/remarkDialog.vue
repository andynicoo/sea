<template>
  <el-dialog
    title="添加备注"
    :visible.sync="dialogvisible"
    width="480px"
    @close="reset"
    center
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      style="padding: 0 35px"
    >
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          clearable
          size="small"
          type="textarea"
          style="width: 300px"
          rows="4"
        />
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
import {addTaxCheckRemark} from '@/api/newApi/workOrder/taxInspection'
export default {
  props: {
    remarkDialog: Boolean,
    serviceId: String,
  },
  data() {
    return {
      form: {
        remark: ""
      },
      rules: {
        remark: [{required: true, message: '请输入备注', trigger: 'blur'}],
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.remarkDialog;
      },
      set(val) {
        this.$emit("update:remarkDialog", val);
      },
    },
  },
  methods: {
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
      addTaxCheckRemark({
        ...this.form,
        serviceId: this.serviceId
      }).then(res => {
        if(res.code === 0) {
          this.$message.success('添加成功')
          this.$emit('refresh')
        }
      })
    },
  },
};
</script>

<style></style>
