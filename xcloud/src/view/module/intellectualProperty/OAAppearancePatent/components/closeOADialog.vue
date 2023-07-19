<template>
  <el-dialog title="关闭OA" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="85px">
      <div class="tip">请确认该OA流程已完成答复或客户已放弃答复</div>
      <el-form-item label="关闭原因" prop="unanswerResson">
        <el-input
          v-model="form.unanswerResson"
          placeholder="输入关闭原因"
          clearable
          type="textarea"
          style="width: 300px"
          size="small"
          maxlength="200"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { progressBarObj } from "../enumObj";
import { OAPatentClose } from "@/api/newApi/intellectualProperty/OAAppearancePatent";
export default {
  props: {
    closeOADialog: Boolean,
    workOrderId: String,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        unanswerResson: "",
      },
      rules: {
        unanswerResson: [{ required: true, message: "请输入关闭原因", trigger: "blur" }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.closeOADialog;
      },
      set(val) {
        this.$emit("update:closeOADialog", val);
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
      OAPatentClose({
        ...this.form,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("关闭成功");
          this.$emit("refresh");
        }
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tip {
  margin-bottom: 20px;
}
</style>
