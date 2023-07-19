<template>
  <el-dialog
    title="驳回进度"
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
      <el-form-item label="当前进度：">
        {{nodeCodeName}}
      </el-form-item>
      <el-form-item label="驳回到：">
        {{rejectNodeName}}
      </el-form-item>
      <el-form-item label="驳回原因：" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          clearable
          type="textarea"
          style="width: 300px"
          size="small"
        />
      </el-form-item>
      <el-form-item label="发短信给客户：" prop="sendMsg">
        <el-radio-group v-model="form.sendMsg">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <div style="margin-left: 100px;color: #dd0707">如果选择发短信给客户，系统将会一并发送更改原因，请详细填写</div>
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
import { eprRejectAuthorization} from "@/api/newApi/workOrder/EPRManage";
export default {
  props: {
    rejectDialog: Boolean,
    serviceId: String,
    nodeCodeName: String,
    rejectNodeName: String,
  },
  data() {
    return {
      form: {
        remark: "",
        sendMsg: false,
      },
      rules: {
        remark: [{required: true, message: '请输入驳回原因', trigger: 'blur'}]
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectDialog;
      },
      set(val) {
        this.$emit("update:rejectDialog", val);
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
      eprRejectAuthorization({
        ...this.form,
        status:2,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("驳回成功");
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style></style>
