<template>
  <!-- 更改税务经理弹窗 -->
  <el-dialog
    title="更改交付专员"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="changeManagerDialog"
    >
      <el-form-item prop="userId">
        <el-select
          style="width: 410px"
          v-model="form.userId"
          size="small"
          filterable
        >
          <el-option v-for="item in userList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
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
import {changeDispose} from '@/api/newApi/simpleWorkOrder/otherService.js'
export default {
  props: {
    changeManagerDialog: Boolean,
    ids: Array,
    userList:Array
  },
  data() {
    return {
      form: {
        userId: '',
      },
      rules: {
        userId: [{required: true, message: '请选择税务经理', trigger: 'blur'}]
      }
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
      if(this.$refs.changeManagerDialog) {
        this.$refs.changeManagerDialog.resetFields()
      }
    },
    submit() {
      this.$refs["changeManagerDialog"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      changeDispose({
        ids: this.ids,
        nickName: this.userList.find(item => item.userId === this.form.userId).nickName,
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

<style></style>
