<template>
  <el-dialog
    title="更改税务经理"
    :visible.sync="dialogvisible"
    width="360px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item prop="disposeId">
        税务经理
        <el-select
          style="width: 220px"
          v-model="form.disposeId"
          size="small"
          filterable
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
        >继续</el-button
      >
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { changeDispose} from "@/api/newApi/workOrder/valueAddedServices.js";
import {getDisposelist} from '@/api/newApi/common'
export default {
  props: {
    changeManagerDialog: Boolean,
    serviceIds: Array,
  },
  data() {
    return {
      form: {
        disposeId: '',
      },
      userList: [],
      rules: {
        disposeId: [{required: true, message: '请选择税务经理', trigger: 'blur'}]
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
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getDisposelist({
        functionCode: this.$constant.TAXREFUND_FUNCTION_CODE
      }).then(res => {
        this.userList = res.data
      })
    },
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
        }
      });
    },
    confirm() {
      changeDispose({
        idColl: this.serviceIds,
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
