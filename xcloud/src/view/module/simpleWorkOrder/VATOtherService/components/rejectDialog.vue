<template>
  <el-dialog title="驳回进度" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="rejectDialog">
      <el-form-item label="当前进度：">
        {{ nodeCodeName | filterProgressBar }}
      </el-form-item>
      <el-form-item label="驳回到：">
        待上传资料
      </el-form-item>
      <el-form-item label="驳回原因：" prop="rejectReason">
        <el-input
          v-model="form.rejectReason"
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
        <!-- <div style="margin-left: 100px;color: #dd0707">如果选择发短信给客户，系统将会一并发送更改原因，请详细填写</div> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { rejectApi } from "@/api/newApi/simpleWorkOrder/otherService.js";
import { progressBarList } from "../enumObj";
export default {
  props: ["rejectDialog", "serviceId", "nodeCodeName"],
  data() {
    return {
      form: {
        rejectReason: "",
        sendMsg: false
      },
      rules: {
        rejectReason: [{ required: true, message: "请输入驳回原因", trigger: "blur" }]
      }
    };
  },
  filters: {
    filterProgressBar(progressBar) {
      let result = progressBarList.find(item => item.value == progressBar);
      return result ? result.label : "";
    }
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectDialog;
      },
      set(val) {
        this.$emit("update:rejectDialog", val);
      }
    }
  },
  methods: {
    reset() {
      if (this.$refs.rejectDialog) {
        this.$refs.rejectDialog.resetFields();
      }
    },
    submit() {
      this.$refs["rejectDialog"].validate(valid => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      rejectApi({
        ...this.form,
        id: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("驳回成功");
          this.$emit("refresh");
        }
      });
    }
  }
};
</script>

<style></style>
