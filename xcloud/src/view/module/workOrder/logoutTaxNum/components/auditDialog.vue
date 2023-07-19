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
      <el-form-item label="审核：" prop="operation">
        <el-radio-group v-model="form.operation">
          <!-- <el-radio :label="1">审核通过</el-radio> -->
          <el-radio :label="2">资料不对，驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="选择服务商：" prop="remark" v-if="form.operation === 1">
        <el-select
          style="width: 300px"
          v-model="form.content"
          size="small"
          filterable
        >
          <el-option :value="1" label="服务号"></el-option>
          <el-option :value="2" label="手机号"></el-option>
          <el-option :value="3" label="订单号"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="驳回原因：" prop="cancelReason" v-if="form.operation === 2">
        <el-input
          v-model="form.cancelReason"
          placeholder="请输入"
          clearable
          type="textarea"
          style="width: 300px"
          size="small"
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
import {taxCancelAudit} from '@/api/newApi/workOrder/logoutTaxNum'
export default {
  props: {
    auditDialog: Boolean,
    serviceId: String,
  },
  data() {
    return {
      form: {
        cancelReason: "",
        operation: 2,
      },
      rules: {
        cancelReason: [{required: true, message: '请输入驳回理由', trigger: 'blur'}]
      }
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
  created() {},
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
      taxCancelAudit({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "驳回成功",
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
