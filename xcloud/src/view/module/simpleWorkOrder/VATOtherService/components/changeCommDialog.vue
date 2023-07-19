<template>
  <!-- 更改供应链专员弹窗 -->
  <el-dialog
    title="更改供应链专员"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="changeCommDialog"
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
import {changeSupplyChain} from '@/api/newApi/simpleWorkOrder/otherService.js'
import {getUserListByRole} from '@/api/newApi/common'
export default {
  props: {
    changeCommDialog: Boolean,
    ids: Array,
  },
  data() {
    return {
      form: {
        userId: '',
      },
      userList: [],
      rules: {
        userId: [{required: true, message: '请选择供应链专员', trigger: 'blur'}]
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeCommDialog;
      },
      set(val) {
        this.$emit("update:changeCommDialog", val);
      },
    },
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUserListByRole({
        roleCode: this.$constant.SUPPLY_COMMISSIONER
      }).then(res => {
        this.userList = res.data
      })
    },
    reset() {
      if(this.$refs.changeCommDialog) {
        this.$refs.changeCommDialog.resetFields()
      }
    },
    submit() {
      this.$refs["changeCommDialog"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      changeSupplyChain({
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
