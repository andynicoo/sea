<template>
  <div class="login-wrapper">
    <img class="bg-img" src="bg.png" alt="bg" />
    <div class="login-block">
      <img class="logo-img" src="logo.png" alt="logo" />
      <div class="login-title">后台管理系统</div>
      <el-form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" class="form">
        <el-form-item prop="username">
          <span class="form-title">账号</span>
          <el-input v-model="form.username" placeholder="请输入用户名\手机号\邮箱" size="small" />
          <!-- <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span> -->
        </el-form-item>
        <el-form-item prop="password">
          <span class="form-title">密码</span>
          <el-input type="password" v-model="form.password" placeholder="请输入密码" size="small" />
          <!-- <span slot="prepend">
            <Icon :size="14" type="md-lock"></Icon>
          </span> -->
        </el-form-item>
        <el-form-item>
          <div class="ope-block">
            <el-checkbox v-model="form.auto">自动登录</el-checkbox>
            <!-- <el-link type="primary">忘记密码</el-link> -->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSubmit" :loading="loading" type="primary" long size="small" style="width: 100%"> 登录 </el-button>
        </el-form-item>
      </el-form>
      <div class="footer-wrapper">
        <div class="footer-block">
          <img class="footer-icon" src="icon1.png" alt="" />
          <div>更简单</div>
        </div>
        <div class="footer-block">
          <img class="footer-icon" src="icon2.png" alt="" />
          <div>可信赖</div>
        </div>
        <div class="footer-block">
          <img class="footer-icon" src="icon3.png" alt="" />
          <div>更高效</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatRouters } from '@/libs/util';
import { mapActions } from 'vuex';

export default {
  name: 'LoginForm',
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }];
      },
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }];
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next();
    if (from.name) {
      window.location.reload();
    }
  },
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        auto: true,
      },
      config: {},
    };
  },
  computed: {
    rules() {
      return {
        username: this.usernameRules,
        password: this.passwordRules,
      };
    },
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleClick(type) {
      let url = this.config[type];
      if (!url) return;
      this.openWin(url, type, 650, 500);
    },
    openWin(url, name, iWidth, iHeight) {
      // 获得窗口的垂直位置
      var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
      // 获得窗口的水平位置
      var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
      window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
    },
    handleSubmit() {
      let self = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let username = this.form.username;
          let password = this.form.password;
          let auto = this.form.auto;
          sessionStorage.clear();
          let cacheKeys = ['recentlyCountryList', 'checkHistoryList'];
          let cacheObj = {};
          cacheKeys.forEach((key) => {
            cacheObj[key] = localStorage.getItem(key);
          });
          localStorage.clear();
          cacheKeys.forEach((key) => {
            if (cacheObj[key]) {
              localStorage.setItem(key, cacheObj[key]);
            }
          });

          this.handleLogin({ username, password, auto })
            .then((res) => {
              // 登录后获取路由并动态添加到router里
              localStorage.setItem('username', username);
              let dyncRouters = [];
              let store = this.$store;
              this.$store.dispatch('getUserInfo').then((res) => {
                dyncRouters = dyncRouters.concat(...formatRouters(store.state.user.menus, store.state.user.access));
                // 防止重复添加路由报错
                self.$router.addRoutes(dyncRouters);
                self.$router.options.routes.push(...dyncRouters);
                // 登录完成跳转到主页
                self.$router.push({
                  name: self.$config.homeName,
                });
                this.loading = false;
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  color: #333;
  .bg-img {
    width: 61vw;
    height: 100vh;
  }
  .login-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    .logo-img {
      width: 290px;
      height: 77px;
      margin-bottom: 20px;
    }
    .login-title {
      font-size: 30px;
      margin-bottom: 30px;
      font-weight: 500;
    }
    .ope-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      ::v-deep .el-checkbox__label {
        font-size: 16px;
      }
      ::v-deep .el-link {
        font-size: 16px;
      }
    }
    .form {
      width: 450px;
      ::v-deep .el-form-item {
        margin-bottom: 20px;
        .form-title {
          font-size: 16px;
          line-height: 40px;
        }
        .el-input {
          height: 55px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          overflow: hidden;
          font-size: 16px;
          .el-input__inner {
            height: 100%;
            border: none;
            background: #f8fcff;
          }
        }
        .el-button {
          height: 56px;
          border-radius: 10px;
          font-size: 22px;
          margin-bottom: -10px;
          box-shadow: 0px 0px 10px 0px #46a6ff;
        }
      }
    }
    .footer-wrapper {
      width: 450px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #999;
      .footer-block {
        display: flex;
        align-items: center;
        .footer-icon {
          width: 33px;
          height: 33px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
