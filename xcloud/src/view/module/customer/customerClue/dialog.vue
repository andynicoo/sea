<template>
  <el-dialog
    :title="ids.length > 1 ? '批量推送' : '推送'"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      ref="form"
    >
      <el-form-item label="电话：" prop="phone" required :show-message="false">
        <el-input v-model="form.phone" style="width: 300px" placeholder="请输入"  />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small"
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
import {apostilleCheck} from '@/api/newApi/workOrder/hyCertification'
export default {
  props: {
    dialogvisible: Boolean,
    ids: Array
  },
  data() {
    return {
      form: {
        phone: ""
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.dialogvisible;
      },
      set(val) {
        this.$emit("update:dialogvisible", val);
      },
    },
  },
  methods: {

    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      apostilleCheck({
        ...this.form,
        ids: this.ids,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "推送成功",
            duration: 2000,
          });
          this.$emit("refresh");
          this.visible = false;
        }
      });
    },
    reset(){
      this.$refs["form"].resetFields()
    }
  },
};
</script>

<style></style>
