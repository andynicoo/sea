<template>
  <!-- 更改交付专员弹窗 -->
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
      ref="form"
    >
      <el-form-item prop="disposeId">
        <el-select
          style="width: 410px"
          v-model="form.disposeId"
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
import {changeDispose} from '@/api/newApi/workOrder/logoutTaxNum'
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
        disposeId: [{required: true, message: '请选择交付专员', trigger: 'blur'}]
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
        functionCode: this.$constant.LOGOUTTAXNUM_FUNCTION_CODE
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
        serviceIds: this.serviceIds,
        disposeName: this.userList.find(item => item.userId === this.form.disposeId).nickName,
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
