<template>
  <el-dialog title="更改客服" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="changeCustomerServiceDialog">
      <el-form-item prop="userId">
        <el-select style="width: 410px" v-model="form.userId" size="small" filterable>
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :value="item.userId"
            :label="item.nickName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">继续</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { batchCustomerSupportApi } from "@/api/newApi/simpleWorkOrder/otherService.js";
export default {
  props: {
    changeCustomerServiceDialog: Boolean,
    ids: Array,
    userList: Array
  },
  data() {
    return {
      form: {
        userId: ""
      },
      rules: {
        userId: [{ required: true, message: "请选择客服", trigger: "blur" }]
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeCustomerServiceDialog;
      },
      set(val) {
        this.$emit("update:changeCustomerServiceDialog", val);
      }
    }
  },
  methods: {
    reset() {
      if (this.$refs.changeCustomerServiceDialog) {
        this.$refs.changeCustomerServiceDialog.resetFields();
      }
    },
    submit() {
      this.$refs["changeCustomerServiceDialog"].validate(valid => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      batchCustomerSupportApi({
        ids: this.ids,
        nickName: this.userList.find(item => item.userId === this.form.userId).nickName,
        ...this.form
      }).then(res => {
        if (res.code === 0) {
          this.$message.success("修改成功");
          this.$emit("refresh");
        }
      });
    }
  }
};
</script>

<style></style>
