<template>
  <el-dialog
    title="初步审核"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="85px"
    >
      <el-form-item label="审核结果" prop="isPass">
        <el-radio-group v-model="form.isPass">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <span v-if="!form.isPass">
        <el-form-item label="驳回原因" prop="reason">
          <el-input
            v-model="form.reason"
            placeholder="输入驳回原因"
            clearable
            type="textarea"
            style="width: 300px"
            size="small"
            maxlength="200"
          />
          <div>注：驳回原因客户可见，请谨慎输入</div>
        </el-form-item>
        <el-form-item label="短信通知" prop="isSendMsg">
          <el-radio-group v-model="form.isSendMsg">
            <el-radio :label="true">通知用户</el-radio>
            <el-radio :label="false">不通知用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </span>
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
import {progressBarObj} from '../enumObj'
import {patentPreAudit} from "@/api/newApi/intellectualProperty/appearancePatent";
export default {
  props: {
    preAuditDialog: Boolean,
    rejectNodeName: String,
    serviceId: String,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        reason: "",
        isPass: true,
        isSendMsg: true
      },
      rules: {
        reason: [{required: true, message: '请输入驳回原因', trigger: 'blur'}],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.preAuditDialog;
      },
      set(val) {
        this.$emit("update:preAuditDialog", val);
      },
    },
  },
  methods: {
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
      patentPreAudit({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
          this.$emit("refresh");
        }
      });
    },
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
  },
};
</script>

<style></style>
