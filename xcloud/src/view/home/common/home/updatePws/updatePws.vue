<template>
  <!-- 修改密码 -->
  <el-dialog :visible.sync="passwordModal" title="修改密码" width="550px" :modal-append-to-body="true">
    <el-form ref="formPassword" :model="formPassword" :rules="passwordValid" label-width="110px">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input type="password" v-model="formPassword.oldPwd" placeholder="请输入旧密码" style="width: 350px" size="small"></el-input>
      </el-form-item>
      <el-form-item label="新登录密码" prop="newPwd">
        <el-input type="password" v-model="formPassword.newPwd" placeholder="输入新密码（6-20位字母、数字和符号任意两种组合）" style="width: 350px" size="small"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPwd">
        <el-input type="password" v-model="formPassword.confirmPwd" placeholder="再次输入新密码" style="width: 350px" size="small"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="passwordModal = false" size="small">取 消</el-button>
      <el-button @click="handleSubmit" type="primary" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeManagerPwd } from '@/api/user';
import { mapActions } from 'vuex';
export default {
  name: 'UpdatePws',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      // let reg2 = /^.{6,20}$/
      let reg2 = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value === this.formPassword.oldPwd) {
        callback(new Error('新密码不能与旧密码相同'));
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('6-20位字母、数字和符号任意两种组合'));
      } else {
        callback();
      }
    };

    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.formPassword.newPwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };

    return {
      formPassword: {},
      // 修改密码校验
      passwordValid: {
        oldPwd: [
          {
            required: true,
            trigger: 'blur',
            message: '不允许为空',
          },
        ],
        newPwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
        confirmPwd: [{ required: true, validator: validatePassConfirm, trigger: 'blur' }],
      },
    };
  },
  computed: {
    passwordModal: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  created() {},
  methods: {
    ...mapActions(['handleLogout']),
    handleSubmit() {
      this.$refs.formPassword.validate((valid) => {
        if (valid) {
          changeManagerPwd(this.formPassword).then((res) => {
            if (res.code === 0) {
              this.passwordModal = false;
              // 更新密码后，强制退出用户，并弹框提示
              this.$Modal.success({
                title: '密码修改成功',
                content: '',
                onOk: () => {
                  this.handleLogout().then(() => {
                    // 清空路由
                    this.$router.options.routes = [];
                    this.$router.push({
                      name: 'login',
                    });
                  });
                },
              });
            }
          });
        } else {
          setTimeout(() => {
            this.refuseLoading = false;
            this.$nextTick(() => {
              this.refuseLoading = true;
            });
          }, 1000);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
