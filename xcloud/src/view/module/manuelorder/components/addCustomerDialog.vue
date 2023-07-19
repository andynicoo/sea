<template>
  <el-dialog title="新增线索" :visible.sync="dialogvisible" width="460px" @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" inline>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="所属企业：" prop="enterpriseId" required>
        <el-input disabled :value="enterpriseName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="跟进人：" prop="followUserId" required>
        <el-input disabled :value="userInfo.nickName" placeholder="请输入" clearable />
      </el-form-item>
      <!-- <el-form-item label="数据源：" prop="configSource">
        <el-select v-model="form.configSource">
          <el-option v-for="item in sourceList" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAccountNew } from '@/api/newApi/manuelorder/addOrder';
// import { getSourceList } from '@/api/newApi/common';
export default {
  props: {
    addCustomerDialog: Boolean,
    mobile: String,
  },
  data() {
    return {
      enterpriseName: this.$util.getLocalStorage('enterpriseName'),
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      form: {
        name: '',
        mobile: '',
        enterpriseId: localStorage.getItem('enterpriseId'),
        followUserId: '',
        // configSource: '',
      },
      rules: {
        // TODO 客户已存在
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' },
        ],
        // configSource: [{ required: true, message: '请选择数据源', trigger: 'blur' }],
      },
      sourceList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.addCustomerDialog;
      },
      set(val) {
        this.$emit('update:addCustomerDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.form.mobile = this.mobile;
      }
    },
  },
  mounted() {
    this.form.followUserId = this.userInfo.userId;
    // this.getSourceListFun();
  },
  methods: {
    // getSourceListFun() {
    //   getSourceList().then((res) => {
    //     this.sourceList = res.data;
    //   });
    // },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    cancel() {
      this.$emit('getMobile', '');
      this.dialogvisible = false;
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      addAccountNew({
        ...this.form,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('新增成功');
          this.$emit('getMobile', this.form.mobile);
          this.dialogvisible = false;
        }
      });
    },
  },
};
</script>

<style></style>
