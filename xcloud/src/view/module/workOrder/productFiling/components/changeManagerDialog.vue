<template>
  <el-dialog
    title="修改交付专员"
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
      <el-form-item label="交付专员" prop="disposeId">
        <el-select
          style="width: 300px"
          placeholder="请选择"
          size="small"
          filterable
          v-model="form.disposeId"
        >
          <el-option v-for="item in userList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确 定</el-button
      >
      <el-button @click="dialogvisible = false" size="small"
        >取 消</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {filingDisposeBatch} from "@/api/newApi/workOrder/productFiling";
export default {
  props: {
    changeManagerDialog: Boolean,
    workIds: Array,
    userList: Array
  },
  data() {
    return {
      form: {
        disposeId: ""
      },
      rules: {
        disposeId: [{required: true, message: '请选择交付专员', trigger: 'blur'}]
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeManagerDialog;
      },
      set(val) {
        this.$emit("update:changeManagerDialog", val);
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
      filingDisposeBatch({
        ...this.form,
        workIds: this.workIds,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("修改成功");
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style></style>
