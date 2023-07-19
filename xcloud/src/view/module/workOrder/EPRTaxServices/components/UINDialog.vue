<template>
  <el-dialog
    :title="isEditUIN? '编辑UIN号' : '录入UIN号'"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="UIN号：" prop="uinStr">
        <el-input
          v-model="form.uinStr"
          placeholder="请输入"
          style="width:248px"
          clearable
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
import { addUIN, editUIN } from "@/api/newApi/workOrder/EPRManage";
export default {
  props: {
    UINDialog: Boolean,
    isEditUIN: Boolean,
    serviceId: String,
  },
  data() {
    return {
      form: {
        uinStr: ""
      },
      rules: {
        uinStr: [{required: true, message: '请输入UIN号', trigger: 'blur'}]
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.UINDialog;
      },
      set(val) {
        this.$emit("update:UINDialog", val);
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
      if (!this.isEditUIN) {
        addUIN({
          ...this.form,
          serviceId: this.serviceId
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success("保存成功");
            this.$emit("refresh");
          }
        });
      } else {
        editUIN({
          ...this.form,
          serviceId: this.serviceId
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success("保存成功");
            this.$emit("refresh");
          }
        });
      }
      
    },
  },
};
</script>

<style></style>
