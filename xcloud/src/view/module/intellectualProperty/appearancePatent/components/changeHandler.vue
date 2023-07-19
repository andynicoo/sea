<template>
  <el-dialog title="修改处理人" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="95px">
      <el-form-item label="处理人类型" prop="handleType">
        <el-select placeholder="请选择处理人类型" v-model="form.handleType">
          <el-option
            :value="item.type"
            :label="item.typeName"
            v-for="item in handlerTypeList"
            :key="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指定处理人" prop="handlerUserId">
        <el-select placeholder="请选择指定处理人" filterable v-model="form.handlerUserId">
          <el-option
            :value="item.userId"
            :label="item.nickName"
            v-for="item in userList"
            :key="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { handlerUserTypeAPI, updateHandlerUserTypeAPI } from "@/api/newApi/intellectualProperty/handleUser";
import { userList } from "@/api/newApi/common.js";
export default {
  props: {
    changeHandler: Boolean,
    serviceId: String,
  },
  data() {
    return {
      form: {
        handleType: "",
        handlerUserId: "",
      },
      rules: {
        handleType: [{ required: true, message: "请选择处理人类型", trigger: "blur" }],
        handlerUserId: [{ required: true, message: "请选择指定处理人", trigger: "blur" }],
      },
      handlerTypeList: [],
      userList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeHandler;
      },
      set(val) {
        this.$emit("update:changeHandler", val);
      },
    },
  },
  created() {
    this.getHandlerUserType();
    this.getUserList();
  },
  methods: {
    getHandlerUserType() {
      handlerUserTypeAPI({
        productFunctionCode: this.$constant.APPEARANCE_FUNCTION_CODE,
      }).then((res) => {
        if (res.code == 0) {
          this.handlerTypeList = res.data;
        }
      });
    },
    getUserList() {
      userList().then((res) => {
        if (res.code == 0) {
          this.userList = res.data;
        }
      });
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
      updateHandlerUserTypeAPI({
        ...this.form,
        handleTypeName: this.handlerTypeList.find((item) => item.type === this.form.handleType).typeName,
        handlerUserName: this.userList.find((item) => item.userId === this.form.handlerUserId).nickName,
        serviceIds: this.serviceId,
        serviceType: this.$constant.APPEARANCE_FUNCTION_CODE,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("修改成功");
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

<style></style>
